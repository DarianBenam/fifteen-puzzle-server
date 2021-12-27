// File Name:        main.js
// By:               Darian Benam (GitHub: https://github.com/BeardedFish/)
// Date Created:     Monday, December 27, 2021

const express = require("express")
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const ChildProcess = require("child_process");

const wss = new WebSocket.Server({ server });

app.use(cors());

const checkDisconnectedConnections = setInterval(function ping()
{
    wss.clients.forEach(ws =>
    {
        if (!ws.isAlive)
        {
            ws.terminate();
            delete connectedClients[ws.id];

            return;
        }

        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

let nextClientId = 0;
let connectedClients = {};

wss.on("connection", (ws) =>
{
    console.log("New websocket connection");

    ws.id = nextClientId++;
    ws.isAlive = true;

    let newConnection = {
        terminalInstance: ChildProcess.execFile(__dirname + "/bin/FifteenPuzzle.bin")
    }

    connectedClients[ws.id] = newConnection;
    connectedClients[ws.id].terminalInstance.stdin.setEncoding("utf8");
    connectedClients[ws.id].terminalInstance.stdout.setEncoding("utf8");

    connectedClients[ws.id].terminalInstance.stdout.on("data", terminalOutput =>
    {
        let data = {
            command: "terminal_updated",
            args: {
                0: terminalOutput
            }
        }

        ws.send(JSON.stringify(data));
    });

    connectedClients[ws.id].terminalInstance.on("exit", exitCode =>
	{
        let data = {
            command: "terminal_closed",
            args: {
                0: exitCode
            }
        }

        ws.send(JSON.stringify(data));
	});

    ws.on("pong", () =>
    {
        ws.isAlive = true;
    });

    ws.on("message", (data, isBinary) =>
    {
        if (isBinary)
        {
            return;
        }

        let receivedData = JSON.parse(data);

        switch (receivedData.command)
        {
            case "enter_input":
                if (connectedClients[ws.id] !== null)
                {
            	    connectedClients[ws.id].terminalInstance.stdin.write(`${receivedData.args[0]}\n`);
                }
                break;
        }
    });

    ws.on("close", (event) =>
    {
        delete connectedClients[ws.id];

        if (Object.keys(connectedClients).length === 0)
        {
            nextClientId = 0;
        }
    });
});

wss.on("close", () =>
{
    clearInterval(checkDisconnectedConnections);
})

server.listen(3000, () =>
{
    console.log("Server started");
});

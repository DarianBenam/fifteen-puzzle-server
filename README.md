# Fifteen Puzzle Server

A Node.js app that allows users to play [Fifteen Puzzle](https://github.com/BeardedFish/Fifteen-Puzzle) (a console game written in C++) via a WebSocket connection.

# How to Run the Server

Assuming `npm` and `node` are installed, open a terminal of your choice and execute the following commands:

```
npm install
node app.js
```

**NOTE:** The binary file located in the `bin` folder was compiled for 64-bit Linux distributions. To run this application under Windows, you need to either run the commands on [WSL](https://docs.microsoft.com/en-us/windows/wsl/about) or compile the [Fifteen Puzzle](https://github.com/BeardedFish/Fifteen-Puzzle) source code into a `.exe` file.

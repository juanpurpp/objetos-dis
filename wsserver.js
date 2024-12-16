const WebSocket = require("ws");

// Clase local: LoginAdmin
class LoginAdmin {
    constructor() {
        this.users = {};
    }

    addUser(username, password) {
        this.users[username] = password;
    }

    verify(username, password) {
        return this.users[username] === password;
    }
}

// Clase remota: RemoteLogin
class RemoteLogin {
    constructor() {
        this.admin = new LoginAdmin();
    }

    login(username, password) {
        return this.admin.verify(username, password);
    }

    addUser(username, password) {
        this.admin.addUser(username, password);
    }
}

// Inicializa el servidor WebSocket
const wss = new WebSocket.Server({ port: 3000 });
const remoteLogin = new RemoteLogin();
console.log("Servidor WebSocket escuchando en ws://localhost:3000");

wss.on("connection", (ws) => {
    console.log("Cliente conectado.");

    ws.on("message", (message) => {
        try {
            const { command, username, password } = JSON.parse(message);

            if (command === "login") {
                const success = remoteLogin.login(username, password);
                ws.send(JSON.stringify({ command: "login", success }));
            } else if (command === "addUser") {
                remoteLogin.addUser(username, password);
                ws.send(JSON.stringify({ command: "addUser", success: true }));
            } else {
                ws.send(JSON.stringify({ error: "Comando no reconocido." }));
            }
        } catch (err) {
            ws.send(JSON.stringify({ error: "Formato de mensaje inválido." }));
        }
    });

    ws.on("close", () => {
        console.log("Cliente desconectado.");
    });
});

const WebSocket = require("ws");
const readline = require("readline");

// Clase RemoteLoginProxy
class RemoteLoginProxy {
    constructor(serverUrl) {
        this.ws = new WebSocket(serverUrl);
        this.ws.on("open", () => {
            console.log("Conectado al servidor.");
        });

        this.ws.on("close", () => {
            console.log("Desconectado del servidor.");
        });

        this.ws.on("message", (message) => {
            const response = JSON.parse(message);

            if (this.callback) {
                this.callback(response);
            }
        });

        this.callback = null; // Para manejar respuestas del servidor
    }

    sendMessage(command, username, password) {
        return new Promise((resolve, reject) => {
            this.callback = resolve; // Configura la respuesta
            this.ws.send(JSON.stringify({ command, username, password }));
        });
    }

    async login(username, password) {
        const response = await this.sendMessage("login", username, password);
        return response.success;
    }

    async addUser(username, password) {
        const response = await this.sendMessage("addUser", username, password);
        return response.success;
    }
}

// Interfaz de consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "cliente> ",
});

// Inicializa la conexión al servidor
const remoteLogin = new RemoteLoginProxy("ws://localhost:3000");

console.log('Usa "login <username> <password>" o "addUser <username> <password>".');
rl.prompt();

rl.on("line", async (line) => {
    const [command, username, password] = line.trim().split(" ");

    if (command === "login") {
        if (!username || !password) {
            console.log("Uso: login <username> <password>");
        } else {
            const success = await remoteLogin.login(username, password);
            console.log(
                success
                    ? `Login exitoso para "${username}".`
                    : `Login fallido para "${username}".`
            );
        }
    } else if (command === "addUser") {
        if (!username || !password) {
            console.log("Uso: addUser <username> <password>");
        } else {
            const success = await remoteLogin.addUser(username, password);
            console.log(success ? `Usuario "${username}" agregado exitosamente.` : "Error al agregar usuario.");
        }
    } else if (command === "exit") {
        console.log("Cerrando cliente...");
        remoteLogin.ws.close();
        rl.close();
        process.exit(0);
    } else {
        console.log('Comando no reconocido. Usa "login" o "addUser".');
    }

    rl.prompt();
});

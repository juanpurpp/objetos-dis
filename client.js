const readline = require("readline");
const axios = require("axios");

// Clase RemoteLoginProxy (opcional, puedes usar directamente Axios si prefieres)
class RemoteLoginProxy {
    constructor(serverUrl) {
        this.serverUrl = serverUrl;
    }

    async login(username, password) {
        try {
            const response = await axios.post(`${this.serverUrl}/login`, {
                username,
                password,
            });
            return response.data.success;
        } catch (error) {
            console.error("Error al conectarse al servidor:", error.message);
            return false;
        }
    }
}

// Inicializa la conexión al servidor
const remoteLogin = new RemoteLoginProxy("http://juankerberos.local:3000");

// Configuración de readline para la consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "cliente> ",
});

console.log("Bienvenido al cliente de autenticación.");
console.log('Usa el comando "login <username> <password>" para autenticarte.');
console.log('Escribe "exit" para salir.');
rl.prompt();

// Procesar comandos
rl.on("line", async (line) => {
    const [command, ...args] = line.trim().split(" ");
    switch (command) {
        case "login":
            if (args.length !== 2) {
                console.log("Uso: login <username> <password>");
            } else {
                const [username, password] = args;
                const result = await remoteLogin.login(username, password);
                console.log(
                    result
                        ? `Login exitoso para "${username}".`
                        : `Login fallido para "${username}".`
                );
            }
            break;

        case "exit":
            console.log("Saliendo del cliente...");
            rl.close();
            process.exit(0);
            break;

        default:
            console.log(`Comando no reconocido: "${command}".`);
            console.log('Comandos disponibles: login, exit');
    }
    rl.prompt();
});

const axios = require("axios");

// Proxy del objeto remoto
class RemoteLoginProxy {
    constructor(serverUrl) {
        this.serverUrl = serverUrl; // Dirección del servidor
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

// Ejemplo de uso del cliente
async function main() {
    const remoteLogin = new RemoteLoginProxy("http://localhost:3000");

    console.log(await remoteLogin.login("pedrito", "yElLobo")); // true
    console.log(await remoteLogin.login("liliana", "nieves")); // false
}

main();

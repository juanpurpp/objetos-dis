const express = require("express");
const readline = require("readline");

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

    listUsers() {
        return Object.keys(this.users);
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

    listUsers() {
        return this.admin.listUsers();
    }
}

// Inicializa servidor HTTP y RemoteLogin
const app = express();
app.use(express.json());

const remoteLogin = new RemoteLogin();

// Endpoint para login
app.post("/login", (req, res) => {
    console.log('Petición de login:', req.body);
    const { username, password } = req.body;
    const result = remoteLogin.login(username, password);

    res.json({ success: result });
});

// Servidor HTTP escuchando
app.listen(3000, () => {
    console.log("Servidor escuchando en http://localhost:3000");
});

// --- Capturar comandos desde la consola ---
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "server> ", // Promt que aparece en la consola
});

console.log("Puedes agregar usuarios o listar usuarios desde la consola.");
rl.prompt();

// Procesar comandos
rl.on("line", (line) => {
    const [command, ...args] = line.trim().split(" ");
    switch (command) {
        case "addUser":
            if (args.length !== 2) {
                console.log("Uso: addUser <username> <password>");
            } else {
                const [username, password] = args;
                remoteLogin.addUser(username, password);
                console.log(`Usuario "${username}" agregado.`);
            }
            break;

        case "listUsers":
            const users = remoteLogin.listUsers();
            if (users.length === 0) {
                console.log("No hay usuarios registrados.");
            } else {
                console.log("Usuarios registrados:", users.join(", "));
            }
            break;

        case "exit":
            console.log("Cerrando servidor...");
            rl.close();
            process.exit(0);
            break;

        default:
            console.log(`Comando no reconocido: "${command}".`);
            console.log('Comandos disponibles: addUser, listUsers, exit');
    }
    rl.prompt(); // Mostrar de nuevo el prompt
});

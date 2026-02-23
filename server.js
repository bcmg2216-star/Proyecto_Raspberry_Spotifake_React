import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Datos en memoria de usuarios
let usuarios = [
    {id: 1, nombre: "admin", apellido1: "", apellido2: "", correo: "admin@gmail.com", admin: 1, premium: 1, pass: "admin", token: "", urlImagen: ""},
];

// Datos en memoria de genero
let generos = [
    {id: 1, nombre: "Pop"}, {id: 2, nombre: "Rock"}
];

// Datos en memoria de canciones
let canciones = [
    { id: 1, nombre: "Yonaguni", artista: "Bad Bunny", album:"Un Verano Sin Ti", genero: 1, likes: 0, urlAudio:"", ulrPortada:""},
];

// Lista de canciones
let listas_canciones = [];

// Login
app.post('/login', (req, res) => {
    const { nombre, pass } = req.body;
    const user = usuarios.find(u => u.nombre === nombre && u.pass === pass);
    if (user) {
        res.json(user);
    } else{
        res.status(401).json({error: "Usuario o contraseña incorrectos"});
    }
});

// CRUD usuarios
// GET: Leer
app.get('/usuarios', (req, res) => res.json(usuarios));

// POST: Crear
app.post('/usuarios', (req, res) => {
    const nuevo = {id: Date.now(), role: "user", ...req.body};
    usuarios.push(nuevo);
    res.json(nuevo);
});

// PUT: Editar
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    usuarios = usuarios.map(u => u.id == id ? { ...u, ...req.body, id: Number(id) } : u);
    res.json({ mensaje: "Usuario actualizado" });
});

// DELETE: Borrar
app.delete('/usuarios/:id', (req, res) => {
    usuarios = usuarios.filter(u => u.id != req.params.id);
    res.json({ mensaje: "Usuario borrado" });
});

// CRUD canciones
// GET: Leer
app.get('/canciones', (req, res) => res.json(canciones));

// POST: Crear
app.post('/canciones', (req, res) => {
    const nueva = { id: Date.now(), ...req.body };
    canciones.push(nueva);
    res.json(nueva);
});

// PUT: Editar
app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    canciones = canciones.map(c => c.id == id ? { ...c, ...req.body, id: Number(id) } : c);
    res.json({ mensaje: "Actualizado" });
});

// DELETE: Borrar
app.delete('/canciones/:id', (req, res) => {
    canciones = canciones.filter(c => c.id != req.params.id);
    res.json({ mensaje: "Borrado" });
});

// Rutas para generos
app.get('/generos', (req, res) => res.json(generos));

// CRUB: Listas canciones
app.get('/listas_canciones', (req, res) => res.json(listas_canciones));

app.post('/listas_canciones', (req, res) => {
    const nueva = { id: Date.now(), ...req.body };
    listas_canciones.push(nueva);
    res.json(nueva);
});

app.delete('/listas_canciones/:id', (req, res) => {
    listas_canciones = listas_canciones.filter(l => l.id != req.params.id);
    res.json({ mensaje: "Lista borrada" });
});

app.listen(5000, () => console.log("Servidor en puerto 5000"));
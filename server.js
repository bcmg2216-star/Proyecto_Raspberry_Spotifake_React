import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Datos en memoria
let canciones = [
    { id: 1, titulo: "Yonaguni", artista: "Bad Bunny" },
    { id: 2, titulo: "Saoko", artista: "Rosalía" }
];

// GET: Leer
app.get('/canciones', (req, res) => res.json(canciones));

// POST: Crear
app.post('/canciones', (req, res) => {
    const nueva = { id: Date.now(), ...req.body };
    canciones.push(nueva);
    res.json(nueva);
});

// PUT: Editar (¡Esto es nuevo!)
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

app.listen(5000, () => console.log("Servidor en puerto 5000"));
import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [songs, setSongs] = useState([]);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [editId, setEditId] = useState(null);

    const url = "http://localhost:5000/canciones";

    const refresh = () => fetch(url).then(r => r.json()).then(d => setSongs(d));

    useEffect(() => { refresh(); }, []);

    const save = (e) => {
        e.preventDefault();
        const method = editId ? 'PUT' : 'POST';
        const finalUrl = editId ? `${url}/${editId}` : url;

        fetch(finalUrl, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ titulo: title, artista: artist })
        }).then(() => {
            setTitle(''); setArtist(''); setEditId(null);
            refresh();
        });
    }

    const startEdit = (s) => {
        setEditId(s.id);
        setTitle(s.titulo);
        setArtist(s.artista);
    }

    const remove = (id) => fetch(`${url}/${id}`, { method: 'DELETE' }).then(() => refresh());

    return (
        <div className="main-container">
            <h1 className="header-title">Mis canciones</h1>

            <form className="spoti-form" onSubmit={save}>
                <input className="spoti-input" placeholder="Nombre canción..." value={title} onChange={e => setTitle(e.target.value)} />
                <input className="spoti-input" placeholder="Artista..." value={artist} onChange={e => setArtist(e.target.value)} />
                <button className="btn-spoti">{editId ? 'Guardar' : 'Añadir'}</button>
                {editId && <button type="button" onClick={() => {setEditId(null); setTitle(''); setArtist('');}}>X</button>}
            </form>

            <div className="song-list">
                {songs.map(s => (
                    <div key={s.id} className="song-card">
                        <div className="song-info">
                            <h3>{s.titulo}</h3>
                            <p>{s.artista}</p>
                        </div>
                        <div className="actions">
                            <button className="btn-edit" onClick={() => startEdit(s)}>Editar</button>
                            <button className="btn-delete" onClick={() => remove(s.id)}>Borrar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App
import { useState, useEffect } from 'react'
import './App.css'

function App() {
    // Estados de sesión
    const [user, setUser] = useState(null); // Si es null, mostramos el login
    const [isRegister, setIsRegister] = useState(false);
    const [authName, setAuthName] = useState('');
    const [authPass, setAuthPass] = useState('');

    // Estados de datos y vistas
    const [canciones, setCanciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [vista, setVista] = useState('canciones');

    // Estados formulario canciones
    const [titulo, setTitulo] = useState('');
    const [artista, setArtista] = useState('');
    const [editCancionId, setEditCancionId] = useState(null);

    // Estados formulario usuarios
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [editUserId, setEditUserId] = useState(null);

    const baseUrl = "http://localhost:5000";

    const loadData = () => {
        fetch(`${baseUrl}/canciones`).then(r => r.json()).then(d => setCanciones(d));
        fetch(`${baseUrl}/usuarios`).then(r => r.json()).then(d => setUsuarios(d));
    }

    useEffect(() => { loadData(); }, []);

    // Gestión de login y registro
    const handleAuth = (e) => {
        e.preventDefault();
        if(isRegister){
            fetch(`${baseUrl}/usuarios`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({nombre: authName, password: authPass})
            }).then(() => {
                alert("Cuenta creada");
                setIsRegister(false);
                setAuthName('');
                setAuthPass('');
                loadData();
            });
        }else {
            fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({nombre: authName, password: authPass})
            })
            .then(r => r.json())
            .then(data =>{
                if(data.error){
                    alert(data.error)
                }else {
                    setUser(data);
                }
            });
        }
    };

    // CRUD canciones
    const saveCancion = (e) => {
        e.preventDefault();
        const method = editCancionId ? 'PUT' : 'POST';
        const url = editCancionId ? `${baseUrl}/canciones/${editCancionId}` : `${baseUrl}/canciones`;

        fetch(url, {
            method: method,headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({titulo, artista})
        }).then(() =>{
           setTitulo('');
           setArtista('');
           setEditCancionId(null);
           loadData();
        });
    };

    const deleteCancion = (id) => fetch(`${baseUrl}/canciones/${id}`, {method: 'DELETE'}).then(() => loadData());

    // CRUD Usuarios (admin)
    const saveUsuario = (e) => {
        e.preventDefault();
        const method = editUserId ? 'PUT' : 'POST';
        const url = editUserId ? `${baseUrl}/usuarios/${editUserId}` : `${baseUrl}/usuarios`;

        fetch(url, {
            method: method, headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nombre, password, rol: 'user' })
        }).then(() => {
            setNombre(''); setPassword(''); setEditUserId(null);
            loadData();
        });
    };

    const deleteUsuario = (id) => fetch(`${baseUrl}/usuarios/${id}`, {method: 'DELETE'}).then(() => loadData());

    // Pantalla login/registro (si no hay usuario)
    if(!user){
        return (
            <div className="main-container">
                <h1 className="header-title">{isRegister ? 'Crear cuenta' : 'Iniciar Sesión'}</h1>
                <form className="spoti-form" onSubmit={handleAuth}>
                    <input className="spoti-input" placeholder="Nombre de usuario" value={authName} onChange={e => setAuthName(e.target.value)} required />
                    <input className="spoti-input" type="password" placeholder="Contraseña" value={authPass} onChange={e => setAuthPass(e.target.value)} required />
                    <button className="btn-spoti">{isRegister ? 'Registrarse' : 'Entrar'}</button>
                </form>
                <button className="btn-edit" onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? 'Ya tengo cuenta' : 'No tengo cuenta, registrarme'}
                </button>
            </div>
        );
    }

    // Pantalla principal (si hay usuario)
    return (
        <div className="main-container">
            {/* Cabecera con saludo y botones de control */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                <h1 className="header-title" style={{margin: 0}}>Hola, {user.nombre}</h1>
                <div style={{display: 'flex', gap: '10px'}}>
                    {user.rol === 'admin' && (
                        <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista(vista === 'canciones' ? 'usuarios' : 'canciones')}>
                            Ver {vista === 'canciones' ? 'Usuarios' : 'Canciones'}
                        </button>
                    )}
                    <button className="btn-delete" onClick={() => { setUser(null); setVista('canciones'); }}>Cerrar Sesión</button>                </div>
            </div>

            {/* Vista de canciones*/}
            {vista === 'canciones' ? (
                <div>
                    {/* Solo el admin ve el formulario para añadir canciones */}
                    {user.rol === 'admin' && (
                        <form className="spoti-form" onSubmit={saveCancion}>
                            <input className="spoti-input" placeholder="Nombre canción..." value={titulo} onChange={e => setTitulo(e.target.value)} required />
                            <input className="spoti-input" placeholder="Artista..." value={artista} onChange={e => setArtista(e.target.value)} required />
                            <button className="btn-spoti">{editCancionId ? 'Guardar' : 'Añadir Canción'}</button>
                            {editCancionId && <button type="button" className="btn-delete" onClick={() => {setEditCancionId(null); setTitulo(''); setArtista('');}}>X</button>}
                        </form>
                    )}

                    <div className="song-list">
                        {canciones.map(c => (
                            <div key={c.id} className="song-card">
                                <div className="song-info">
                                    <h3>{c.titulo}</h3>
                                    <p>{c.artista}</p>
                                </div>
                                {/* Solo el admin ve los botones de editar/borrar */}
                                {user.rol === 'admin' && (
                                    <div className="actions">
                                        <button className="btn-edit" onClick={() => {setEditCancionId(c.id); setTitulo(c.titulo); setArtista(c.artista);}}>Editar</button>
                                        <button className="btn-delete" onClick={() => deleteCancion(c.id)}>Borrar</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* vista de usuarios (solo si es admin) */
                <div>
                    <form className="spoti-form" onSubmit={saveUsuario}>
                        <input className="spoti-input" placeholder="Nombre usuario..." value={nombre} onChange={e => setNombre(e.target.value)} required />
                        <input className="spoti-input" type="password" placeholder="Contraseña..." value={password} onChange={e => setPassword(e.target.value)} required />
                        <button className="btn-spoti">{editUserId ? 'Guardar' : 'Añadir Usuario'}</button>
                        {editUserId && <button type="button" className="btn-delete" onClick={() => {setEditUserId(null); setNombre(''); setPassword('');}}>X</button>}
                    </form>

                    <div className="song-list">
                        {usuarios.map(u => (
                            <div key={u.id} className="song-card">
                                <div className="song-info">
                                    <h3>{u.nombre}</h3>
                                    <p>Rol: {u.rol}</p>
                                </div>
                                <div className="actions">
                                    <button className="btn-edit" onClick={() => {setEditUserId(u.id); setNombre(u.nombre); setPassword(u.password);}}>Editar</button>
                                    {u.id !== 1 && <button className="btn-delete" onClick={() => deleteUsuario(u.id)}>Borrar</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
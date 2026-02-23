import { useState, useEffect } from 'react'
import './App.css'

function App() {
    // Estados de sesión
    const [user, setUser] = useState(null); // Si es null, mostramos el login
    const [isRegister, setIsRegister] = useState(false);
    const [authName, setAuthName] = useState('');
    const [authCorreo, setAuthCorreo] = useState('');
    const [authPass, setAuthPass] = useState('');

    // Estados de datos y vistas
    const [canciones, setCanciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [vista, setVista] = useState('canciones');
    const [generos, setGeneros] = useState([]);
    const [listas, setListas] = useState([]);

    // Estados formulario canciones
    const [nombreCancion, setNombreCancion] = useState('');
    const [artista, setArtista] = useState('');
    const [album, setAlbum] = useState('');
    const [genero, setGenero] = useState('');
    const [urlAudio, setUrlAudio] = useState('');
    const [urlPortada, setUrlPortada] = useState('');
    const [editCancionId, setEditCancionId] = useState(null);

    // Estados formulario usuarios
    const [nombre, setNombre] = useState('');
    const [apellido1, setApellido1] = useState('');
    const [apellido2, setApellido2] = useState('');
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [urlImagen, setUrlImagen] = useState('');
    const [editUserId, setEditUserId] = useState(null);

    // Estados de formulario listas
    const [nombreLista, setNombreLista] = useState('');

    const baseUrl = "http://localhost:5000";

    const loadData = () => {
        fetch(`${baseUrl}/canciones`).then(r => r.json()).then(d => setCanciones(d));
        fetch(`${baseUrl}/usuarios`).then(r => r.json()).then(d => setUsuarios(d));
        fetch(`${baseUrl}/generos`).then(r => r.json()).then(d => setGeneros(d));
        fetch(`${baseUrl}/listas_canciones`).then(r => r.json()).then(d => setListas(d));
    }

    useEffect(() => { loadData(); }, []);

    // Gestión de login y registro
    const handleAuth = (e) => {
        e.preventDefault();
        if(isRegister){
            fetch(`${baseUrl}/usuarios`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    nombre: authName,
                    correo: authCorreo,
                    pass: authPass,
                    admin: 0,
                    premium: 0,
                    token: '',
                    apellido1: '',
                    apellido2: '',
                    urlImagen: urlImagen
                })
            }).then(() => {
                alert("Cuenta creada");
                setIsRegister(false);
                setAuthName('');
                setAuthPass('');
                setAuthCorreo('')
                loadData();
            });
        }else {
            fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({nombre: authName, pass: authPass})
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
            body: JSON.stringify({
                nombre: nombreCancion, artista, album, genero, likes: 0, urlaudio: urlAudio, urlportada: urlPortada
            })
        }).then(() =>{
            setNombreCancion(''); setArtista(''); setAlbum(''); setGenero(''); setUrlAudio(''); setUrlPortada('');           setArtista('');
           setEditCancionId(null);
           loadData();
        });
    };

    const deleteCancion = (id) => fetch(`${baseUrl}/canciones/${id}`, {method: 'DELETE'}).then(loadData);

    // CRUD Usuarios (admin)
    const saveUsuario = (e) => {
        e.preventDefault();
        const method = editUserId ? 'PUT' : 'POST';
        const url = editUserId ? `${baseUrl}/usuarios/${editUserId}` : `${baseUrl}/usuarios`;

        fetch(url, {
            method: method, headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                nombre, apellido1, apellido2, correo, pass, urlImagen, admin: 0, premium: 0, token: ''
            })
        }).then(() => {
            setNombre(''); setApellido1(''); setApellido2(''); setCorreo(''); setPass(''); setUrlImagen('');
            setEditCancionId(null);
            loadData();
        });
    };

    const deleteUsuario = (id) => fetch(`${baseUrl}/usuarios/${id}`, {method: 'DELETE'}).then(loadData);

    // CRUD Listas
    const saveLista = (e) => {
        e.preventDefault();
        fetch(`${baseUrl}/listas_canciones`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                nombre: nombreLista, id_usuario: user.id
            })
        }).then(() => {setNombreLista(''); loadData();})
    };

    const deleteLista = (id) => fetch(`${baseUrl}/listas_canciones/${id}`, {method: 'DELETE'}).then(loadData);

    // Pantalla login/registro (si no hay usuario)
    if(!user){
        return (
            <div className="main-container">
                <h1 className="header-title">{isRegister ? 'Crear cuenta' : 'Iniciar Sesión'}</h1>
                <form className="spoti-form" onSubmit={handleAuth}>
                    <input className="spoti-input" placeholder="Nombre de usuario" value={authName} onChange={e => setAuthName(e.target.value)} required />
                    {isRegister && <input className="spoti-input" type="email" placeholder="Correo" value={authCorreo} onChange={e => setAuthCorreo(e.target.value)} required />}
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
                    <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('canciones')}>Canciones</button>
                    <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('listas')}>Mis Listas</button>
                    {user.admin === 1 && (
                        <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('usuarios')}>Usuarios</button>
                    )}
                    <button className="btn-delete" onClick={() => { setUser(null); setVista('canciones'); }}>Cerrar Sesión</button>
                </div>
            </div>

            {/* Vista de canciones*/}
            {vista === 'canciones' && (
                <div>
                    {user.admin === 1 && (
                        <form className="spoti-form" onSubmit={saveCancion}>
                            <input className="spoti-input" placeholder="Nombre..." value={nombreCancion} onChange={e => setNombreCancion(e.target.value)} required />
                            <input className="spoti-input" placeholder="Artista..." value={artista} onChange={e => setArtista(e.target.value)} required />
                            <input className="spoti-input" placeholder="Álbum..." value={album} onChange={e => setAlbum(e.target.value)} required />
                            <input className="spoti-input" placeholder="URL Audio..." value={urlAudio} onChange={e => setUrlAudio(e.target.value)} required />
                            <input className="spoti-input" placeholder="URL Portada..." value={urlPortada} onChange={e => setUrlPortada(e.target.value)} required />
                            <select className="spoti-input" value={genero} onChange={e => setGenero(e.target.value)} required>
                                <option value="">Género...</option>
                                {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                            </select>
                            <button className="btn-spoti">{editCancionId ? 'Guardar' : 'Añadir'}</button>
                            {editCancionId && <button type="button" className="btn-delete" onClick={() => setEditCancionId(null)}>X</button>}
                        </form>
                    )}
                    <div className="song-list">
                        {canciones.map(c => (
                            <div key={c.id} className="song-card">
                                <div className="song-info"><h3>{c.nombre}</h3><p>{c.artista} - {c.album}</p></div>
                                {user.admin === 1 && (
                                    <div className="actions">
                                        <button className="btn-edit" onClick={() => {setEditCancionId(c.id); setNombreCancion(c.nombre); setArtista(c.artista); setAlbum(c.album); setGenero(c.genero); setUrlAudio(c.urlaudio); setUrlPortada(c.urlportada);}}>Editar</button>
                                        <button className="btn-delete" onClick={() => deleteCancion(c.id)}>Borrar</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/*Listas*/}
            {vista === 'listas' && (
                <div>
                    <form className="spoti-form" onSubmit={saveLista}>
                        <input className="spoti-input" placeholder="Nombre de lista..." value={nombreLista} onChange={e => setNombreLista(e.target.value)} required />
                        <button className="btn-spoti">Crear</button>
                    </form>
                    <div className="song-list">
                        {listas.filter(l => l.id_usuario === user.id).map(l => (
                            <div key={l.id} className="song-card">
                                <div className="song-info"><h3>{l.nombre}</h3></div>
                                <div className="actions"><button className="btn-delete" onClick={() => deleteLista(l.id)}>Borrar</button></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* USUARIOS */}
            {vista === 'usuarios' && user.admin === 1 && (
                <div>
                    <form className="spoti-form" onSubmit={saveUsuario}>
                        <input className="spoti-input" placeholder="Nombre..." value={nombre} onChange={e => setNombre(e.target.value)} required />
                        <input className="spoti-input" placeholder="Apellido 1" value={apellido1} onChange={e => setApellido1(e.target.value)} />
                        <input className="spoti-input" placeholder="Apellido 2" value={apellido2} onChange={e => setApellido2(e.target.value)} />
                        <input className="spoti-input" placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} required />
                        <input className="spoti-input" type="password" placeholder="Pass" value={pass} onChange={e => setPass(e.target.value)} required />
                        <input className="spoti-input" placeholder="URL Imagen" value={urlImagen} onChange={e => setUrlImagen(e.target.value)} />
                        <button className="btn-spoti">{editUserId ? 'Guardar' : 'Crear'}</button>
                    </form>
                    <div className="song-list">
                        {usuarios.map(u => (
                            <div key={u.id} className="song-card">
                                <div className="song-info"><h3>{u.nombre} {u.apellido1}</h3><p>{u.correo}</p></div>
                                <div className="actions">
                                    <button className="btn-edit" onClick={() => {setEditUserId(u.id); setNombre(u.nombre); setApellido1(u.apellido1); setApellido2(u.apellido2); setCorreo(u.correo); setPass(u.pass); setUrlImagen(u.urlImagen);}}>Editar</button>
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
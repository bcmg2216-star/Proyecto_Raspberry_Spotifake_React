import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [user, setUser] = useState(null) // guardamos los datos y el token
    const [isRegister, setIsRegister] = useState(false);

    // Estados de sesión
    const [authUsername, setAuthUsername] = useState('');
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
    const [editCancionId, setEditCancionId] = useState(null);

    // Estados formulario usuarios
    const [username, setUsername] = useState('');
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [urlImagen, setUrlImagen] = useState('');
    const [editUserId, setEditUserId] = useState(null);

    // Estados de formulario listas
    const [nombreLista, setNombreLista] = useState('');

    // Estado para el nuevo genero
    const [nombreGenero, setNombreGenero] = useState('');

    const baseUrl = "https://corsproxy.io/?https://subpatronal-heathiest-kash.ngrok-free.dev/api";
    //const baseUrl = "https://subpatronal-heathiest-kash.ngrok-free.dev/api";

    const loadData = () => {
        if (!user) return;

        const headersConToken = {
            'Authorization': `Bearer ${user.token || ''}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        };

        fetch(`${baseUrl}/canciones`, { headers: headersConToken })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setCanciones(data); });

        fetch(`${baseUrl}/generos`, { headers: headersConToken })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setGeneros(data);
            })
            .catch(err => console.error("Error al cargar géneros:", err));

        fetch(`${baseUrl}/usuarios/${user.id}/listas`, { headers: headersConToken })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setListas(data); });
        if (user.admin) {
            fetch(`${baseUrl}/usuarios`, { headers: headersConToken })
                .then(r => r.json())
                .then(data => { if (Array.isArray(data)) setUsuarios(data); });
        }
    }

    // Cada vez que el usuario cambia (hace login), cargamos sus datos
    useEffect(() => {
        if(user) loadData();
        }, [user]);

    // Gestión de login y registro
    const handleAuth = (e) => {
        e.preventDefault();
        if (isRegister) {
            fetch(`${baseUrl}/register?t=${Date.now()}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true'},
                body: JSON.stringify({
                    username: authUsername, correo: authCorreo, pass: authPass
                })
            }).then(r => {
                if (r.ok) {
                    alert("¡Cuenta creada! Ya puedes entrar.");
                    setIsRegister(false);
                } else alert("Error al registrar el usuario.");
            });

        } else {
            fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true'},
                body: JSON.stringify({correo: authCorreo, pass: authPass})
            }).then(async r => {
                if (r.ok) {
                    setUser(await r.json());
                } else {
                    alert("Correo o contraseña incorrectos.");
                }
            });
        }
    };

    // Para cualquier operación CRUD, creamos las cabeceras con el token
    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
        'ngrok-skip-browser-warning': 'true'
    });

    // CRUD canciones
    const saveCancion = (e) => {
        e.preventDefault();
        const method = editCancionId ? 'PUT' : 'POST';
        const url = editCancionId ? `${baseUrl}/canciones/${editCancionId}` : `${baseUrl}/canciones`;

        const formData = new FormData();
        formData.append('nombre', nombreCancion);
        formData.append('artista', artista);
        formData.append('album', album);
        formData.append('genero', genero);
        formData.append('likes', 0);

        // Coge los archivos directamente de los inputs
        const inputAudio = document.getElementById('audioInput');
        const inputPortada = document.getElementById('portadaInput');
        if (inputAudio.files[0]) formData.append('audio', inputAudio.files[0]);
        if (inputPortada.files[0]) formData.append('portada', inputPortada.files[0]);

        fetch(url, {
            method: method,
            headers: { 'Authorization': `Bearer ${user.token}`,
                'ngrok-skip-browser-warning': 'true'
            },
            body: formData
        }).then(() =>{
            setNombreCancion(''); setArtista(''); setAlbum(''); setGenero('');
            inputAudio.value = ''; inputPortada.value = ''; // Limpiamos los inputs
            setEditCancionId(null);
            loadData();
        });
    };

    const deleteCancion = (id) => fetch(`${baseUrl}/canciones/${id}`, {method: 'DELETE', headers: getHeaders()}).then(loadData);

    // CRUD Generos (admin)
    const saveGenero = (e) => {
        e.preventDefault();
        fetch(`${baseUrl}/generos`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({id: 0, nombre: nombreGenero})
        }).then(() =>{
            setNombreGenero('');
            loadData();
        }).catch(err => console.log(err));
    };

    // CRUD Usuarios (admin)
    const saveUsuario = (e) => {
        e.preventDefault();
        if(!editUserId) return;

        fetch(`${baseUrl}/usuarios/${editUserId}`, {
            method: 'PUT', headers: getHeaders(),
            body: JSON.stringify({
                username: username, correo: correo, pass: pass, urlImagen: urlImagen, admin: 0, premium: 0, token: ''
            })
        }).then(() => {
            setEditCancionId(null);
            setUsername(''); setCorreo(''); setPass(''); setUrlImagen('');
            loadData();
        });
    };

    const deleteUsuario = (id) => fetch(`${baseUrl}/usuarios/${id}`, {method: 'DELETE', headers: getHeaders()}).then(loadData);

    // CRUD Listas
    const saveLista = (e) => {
        e.preventDefault();
        fetch(`${baseUrl}/listas`, {
            method: 'POST', headers: getHeaders(),
            body: JSON.stringify({
                nombre: nombreLista, idUsuario: user.id
            })
        }).then(() => {setNombreLista(''); loadData();})
    };

    const deleteLista = (id) => fetch(`${baseUrl}/listas/${id}`, {method: 'DELETE', headers: getHeaders()}).then(loadData);

    // Pantalla login/registro (si no hay usuario)
    if(!user){
        return (
            <div className="main-container">
                <h1 className="header-title">{isRegister ? 'Crear cuenta' : 'Iniciar Sesión'}</h1>
                <form className="spoti-form" onSubmit={handleAuth}>
                    {isRegister && <input className="spoti-input" placeholder="Nombre de usuario" value={authUsername} onChange={e => setAuthUsername(e.target.value)} required />}
                    <input className="spoti-input" type="email" placeholder="Correo electrónico" value={authCorreo} onChange={e => setAuthCorreo(e.target.value)} required />
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
                <h1 className="header-title" style={{margin: 0}}>Hola, {user.username}</h1>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('canciones')}>Canciones</button>
                    <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('listas')}>Mis Listas</button>
                    {user.admin && (
                        <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('usuarios')}>Usuarios</button>
                    )}
                    <button className="btn-delete" onClick={() => { setUser(null); setVista('canciones'); }}>Cerrar Sesión</button>
                </div>
            </div>

            {/* Vista de canciones*/}
            {vista === 'canciones' && (
                <div>
                    {user.admin && (
                        <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#282828', borderRadius: '8px' }}>
                            {/* Gestión de Géneros */}
                            <h2 style={{ color: '#1DB954', marginBottom: '15px', fontSize: '1.2rem' }}>Añadir Nuevo Género</h2>
                            <form className="spoti-form" onSubmit={saveGenero} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
                                <input
                                    className="spoti-input"
                                    placeholder="Nombre del género (Ej: Rock, Techno...)"
                                    value={nombreGenero}
                                    onChange={e => setNombreGenero(e.target.value)}
                                    required
                                />
                                <button className="btn-spoti" style={{ width: 'auto', whiteSpace: 'nowrap' }}>Añadir Género</button>
                            </form>

                            <hr style={{ borderColor: '#333', marginBottom: '30px' }} />

                            {/* Gestión de Canciones */}
                            <h2 style={{ color: '#1DB954', marginBottom: '15px', fontSize: '1.2rem' }}>
                                {editCancionId ? 'Editar Canción' : 'Añadir Nueva Canción'}
                            </h2>
                            <form className="spoti-form" onSubmit={saveCancion}>
                                <input className="spoti-input" placeholder="Nombre..." value={nombreCancion} onChange={e => setNombreCancion(e.target.value)} required />
                                <input className="spoti-input" placeholder="Artista..." value={artista} onChange={e => setArtista(e.target.value)} required />
                                <input className="spoti-input" placeholder="Álbum..." value={album} onChange={e => setAlbum(e.target.value)} required />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>Archivo Audio (mp3)</label>
                                    <input id="audioInput" className="spoti-input" type="file" accept="audio/*" required={!editCancionId} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>Imagen de Portada</label>
                                    <input id="portadaInput" className="spoti-input" type="file" accept="image/*" required={!editCancionId} />
                                </div>

                                <select className="spoti-input" value={genero} onChange={e => setGenero(e.target.value)} required>
                                    <option value="">Selecciona un Género...</option>
                                    {generos.map(g => (
                                        <option key={g.id} value={g.id}>{g.nombre}</option>
                                    ))}
                                </select>

                                <button className="btn-spoti">
                                    {editCancionId ? 'Guardar Cambios' : 'Subir Canción'}
                                </button>

                                {editCancionId && (
                                    <button type="button" className="btn-delete" onClick={() => {
                                        setEditCancionId(null);
                                        setNombreCancion(''); setArtista(''); setAlbum(''); setGenero('');
                                    }}>Cancelar Edición</button>
                                )}
                            </form>
                        </div>
                    )}

                    {/* LISTADO DE CANCIONES */}
                    <div className="song-list">
                        {canciones.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#b3b3b3' }}>No hay canciones disponibles.</p>
                        ) : (
                            canciones.map(c => (
                                <div key={c.id} className="song-card">
                                    <div className="song-info">
                                        <h3>{c.nombre}</h3>
                                        <p>{c.artista} — {c.album}</p>
                                    </div>
                                    {user.admin && (
                                        <div className="actions">
                                            <button className="btn-edit" onClick={() => {
                                                setEditCancionId(c.id);
                                                setNombreCancion(c.nombre);
                                                setArtista(c.artista);
                                                setAlbum(c.album);
                                                setGenero(c.genero);
                                            }}>Editar</button>
                                            <button className="btn-delete" onClick={() => deleteCancion(c.id)}>Borrar</button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
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
                        {listas.map(l => (
                            <div key={l.id} className="song-card">
                                <div className="song-info"><h3>{l.nombre}</h3></div>
                                <div className="actions"><button className="btn-delete" onClick={() => deleteLista(l.id)}>Borrar</button></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* USUARIOS */}
            {vista === 'usuarios' && user.admin && (
                <div>
                    {/* El formulario solo se muestra si estamos editando a alguien */}
                    {editUserId ? (
                        <div style={{ backgroundColor: '#282828', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                            <h2 style={{ color: '#1DB954', fontSize: '1.2rem', marginBottom: '15px' }}>Editar Perfil de Usuario</h2>
                            <form className="spoti-form" onSubmit={saveUsuario}>
                                <input className="spoti-input" placeholder="Nombre de usuario" value={username} onChange={e => setUsername(e.target.value)} required />
                                <input className="spoti-input" placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} required />
                                <input className="spoti-input" type="password" placeholder="Nueva contraseña (opcional)" value={pass} onChange={e => setPass(e.target.value)} />
                                <input className="spoti-input" placeholder="URL Imagen de perfil" value={urlImagen} onChange={e => setUrlImagen(e.target.value)} />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn-spoti">Guardar Cambios</button>
                                    <button type="button" className="btn-delete" onClick={() => { setEditUserId(null); setUsername(''); setCorreo(''); setPass(''); setUrlImagen(''); }}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <p style={{ color: '#b3b3b3', marginBottom: '20px', textAlign: 'center' }}>Selecciona un usuario de la lista para editar sus datos.</p>
                    )}

                    <div className="song-list">
                        {usuarios.map(u => (
                            <div key={u.id} className="song-card">
                                <div className="song-info">
                                    <h3>{u.username}</h3>
                                    <p>{u.correo}</p>
                                </div>
                                <div className="actions">
                                    <button className="btn-edit" onClick={() => {
                                        setEditUserId(u.id);
                                        setUsername(u.username);
                                        setCorreo(u.correo);
                                        setPass(''); // No cargamos la pass por seguridad
                                        setUrlImagen(u.urlImagen || '');
                                    }}>Editar</button>
                                    {/* Evitamos que el admin se borre a sí mismo (suponiendo que es el ID 1) */}
                                    {u.id !== user.id && <button className="btn-delete" onClick={() => deleteUsuario(u.id)}>Borrar</button>}
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
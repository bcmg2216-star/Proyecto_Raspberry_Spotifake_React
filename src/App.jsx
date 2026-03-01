import { useState, useEffect } from 'react'
import './App.css'
import logo from './assets/logo.png'

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
    const [artistas, setArtistas] = useState([]);
    const [albums, setAlbums] = useState([]);

    // Estados formulario canciones
    const [nombreCancion, setNombreCancion] = useState('');
    const [artista, setArtista] = useState('');
    const [album, setAlbum] = useState('');
    const [genero, setGenero] = useState('');
    const [editCancionId, setEditCancionId] = useState(null);

    // Estados formularios de edición para géneros, artistas y álbumes
    const [editGeneroId, setEditGeneroId] = useState(null);
    const [editArtistaId, setEditArtistaId] = useState(null);
    const [editAlbumId, setEditAlbumId] = useState(null);

    // Estados formulario usuarios
    const [username, setUsername] = useState('');
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [urlImagen, setUrlImagen] = useState('');
    const [editUserId, setEditUserId] = useState(null);
    const [premium, setPremium] = useState(0);
    const [isAdmin, setIsAdmin] = useState(0);
    const [searchCorreo, setSearchCorreo] = useState('');

    // Estados para gestionar las listas de un usuario (admin)
    const [adminSelectedUserId, setAdminSelectedUserId] = useState(null);
    const [adminUserListas, setAdminUserListas] = useState([]);
    const [adminEditListaId, setAdminEditListaId] = useState(null);
    const [adminEditListaNombre, setAdminEditListaNombre] = useState('');
    const [adminSelectedListaId, setAdminSelectedListaId] = useState(null);
    const [adminCancionesLista, setAdminCancionesLista] = useState([]);

    // Estados de formulario listas
    const [nombreLista, setNombreLista] = useState('');

    // Estado para el nuevo genero, nuevo artista y nuevo album
    const [nombreGenero, setNombreGenero] = useState('');
    const [nombreArtistaNuevo, setNombreArtistaNuevo] = useState('');
    const [nombreAlbumNuevo, setNombreAlbumNuevo] = useState('');
    const [artistaAlbumNuevo, setArtistaAlbumNuevo] = useState('');

    // Estados para la reproduccion
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);

    const baseUrl = "https://subpatronal-heathiest-kash.ngrok-free.dev/api";

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

        fetch(`${baseUrl}/artistas`, { headers: headersConToken })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setArtistas(data); })
            .catch(err => console.error("Error al cargar artistas:", err));

        // CARGAMOS LOS ÁLBUMES PARA LOS DESPLEGABLES Y LISTADOS
        fetch(`${baseUrl}/albums`, { headers: headersConToken })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setAlbums(data); })
            .catch(err => console.error("Error al cargar álbumes:", err));

        fetch(`${baseUrl}/usuarios/${user.id}/listas`, { headers: headersConToken })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setListas(data); });

        // COMPROBACIÓN ADMIN SEGURA
        if (user.admin === true || user.admin == 1) {
            fetch(`${baseUrl}/usuarios`, { headers: headersConToken })
                .then(r => r.json())
                .then(data => { if (Array.isArray(data)) setUsuarios(data); });
        }
    }

    // Cada vez que el usuario cambia (hace login), cargamos sus datos
    useEffect(() => {
        if(user) loadData();
    }, [user]);

    // Funcion para reproducir una cancion
    const playSong = (index, songList) => {
        setPlaylist(songList);
        setCurrentSongIndex(index);
        setIsPlaying(true);
    };

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

    // Cabeceras para JSON normal (Usuarios, Listas, Géneros)
    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
        'ngrok-skip-browser-warning': 'true'
    });

    // Cabeceras para MULTIPART (Canciones, Artistas, Álbumes).
    const getMultipartHeaders = () => ({
        'Authorization': `Bearer ${user.token}`,
        'ngrok-skip-browser-warning': 'true'
    });

    // CRUD canciones
    const saveCancion = (e) => {
        e.preventDefault();
        const method = editCancionId ? 'PATCH' : 'POST';
        const url = editCancionId ? `${baseUrl}/canciones/${editCancionId}` : `${baseUrl}/canciones`;

        const formData = new FormData();
        formData.append('nombre', nombreCancion);
        formData.append('artistaId', artista);
        formData.append('albumId', album);
        formData.append('genero', genero);
        formData.append('likes', 0);

        const inputAudio = document.getElementById('audioInput');
        if (inputAudio.files[0]) formData.append('audio', inputAudio.files[0]);

        fetch(url, { method: method, headers: getMultipartHeaders(), body: formData })
            .then(() =>{
                setNombreCancion('');
                setArtista('');
                setAlbum('');
                setGenero('');
                setEditCancionId(null);
                loadData();
                alert("Cancion guardada correctamente");
            });
    };
    const deleteCancion = (id) => fetch(`${baseUrl}/canciones/${id}`, {method: 'DELETE', headers: getHeaders()}).then(loadData);


    //  CRUD generos (admin)
    const saveGenero = (e) => {
        e.preventDefault();
        const method = editGeneroId ? 'PATCH' : 'POST';
        const url = editGeneroId ? `${baseUrl}/generos/${editGeneroId}` : `${baseUrl}/generos`;

        fetch(url, { method: method, headers: getHeaders(), body: JSON.stringify({ nombre: nombreGenero }) })
            .then(() =>{
                setNombreGenero('');
                setEditGeneroId(null);
                loadData();
                alert("Genero guardado correctamente");
            })
            .catch(err => console.log(err));
    };
    const deleteGenero = (id) => fetch(`${baseUrl}/generos/${id}`, {method: 'DELETE', headers: getHeaders()}).then(loadData);


    // CRUD artistas (admin)
    const saveArtista = (e) => {
        e.preventDefault();
        const method = editArtistaId ? 'PATCH' : 'POST';
        const url = editArtistaId ? `${baseUrl}/artistas/${editArtistaId}` : `${baseUrl}/artistas`;

        const formData = new FormData();
        formData.append('nombre', nombreArtistaNuevo);

        const inputFoto = document.getElementById('fotoArtistaInput');
        if (inputFoto && inputFoto.files[0]) {
            formData.append('imagen', inputFoto.files[0]);
        }

        fetch(url, { method: method, headers: getMultipartHeaders(), body: formData })
            .then(res => {
                if(res.ok) {
                    setNombreArtistaNuevo('');
                    setEditArtistaId(null);
                    if(inputFoto) inputFoto.value = '';
                    loadData();
                    alert("Artista guardado correctamente");
                } else { alert("Error al guardar artista."); }
            }).catch(err => console.log(err));
    };
    const deleteArtista = (id) => fetch(`${baseUrl}/artistas/${id}`, {method: 'DELETE', headers: getHeaders()}).then(loadData);


    // CRUD albums (admin)
    const saveAlbum = (e) => {
        e.preventDefault();
        if (!artistaAlbumNuevo && !editAlbumId) {
            alert("Selecciona un artista primero");
            return;
        }

        const method = editAlbumId ? 'PATCH' : 'POST';
        const url = editAlbumId ? `${baseUrl}/albums/${editAlbumId}` : `${baseUrl}/artistas/${artistaAlbumNuevo}/albums`;

        const formData = new FormData();
        formData.append('nombre', nombreAlbumNuevo);
        if (editAlbumId && artistaAlbumNuevo) {
            formData.append('artistaId', artistaAlbumNuevo);
        }

        const inputPortada = document.getElementById('portadaAlbumInput');
        if (inputPortada && inputPortada.files[0]) {
            formData.append('portada', inputPortada.files[0]);
        }

        fetch(url, { method: method, headers: getMultipartHeaders(), body: formData })
            .then(res => {
                if (res.ok) {
                    setNombreAlbumNuevo('');
                    setArtistaAlbumNuevo('');
                    setEditAlbumId(null);
                    if (inputPortada) inputPortada.value = '';
                    loadData();
                    alert("Álbum guardado correctamente.");
                } else { alert("Error al guardar álbum."); }
            }).catch(err => console.log(err));
    };
    const deleteAlbum = (id) => fetch(`${baseUrl}/albums/${id}`, {method: 'DELETE', headers: getHeaders()}).then(loadData);


    // CRUD usuarios (admin)
    const saveUsuario = (e) => {
        e.preventDefault();
        if(!editUserId) return;

        // 1. Preparamos los datos de texto (JSON normal)
        const bodyData = {
            username: username,
            correo: correo,
            premium: premium === 1 || premium === true ? 1 : 0,
            admin: isAdmin === 1 || isAdmin === true ? 1 : 0
        };
        if (pass) bodyData.pass = pass;

        // 2. Enviamos primero los textos
        fetch(`${baseUrl}/usuarios/${editUserId}`, {
            method: 'PATCH', headers: getHeaders(),
            body: JSON.stringify(bodyData)
        }).then(res => {
            if(res.ok) {
                // 3. Si el texto se guardó bien, comprobamos si el admin seleccionó una foto
                const inputFoto = document.getElementById('fotoPerfilInput');
                if (inputFoto && inputFoto.files[0]) {

                    // Preparamos la foto en formato Multipart
                    const formData = new FormData();
                    formData.append('imagen', inputFoto.files[0]);

                    // Hacemos el POST secundario solo para la foto
                    fetch(`${baseUrl}/usuarios/${editUserId}/perfil`, {
                        method: 'POST',
                        headers: getMultipartHeaders(),
                        body: formData
                    }).then(resFoto => {
                        if (resFoto.ok) {
                            cerrarYRecargarUsuario();
                        } else {
                            alert("Datos actualizados, pero la foto dio error.");
                            cerrarYRecargarUsuario();
                        }
                    });
                } else {
                    // Si no había foto seleccionada, terminamos y recargamos directamente
                    cerrarYRecargarUsuario();
                }
            } else {
                alert("Error al actualizar los datos de texto del usuario.");
            }
        }).catch(err => console.log(err));
    };

    // Función auxiliar para limpiar el formulario rápido
    const cerrarYRecargarUsuario = () => {
        setEditUserId(null);
        setUsername('');
        setCorreo('');
        setPass('');
        setUrlImagen('');
        setPremium(0);
        const inputFoto = document.getElementById('fotoPerfilInput');
        if (inputFoto) inputFoto.value = '';
        loadData();
    };

    const deleteUsuario = (id) => fetch(`${baseUrl}/usuarios/${id}`, {method: 'DELETE', headers: getHeaders()}).then(loadData);

    // Buscar usuarios
    const handleSearchUsuario = (e) => {
        e.preventDefault();
        if (!searchCorreo.trim()) {
            loadData(); // Si está vacío, recargamos todos
            return;
        }
        fetch(`${baseUrl}/usuarios/correo/${searchCorreo.trim()}`, { headers: getHeaders() })
            .then(r => {
                if (r.ok) return r.json();
                throw new Error('No encontrado');
            })
            .then(data => {
                setUsuarios([data]); // Lo metemos en un array para que el listado funcione igual
            })
            .catch(() => {
                setUsuarios([]); // Si da error , mostramos la lista vacía
            });
    };

    // CRUD Listas (admin)
    const saveLista = (e) => {
        e.preventDefault();
        fetch(`${baseUrl}/listas`, {
            method: 'POST', headers: getHeaders(),
            body: JSON.stringify({
                nombre: nombreLista, idUsuario: user.id
            })
        }).then(() => {setNombreLista(''); loadData();
            alert("Lista guardada correctamente");
        })
    };
    const deleteLista = (id) => fetch(`${baseUrl}/listas/${id}`, {method: 'DELETE', headers: getHeaders()}).then(loadData);

    // Gestionar listas de usuarios
    const verListasDeUsuario = (idUsuario) => {
        setAdminSelectedUserId(idUsuario);
        setAdminSelectedListaId(null);
        fetch(`${baseUrl}/usuarios/${idUsuario}/listas`, { headers: getHeaders() })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setAdminUserListas(data); });
    };

    const adminDeleteLista = (idLista) => {
        fetch(`${baseUrl}/listas/${idLista}`, {method: 'DELETE', headers: getHeaders()})
            .then(() => verListasDeUsuario(adminSelectedUserId));
    };

    const adminSaveLista = (e) => {
        e.preventDefault();
        fetch(`${baseUrl}/listas/${adminEditListaId}`, {
            method: 'PATCH', headers: getHeaders(),
            body: JSON.stringify({ nombre: adminEditListaNombre, idUsuario: adminSelectedUserId })
        }).then(() => {
            setAdminEditListaId(null);
            setAdminEditListaNombre('');
            verListasDeUsuario(adminSelectedUserId);
        });
    };

    const verCancionesDeLista = (idLista) => {
        setAdminSelectedListaId(idLista);
        fetch(`${baseUrl}/listas/${idLista}/canciones`, { headers: getHeaders() })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setAdminCancionesLista(data); })
            .catch(() => setAdminCancionesLista([]));
    };

    // Pantalla login/registro (si no hay usuario)
    if(!user){
        return (
            <div className="main-container">
                <img src={logo} style={{ width: '120px', marginBottom: '20px' }} alt="Logo" />
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
                {/* DESCARGA APK */}
                <div style={{ borderTop: '1px solid #333', paddingTop: '20px', width: '100%', textAlign: 'center' }}>
                    <p style={{ color: '#b3b3b3', fontSize: '0.9rem', marginBottom: '10px' }}>¿Usas Android?</p>
                    <a
                        href={`${baseUrl}/descargas/spotifake.apk`}
                        download
                        className="btn-spoti"
                        style={{
                            background: '#3DDC84',
                            color: 'black',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: 'bold'
                        }}
                    >
                        <span>🤖</span> Descargar APK Móvil
                    </a>
                </div>
            </div>
        );
    }

    // Pantalla principal (si hay usuario)
    return (
        <div className="main-container">
            {/* Cabecera con saludo y botones de control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img
                    src={logo}
                    alt="Spotifake Logo"
                    style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                />
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('canciones')}>Canciones</button>
                    <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('listas')}>Mis Listas</button>

                    {/* Botones de administrador ahora divididos en pestañas */}
                    {(user.admin === true || user.admin == 1) && (
                        <>
                            <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('generos')}>Géneros</button>
                            <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('artistas')}>Artistas</button>
                            <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('albums')}>Álbumes</button>
                            <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('usuarios')}>Usuarios</button>
                        </>
                    )}
                    <button className="btn-delete" onClick={() => { setUser(null); setVista('canciones'); }}>Cerrar Sesión</button>
                </div>
            </div>

            {/* VISTA: CANCIONES */}
            {vista === 'canciones' && (
                <div>
                    {(user.admin === true || user.admin == 1) && (
                        <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#282828', borderRadius: '8px' }}>
                            <h2 style={{ color: '#1DB954', marginBottom: '15px', fontSize: '1.2rem' }}>
                                {editCancionId ? 'Editar Canción' : 'Añadir Nueva Canción'}
                            </h2>
                            <form className="spoti-form" onSubmit={saveCancion} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input className="spoti-input" placeholder="Nombre..." value={nombreCancion} onChange={e => setNombreCancion(e.target.value)} required />

                                {/* Artista y Álbum adaptados a la base de datos (desplegables) */}
                                <select className="spoti-input" value={artista} onChange={e => setArtista(e.target.value)} required>
                                    <option value="">Selecciona un Artista...</option>
                                    {artistas.map(a => (
                                        <option key={a.id} value={a.id}>{a.nombre}</option>
                                    ))}
                                </select>

                                <select className="spoti-input" value={album} onChange={e => setAlbum(e.target.value)} required>
                                    <option value="">Selecciona un Álbum...</option>
                                    {albums.map(al => (
                                        <option key={al.id} value={al.id}>{al.nombre}</option>
                                    ))}
                                </select>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>Archivo Audio (mp3)</label>
                                    <input id="audioInput" className="spoti-input" type="file" accept="audio/*" required={!editCancionId} />
                                </div>

                                {/* DESPLEGABLE DE GÉNERO */}
                                <select className="spoti-input" value={genero} onChange={e => setGenero(e.target.value)} required>
                                    <option value="">Selecciona un Género...</option>
                                    {generos.map(g => (
                                        <option key={g.id} value={g.id}>{g.nombre}</option>
                                    ))}
                                </select>

                                <button className="btn-spoti" style={{ marginTop: '10px' }}>
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
                            canciones.map(c => {
                                const artistaObj = artistas.find(a => a.id.toString() === c.artista?.toString());
                                const nombreArtistaStr = artistaObj ? artistaObj.nombre : c.artista;
                                const albumObj = albums.find(al => al.id.toString() === c.album?.toString());
                                const nombreAlbumStr = albumObj ? albumObj.nombre : c.album;
                                const urlDelAudio = c.urlAudio ? `${baseUrl}/${c.urlAudio}` : null;
                                const urlDeLaPortada = c.urlportada || c.urlPortada
                                    ? `${baseUrl}/${c.urlportada || c.urlPortada}`
                                    : 'https://ui-avatars.com/api/?name=%F0%9F%8E%B5&background=282828&color=1DB954';
                                return (
                                    <div key={c.id} className="song-card">
                                        <img
                                            src={urlDeLaPortada}
                                            alt={`Portada de ${c.nombre}`}
                                            style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }}
                                        />

                                        <div className="song-info" style={{ minWidth: '200px' }}>
                                            <h3>{c.nombre}</h3>
                                            <p>{nombreArtistaStr} — {nombreAlbumStr}</p>
                                        </div>

                                        {/* CONTADOR DE LIKES */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: '60px', color: '#1DB954', fontWeight: 'bold' }}>
                                            <span>💚</span>
                                            <span>{c.likes || 0}</span>
                                        </div>

                                        {/* BOTÓN REPRODUCIR */}
                                        {urlDelAudio ? (
                                            <button
                                                className="btn-spoti"
                                                style={{ flex: 1, margin: '0 20px' }}
                                                onClick={() => playSong(canciones.indexOf(c), canciones)}
                                            >
                                                ▶ Reproducir
                                            </button>
                                        ) : (
                                            <p style={{ color: '#ff4d4d', fontSize: '0.8rem', flex: 1, textAlign: 'center' }}>
                                                No hay audio
                                            </p>
                                        )}

                                        {(user.admin === true || user.admin == 1) && (
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
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* VISTA: GÉNEROS (ADMIN) */}
            {vista === 'generos' && (user.admin === true || user.admin == 1) && (
                <div>
                    <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#282828', borderRadius: '8px' }}>
                        <h2 style={{ color: '#1DB954', marginBottom: '15px' }}>{editGeneroId ? 'Editar Género' : 'Añadir Género'}</h2>
                        <form className="spoti-form" onSubmit={saveGenero} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input className="spoti-input" placeholder="Nombre del Género..." value={nombreGenero} onChange={e => setNombreGenero(e.target.value)} required />
                            <button className="btn-spoti">{editGeneroId ? 'Guardar Cambios' : 'Añadir Género'}</button>
                            {editGeneroId && <button type="button" className="btn-delete" onClick={() => { setEditGeneroId(null); setNombreGenero(''); }}>Cancelar Edición</button>}
                        </form>
                    </div>
                    <div className="song-list">
                        {generos.length === 0 ? <p style={{ color: '#b3b3b3', textAlign: 'center' }}>No hay géneros creados.</p> : generos.map(g => (
                            <div key={g.id} className="song-card">
                                <div className="song-info"><h3>{g.nombre}</h3></div>
                                <div className="actions">
                                    <button className="btn-delete" onClick={() => deleteGenero(g.id)}>Borrar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VISTA: ARTISTAS (ADMIN) */}
            {vista === 'artistas' && (user.admin === true || user.admin == 1) && (
                <div>
                    <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#282828', borderRadius: '8px' }}>
                        <h2 style={{ color: '#1DB954', marginBottom: '15px' }}>{editArtistaId ? 'Editar Artista' : 'Añadir Artista'}</h2>
                        <form className="spoti-form" onSubmit={saveArtista} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input className="spoti-input" placeholder="Nombre del Artista..." value={nombreArtistaNuevo} onChange={e => setNombreArtistaNuevo(e.target.value)} required />

                            {/* SUBIR FOTO */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>Foto del Artista</label>
                                <input id="fotoArtistaInput" className="spoti-input" type="file" accept="image/*" />
                            </div>

                            <button className="btn-spoti">{editArtistaId ? 'Guardar Cambios' : 'Añadir Artista'}</button>

                            {editArtistaId && (
                                <button type="button" className="btn-delete" onClick={() => {
                                    setEditArtistaId(null);
                                    setNombreArtistaNuevo('');
                                    const inputFoto = document.getElementById('fotoArtistaInput');
                                    if(inputFoto) inputFoto.value = '';
                                }}>
                                    Cancelar Edición
                                </button>
                            )}
                        </form>
                    </div>
                    <div className="song-list">
                        {artistas.length === 0 ? <p style={{ color: '#b3b3b3', textAlign: 'center' }}>No hay artistas creados.</p> : artistas.map(a => (
                            <div key={a.id} className="song-card">
                                <div className="song-info"><h3>{a.nombre}</h3></div>
                                <div className="actions">
                                    <button className="btn-edit" onClick={() => { setEditArtistaId(a.id); setNombreArtistaNuevo(a.nombre); }}>Editar</button>
                                    <button className="btn-delete" onClick={() => deleteArtista(a.id)}>Borrar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VISTA: ÁLBUMES (ADMIN) */}
            {vista === 'albums' && (user.admin === true || user.admin == 1) && (
                <div>
                    <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#282828', borderRadius: '8px' }}>
                        <h2 style={{ color: '#1DB954', marginBottom: '15px' }}>{editAlbumId ? 'Editar Álbum' : 'Añadir Álbum'}</h2>
                        <form className="spoti-form" onSubmit={saveAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input className="spoti-input" placeholder="Nombre del Álbum..." value={nombreAlbumNuevo} onChange={e => setNombreAlbumNuevo(e.target.value)} required />
                            <select className="spoti-input" value={artistaAlbumNuevo} onChange={e => setArtistaAlbumNuevo(e.target.value)} required>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>Portada del Álbum</label>
                                    <input id="portadaAlbumInput" className="spoti-input" type="file" accept="image/*" />
                                </div>
                                <option value="">Selecciona su Artista...</option>
                                {artistas.map(a => (
                                    <option key={a.id} value={a.id}>{a.nombre}</option>
                                ))}
                            </select>
                            <button className="btn-spoti">{editAlbumId ? 'Guardar Cambios' : 'Añadir Álbum'}</button>
                            {editAlbumId && <button type="button" className="btn-delete" onClick={() => { setEditAlbumId(null); setNombreAlbumNuevo(''); setArtistaAlbumNuevo(''); }}>Cancelar Edición</button>}
                        </form>
                    </div>
                    <div className="song-list">
                        {albums.length === 0 ? <p style={{ color: '#b3b3b3', textAlign: 'center' }}>No hay álbumes creados.</p> : albums.map(al => {
                            const artistaDelAlbum = artistas.find(a => a.id.toString() === (al.artista?.id || al.artistaId || al.artista)?.toString());
                            return (
                                <div key={al.id} className="song-card">
                                    <div className="song-info">
                                        <h3>{al.nombre}</h3>
                                        <p>{artistaDelAlbum ? artistaDelAlbum.nombre : 'Artista Desconocido'}</p>
                                    </div>
                                    <div className="actions">
                                        <button className="btn-edit" onClick={() => { setEditAlbumId(al.id); setNombreAlbumNuevo(al.nombre); setArtistaAlbumNuevo(al.artista); }}>Editar</button>
                                        <button className="btn-delete" onClick={() => deleteAlbum(al.id)}>Borrar</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* VISTA: LISTAS */}
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

            {/* VISTA: USUARIOS (ADMIN) */}
            {vista === 'usuarios' && (user.admin === true || user.admin == 1) && (
                <div>
                    {/* --- BUSCADOR DE USUARIOS --- */}
                    <div style={{ marginBottom: '25px' }}>
                        <form onSubmit={handleSearchUsuario} style={{ display: 'flex', gap: '10px' }}>
                            <input
                                className="spoti-input"
                                style={{ flex: 1 }}
                                placeholder="Buscar usuario por correo exacto..."
                                value={searchCorreo}
                                onChange={e => setSearchCorreo(e.target.value)}
                            />
                            <button className="btn-spoti" type="submit">Buscar</button>
                            <button className="btn-delete" type="button" onClick={() => { setSearchCorreo(''); loadData(); }}>Limpiar</button>
                        </form>
                    </div>
                    {/* 1. FORMULARIO DE EDICIÓN DE USUARIO */}
                    {editUserId ? (
                        <div style={{ backgroundColor: '#282828', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                            <h2 style={{ color: '#1DB954', fontSize: '1.2rem', marginBottom: '15px' }}>Editar Perfil de Usuario</h2>
                            <form className="spoti-form" onSubmit={saveUsuario}>
                                <input className="spoti-input" placeholder="Nombre de usuario" value={username} onChange={e => setUsername(e.target.value)} required />
                                <input className="spoti-input" placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} required />
                                <input className="spoti-input" type="password" placeholder="Nueva contraseña (opcional)" value={pass} onChange={e => setPass(e.target.value)} />

                                {/* BOTÓN PARA SUBIR LA FOTO */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px', marginBottom: '5px' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>Subir Foto de Perfil (Opcional - JPG/PNG)</label>
                                    <input id="fotoPerfilInput" className="spoti-input" type="file" accept="image/jpeg, image/png" />
                                </div>

                                {/* CASILLA PARA HACER PREMIUM */}
                                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={premium === 1 || premium === true}
                                        onChange={e => setPremium(e.target.checked ? 1 : 0)}
                                        style={{ transform: 'scale(1.5)' }}
                                    />
                                    Hacer a este usuario Premium ⭐
                                </label>

                                {/* CASILLA PARA HACER ADMIN */}
                                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={isAdmin === 1 || isAdmin === true}
                                        onChange={e => setIsAdmin(e.target.checked ? 1 : 0)}
                                        style={{ transform: 'scale(1.5)' }}
                                    />
                                    Hacer a este usuario Admin 👑
                                </label>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button className="btn-spoti">Guardar Cambios</button>
                                    <button type="button" className="btn-delete" onClick={() => {
                                        setEditUserId(null); setUsername(''); setCorreo(''); setPass(''); setPremium(0);
                                        const f = document.getElementById('fotoPerfilInput'); if(f) f.value = '';
                                    }}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <p style={{ color: '#b3b3b3', marginBottom: '20px', textAlign: 'center' }}>Lista para editar los datos o ver sus listas de los usuarios.</p>
                    )}

                    {/* 2. PANEL DE GESTIÓN DE LISTAS DEL USUARIO SELECCIONADO */}
                    {adminSelectedUserId && (
                        <div style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #1DB954' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h2 style={{ color: '#1DB954', fontSize: '1.2rem', margin: 0 }}>Listas del Usuario</h2>
                                <button className="btn-delete" onClick={() => { setAdminSelectedUserId(null); setAdminSelectedListaId(null); }}>Cerrar Panel</button>
                            </div>

                            {/* Formulario para editar el nombre de la lista */}
                            {adminEditListaId && (
                                <form className="spoti-form" onSubmit={adminSaveLista} style={{ marginBottom: '20px' }}>
                                    <input className="spoti-input" value={adminEditListaNombre} onChange={e => setAdminEditListaNombre(e.target.value)} required />
                                    <button className="btn-spoti">Guardar Nombre</button>
                                    <button type="button" className="btn-delete" onClick={() => setAdminEditListaId(null)}>Cancelar</button>
                                </form>
                            )}

                            {/* Tarjetas de las listas de este usuario */}
                            <div className="song-list" style={{ marginBottom: '20px' }}>
                                {adminUserListas.length === 0 ? <p style={{ color: '#b3b3b3' }}>No tiene listas.</p> : adminUserListas.map(l => (
                                    <div key={l.id} className="song-card" style={{ backgroundColor: '#282828' }}>
                                        <div className="song-info"><h3>{l.nombre}</h3></div>
                                        <div className="actions">
                                            <button className="btn-spoti" style={{ padding: '5px 10px', fontSize: '0.9rem' }} onClick={() => verCancionesDeLista(l.id)}>Ver Canciones</button>
                                            <button className="btn-edit" onClick={() => { setAdminEditListaId(l.id); setAdminEditListaNombre(l.nombre); }}>Editar</button>
                                            <button className="btn-delete" onClick={() => adminDeleteLista(l.id)}>Borrar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CANCIONES DE LA LISTA SELECCIONADA */}
                            {adminSelectedListaId && (
                                <div style={{ backgroundColor: '#121212', padding: '15px', borderRadius: '8px' }}>
                                    <h3 style={{ color: 'white', marginBottom: '10px' }}>Canciones en la lista:</h3>
                                    {adminCancionesLista.length === 0 ? <p style={{ color: '#b3b3b3' }}>La lista está vacía.</p> : adminCancionesLista.map(c => (
                                        <div key={c.id} style={{ padding: '8px 0', borderBottom: '1px solid #333', color: '#b3b3b3' }}>
                                            🎵 {c.nombre}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. LISTADO DE USUARIOS */}
                    <div className="song-list">
                        {usuarios.map(u => {
                            const fotoPerfil = u.urlImagen
                                ? `${baseUrl}/${u.urlImagen}`
                                : 'https://ui-avatars.com/api/?name=' + u.username + '&background=282828&color=1DB954';
                            return (
                                <div key={u.id} className="song-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <img src={fotoPerfil} alt={`Perfil de ${u.username}`} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                                        <div className="song-info">
                                            {/* Si es premium o admin, le ponemos sus iconos */}
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, paddingBottom: '5px' }}>
                                                {u.username}
                                                {u.premium === 1 && <span style={{ color: '#1DB954', fontSize: '0.9rem' }}>⭐ Premium</span>}
                                                {(u.admin === 1 || u.admin === true) && <span style={{ color: '#FFD700', fontSize: '0.9rem' }}>👑 Admin</span>}
                                            </h3>
                                            <p>{u.correo}</p>
                                        </div>
                                    </div>

                                    <div className="actions">
                                        <button className="btn-spoti" style={{ padding: '5px 10px', fontSize: '0.9rem' }} onClick={() => verListasDeUsuario(u.id)}>
                                            Ver Listas
                                        </button>

                                        <button className="btn-edit" onClick={() => {
                                            setEditUserId(u.id);
                                            setUsername(u.username);
                                            setCorreo(u.correo);
                                            setPass('');
                                            setUrlImagen(u.urlImagen || '');
                                            setPremium(u.premium || 0);
                                            setIsAdmin(u.admin || 0);
                                        }}>Editar</button>

                                        {u.id !== user.id && <button className="btn-delete" onClick={() => deleteUsuario(u.id)}>Borrar</button>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* --- REPRODUCTOR GLOBAL --- */}
            {playlist.length > 0 && currentSongIndex !== null && (
                <div style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0,
                    backgroundColor: '#181818', borderTop: '1px solid #282828',
                    padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1000
                }}>
                    <div style={{ minWidth: '150px' }}>
                        <p style={{ color: 'white', margin: 0, fontWeight: 'bold' }}>
                            {playlist[currentSongIndex].nombre}
                        </p>
                    </div>

                    <audio
                        controls
                        autoPlay
                        src={`${baseUrl}/${playlist[currentSongIndex].urlAudio}`}
                        style={{ flex: 1, height: '40px' }}
                        onEnded={() => {
                            if (currentSongIndex < playlist.length - 1) {
                                setCurrentSongIndex(currentSongIndex + 1);
                            }
                        }}
                    />

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className="btn-spoti"
                            style={{ padding: '5px 10px', backgroundColor: currentSongIndex === 0 ? '#555' : '#1DB954' }}
                            onClick={() => currentSongIndex > 0 && setCurrentSongIndex(currentSongIndex - 1)}
                            disabled={currentSongIndex === 0}
                        >
                            ⏮
                        </button>
                        <button
                            className="btn-spoti"
                            style={{ padding: '5px 10px', backgroundColor: currentSongIndex === playlist.length - 1 ? '#555' : '#1DB954' }}
                            onClick={() => currentSongIndex < playlist.length - 1 && setCurrentSongIndex(currentSongIndex + 1)}
                            disabled={currentSongIndex === playlist.length - 1}
                        >
                            ⏭
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
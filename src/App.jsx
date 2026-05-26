import React, { useState, useEffect } from 'react'
import './App.css'
import logo from '../public/logo.png'


// --- COMPONENTE PARA CARGAR IMAGENES PROTEGIDAS ---
const ImagenSegura = ({ url, token, alt, style }) => {
    // Usamos React.useState y React.useEffect por si acaso
    const [imgData, setImgData] = React.useState('https://ui-avatars.com/api/?name=Foto&background=282828&color=1DB954');

    React.useEffect(() => {
        if (!url) return;

        // Si es el avatar por defecto, no necesita token
        if (url.includes('ui-avatars.com')) {
            setImgData(url);
            return;
        }

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true'
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Error de foto');
                return res.blob();
            })
            .then(blob => {
                setImgData(URL.createObjectURL(blob));
            })
            .catch((err) => {
                console.error("Error cargando la imagen segura:", err);
            });
    }, [url, token]);

    return <img src={imgData} alt={alt} style={style} />;
};

function App() {

    const [user, setUser] = useState(null) // guardamos los datos y el token
    const [isRegister, setIsRegister] = useState(false);

    // Estado para la pantalla de carga
    const [isLoading, setIsLoading] = useState(false);

    // Estados de sesion
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
    const [artista, setArtista] = useState([]);
    const [album, setAlbum] = useState('');
    const [genero, setGenero] = useState([]);
    const [editCancionId, setEditCancionId] = useState(null);

    // Estados formularios de edicion para generos, artistas y albumes
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
    const [artistaAlbumNuevo, setArtistaAlbumNuevo] = useState([]);
    const [searchGenero, setSearchGenero] = useState('');

    // Estados para la reproduccion
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioUrlSegura, setAudioUrlSegura] = useState(null);

    // Estados para navegar
    const [filtroArtistaId, setFiltroArtistaId] = useState(null);
    const [filtroAlbumId, setFiltroAlbumId] = useState(null);

    // Estado para recordar las canciones a las que tu has dado like
    const [cancionesLikeadas, setCancionesLikeadas] = useState([]);

    // Estados para el buscador de artistas en el formulario de canciones
    const [searchArtistaForm, setSearchArtistaForm] = useState('');
    const [showArtistaDropdown, setShowArtistaDropdown] = useState(false);

    const baseUrl = "https://ruser215.freedynamicdns.org/api";

    // --- ESTA FUNCION LIMPIA LAS RUTAS PARA QUE NO TENGAN DOBLE BARRA ---
    const getSafeUrl = (ruta, fallbackName) => {
        if (!ruta) return `https://ui-avatars.com/api/?name=${fallbackName}&background=282828&color=1DB954`;
        const limpia = ruta.startsWith('/') ? ruta.substring(1) : ruta;
        return `${baseUrl}/${limpia}`;
    };

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

        // CARGAMOS LOS ALBUMES PARA LOS DESPLEGABLES Y LISTADOS
        fetch(`${baseUrl}/albums`, { headers: headersConToken })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setAlbums(data); })
            .catch(err => console.error("Error al cargar álbumes:", err));

        fetch(`${baseUrl}/usuarios/${user.id}/listas`, { headers: headersConToken })
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setListas(data); });

        // COMPROBACION ADMIN SEGURA
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

    // Descargar el audio de forma segura mandando el token
    useEffect(() => {
        let objectUrl = null;
        if (currentSongIndex !== null && playlist[currentSongIndex]) {
            setAudioUrlSegura(null); // Vaciamos mientras carga
            fetch(`${baseUrl}/${playlist[currentSongIndex].urlAudio}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            })
                .then(res => {
                    if(!res.ok) throw new Error("Audio protegido");
                    return res.blob();
                })
                .then(blob => {
                    objectUrl = URL.createObjectURL(blob);
                    setAudioUrlSegura(objectUrl);
                })
                .catch(err => console.error("Error cargando audio:", err));
        }

        // Limpiamos la memoria RAM al cambiar de canción
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [currentSongIndex, playlist, user]);

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

        setIsLoading(true);

        const method = editCancionId ? 'PATCH' : 'POST';
        const url = editCancionId ? `${baseUrl}/canciones/${editCancionId}` : `${baseUrl}/canciones`;

        const formData = new FormData();
        formData.append('nombre', nombreCancion);
        formData.append('artistaIds', artista.join(','));
        formData.append('albumId', album);
        formData.append('generosIds', genero.join(','));
        formData.append('likes', 0);

        const inputAudio = document.getElementById('audioInput');
        if (inputAudio.files[0]) formData.append('audio', inputAudio.files[0]);

        fetch(url, { method: method, headers: getMultipartHeaders(), body: formData })
            .then(res => {
                setIsLoading(false);
                if (res.ok) {
                    setNombreCancion('');
                    setArtista([]);
                    setAlbum('');
                    setGenero([]);
                    setEditCancionId(null);
                    loadData();
                    alert("Canción guardada correctamente");
                } else {
                    alert("Error del servidor: " + res.status);
                }
            })
            .catch(err => {
                setIsLoading(false);
                alert("No se pudo conectar con el servidor");
                console.log(err);
            });
    };
    const deleteCancion = (id) => fetch(`${baseUrl}/canciones/${id}`, {method: 'DELETE', headers: getHeaders()}).then(loadData);

    // 1. FUNCION INTERRUPTOR (Poner y quitar like normal)
    const darLike = (idCancion, likesActuales) => {
        const yaTieneLike = cancionesLikeadas.includes(idCancion);
        let nuevosLikes = likesActuales || 0;

        if (yaTieneLike) {
            // Si ya tenia tu like lo quitamos y restamos 1
            nuevosLikes = Math.max(0, nuevosLikes - 1);
            setCancionesLikeadas(cancionesLikeadas.filter(id => id !== idCancion));
        } else {
            // Si no lo tenia lo ponemos y sumamos 1
            nuevosLikes = nuevosLikes + 1;
            setCancionesLikeadas([...cancionesLikeadas, idCancion]);
        }

        // Actualizamos la pantalla al momento
        setCanciones(canciones.map(c => c.id === idCancion ? { ...c, likes: nuevosLikes } : c));

        // Guardamos en la base de datos
        fetch(`${baseUrl}/canciones/${idCancion}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ likes: nuevosLikes })
        }).catch(err => console.log("Error al guardar like:", err));
    };

    // 2. FUNCION ADMIN (poner el numero exacto que quieras)
    const cambiarLikesAdmin = (idCancion, likesActuales) => {
        const input = prompt("¿Qué número exacto de likes quieres ponerle a esta canción?", likesActuales || 0);

        // Si el admin cancela o le da a cerrar no hacemos nada
        if (input === null) return;

        const nuevosLikes = parseInt(input, 10);
        if (isNaN(nuevosLikes)) {
            alert("Por favor, introduce un número válido.");
            return;
        }

        // Actualizamos la pantalla
        setCanciones(canciones.map(c => c.id === idCancion ? { ...c, likes: nuevosLikes } : c));

        // Guardamos
        fetch(`${baseUrl}/canciones/${idCancion}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ likes: nuevosLikes })
        }).catch(err => console.log("Error en likes admin:", err));
    };

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

        setIsLoading(true);

        const method = editArtistaId ? 'PATCH' : 'POST';
        const url = editArtistaId ? `${baseUrl}/artistas/${editArtistaId}` : `${baseUrl}/artistas`;

        const formData = new FormData();
        formData.append('nombre', nombreArtistaNuevo);

        const inputFoto = document.getElementById('fotoArtistaInput');
        if (inputFoto && inputFoto.files[0]) {
            formData.append('foto', inputFoto.files[0]);
        }

        fetch(url, { method: method, headers: getMultipartHeaders(), body: formData })
            .then(res => {
                setIsLoading(false);
                if(res.ok) {
                    setNombreArtistaNuevo('');
                    setEditArtistaId(null);
                    if(inputFoto) inputFoto.value = '';
                    loadData();
                    alert("Artista guardado correctamente");
                } else { alert("Error al guardar artista."); }
            }).catch(err => {
            setIsLoading(false);
            console.log(err);
        });
    };
    const deleteArtista = (id) => fetch(`${baseUrl}/artistas/${id}`, {method: 'DELETE', headers: getHeaders()}).then(loadData);

    // CRUD albums (admin)
    const saveAlbum = (e) => {
        e.preventDefault();
        if (artistaAlbumNuevo.length === 0 && !editAlbumId) {
            alert("Selecciona un artista primero");
            return;
        }

        setIsLoading(true);

        // Cogemos el primer artista marcado para usarlo en la URL de creación
        const artistaPrincipalUrl = artistaAlbumNuevo[0];
        const method = editAlbumId ? 'PATCH' : 'POST';
        const url = editAlbumId ? `${baseUrl}/albums/${editAlbumId}` : `${baseUrl}/artistas/${artistaPrincipalUrl}/albums`;

        const formData = new FormData();
        formData.append('nombre', nombreAlbumNuevo);

        // Le mandamos los IDs separados por comas
        formData.append('artistaId', artistaAlbumNuevo.join(','));

        const inputPortada = document.getElementById('portadaAlbumInput');
        if (inputPortada && inputPortada.files[0]) {
            formData.append('portada', inputPortada.files[0]);
        }

        fetch(url, { method: method, headers: getMultipartHeaders(), body: formData })
            .then(res => {
                setIsLoading(false);
                if (res.ok) {
                    setNombreAlbumNuevo('');
                    setArtistaAlbumNuevo([]);
                    setEditAlbumId(null);
                    if (inputPortada) inputPortada.value = '';
                    loadData();
                    alert("Álbum guardado correctamente.");
                } else { alert("Error al guardar álbum."); }
            }).catch(err => {
            setIsLoading(false);
            console.log(err);
        });
    };
    const deleteAlbum = (id) => fetch(`${baseUrl}/albums/${id}`, {method: 'DELETE', headers: getHeaders()}).then(loadData);

    // CRUD usuarios (admin)
    const saveUsuario = (e) => {
        e.preventDefault();

        setIsLoading(true);

        if(!editUserId) return;

        // 1. Preparamos los datos de texto (JSON normal)
        const bodyData = {
            username: username,
            correo: correo,
            premium: premium,
            admin: isAdmin
        };
        if (pass) bodyData.pass = pass;

        // 2. Enviamos primero los textos
        fetch(`${baseUrl}/usuarios/${editUserId}`, {
            method: 'PATCH', headers: getHeaders(),
            body: JSON.stringify(bodyData)
        }).then(res => {
            setIsLoading(false);
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
                        setIsLoading(false);
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
        }).catch(err => {
            setIsLoading(false);
            console.log(err);
        });
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
                <img src={logo} style={{ width: '200px', marginBottom: '20px', objectFit: 'contain' }} alt="Logo" />
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
                {/* DESCARGA APK Y QR */}
                <div style={{ borderTop: '1px solid #333', paddingTop: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>

                    {/* IMAGEN DEL CÓDIGO QR */}
                    <img
                        src={`${baseUrl}/qr/QR.png`}
                        alt="Código QR para descargar Spotifake"
                        style={{ width: '150px', height: '150px', borderRadius: '8px' }}
                        onError={(e) => e.target.style.display = 'none'}
                    />
                </div>
            </div>
        );
    }

    // Pantalla principal (si hay usuario)
    return (
        <div className="main-container">

            {/* PANTALLA DE CARGA */}
            {isLoading && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center', zIndex: 9999
                }}>
                    <div style={{
                        border: '4px solid #333', borderTop: '4px solid #1DB954',
                        borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite'
                    }} />
                    <h2 style={{ color: '#1DB954', marginTop: '20px' }}>Subiendo archivos...</h2>
                    <p style={{ color: 'white' }}>Por favor, espera, no cierres la página.</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {/* Cabecera con saludo y botones de control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
                <img
                    src={logo}
                    alt="Spotifake"
                    style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
                {/* Aumentamos el gap a 15px para separar más los botones entre sí */}
                <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                    <button className="btn-spoti" style={{background: '#555'}} onClick={() => { setVista('canciones'); setFiltroAlbumId(null); }}>Canciones</button>
                    <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('listas')}>Mis Listas</button>

                    {/* Botones de administrador ahora divididos en pestañas */}
                    {(user.admin === true || user.admin == 1) && (
                        <>
                            <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('generos')}>Géneros</button>
                            <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('artistas')}>Artistas</button>
                            <button className="btn-spoti" style={{background: '#555'}} onClick={() => { setVista('albums'); setFiltroArtistaId(null); }}>Álbumes</button>
                            <button className="btn-spoti" style={{background: '#555'}} onClick={() => setVista('usuarios')}>Usuarios</button>
                        </>
                    )}
                    <button className="btn-delete" onClick={() => { setUser(null); setVista('canciones'); }}>Cerrar Sesión</button>
                </div>
                {/* Versión para control de cambios */}
                <div style={{
                    position: 'fixed',
                    bottom: '10px',
                    right: '10px',
                    color: '#555',
                    fontSize: '0.7rem',
                    pointerEvents: 'none' // Para que no moleste si haces clic ahí
                }}>
                    v1.1.0
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

                                {/* Selección de Artistas (Desplegable con buscador) */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>Artistas (puedes marcar varios)</label>

                                    {/* Botón que simula el desplegable */}
                                    <div
                                        className="spoti-input"
                                        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#181818' }}
                                        onClick={() => setShowArtistaDropdown(!showArtistaDropdown)}
                                    >
                                        <span>{artista.length === 0 ? 'Selecciona uno o varios artistas...' : `${artista.length} artista(s) seleccionado(s)`}</span>
                                        <span>{showArtistaDropdown ? '▲' : '▼'}</span>
                                    </div>

                                    {/* Menú desplegable flotante */}
                                    {showArtistaDropdown && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                                            backgroundColor: '#282828', border: '1px solid #333', borderRadius: '4px',
                                            marginTop: '5px', padding: '15px', boxShadow: '0 8px 16px rgba(0,0,0,0.8)'
                                        }}>
                                            {/* Buscador */}
                                            <input
                                                type="text"
                                                className="spoti-input"
                                                placeholder="Buscar artista por nombre..."
                                                value={searchArtistaForm}
                                                onChange={e => setSearchArtistaForm(e.target.value)}
                                                style={{ marginBottom: '15px', padding: '8px' }}
                                            />

                                            {/* Lista filtrada con scroll */}
                                            <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {artistas.filter(a => a.nombre.toLowerCase().includes(searchArtistaForm.toLowerCase())).length === 0 ? (
                                                    <p style={{ color: '#b3b3b3', fontSize: '0.9rem', textAlign: 'center' }}>No se encontraron artistas</p>
                                                ) : (
                                                    artistas
                                                        .filter(a => a.nombre.toLowerCase().includes(searchArtistaForm.toLowerCase()))
                                                        .map(a => (
                                                            <label key={a.id} style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.95rem', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    value={a.id}
                                                                    checked={artista.includes(a.id.toString())}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setArtista([...artista, e.target.value]);
                                                                        } else {
                                                                            setArtista(artista.filter(id => id !== e.target.value));
                                                                        }
                                                                    }}
                                                                    style={{ transform: 'scale(1.2)' }}
                                                                />
                                                                {a.nombre}
                                                            </label>
                                                        ))
                                                )}
                                            </div>

                                            {/* Botón para cerrar el desplegable rápido */}
                                            <button
                                                type="button"
                                                className="btn-spoti"
                                                style={{ marginTop: '15px', width: '100%', padding: '5px' }}
                                                onClick={() => setShowArtistaDropdown(false)}
                                            >
                                                Cerrar lista
                                            </button>
                                        </div>
                                    )}
                                </div>

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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>Géneros (puedes marcar varios)</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', backgroundColor: '#181818', padding: '10px', borderRadius: '4px', border: '1px solid #333' }}>
                                        {generos.map(g => (
                                            <label key={g.id} style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                                <input
                                                    type="checkbox"
                                                    value={g.id}
                                                    checked={genero.includes(g.id.toString())}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setGenero([...genero, e.target.value]);
                                                        } else {
                                                            setGenero(genero.filter(id => id !== e.target.value));
                                                        }
                                                    }}
                                                    style={{ transform: 'scale(1.2)' }}
                                                />
                                                {g.nombre}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button className="btn-spoti" style={{ marginTop: '10px' }}>
                                    {editCancionId ? 'Guardar Cambios' : 'Subir Canción'}
                                </button>

                                {editCancionId && (
                                    <button type="button" className="btn-delete" onClick={() => {
                                        setEditCancionId(null);
                                        setNombreCancion(''); setArtista(''); setAlbum(''); setGenero([]);
                                    }}>Cancelar Edición</button>
                                )}
                            </form>
                        </div>
                    )}

                    {/* LISTADO DE CANCIONES */}
                    <div className="song-list">
                        {filtroAlbumId && (
                            <div style={{ backgroundColor: '#1DB954', color: 'black', padding: '10px', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong>Mostrando solo las canciones de este álbum</strong>
                                <button className="btn-delete" style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setFiltroAlbumId(null)}>Ver todas</button>
                            </div>
                        )}

                        {canciones.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#b3b3b3' }}>No hay canciones disponibles.</p>
                        ) : (
                            canciones
                                .filter(c => !filtroAlbumId || (c.album?.id || c.albumId || c.album)?.toString() === filtroAlbumId.toString())
                                .map(c => {

                                    let nombresArtistasStr = "Artista Desconocido";
                                    const datoArtista = c.artista || c.artistas || c.artistaId || c.artistaIds;

                                    if (datoArtista) {
                                        let nombres = [];
                                        if (Array.isArray(datoArtista) && datoArtista.length > 0 && datoArtista[0].nombre) {
                                            nombres = datoArtista.map(a => a.nombre);
                                        } else {
                                            let listaIds = Array.isArray(datoArtista) ? datoArtista.map(a => a.id || a) : datoArtista.toString().split(',');
                                            nombres = listaIds.map(id => {
                                                let encontrado = artistas.find(a => a.id.toString() === id.toString().trim());
                                                return encontrado ? encontrado.nombre : null;
                                            }).filter(n => n);
                                        }
                                        if (nombres.length > 0) {
                                            nombresArtistasStr = nombres.join(' & ');
                                        } else if (typeof datoArtista === 'string' && isNaN(datoArtista.split(',')[0])) {
                                            nombresArtistasStr = datoArtista;
                                        }
                                    }

                                    const idDelAlbum = c.album?.id || c.albumId || c.album;
                                    const albumObj = albums.find(al => al.id.toString() === idDelAlbum?.toString());
                                    const nombreAlbumStr = albumObj ? albumObj.nombre : (idDelAlbum || "Desconocido");
                                    const urlDelAudio = c.urlAudio ? `${baseUrl}/${c.urlAudio}` : null;

                                    return (
                                        <div key={c.id} className="song-card">
                                            <ImagenSegura url={getSafeUrl(c.urlportada || c.urlPortada, c.nombre)} token={user.token} alt={`Portada de ${c.nombre}`} style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }} />

                                            <div className="song-info" style={{ minWidth: '200px' }}>
                                                <h3>{c.nombre}</h3>
                                                <p>{nombresArtistasStr} — {nombreAlbumStr}</p>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: '60px', color: '#1DB954', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => darLike(c.id, c.likes)} title="¡Dar Me Gusta!">
                                                <span style={{ transition: 'transform 0.1s' }} onMouseDown={e => e.target.style.transform = 'scale(0.8)'} onMouseUp={e => e.target.style.transform = 'scale(1)'}>
                                                    💚
                                                </span>
                                                <span>{c.likes || 0}</span>
                                            </div>

                                            {urlDelAudio ? (
                                                <button className="btn-spoti" style={{ flex: 1, margin: '0 20px' }} onClick={() => playSong(canciones.indexOf(c), canciones)}>▶ Reproducir</button>
                                            ) : (
                                                <p style={{ color: '#ff4d4d', fontSize: '0.8rem', flex: 1, textAlign: 'center' }}>No hay audio</p>
                                            )}

                                            {(user.admin === true || user.admin == 1) && (
                                                <div className="actions">
                                                    <button className="btn-spoti" style={{ backgroundColor: '#1DB954', color: 'black', fontWeight: 'bold', padding: '5px 10px', fontSize: '0.9rem' }} onClick={() => cambiarLikesAdmin(c.id, c.likes)}>
                                                        Likes
                                                    </button>
                                                    <button className="btn-edit" onClick={() => {
                                                        setEditCancionId(c.id); setNombreCancion(c.nombre);
                                                        let artistasEditados = [];
                                                        if (Array.isArray(c.artista)) artistasEditados = c.artista.map(a => a.id ? a.id.toString() : a.toString());
                                                        else if (typeof c.artista === 'string') artistasEditados = c.artista.split(',');
                                                        else if (typeof c.artista === 'number') artistasEditados = [c.artista.toString()];
                                                        setArtista(artistasEditados); setAlbum(c.album);
                                                        let generosEditados = [];
                                                        if (Array.isArray(c.genero)) generosEditados = c.genero.map(g => g.id ? g.id.toString() : g.toString());
                                                        else if (typeof c.genero === 'string') generosEditados = c.genero.split(',');
                                                        setGenero(generosEditados);
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
                    {/* --- FORMULARIO CREAR/EDITAR GÉNERO --- */}
                    <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#282828', borderRadius: '8px' }}>
                        <h2 style={{ color: '#1DB954', marginBottom: '15px' }}>{editGeneroId ? 'Editar Género' : 'Añadir Género'}</h2>
                        <form className="spoti-form" onSubmit={saveGenero} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input className="spoti-input" placeholder="Nombre del Género..." value={nombreGenero} onChange={e => setNombreGenero(e.target.value)} required />
                            <button className="btn-spoti">{editGeneroId ? 'Guardar Cambios' : 'Añadir Género'}</button>
                            {editGeneroId && <button type="button" className="btn-delete" onClick={() => { setEditGeneroId(null); setNombreGenero(''); }}>Cancelar Edición</button>}
                        </form>
                    </div>

                    {/* --- BUSCADOR DE GÉNEROS --- */}
                    <div style={{ marginBottom: '25px', display: 'flex', gap: '10px' }}>
                        <input
                            className="spoti-input"
                            style={{ flex: 1 }}
                            placeholder="Buscar género por nombre..."
                            value={searchGenero}
                            onChange={e => setSearchGenero(e.target.value)}
                        />
                        <button className="btn-delete" type="button" onClick={() => setSearchGenero('')}>Limpiar</button>
                    </div>

                    {/* --- LISTA DE GÉNEROS --- */}
                    <div className="song-list">
                        {generos.length === 0 ? (
                            <p style={{ color: '#b3b3b3', textAlign: 'center' }}>No hay géneros creados.</p>
                        ) : (
                            generos
                                .filter(g => g.nombre.toLowerCase().includes(searchGenero.toLowerCase()))
                                .map(g => (
                                    <div key={g.id} className="song-card">
                                        <div className="song-info"><h3>{g.nombre}</h3></div>
                                        <div className="actions">
                                            <button className="btn-edit" onClick={() => { setEditGeneroId(g.id); setNombreGenero(g.nombre); }}>Editar</button>
                                            <button className="btn-delete" onClick={() => deleteGenero(g.id)}>Borrar</button>
                                        </div>
                                    </div>
                                ))
                        )}

                        {/* Mensaje por si la búsqueda no coincide con nada */}
                        {generos.length > 0 && generos.filter(g => g.nombre.toLowerCase().includes(searchGenero.toLowerCase())).length === 0 && (
                            <p style={{ color: '#b3b3b3', textAlign: 'center', width: '100%' }}>No se encontró ningún género con ese nombre.</p>
                        )}
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
                        {artistas.length === 0 ? (
                            <p style={{ color: '#b3b3b3', textAlign: 'center' }}>No hay artistas creados.</p>
                        ) : (
                            artistas.map(a => (
                                <div key={a.id} className="song-card">
                                    <ImagenSegura
                                        url={getSafeUrl(a.foto || a.urlImagen || a.imagen, a.nombre)}
                                        token={user.token}
                                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    <div className="song-info">
                                        <h3>{a.nombre}</h3>
                                    </div>
                                    <div className="actions">
                                        <button className="btn-spoti" onClick={() => { setFiltroArtistaId(a.id); setVista('albums'); }}>Ver Álbumes</button>
                                        <button className="btn-edit" onClick={() => { setEditArtistaId(a.id); setNombreArtistaNuevo(a.nombre); }}>Editar</button>
                                        <button className="btn-delete" onClick={() => deleteArtista(a.id)}>Borrar</button>
                                    </div>
                                </div>
                            ))
                        )}
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

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>Artistas del Álbum (puedes marcar varios)</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', backgroundColor: '#181818', padding: '10px', borderRadius: '4px', border: '1px solid #333' }}>
                                    {artistas.map(a => (
                                        <label key={a.id} style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                            <input
                                                type="checkbox"
                                                value={a.id}
                                                checked={artistaAlbumNuevo.includes(a.id.toString())}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setArtistaAlbumNuevo([...artistaAlbumNuevo, e.target.value]);
                                                    } else {
                                                        setArtistaAlbumNuevo(artistaAlbumNuevo.filter(id => id !== e.target.value));
                                                    }
                                                }}
                                                style={{ transform: 'scale(1.2)' }}
                                            />
                                            {a.nombre}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.8rem', color: '#b3b3b3' }}>
                                    {editAlbumId ? 'Nueva portada (Dejar en blanco para no cambiarla)' : 'Portada del Álbum'}
                                </label>
                                <input id="portadaAlbumInput" className="spoti-input" type="file" accept="image/*" />
                            </div>

                            <button className="btn-spoti">{editAlbumId ? 'Guardar Cambios' : 'Añadir Álbum'}</button>
                            {editAlbumId && <button type="button" className="btn-delete" onClick={() => { setEditAlbumId(null); setNombreAlbumNuevo(''); setArtistaAlbumNuevo([]); }}>Cancelar Edición</button>}
                        </form>
                    </div>

                    <div className="song-list">
                        {filtroArtistaId && (
                            <div style={{ backgroundColor: '#1DB954', color: 'black', padding: '10px', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong>Mostrando solo los álbumes de este artista</strong>
                                <button className="btn-delete" style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setFiltroArtistaId(null)}>Ver todos</button>
                            </div>
                        )}

                        {albums.length === 0 ? <p style={{ color: '#b3b3b3', textAlign: 'center' }}>No hay álbumes creados.</p> : albums
                            .filter(al => !filtroArtistaId || (al.artista?.id || al.artistaId || al.artista)?.toString() === filtroArtistaId.toString())
                            .map(al => {
                                let nombresArtistasAlbumStr = "Artista Desconocido";
                                const datoArtista = al.artista || al.artistaId;

                                if (datoArtista) {
                                    let idsArtistas = [];
                                    if (Array.isArray(datoArtista)) {
                                        idsArtistas = datoArtista.map(a => a.id ? a.id.toString() : a.toString());
                                    } else if (typeof datoArtista === 'string') {
                                        idsArtistas = datoArtista.split(',').map(id => id.trim());
                                    } else if (typeof datoArtista === 'number') {
                                        idsArtistas = [datoArtista.toString()];
                                    }

                                    const objsArtistas = idsArtistas.map(id => artistas.find(a => a.id.toString() === id));
                                    const nombres = objsArtistas.filter(a => a).map(a => a.nombre);
                                    nombresArtistasAlbumStr = nombres.length > 0 ? nombres.join(' & ') : datoArtista.toString();
                                }

                                return (
                                    <div key={al.id} className="song-card">
                                        <ImagenSegura
                                            url={getSafeUrl(al.portada || al.urlPortada || al.urlportada, al.nombre)}
                                            token={user.token}
                                            style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }}
                                        />
                                        <div className="song-info">
                                            <h3>{al.nombre}</h3>
                                            <p>{nombresArtistasAlbumStr}</p>
                                        </div>
                                        <div className="actions">
                                            <button className="btn-spoti" onClick={() => { setFiltroAlbumId(al.id); setVista('canciones'); }}>Ver Canciones</button>
                                            <button className="btn-edit" onClick={() => {
                                                setEditAlbumId(al.id);
                                                setNombreAlbumNuevo(al.nombre);

                                                // Leer los artistas del álbum al editar
                                                const datoArtista = al.artista || al.artistaId;
                                                let artistasEditados = [];
                                                if (Array.isArray(datoArtista)) {
                                                    artistasEditados = datoArtista.map(a => a.id ? a.id.toString() : a.toString());
                                                } else if (typeof datoArtista === 'string') {
                                                    artistasEditados = datoArtista.split(',');
                                                } else if (typeof datoArtista === 'number') {
                                                    artistasEditados = [datoArtista.toString()];
                                                }
                                                setArtistaAlbumNuevo(artistasEditados);
                                            }}>Editar</button>

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
                    {/* Formulario para crear lista */}
                    <form className="spoti-form" onSubmit={saveLista} style={{ marginBottom: '30px' }}>
                        <input className="spoti-input" placeholder="Nombre de lista..." value={nombreLista} onChange={e => setNombreLista(e.target.value)} required />
                        <button className="btn-spoti">Crear</button>
                    </form>

                    {/* Listado de las listas */}
                    <div className="song-list" style={{ marginBottom: '30px' }}>
                        {listas.length === 0 ? <p style={{ color: '#b3b3b3' }}>No tienes listas creadas.</p> : listas.map(l => (
                            <div key={l.id} className="song-card">
                                <div className="song-info"><h3>{l.nombre}</h3></div>
                                <div className="actions">
                                    <button className="btn-spoti" onClick={() => verCancionesDeLista(l.id)}>Ver Canciones</button>
                                    <button className="btn-delete" onClick={() => deleteLista(l.id)}>Borrar</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Panel de canciones de la lista seleccionada */}
                    {adminSelectedListaId && (
                        <div style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '8px', border: '1px solid #1DB954' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h2 style={{ color: '#1DB954', fontSize: '1.2rem', margin: 0 }}>Canciones de la lista</h2>
                                <button className="btn-delete" onClick={() => setAdminSelectedListaId(null)}>Cerrar Panel</button>
                            </div>

                            {adminCancionesLista.length === 0 ? (
                                <p style={{ color: '#b3b3b3' }}>La lista está vacía.</p>
                            ) : (
                                <div className="song-list">
                                    {adminCancionesLista.map((c, index) => (
                                        <div key={c.id} className="song-card" style={{ backgroundColor: '#282828' }}>
                                            <div className="song-info">
                                                <h3>{c.nombre}</h3>
                                            </div>
                                            <div className="actions">
                                                {c.urlAudio ? (
                                                    <button
                                                        className="btn-spoti"
                                                        onClick={() => playSong(index, adminCancionesLista)}
                                                    >
                                                        ▶ Reproducir
                                                    </button>
                                                ) : (
                                                    <p style={{ color: '#ff4d4d', fontSize: '0.8rem', textAlign: 'center' }}>Sin audio</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
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
                                        checked={premium}
                                        onChange={e => setPremium(e.target.checked)}
                                        style={{ transform: 'scale(1.5)' }}
                                    />
                                    Hacer a este usuario Premium ⭐
                                </label>

                                {/* CASILLA PARA HACER ADMIN */}
                                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={isAdmin}
                                        onChange={e => setIsAdmin(e.target.checked)}
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
                                        <ImagenSegura
                                            url={fotoPerfil}
                                            token={user.token}
                                            alt={`Perfil de ${u.username}`}
                                            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                        <div className="song-info">
                                            {/* Si es premium o admin, le ponemos sus iconos */}
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, paddingBottom: '5px' }}>
                                                {u.username}
                                                {(u.premium === 1 || u.premium === true || u.premium === "true") && (
                                                    <span style={{ color: '#1DB954', fontSize: '0.9rem', fontWeight: 'bold' }}>⭐ Premium</span>
                                                )}
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
                                            setPremium(u.premium === 1 || u.premium === true);
                                            setIsAdmin(u.admin === 1|| u.admin === true);
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
                        key={currentSongIndex}
                        controls
                        autoPlay
                        src={audioUrlSegura || ''}
                        style={{ flex: 1, height: '40px' }}
                        onEnded={() => {
                            // Si hay más canciones, pasa a la siguiente
                            if (currentSongIndex < playlist.length - 1) {
                                setCurrentSongIndex(currentSongIndex + 1);
                            } else {
                                // Si era la última, vuelve a empezar desde la primera
                                setCurrentSongIndex(0);
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
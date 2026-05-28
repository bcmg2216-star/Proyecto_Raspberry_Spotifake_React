# Spotifake - Frontend (React)
Este es el código del frontend de **Spotifake**, un clon de Spotify hecho con React. El proyecto está preparado para montarse en una Raspberry Pi 3 usando Docker, y se comunica con el backend a través de la VPN de Tailscale o Ngrok.

## ¿Qué incluye?
- **Login y Registro** de usuarios.
- **Reproductor de música global:** Barra de reproducción persistente en la parte inferior con controles de siguiente/anterior y autoplay, permitiendo navegar por la app sin que se corte la música.
- **Modo Todoterreno Visual:** La interfaz está programada para leer de forma inteligente y renderizar **múltiples artistas y géneros** por canción.
- **Panel de Admin Avanzado:** Permite gestionar todo el contenido:
    - **Canciones:** Subida de archivos de audio protegidos (mp3), asociados a uno o múltiples artistas/géneros mediante selectores desplegables inteligentes con buscador interno.
    - **Artistas y Álbumes:** Creación de entidades con subida de imágenes para la foto de perfil del artista y la portada del álbum, permitiendo álbumes colaborativos.
    - **Géneros:** Gestión de etiquetas musicales con filtrado en tiempo real.
    - **Sistema de Likes:** Funcionalidad de "Dar Me Gusta" para los usuarios normales, y un editor directo numérico para los administradores.
- **Gestión de usuarios (Admin):** Para dar permisos de Admin, otorgar suscripciones Premium, subir fotos de perfil, buscar por correo exacto y gestionar (ver/editar/borrar) las listas de reproducción de cualquier usuario del sistema.
- **Pantalla de carga (Loading state):** Sistema global de bloqueo de pantalla que previene errores y dobles clics durante subidas de archivos pesados y peticiones a la API.
- Botón y código QR en la pantalla principal para descargar la APK de la versión de Android.
- Diseño en modo oscuro inspirado en Spotify (CSS puro).

## Stack
- React + Vite
- CSS normal (App.css)
- Fetch API (Gestión de peticiones JSON y `multipart/form-data`)
- Docker (Nginx) configurado para arquitectura ARM (Raspberry Pi)

## Para probarlo en local
Si quieres bajarte el código y probarlo en tu PC:

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Arranca el servidor de pruebas:
   ```bash
   npm run dev
   ```

**⚠️ Importante:** La variable `baseUrl` en el archivo `src/App.jsx` apunta a la API de producción (Ngrok). Asegúrate de que el servidor Backend esté levantado en esa ruta.

**⚠️ Importante:** Tienes que estar conectado a la red de Tailscale del proyecto (o tener Ngrok activo sin el aviso de seguridad) para que la web funcione, haga login y cargue la música de forma segura.

## Para subirlo a producción (Docker)
El Dockerfile compila la aplicación y la empaqueta en un servidor Nginx ligero para la Raspberry Pi (ARM 32-bits).

Para compilar y subir la imagen actualizada a Docker Hub, ejecuta esto en la terminal:

```bash
docker build --platform linux/arm/v7 -t bcmg/spotify-react-pi3:latest .
docker push bcmg/spotify-react-pi3:latest
```

Una vez subida, en el servidor de la Raspberry solo hay que hacer un `docker pull bcmg/spotify-react-pi3:latest` (o `docker-compose pull`) y volver a levantar el contenedor. Nginx sirve la web empaquetada internamente por el puerto 80.
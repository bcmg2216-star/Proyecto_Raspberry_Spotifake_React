# Spotifake - Frontend (React)
Este es el código del frontend de **Spotifake**, un clon de Spotify hecho con React. El proyecto está preparado para montarse en una Raspberry Pi 3 usando Docker, y se comunica con el backend a través de la VPN de Tailscale o Ngrok.

## ¿Qué incluye?
- **Login y Registro** de usuarios.
- **Reproductor de música global:** Barra de reproducción persistente en la parte inferior con controles de siguiente/anterior y autoplay, permitiendo navegar por la app sin que se corte la música.
- **Panel de Admin:** Permite gestionar todo el contenido:
    - **Canciones:** Subida de archivos de audio (mp3) asociados a un artista y álbum.
    - **Artistas y Álbumes:** Creación de entidades con subida de imágenes para la foto de perfil del artista y la portada del álbum.
    - **Géneros:** Gestión de etiquetas musicales.
- **Gestión de usuarios (Admin):** Para dar permisos de Admin, hacer cuentas Premium, subir fotos de perfil y gestionar (ver/editar/borrar) las listas de reproducción de cualquier usuario.
- Botón en la pantalla principal para descargar la APK de la versión de Android.
- Diseño en modo oscuro inspirado en Spotify (CSS puro).

## Stack
- React + Vite
- CSS normal (App.css)
- Docker (Nginx) configurado para arquitectura ARM (Raspberry Pi)

## Para probarlo en local
Si quieres bajarte el código y probarlo en tu PC:

1. Instala las dependencias:
   npm install

2. Arranca el servidor de pruebas:
   npm run dev

**⚠️ Importante:** La variable `baseUrl` en el archivo `src/App.jsx` apunta a la API de producción (Ngrok). Si vas a probarlo en `localhost:5173`, te dará error al intentar hacer login.

**⚠️ Importante:** Tienes que estar conectado a la red de Tailscale del proyecto para que la web funcione y cargue la música.

## Para subirlo a producción (Docker)
El Dockerfile compila la aplicación y la empaqueta en un servidor Nginx ligero para la Raspberry Pi (ARM 32-bits).

Para compilar y subir la imagen actualizada a Docker Hub, ejecuta esto en la terminal:

docker build --platform linux/arm/v7 -t bcmg/spotify-react-pi3:latest .

docker push bcmg/spotify-react-pi3:latest

Una vez subida, en el servidor de la Raspberry solo hay que hacer un `docker-compose pull` y volver a levantar el contenedor. Nginx sirve la web internamente por el puerto 80.
# Spotifake - Frontend (React)

Este es el código del frontend de Spotifake, un clon de Spotify hecho con React. El proyecto está preparado para montarse en una Raspberry Pi 3 usando Docker, y se comunica con el backend a través de la VPN de Tailscale.

## ¿Qué incluye?

- Login y registro de usuarios.
- Reproductor de música integrado en el navegador.
- **Panel de Admin:** Permite subir canciones (con su mp3 y foto de portada), y crear/borrar artistas, álbumes y géneros.
- **Gestión de usuarios (Admin):** Para dar permisos de Admin, hacer cuentas Premium, subir fotos de perfil y cotillear/borrar las listas de reproducción de la gente.
- Botón en la pantalla principal para descargar la APK de la versión de Android.
- Diseño en modo oscuro inspirado en Spotify (CSS puro).

## Stack

- React + Vite
- CSS normal (App.css)
- Docker (Nginx) configurado para arquitectura ARM (Raspberry Pi)
- Tailscale para conectar con la API

## Para probarlo en local

Si quieres bajarte el código y probarlo en tu PC:

1. Instala las dependencias:
   npm install

2. Arranca el servidor de pruebas:
   npm run dev

**⚠️ Importante:** Tienes que estar conectado a la red de Tailscale del proyecto para que la web funcione y cargue la música. Ahora mismo, la URL base de la API apunta a http://100.124.67.2:8001/api. Si la IP del servidor cambia algún día, hay que modificar la variable `baseUrl` en el archivo `src/App.jsx`.

## Para subirlo a producción (Docker)

El Dockerfile está montado en dos etapas para que compile usando la potencia del ordenador local y luego lo empaquete en un Nginx ligero para la Raspberry (ARM 32-bits).

Para compilar y subir la imagen actualizada a Docker Hub, ejecuta esto en la terminal:

docker build --platform linux/arm/v7 -t bcmg/spotify-react-pi3:latest .
docker push bcmg/spotify-react-pi3:latest

Una vez subida, el servidor de la Raspberry solo tiene que tirar de esa imagen en su docker-compose.yml y a funcionar.
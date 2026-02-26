# Spotifake - Panel Web Frontend

Este es el frontend (cliente web) del proyecto **Spotifake**, una aplicación de música al estilo Spotify. Está construido con **React** y permite tanto a usuarios normales como a administradores interactuar con la base de datos de música.

## Características Principales

La aplicación tiene dos niveles de acceso dependiendo del rol del usuario:

### Para Usuarios Normales:
* **Autenticación:** Registro e Inicio de sesión seguro con JWT.
* **Catálogo de Música:** Ver la lista de canciones disponibles y reproducirlas.
* **Mis Listas:** Crear listas de reproducción personalizadas y borrarlas.

### Para Administradores:
Los administradores tienen acceso a pestañas exclusivas para gestionar todo el contenido de la plataforma:
* **Gestión de Canciones:** Subir nuevas canciones (archivos de audio MP3 y portadas de imagen), editarlas y borrarlas.
* **Gestión de Entidades:** Crear, editar y borrar **Géneros**, **Artistas** y **Álbumes**. 
* **Gestión de Usuarios:** Ver todos los usuarios registrados, editar sus perfiles, otorgarles el estado de **Premium**, ver sus listas de reproducción y eliminarlos si es necesario.

## Tecnologías Utilizadas

* **React (Vite/Create React App):** Framework principal para la interfaz de usuario (`App.jsx`).
* **CSS Puro:** Estilos personalizados (`App.css`).
* **Fetch API:** Para las peticiones HTTP al servidor backend. Soporta tanto peticiones `JSON` estándar como `Multipart/FormData` para la subida de archivos (canciones y portadas).

## Cómo instalar y ejecutar el proyecto

Sigue estos sencillos pasos para levantar la web en tu ordenador:

1. **Abre una terminal** en la carpeta del proyecto.
2. **Instala las dependencias** de React ejecutando el siguiente comando:
   ```bash
   npm install
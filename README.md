# 2° Proyecto Web II Client

## Descripción

2° Proyecto Web II Client es la interfaz de usuario para el proyecto 2° Proyecto Web II Server. Permite a los usuarios interactuar con la aplicación a través de una serie de componentes y vistas. Esta parte del proyecto incluye la autenticación, la administración de perfiles y playlists, y la visualización de videos.

## Componentes

### Componentes Principales

- **Home**: Vista principal de la aplicación.
- **Home Admin**: Vista de administración donde se pueden gestionar perfiles y playlists.
- **Login**: Página de inicio de sesión.
- **Perfil**: Vista del perfil del usuario.
- **Perfil Edit**: Página para editar la información del perfil.
- **Perfiles**: Vista para gestionar varios perfiles.
- **Playlist**: Vista de las playlists del usuario.
- **Edit Playlist**: Página para editar las playlists.
- **Register**: Página para el registro de nuevos usuarios.
- **Confirm Account**: Nuevo componente para confirmar cuentas de usuario mediante un enlace recibido.
- **Verificate Code**: Componente que solicita un código de verificación de dos factores después de iniciar sesión.

### Características

- **Confirm Account**: Permite a los usuarios confirmar sus cuentas a través de un enlace enviado a su correo. Llama a la API para confirmar la cuenta usando el ID del usuario.
  
- **Verificate Code**: Después del inicio de sesión, se solicita un código de verificación enviado por SMS. El usuario debe ingresar este código para obtener un token de acceso.

- **Admin Dashboard**: Incluye opciones para crear, editar y eliminar perfiles y playlists. Los perfiles y playlists se pueden gestionar desde la vista de administración.

- **Playlist Management**: Permite agregar, editar y eliminar playlists. Los usuarios pueden gestionar las playlists asociadas a sus perfiles y agregar o eliminar videos de ellas.

- **Video Search**: Los usuarios pueden buscar videos dentro de las playlists. El buscador permite filtrar videos por tipo o título.

### Integración con APIs

- **GraphQL API**: Todas las solicitudes GET para obtener datos se realizan a la API GraphQL.
- **REST API**: Las solicitudes para actualizar, eliminar o realizar otras operaciones se envían a la API REST.

### Interceptor de Fetch

- **Interceptor de Fetch**: Se ha agregado una función de interceptor de Fetch que redirige a los usuarios a la página de inicio de sesión si se recibe un error 401 (no autorizado). Esto asegura que los usuarios se vuelvan a autenticar si su token de acceso ha expirado.

## Ejecución del Proyecto

Para ejecutar el proyecto localmente, sigue estos pasos:

1. Clona el repositorio en tu máquina local utilizando el siguiente comando:
    ```bash
    git clone https://github.com/FierceSpectrum/2-Proyecto-Web-II-Client
    ```
2. Navega hasta la carpeta del proyecto:
    ```bash
    cd 2-Proyecto-Web-II-Client
    ```
3. Instala las dependencias necesarias:
    ```bash
    npm install
    ```
4. Inicia la aplicación:
    ```bash
    npm start
    ```
5. La aplicación estará disponible en `http://localhost:3000`.

## Estado del Proyecto

Este proyecto fue desarrollado como parte del curso Web 2 y está completo en términos de funcionalidades frontend. No se han realizado actualizaciones desde su creación.

## Autor

Este proyecto fue desarrollado en su totalidad por [Benjamín Sandí](https://github.com/FierceSpectrum) durante el primer cuatrimestre del año 2024.

## Licencia

Este proyecto no tiene una licencia formal y fue creado con fines educativos. No está destinado para uso comercial.

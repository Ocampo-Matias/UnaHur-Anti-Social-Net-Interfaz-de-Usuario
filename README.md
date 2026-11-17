# UnaHur Anti-Social Net - Frontend

Trabajo Práctico para la materia **Construcción de Interfaces de Usuario** - Universidad Nacional de Hurlingham (UNAHUR).

---

## Datos del Alumno

* **Alumno:** Ocampo Matias
* **Materia:** Construcción de Interfaces de Usuario

---

## Descripción del Proyecto

Aplicación web desarrollada en **React + TypeScript + Vite** que consume la API REST de "UnaHur Anti-Social Net".

### Funcionalidades principales:
* **Inicio de sesión simulado:** Validación de usuario contra la API y contraseña fija local (`123456`). Manejo de sesión global con `useContext` y persistencia en `localStorage`.
* **Registro de usuarios:** Alta de nuevos usuarios (`nickName` y `email`) mediante `POST /users`.
* **Rutas protegidas:** La vista de perfil y la creación de publicaciones requieren inicio de sesión activo.
* **Feed de publicaciones:** Lista de publicaciones recientes con autor, imágenes, etiquetas y cantidad de comentarios.
* **Detalle de publicación (`/post/:id`):** Vista completa del post con carrusel de imágenes y formulario para agregar comentarios en tiempo real (`POST /comments`).
* **Perfil de usuario:** Muestra los datos del usuario conectado, sus publicaciones creadas y botón para cerrar sesión.
* **Crear publicaciones:** Formulario con descripción, selección de etiquetas (obtenidas de la API) y soporte para una o múltiples URLs de imágenes asociadas.

---

## API Utilizada

* **URL local del backend:** `http://localhost:3001`
* **Repositorio oficial de la cátedra:** [https://github.com/lucasfigarola/backend-api](https://github.com/lucasfigarola/backend-api)

---

## Instrucciones para ejecutar el proyecto en local

Abrir una  terminal en la carpeta `UnaHur-Anti-Social-Net-Interfaz-de-Usuario`:

```bash
cd UnaHur-Anti-Social-Net-Interfaz-de-Usuario

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

> Abrir en el navegador la dirección que indique Vite (generalmente `http://localhost:5173`).



## Tecnologías Utilizadas

* **React 19**
* **TypeScript**
* **Vite**
* **React Router DOM v7** (navegación y rutas protegidas)
* **Axios** (consumo de API REST)
* **Bootstrap 5 + CSS plano** (diseño responsive)

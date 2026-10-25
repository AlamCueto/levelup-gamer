<div align="center">

🎮 LEVEL-UP GAMER

🛍️ Tienda Online | Desarrollo FullStack II

¡Sube de nivel tu experiencia gamer! 🎯

Aplicación web interactiva desarrollada con React y Vite, que integra un catálogo de productos, carrito de compras, beneficios para estudiantes Duoc UC y pruebas unitarias automatizadas.

<br>
</div>

⸻

📌 Descripción del proyecto

Level-Up Gamer es una tienda online desarrollada como parte de la Evaluación Parcial 2 de Desarrollo FullStack II.

El proyecto evolucionó desde una estructura web estática hacia una Single Page Application (SPA), utilizando React para construir interfaces mediante componentes reutilizables y Vite como herramienta de desarrollo.

La aplicación incorpora navegación entre páginas, administración global del carrito de compras, validaciones de formularios y pruebas unitarias automatizadas.

✨ Objetivos principales

* 🛒 Implementar un carrito de compras interactivo.
* 🧩 Desarrollar una arquitectura basada en componentes reutilizables.
* 🧭 Gestionar la navegación mediante React Router.
* 🎓 Aplicar reglas de negocio para los beneficios Duoc UC.
* 🧪 Verificar el funcionamiento mediante pruebas unitarias.
* 📱 Crear una interfaz adaptable a distintos dispositivos.

⸻

👥 Equipo de trabajo

Integrantes:
Alam Cueto.
Francesca Valencia.	

⸻

🛠️ Tecnologías y herramientas

Tecnología	Uso en el proyecto
⚛️ React 18	Desarrollo de interfaces mediante componentes.
⚡ Vite 5	Servidor de desarrollo y herramientas de compilación.
🎨 Bootstrap 5	Diseño responsivo y estilos de interfaz.
🧩 React-Bootstrap	Componentes visuales integrados con React.
🧭 React Router DOM v6	Navegación entre las vistas de la aplicación.
🔄 Context API	Administración global del carrito mediante CartContext.
🧪 Jasmine	Definición y ejecución de pruebas unitarias.
🚦 Karma	Ejecución de pruebas automatizadas.
🧰 Webpack y JSDOM	Preparación del entorno de pruebas y simulación del DOM.
🐙 Git y GitHub	Control de versiones y colaboración.
💻 Visual Studio Code	Entorno de desarrollo.

⸻

🚀 Características principales

🛍️ 1. Catálogo de productos

Visualización de productos mediante componentes reutilizables, facilitando la organización y presentación del catálogo.

🛒 2. Carrito de compras

Gestión centralizada mediante CartContext, que permite:

* Agregar productos al carrito.
* Incrementar la cantidad de productos.
* Eliminar productos seleccionados.
* Vaciar completamente el carrito.
* Calcular subtotales y totales.
* Aplicar los beneficios correspondientes.

🎓 3. Beneficio Duoc UC

Implementación de una regla de negocio que contempla un 20 % de descuento para usuarios que cumplen con el criterio de correo institucional definido en el proyecto.

Dominios considerados:

* @duocuc.cl
* @profesor.duoc.cl

🧭 4. Navegación SPA

Navegación entre las diferentes vistas mediante React Router DOM, evitando la recarga completa de la página en cada cambio de ruta.

📱 5. Diseño responsivo

Interfaz con temática gamer, adaptada a dispositivos móviles, tablets y computadores mediante las herramientas de Bootstrap.

🧪 6. Pruebas unitarias automatizadas

Suite de 10 pruebas unitarias destinadas a comprobar componentes, interacciones, reglas de negocio y validaciones de formularios.

⸻

📂 Estructura del proyecto

levelup-gamer/
│
├── public/                      # Recursos estáticos e imágenes
│
├── src/
│   │
│   ├── components/              # Componentes reutilizables
│   │   ├── CartModal.jsx
│   │   ├── ContactoForm.jsx
│   │   ├── ProductCard.jsx
│   │   ├── RegistroForm.jsx
│   │   └── ReviewSection.jsx
│   │
│   ├── context/                  # Estado global de la aplicación
│   │   └── CartContext.jsx
│   │
│   ├── pages/                    # Páginas principales
│   │   ├── Catalogo.jsx
│   │   ├── Contacto.jsx
│   │   ├── Home.jsx
│   │   └── Registro.jsx
│   │
│   ├── tests/                    # Pruebas unitarias
│   │   └── app.spec.jsx
│   │
│   ├── App.jsx                   # Componente principal y rutas
│   └── main.jsx                  # Punto de entrada de React
│
├── karma.conf.cjs                # Configuración de Karma
├── package.json                  # Dependencias y scripts
├── package-lock.json             # Versiones de dependencias
└── README.md                     # Documentación del proyecto

⸻

🧪 Pruebas unitarias

El proyecto incluye una suite de 10 pruebas unitarias ubicadas en src/tests/app.spec.jsx, utilizando Jasmine y Karma.

✅ Casos de prueba contemplados

N.º	Prueba	Objetivo
1	Renderizado de ProductCard	Comprobar que el componente se muestra correctamente.
2	Evento onAddToCart	Verificar la interacción con la función para agregar productos.
3	Estado global del carrito	Comprobar que agregar productos actualiza el estado.
4	Descuento Duoc UC	Verificar la aplicación del descuento del 20 %.
5	Eliminación de productos	Comprobar que se pueden quitar elementos del carrito.
6	Función clearCart	Verificar que el carrito se vacía correctamente.
7	ReviewSection	Comprobar la publicación de opiniones y su interacción con el DOM.
8	Validación de contraseñas	Verificar la coincidencia de las contraseñas del registro.
9	Correo institucional	Comprobar la validación del dominio Duoc UC.
10	Etiquetas de beneficio	Verificar el renderizado condicional de la etiqueta BENEFICIO DUOC.

▶️ Ejecutar las pruebas

Desde la terminal, en la carpeta raíz del proyecto, ejecuta:

npm test

Nota: El comando requiere que el script test esté configurado en package.json.

⸻

⚙️ Instalación y ejecución local

Sigue estos pasos para ejecutar el proyecto en tu computador.

1. 📥 Clonar el repositorio

git clone https://github.com/TU_USUARIO/levelup-gamer.git

Importante: Reemplaza TU_USUARIO por el nombre de usuario correspondiente y utiliza la URL real del repositorio.

2. 📂 Ingresar a la carpeta

cd levelup-gamer

3. 📦 Instalar dependencias

npm install

4. ⚡ Iniciar el servidor de desarrollo

npm run dev

5. 🌐 Abrir la aplicación

Abre en tu navegador la dirección que indique Vite en la terminal. Normalmente es:

http://localhost:5173

⸻

🌿 Control de versiones

El proyecto utiliza Git y GitHub para administrar el código fuente y facilitar el trabajo colaborativo.

* Repositorio: Level-Up Gamer.
* Rama de desarrollo: Levelup-v2.
* Control de versiones: Git.
* Plataforma de alojamiento: GitHub.

⸻

<div align="center">

🎮 LEVEL-UP GAMER

Desarrollo FullStack II · Evaluación Parcial 2

Desarrollando experiencias, subiendo de nivel. 🚀

</div>

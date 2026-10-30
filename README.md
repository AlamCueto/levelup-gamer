<div align="center">

🎮 LEVEL-UP GAMER

🛍️ Tienda Online | Desarrollo FullStack II

¡Sube de nivel tu experiencia gamer! 🎯

Aplicación web interactiva desarrollada con React y Vite, que integra un catálogo de productos, carrito de compras, beneficios para estudiantes Duoc UC y pruebas unitarias automatizadas.

</div>

⸻

📌 Descripción del proyecto

Level-Up Gamer es una tienda online desarrollada como parte de la Evaluación Parcial 2 de Desarrollo FullStack II.

El proyecto evolucionó desde una estructura web estática hacia una Single Page Application (SPA), utilizando React para construir interfaces mediante componentes reutilizables y Vite como herramienta de desarrollo.

La aplicación incorpora navegación entre páginas, administración global del carrito de compras, validaciones de formularios y pruebas unitarias automatizadas.

✨ Objetivos principales

* 🛒 Implementar un carrito de compras interactivo.
* 🧩 Desarrollar una arquitectura basada en componentes reutilizables.
* 🧭 Gestionar la navegación mediante React Router DOM.
* 🎓 Aplicar reglas de negocio para los beneficios Duoc UC.
* 🧪 Verificar el funcionamiento mediante pruebas unitarias.
* 📊 Medir la cobertura del código.
* 📱 Crear una interfaz adaptable a distintos dispositivos.

⸻

👥 Equipo de trabajo

Integrantes:

* Alam Cueto.
* Francesca Valencia.

Asignatura: Desarrollo FullStack II.
Evaluación: Parcial 2.

⸻

🛠️ Tecnologías y herramientas

* ⚛️ React 18: desarrollo de interfaces mediante componentes.
* ⚡ Vite 5: servidor de desarrollo y herramientas de compilación.
* 🎨 Bootstrap 5: diseño responsivo y estilos.
* 🧩 React-Bootstrap: componentes visuales para React.
* 🧭 React Router DOM v6: navegación entre páginas.
* 🔄 Context API: gestión global del carrito mediante CartContext.
* 🔐 AuthContext: gestión de autenticación y datos del usuario.
* 🧪 Vitest: ejecución de pruebas unitarias.
* 📊 @vitest/coverage-v8: generación de informes de cobertura.
* 🧰 React Testing Library: pruebas de componentes e interacciones.
* 🌐 jsdom: simulación del entorno del navegador durante las pruebas.
* 🐙 Git y GitHub: control de versiones y colaboración.
* 💻 Visual Studio Code: entorno de desarrollo.

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

Implementación de una regla de negocio que contempla un 20 % de descuento para usuarios que cumplen con los criterios establecidos en el proyecto.

Dominios institucionales considerados:

* @duocuc.cl
* @profesor.duoc.cl

🧭 4. Navegación SPA

Navegación entre las diferentes vistas mediante React Router DOM, evitando la recarga completa de la página en cada cambio de ruta.

📱 5. Diseño responsivo

Interfaz con temática gamer, adaptada a dispositivos móviles, tablets y computadores mediante Bootstrap.

🧪 6. Pruebas unitarias automatizadas

El proyecto cuenta con una suite de 10 casos de prueba desarrollados con Vitest y React Testing Library.

Las pruebas verifican componentes, interacciones, estado global, reglas de negocio y validaciones de formularios.

📊 7. Cobertura de código

La cobertura permite identificar qué proporción del código se ejecuta durante las pruebas.

El informe contempla las siguientes métricas:

* Statements: instrucciones ejecutadas.
* Branches: ramas de decisión evaluadas.
* Functions: funciones ejecutadas.
* Lines: líneas de código ejecutadas.

⸻
```text
📂 Estructura del proyecto

levelup-gamer/
│
├── public/                         # Recursos estáticos e imágenes
│
├── src/
│   │
│   ├── assets/                     # Estilos CSS y recursos multimedia
│   │
│   ├── components/                 # Componentes reutilizables
│   │   ├── CartModal.jsx           # Modal del carrito
│   │   ├── ContactoForm.jsx        # Formulario de contacto y Level-Bot
│   │   ├── ProductCard.jsx         # Tarjeta individual de producto
│   │   ├── RegistroForm.jsx        # Formulario de registro
│   │   └── ReviewSection.jsx       # Reseñas de clientes
│   │
│   ├── context/                    # Estado global de la aplicación
│   │   ├── AuthContext.jsx          # Autenticación y sesión
│   │   └── CartContext.jsx          # Carrito, subtotales y totales
│   │
│   ├── pages/                      # Páginas principales
│   │   ├── AdminPanel.jsx           # Panel administrativo
│   │   ├── Catalogo.jsx             # Catálogo de productos
│   │   ├── Checkout.jsx             # Página de compra/venta producto
│   │   ├── Contacto.jsx             # Página de contacto
│   │   ├── Home.jsx                 # Página de inicio
│   │   ├── Login.jsx                # Inicio de sesión
│   │   └── Registro.jsx             # Página de registro
│   │
│   ├── tests/                     # Pruebas automatizadas
│   │   └── app.spec.jsx             # Suite de 10 pruebas unitarias
│   │
│   ├── App.css                    # Estilos personalizados
│   ├── App.jsx                    # Aplicación y rutas principales
│   ├── index.css                  # Estilos globales
│   └── main.jsx                   # Punto de entrada de React
│
├── package.json                   # Dependencias y scripts
├── package-lock.json              # Versiones bloqueadas
└── README.md                      # Documentación del proyecto
```
⸻

🧪 Pruebas unitarias

Las pruebas están ubicadas en:

src/tests/app.spec.jsx

Se utiliza Vitest para ejecutar las pruebas y React Testing Library para interactuar con los componentes.

✅ Casos de prueba contemplados

N.º	Prueba	Objetivo
1	Renderizado de ProductCard	Comprobar que el nombre del producto se muestra correctamente.
2	Evento onAddToCart	Verificar que el botón de compra invoque la función correspondiente.
3	Estado global del carrito	Comprobar que agregar un producto actualiza el estado.
4	Descuento Duoc UC	Verificar el cálculo del 20 % de descuento.
5	Eliminación de productos	Comprobar que se puede eliminar un producto específico.
6	Función clearCart	Verificar que el carrito se vacía correctamente.
7	ReviewSection	Comprobar que se puede publicar una reseña.
8	Validación de contraseñas	Verificar el mensaje de error cuando las contraseñas no coinciden.
9	Correo institucional	Comprobar el reconocimiento del dominio Duoc UC durante el registro.
10	Etiquetas de beneficio	Verificar que se muestra la etiqueta BENEFICIO DUOC.

▶️ Ejecutar las pruebas

Instala las dependencias del proyecto:

npm install

Ejecuta las pruebas unitarias:

npx vitest run

Para ejecutar las pruebas en modo interactivo:

npx vitest

📊 Generar el informe de cobertura

Ejecuta las pruebas y genera el informe:

npm run cobertura

También puedes generar el informe directamente mediante:

npx vitest run --coverage

📁 Consultar el informe HTML

Una vez finalizada la ejecución, abre el siguiente archivo en tu navegador:

coverage/index.html

El informe permite revisar los porcentajes de cobertura globales y por archivo, además de identificar las instrucciones, ramas, funciones y líneas que no fueron ejecutadas.

⸻

⚙️ Instalación y ejecución local

📋 Requisitos previos

* Node.js.
* npm.
* Git.
* Visual Studio Code o un editor equivalente.
* Un navegador web actualizado.

1. 📥 Clonar el repositorio

git clone https://github.com/TU_USUARIO/levelup-gamer.git

Reemplaza la dirección de ejemplo por la URL real del repositorio.

2. 📂 Ingresar a la carpeta

cd levelup-gamer

3. 📦 Instalar las dependencias

npm install

4. ⚡ Iniciar el servidor de desarrollo

npm run dev

5. 🌐 Abrir la aplicación

Abre en tu navegador la dirección que indique Vite en la terminal. Normalmente es:

http://localhost:5173

⸻

📜 Comandos principales

Comando	Función
npm install	Instala las dependencias.
npm run dev	Inicia el servidor de desarrollo.
npm run build	Genera la compilación de producción.
npm run preview	Previsualiza la compilación de producción.
npx vitest run	Ejecuta las pruebas unitarias.
npx vitest	Ejecuta las pruebas en modo interactivo.
npm run cobertura	Ejecuta las pruebas y genera la cobertura.
npx vitest run --coverage	Genera directamente el informe de cobertura.

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


<div align="center">

# 🎮 LEVEL-UP GAMER

### 🛍️ Tienda Online Fullstack | Desarrollo FullStack II (DSY1104)

**¡Sube de nivel tu experiencia gamer! 🎯**

Aplicación web interactiva desarrollada con **React y Vite**, integrada con una **API RESTful en Spring Boot 4.1.2**, base de datos **MySQL**, autenticación **JWT** y control de acceso por roles.

</div>

---

## 📌 Descripción del proyecto

**Level-Up Gamer** es una tienda online desarrollada como parte de la **Evaluación Parcial N° 3 — Integrando Backend y Frontend** de *Desarrollo FullStack II* (Duoc UC).

En esta etapa, la Single Page Application (SPA) en React se conecta en tiempo real con el servidor backend (`tienda-api` en puerto `8081`) mediante **Axios**, incorporando autenticación stateless con **JSON Web Tokens (JWT)**, persistencia de sesión en `localStorage`, control de permisos por rol (`ROLE_ADMIN`, `ROLE_VENDEDOR`, `ROLE_CLIENTE`), operaciones CRUD completas sobre productos y generación de órdenes de compra (boletas).

### ✨ Objetivos principales

- 🔗 **Integrar Frontend y Backend** mediante consumo asíncrono de API REST (`/api/v1`) con Axios.
- 🔐 **Gestionar autenticación y sesiones persistentes** mediante tokens JWT (`Bearer`) y verificación de expiración.
- 🛡️ **Implementar control de acceso basado en roles** mediante `RutaProtegida` y renderizado condicional.
- 🛒 **Procesar compras reales** conectadas a MySQL con descuento automático de stock y emisión de boletas.
- 🧩 **Mantener arquitectura modular** basada en componentes reutilizables, contextos globales y servicios HTTP.
- 🎓 **Aplicar reglas de negocio** para los beneficios de estudiantes y docentes Duoc UC.
- 📱 **Ofrecer una interfaz responsiva** adaptada a distintos dispositivos con temática gamer.

---

## 👥 Equipo de trabajo

**Integrantes:**

- **Alam Cueto.**
- **Francesca Valencia.**

- **Asignatura:** Desarrollo FullStack II (DSY1104).
- **Evaluación:** Evaluación Parcial N° 3 — Integrando Backend y Frontend.

---

## 🛠️ Tecnologías y herramientas

- ⚛️ **React 18:** desarrollo de interfaces mediante componentes reutilizables.
- ⚡ **Vite 5:** servidor de desarrollo (`http://localhost:5173`) y herramientas de compilación.
- 🌐 **Axios:** cliente HTTP centralizado con interceptores de petición (`Authorization: Bearer`) y respuesta (`401 Unauthorized`).
- 🎨 **Bootstrap 5 & React-Bootstrap:** diseño responsivo y componentes visuales.
- 🧭 **React Router DOM v6:** navegación SPA y protección de rutas privadas (`RutaProtegida`).
- 🔄 **Context API (`CartContext` y `AuthContext`):** gestión global del carrito, sesión JWT y roles.
- 🧪 **Vitest & React Testing Library:** suite de pruebas unitarias y cobertura de código (`@vitest/coverage-v8`).
- 🐙 **Git y GitHub:** control de versiones en rama `Levelup_ev3`.
- 💻 **Visual Studio Code:** entorno de desarrollo.

---

## 🚀 Características principales

### 🛍️ 1. Catálogo de productos conectado a MySQL
Consumo en tiempo real desde `GET /api/v1/productos` con filtrado por categoría (`audio`, `computacion`, `hogar`), visualización de stock disponible y restricciones visuales según el rol activo.

### 🔐 2. Autenticación JWT y persistencia de sesión
Inicio de sesión conectado a `POST /api/v1/auth/login` mediante `AuthContext`. El token JWT recibido se almacena en `localStorage`, manteniendo la sesión activa tras recargar el navegador (`F5`) y validando su fecha de expiración (`exp`).

### 🛡️ 3. Control de acceso por roles (`ROLE_ADMIN`, `ROLE_VENDEDOR`, `ROLE_CLIENTE`)
- **Visitante / Cliente (`ROLE_CLIENTE`):** Puede explorar el catálogo, gestionar el carrito y finalizar compras (`POST /api/v1/pedidos`). Tiene bloqueado el acceso a `/admin` y `/ordenes`.
- **Vendedor (`ROLE_VENDEDOR`):** Accede al inventario en modo solo lectura y al historial completo de boletas emitidas en `/ordenes` (`GET /api/v1/pedidos`).
- **Administrador (`ROLE_ADMIN`):** Acceso total al **Panel de Administración (`/admin`)** para ejecutar operaciones **CRUD** (`POST`, `PUT`, `DELETE`) sobre productos y revisar órdenes.

### 🛒 4. Carrito de compras y emisión de boletas
Gestión centralizada mediante `CartContext` y servicio `pedidos.js` para agregar productos, calcular subtotales/descuentos y confirmar la compra en `/checkout`, generando el comprobante oficial (`ORD-#`).

### 🎓 5. Beneficio Duoc UC
Regla de negocio que aplica un **20 % de descuento** a usuarios registrados con correos institucionales (`@duocuc.cl` y `@profesor.duoc.cl`).

### 🧪 6. Pruebas unitarias automatizadas
Suite de **10 casos de prueba** desarrollados con Vitest y React Testing Library que verifican componentes, estado global del carrito, descuento Duoc UC y validaciones de formularios.

---

## 📂 Estructura del proyecto

```text
levelup-v3/
│
├── public/                         # Recursos estáticos e imágenes
│
├── src/
│   │
│   ├── assets/                     # Estilos CSS y recursos multimedia
│   │
│   ├── components/                 # Componentes reutilizables
│   │   ├── CartModal.jsx           # Modal del carrito de compras
│   │   ├── ContactoForm.jsx        # Formulario de contacto y Level-Bot
│   │   ├── HeaderNav.jsx           # Barra de navegación dinámica por rol
│   │   ├── ProductCard.jsx         # Tarjeta individual de producto
│   │   ├── RegistroForm.jsx        # Formulario de registro
│   │   ├── ReviewSection.jsx       # Reseñas de clientes
│   │   └── RutaProtegida.jsx       # Guardia de rutas por autenticación y rol
│   │
│   ├── context/                    # Estado global de la aplicación
│   │   ├── AuthContext.jsx         # Autenticación JWT, roles y persistencia
│   │   └── CartContext.jsx         # Carrito, subtotales y totales
│   │
│   ├── pages/                      # Páginas principales
│   │   ├── AdminPanel.jsx          # Panel administrativo CRUD (/admin)
│   │   ├── Catalogo.jsx            # Catálogo de productos (/productos)
│   │   ├── Checkout.jsx            # Confirmación de compra y boleta (/checkout)
│   │   ├── Contacto.jsx            # Página de contacto (/contacto)
│   │   ├── Home.jsx                # Página de inicio (/)
│   │   ├── Login.jsx               # Inicio de sesión (/login)
│   │   ├── Ordenes.jsx             # Historial de boletas para Vendedor/Admin (/ordenes)
│   │   └── Registro.jsx            # Página de registro (/registro)
│   │
│   ├── servicios/                  # Capa de integración HTTP con Backend
│   │   ├── api.js                  # Instancia Axios e interceptores JWT
│   │   ├── pedidos.js              # Consumo de endpoints /api/v1/pedidos
│   │   └── productos.js            # Consumo de endpoints CRUD /api/v1/productos
│   │
│   ├── tests/                      # Pruebas automatizadas
│   │   └── app.spec.jsx            # Suite de 10 pruebas unitarias
│   │
│   ├── App.css                     # Estilos personalizados
│   ├── App.jsx                     # Aplicación y enrutamiento principal
│   ├── index.css                   # Estilos globales
│   └── main.jsx                    # Punto de entrada de React
│
├── package.json                    # Dependencias y scripts
├── package-lock.json               # Versiones bloqueadas
└── README.md                       # Documentación del proyecto

```

---

## 👤 Credenciales de prueba

Para probar los distintos perfiles integrados con el backend (`http://localhost:8081`):

| Rol | Correo Electrónico | Contraseña | Acceso en Frontend |
| --- | --- | --- | --- |
| **`ROLE_ADMIN`** | `admin@levelup.cl` | `admin123` | Catálogo, Carrito, Órdenes (`/ordenes`) y Panel CRUD (`/admin`). |
| **`ROLE_VENDEDOR`** | `vendedor@levelup.cl` | `vendedor123` | Catálogo (solo lectura) e Historial de Órdenes (`/ordenes`). |
| **`ROLE_CLIENTE`** | `cliente@duoc.cl` | `cliente123` | Catálogo, Carrito de compras y Checkout (`/checkout`). |

---

## 🧪 Pruebas unitarias

Las pruebas están ubicadas en `src/tests/app.spec.jsx` y se ejecutan con Vitest y React Testing Library:

| N.º | Prueba | Objetivo |
| --- | --- | --- |
| 1 | Renderizado de `ProductCard` | Comprobar que el nombre del producto se muestra correctamente. |
| 2 | Evento `onAddToCart` | Verificar que el botón de compra invoque la función correspondiente. |
| 3 | Estado global del carrito | Comprobar que agregar un producto actualiza el estado. |
| 4 | Descuento Duoc UC | Verificar el cálculo del 20 % de descuento. |
| 5 | Eliminación de productos | Comprobar que se puede eliminar un producto específico. |
| 6 | Función `clearCart` | Verificar que el carrito se vacía correctamente. |
| 7 | `ReviewSection` | Comprobar que se puede publicar una reseña. |
| 8 | Validación de contraseñas | Verificar el mensaje de error cuando las contraseñas no coinciden. |
| 9 | Correo institucional | Comprobar el reconocimiento del dominio Duoc UC durante el registro. |
| 10 | Etiquetas de beneficio | Verificar que se muestra la etiqueta `BENEFICIO DUOC`. |

---

## ⚙️ Instalación y ejecución local

### 📋 Requisitos previos

* **Node.js** (v18 o superior) y **npm**.
* **Backend Spring Boot (`tienda-api`)** ejecutándose en `http://localhost:8081`.
* **Git** y un navegador web actualizado.

### 1. 📥 Clonar el repositorio (rama `Levelup_ev3`)

```bash
git clone -b Levelup_ev3 [https://github.com/AlamCueto/levelup-gamer.git](https://github.com/AlamCueto/levelup-gamer.git)
cd levelup-gamer

```

### 2. 📦 Instalar las dependencias

```bash
npm install

```

### 3. ⚡ Iniciar el servidor de desarrollo

```bash
npm run dev

```

Abre en tu navegador: **`http://localhost:5173`**

---

## 📜 Comandos principales

| Comando | Función |
| --- | --- |
| `npm install` | Instala las dependencias del proyecto. |
| `npm run dev` | Inicia el servidor de desarrollo de Vite (`http://localhost:5173`). |
| `npm run build` | Genera la compilación de producción en `dist/`. |
| `npm run preview` | Previsualiza la compilación de producción. |
| `npx vitest run` | Ejecuta las pruebas unitarias en consola. |
| `npm run cobertura` | Ejecuta las pruebas y genera el informe de cobertura (`coverage/index.html`). |

---

## 🌿 Control de versiones

* **Repositorio:** `https://github.com/AlamCueto/levelup-gamer`
* **Rama Frontend:** `Levelup_ev3`
* **Rama Backend:** `backend_ev3`
* **Plataforma:** GitHub

---

### 🎮 LEVEL-UP GAMER

**Desarrollo FullStack II (DSY1104) · Evaluación Parcial N° 3**

*Desarrollando experiencias, subiendo de nivel. 🚀*

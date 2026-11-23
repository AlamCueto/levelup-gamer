```markdown
# Level-Up Gamer — Backend API REST (`tienda-api`)

API RESTful desarrollada con **Spring Boot 4.1.2**, **Spring Security + JWT** y **MySQL** para la tienda online de equipamiento gamer **Level-Up Gamer**. Corresponde a la **Evaluación Parcial N° 3** de la asignatura *Desarrollo Fullstack II (DSY1104)* — Duoc UC[cite: 5, 10].

---

## 🛠️ Tecnologías Utilizadas
* **Java 21+** / **Spring Boot 4.1.2**
* **Spring Data JPA / Hibernate** (Persistencia relacional y gestión automática de esquema)
* **Spring Security + JJWT (HS256)** (Autenticación stateless y control de acceso por roles)[cite: 8]
* **MySQL 8+** (`tienda_db`)
* **SpringDoc OpenAPI / Swagger UI** (Documentación interactiva de endpoints)
* **JUnit 5 & Mockito** (Pruebas unitarias de lógica de negocio)

---

## ⚙️ Requisitos Previos y Configuración

1. **Java JDK 21** o superior instalado.
2. **MySQL Server** ejecutándose en `localhost:3306`.
3. Verificar la configuración en `src/main/resources/application.properties`:

```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/tienda_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Santiago
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update

```

*(La base de datos `tienda_db` se crea automáticamente al iniciar la aplicación si no existe).*

---

## 🚀 Ejecución del Proyecto

Desde la raíz del proyecto, ejecuta:

```bash
# En macOS / Linux
./mvnw spring-boot:run

# En Windows
mvnw.cmd spring-boot:run

```

* **URL Base API:** `http://localhost:8081/api/v1`


* **Swagger UI (Documentación Interactiva):** `http://localhost:8081/swagger-ui.html`



---

## 👤 Credenciales de Prueba (Carga Inicial Automática)

Al iniciar el servidor con la base de datos vacía, `CargadorDatos` precarga 8 productos iniciales y 3 cuentas de prueba con contraseñas cifradas en **BCrypt**:

| Rol | Correo Electrónico | Contraseña | Permisos Principales |
| --- | --- | --- | --- |
| **`ROLE_ADMIN`** | `admin@levelup.cl`

 | `admin123` | CRUD completo de productos, compras y visualización de todas las boletas.

 |
| **`ROLE_VENDEDOR`** | `vendedor@levelup.cl`

 | `vendedor123` | Consulta de catálogo en solo lectura y revisión de órdenes/boletas (`GET /pedidos`).

 |
| **`ROLE_CLIENTE`** | `cliente@duoc.cl`

 | `cliente123` | Exploración de catálogo, carrito de compras y generación de órdenes (`POST /pedidos`).

 |

---

## 📡 Endpoints Principales (`/api/v1`)

| Método | Ruta | Acceso / Rol | Descripción |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/login`

 | Público

 | Valida credenciales y retorna token JWT (`Bearer`).

 |
| `GET` | `/api/v1/productos`

 | Público

 | Lista todos los productos (soporta filtro `?categoria=`).

 |
| `GET` | `/api/v1/productos/{id}`

 | Público

 | Obtiene el detalle de un producto por ID.

 |
| `POST` | `/api/v1/productos`

 | `ROLE_ADMIN`

 | Crea un nuevo producto en MySQL (`201 Created`).

 |
| `PUT` | `/api/v1/productos/{id}`

 | `ROLE_ADMIN`

 | Actualiza un producto existente (`200 OK`).

 |
| `DELETE` | `/api/v1/productos/{id}`

 | `ROLE_ADMIN`

 | Elimina un producto del inventario (`204 No Content`).

 |
| `POST` | `/api/v1/pedidos`

 | `ROLE_CLIENTE`, `ROLE_ADMIN`

 | Procesa compra transaccional, descuenta stock y genera boleta (`201 Created`).

 |
| `GET` | `/api/v1/pedidos`

 | `ROLE_VENDEDOR`, `ROLE_ADMIN`

 | Lista el historial de boletas emitidas con su detalle.

 |

---

## 🗄️ Modelo de Datos (`tienda_db`)

El esquema relacional consta de **5 entidades**:

* `usuarios`: Credenciales y rol de cada usuario.


* `categoria`: Categorías del catálogo (`audio`, `computacion`, `hogar`).


* `producto`: Artículos disponibles, precio y stock.


* `boleta`: Cabecera de cada orden de compra emitida (fecha, unidades, total).


* `detalle_boleta`: Líneas de detalle asociadas a cada boleta y producto (`@ManyToOne`).



---

## 🧪 Ejecución de Pruebas Unitarias

Para ejecutar las pruebas de contexto y lógica de negocio (`PedidoServiceTest`):

```bash
./mvnw test

```

---

## 👥 Integrantes

* **Alam Cueto**


* **Francesca Valencia**



```

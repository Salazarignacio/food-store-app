# 🍔 Food Store App

Aplicación web de carrito de compras y panel de control para una tienda de comidas, inspirada en plataformas como PedidosYa. Desarrollada con **TypeScript**, **HTML5** y **CSS3 puro** (sin frameworks de JS/CSS), y configurada y empaquetada con **Vite**.

---

## 🛠️ Tecnologías Utilizadas

* **Lenguaje**: TypeScript
* **Maquetado**: HTML5 Semántico
* **Estilos**: CSS3 Puro (con variables personalizadas, flexbox, CSS Grid y transiciones avanzadas)
* **API de Navegador**: LocalStorage (para persistencia de sesión del usuario, productos en el carrito e historial de compras)
* **Empaquetador / Servidor Dev**: Vite
* **Iconografía**: FontAwesome

---

## 🚀 Instalación y Ejecución Local

Sigue los siguientes pasos para clonar y ejecutar el proyecto en tu máquina local:

### Prerrequisitos

Asegúrate de tener instalado **Node.js** (versión 20.0.0 o superior recomendada) en tu sistema.

### Pasos de Instalación

1. **Instalar Dependencias**
   Instala los paquetes necesarios utilizando npm (o pnpm si lo tienes instalado):
   ```bash
   npm install
   ```

2. **Iniciar el Servidor de Desarrollo**
   Ejecuta el servidor local de Vite:
   ```bash
   npm run dev
   ```
   Una vez iniciado, abre la URL provista por la consola (normalmente `http://localhost:5173`) en tu navegador para ver la aplicación.

3. **Compilar para Producción**
   Si deseas generar la build optimizada y minificada para producción, ejecuta:
   ```bash
   npm run build
   ```
   Esto generará los archivos correspondientes dentro de la carpeta `dist`.

4. **Previsualizar la Build**
   Puedes previsualizar la compilación de producción de forma local ejecutando:
   ```bash
   npm run preview
   ```

---

## 🔐 Credenciales de Prueba

Para ingresar a la aplicación y probar los diferentes flujos según el rol asignado, puedes utilizar las siguientes cuentas:

### 1. Rol Administrador (ADMIN)
Los administradores tienen acceso completo al panel de control para gestionar categorías, productos y visualizar todos los pedidos recibidos.

* **Email**: `admin@food.com`
* **Contraseña**: `admin123`

*(Nota: También puedes acceder con la cuenta del archivo de datos: `santiago.perez@gmail.com` / `admin123`)*

### 2. Rol Cliente (CLIENT)
Los clientes pueden navegar por el catálogo general de comidas, filtrar categorías, detallar productos, agregarlos al carrito de compras y registrar órdenes.

* **Email**: `cliente@food.com`
* **Contraseña**: `cliente123`

*(Nota: También puedes acceder con la cuenta del archivo de datos: `lucia.fernandez@gmail.com` / `abcd`)*

---

## 📂 Estructura del Proyecto

* `src/`: Carpeta contenedora del código fuente.
  * `pages/`: Vistas principales organizadas por módulos de negocio:
    * `auth/`: Flujos de autenticación (Login y Registro).
    * `store/`: Vistas de cara al cliente (Catálogo general `home`, Carrito `cart`, `product-detail`).
    * `admin/`: Dashboard y herramientas de administración (`adminHome`, gestión de categorías, productos y listado de pedidos).
    * `client/`: Historial de pedidos personal del usuario (`orders`).
  * `types/`: Definiciones de interfaces TypeScript (`Product.ts`, `Category.ts`, `IPedido.ts`, `IUser.ts`).
  * `utils/`: Módulos de soporte reutilizables (`auth.ts`, `cart.ts`, `localStorage.ts`, `navigate.ts`).
* `public/`: Assets estáticos globales servidos por la raíz (datos de JSON locales en `/data` e imágenes de productos en `/images`).
* `index.html`: Punto de entrada que redirige automáticamente al flujo de Login.
* `vite.config.ts`: Configuración del servidor de desarrollo y del empaquetado multi-página.
import type { IProducto } from "../../../types/Product";

import {
  agregarCantidad,
  eliminarDelCarrito,
  quitarCantidad,
  vaciarCarrito,
} from "../../../utils/cart";
import {
  getProduct,
  saveProduct,
  saveOrder,
  getUser,
  getUsersLocalStorage,
} from "../../../utils/localStorage";
import { logout, checkoutUser } from "../../../utils/auth";
import type { IPedido, IDetallePedido } from "../../../types/IPedido";
import { navigate } from "../../../utils/navigate";
import { IUser } from "../../../types/IUser";

const user = JSON.parse(getUser() || "{}");
if (!user?.loggedIn) {
  alert("Debes iniciar sesión para acceder a la tienda.");
  navigate("../../auth/login/login.html");
}

checkoutUser();

// Agregar caja flotante de información de usuario
const userDiv = document.createElement("div");
userDiv.classList.add("user-info");
userDiv.innerHTML = `<p><i class="fa-solid fa-user"></i> ${user.email}</p>`;
userDiv.addEventListener("click", () => {
  logout();
  alert("Has cerrado sesión.");
});
document.body.appendChild(userDiv);

const productosLista = document.getElementById("productos-carrito-lista");
const resumenPedido = document.getElementById("resumen-pedido-card");

// Modal de checkout
const checkoutModal = document.getElementById("checkout-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const checkoutForm = document.getElementById(
  "checkout-form",
) as HTMLFormElement | null;
const modalTotalPago = document.getElementById("modal-total-pago");

const cartItems: IProducto[] = getProduct()
  ? JSON.parse(getProduct() as string)
  : [];

function renderCart(): void {
  const total = cartItems.reduce((acc, producto) => {
    return acc + producto.precio * (producto.cantidad || 1);
  }, 0);
  const costoEnvio: number = cartItems.length === 0 ? 0 : 500; // Según el recorte ($500.00)

  // 1. Renderizar listado de productos
  if (productosLista) {
    if (cartItems.length === 0) {
      productosLista.innerHTML = `
        <div class="sin-productos">
          <p class="vacio">El carrito está vacío.</p>
          <a href="/src/pages/store/home/home.html" class="btn-volver-tienda">Volver a la tienda</a>
        </div>
      `;
    } else {
      productosLista.innerHTML = cartItems
        .map(
          (producto) => `
        <div class="producto-cart-custom">
          <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-cart-img">
          <div class="producto-cart-info">
            <span class="producto-cart-nombre">${producto.nombre}</span>
            <span class="producto-cart-desc">${producto.descripcion || ""}</span>
            <span class="producto-cart-precio-u">$${producto.precio.toFixed(2)} c/u</span>
          </div>
          <div class="producto-cart-controles">
            <button class="btn-cantidad btn-quitar" data-id="${producto.id}">-</button>
            <span class="producto-cart-cantidad-num">${producto.cantidad || 1}</span>
            <button class="btn-cantidad btn-agregar" data-id="${producto.id}">+</button>
          </div>
          <span class="producto-cart-subtotal">$${(producto.precio * (producto.cantidad || 1)).toFixed(2)}</span>
          <button class="btn-eliminar-item btn-eliminar" data-id="${producto.id}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `,
        )
        .join("");
    }
  }

  // 2. Renderizar resumen del pedido
  if (resumenPedido) {
    resumenPedido.innerHTML = `
      <h3 class="resumen-titulo">Resumen del Pedido</h3>
      <div class="resumen-fila">
        <span>Subtotal:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      <div class="resumen-fila">
        <span>Envío:</span>
        <span>$${costoEnvio.toFixed(2)}</span>
      </div>
      <hr class="resumen-divisor">
      <div class="resumen-fila resumen-total-fila">
        <span>Total:</span>
        <span class="resumen-total-valor">$${(total + costoEnvio).toFixed(2)}</span>
      </div>
      <button id="proceder-carrito" class="btn-resumen btn-proceder" ${cartItems.length === 0 ? "disabled" : ""}>Proceder al Pago</button>
      <button id="vaciar-carrito" class="btn-resumen btn-vaciar" ${cartItems.length === 0 ? "disabled" : ""}>Vaciar Carrito</button>
    `;
  }

  // 3. Asignar manejadores de eventos
  const agregar = document.querySelectorAll(".btn-agregar");
  agregar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      agregarCantidad(id);
    });
  });

  const quitar = document.querySelectorAll(".btn-quitar");
  quitar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      quitarCantidad(id);
    });
  });

  const botones = document.querySelectorAll(".btn-eliminar");
  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      eliminarDelCarrito(id);
    });
  });

  const procederBtn = document.getElementById(
    "proceder-carrito",
  ) as HTMLButtonElement | null;
  procederBtn?.addEventListener("click", () => {
    if (checkoutModal && modalTotalPago) {
      modalTotalPago.textContent = `$${(total + costoEnvio).toFixed(2)}`;
      checkoutModal.style.display = "flex";
    }
  });

  const vaciarBtn = document.getElementById(
    "vaciar-carrito",
  ) as HTMLButtonElement | null;
  vaciarBtn?.addEventListener("click", () => {
    vaciarCarrito();
  });
}

// Eventos del modal
closeModalBtn?.addEventListener("click", () => {
  if (checkoutModal) {
    checkoutModal.style.display = "none";
  }
});

// Cerrar al hacer clic fuera del contenido del modal
window.addEventListener("click", (e) => {
  if (checkoutModal && e.target === checkoutModal) {
    checkoutModal.style.display = "none";
  }
});

checkoutForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const telefonoInput = document.getElementById(
    "checkout-telefono",
  ) as HTMLInputElement;
  const direccionInput = document.getElementById(
    "checkout-direccion",
  ) as HTMLInputElement;
  const metodoPagoInput = document.getElementById(
    "checkout-metodo-pago",
  ) as HTMLSelectElement;
  const notasInput = document.getElementById(
    "checkout-notas",
  ) as HTMLTextAreaElement;

  const usuariosLS: IUser[] = getUsersLocalStorage();
  const responseUsuario: Response = await fetch("/data/usuarios.json");
  const usuariosData: IUser[] = await responseUsuario.json();

  const usuarioEcnontrado: IUser | undefined = usuariosLS.find((u) => u.email === user.email) || usuariosData.find((u) => u.email === user.email);
  const usuarioId: number | 0 = usuarioEcnontrado?.id || 0;
  const total = cartItems.reduce((acc, producto) => {
    return acc + producto.precio * (producto.cantidad || 1);
  }, 0);
  const costoEnvio = 500;

  // Generar ID del pedido (ej: ORD-1760797178248)
  const orderId = `ORD-${Date.now()}`;

  // Formatear detalles
  const detalles: IDetallePedido[] = cartItems.map((item) => ({
    idProducto: item.id,
    cantidad: item.cantidad || 1,
    subtotal: item.precio * (item.cantidad || 1),
  }));

  // Crear objeto pedido
  const nuevoPedido: IPedido = {
    id: orderId,
    fecha: new Date().toISOString(),
    estado: "PENDIENTE",
    total: total + costoEnvio,
    formaPago: metodoPagoInput.value as
      | "EFECTIVO"
      | "TARJETA"
      | "TRANSFERENCIA",
    idUsuario: usuarioId,
    telefono: telefonoInput.value,
    direccion: direccionInput.value,
    notas: notasInput.value,
    detalles: detalles,
  };

  // Guardar en localStorage
  saveOrder(nuevoPedido);

  alert(`¡Pedido ${orderId} creado con éxito!`);

  // Limpiar carrito y redirigir
  saveProduct([]);
  navigate("../home/home.html");
});

renderCart();

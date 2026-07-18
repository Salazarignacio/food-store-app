import { IPedido } from "../../../types/IPedido";
import { IUser } from "../../../types/IUser";
import { IProducto } from "../../../types/Product";
import { getOrders, getUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";
import { logout } from "../../../utils/auth";

const user: string | null = getUser();

if (user) {
  const parsedUser = JSON.parse(user);
  
  // Agregar caja flotante de información de usuario
  const userDiv = document.createElement("div");
  userDiv.classList.add("user-info");
  userDiv.innerHTML = `<p><i class="fa-solid fa-user"></i> ${parsedUser.email}</p>`;
  userDiv.addEventListener("click", () => {
    logout();
    alert("Has cerrado sesión.");
  });
  document.body.appendChild(userDiv);

  // Cargar elementos de la interfaz
  const ordersListContainer = document.getElementById("orders-list");

  // Obtener lista de usuarios para encontrar el ID del usuario logueado
  const responseUsuarios = await fetch("/data/usuarios.json");
  const usuarios: IUser[] = await responseUsuarios.json();

  const usuarioEncontrado: IUser | undefined = usuarios.find(
    (u: IUser) => u.email === parsedUser.email
  );

  if (usuarioEncontrado) {
    // Obtener catálogo de productos para poder resolver nombres de productos en los detalles
    const responseProductos = await fetch("/data/productos.json");
    const productos: IProducto[] = await responseProductos.json();

    // Obtener pedidos por defecto (pedidos.json)
    const responsePedidos = await fetch("/data/pedidos.json");
    const pedidosJson: IPedido[] = await responsePedidos.json();

    // Obtener pedidos del localStorage
    const localOrders: IPedido[] = getOrders();

    // Unir ambos e identificar los del usuario actual
    const allOrders = [...pedidosJson, ...localOrders];
    const userOrders = allOrders.filter(
      (order) => Number(order.idUsuario) === usuarioEncontrado.id
    );

    // Ordenar de más recientes a más antiguos (basándonos en la fecha)
    userOrders.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    if (ordersListContainer) {
      if (userOrders.length === 0) {
        ordersListContainer.innerHTML = `
          <div class="sin-pedidos" style="text-align: center; color: #64748b; padding: 40px 0;">
            <p style="font-size: 1.2rem;">No tienes pedidos registrados.</p>
            <a href="/src/pages/store/home/home.html" class="btn-volver-tienda">Ir a la tienda</a>
          </div>
        `;
      } else {
        ordersListContainer.innerHTML = userOrders
          .map((order) => {
            // Formatear fecha
            const fechaObj = new Date(order.fecha);
            const opciones: Intl.DateTimeFormatOptions = {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            };
            const fechaFormateada = fechaObj.toLocaleDateString("es-ES", opciones);

            // Obtener el total de items
            const totalItems = order.detalles.reduce((acc, det) => acc + det.cantidad, 0);

            // Crear el resumen de productos (primeros 3)
            const primerosDetalles = order.detalles.slice(0, 3);
            const detallesHtml = primerosDetalles
              .map((det) => {
                const prod = productos.find((p) => p.id === det.idProducto);
                const nombre = prod ? prod.nombre : `Producto #${det.idProducto}`;
                return `<p class="order-item-detail">• ${nombre} (x${det.cantidad})</p>`;
              })
              .join("");

            // Asignar clase de estilo al badge según el estado
            let badgeClass = "badge-pendiente";
            if (order.estado === "CONFIRMADO") badgeClass = "badge-confirmado";
            else if (order.estado === "ENTREGADO" || order.estado === "TERMINADO")
              badgeClass = "badge-entregado";
            else if (order.estado === "CANCELADO") badgeClass = "badge-cancelado";

            return `
              <div class="order-card" data-id="${order.id}">
                <div class="order-card-header">
                  <span class="order-card-title">Pedido #${order.id}</span>
                  <span class="order-badge ${badgeClass}">${order.estado}</span>
                </div>
                <div class="order-card-date">
                  <i class="fa-regular fa-calendar-days"></i> ${fechaFormateada}
                </div>
                <hr class="order-card-divider">
                <div class="order-card-items">
                  ${detallesHtml}
                  ${order.detalles.length > 3 ? `<p class="order-item-detail" style="color: #94a3b8; font-style: italic;">... y ${order.detalles.length - 3} producto(s) más</p>` : ""}
                </div>
                <hr class="order-card-divider">
                <div class="order-card-footer">
                  <span class="order-card-summary">
                    <i class="fa-solid fa-box"></i> ${totalItems} producto(s)
                  </span>
                  <span class="order-card-total">$${order.total.toFixed(2)}</span>
                </div>
              </div>
            `;
          })
          .join("");
          
        // Agregar eventos de clic para abrir el modal
        const cards = document.querySelectorAll(".order-card");
        cards.forEach((card) => {
          card.addEventListener("click", () => {
            const orderId = card.getAttribute("data-id");
            const orderObj = userOrders.find((o) => String(o.id) === orderId);
            if (orderObj) {
              mostrarModalDetalle(orderObj, productos);
            }
          });
        });
      }
    }
  } else {
    if (ordersListContainer) {
      ordersListContainer.innerHTML = `<p style="color: #ef4444; font-weight: bold; text-align: center;">Usuario no encontrado en la base de datos.</p>`;
    }
  }
} else {
  navigate("../../auth/login/login.html");
}

// Función para mostrar el modal de detalle del pedido
function mostrarModalDetalle(pedido: IPedido, productos: IProducto[]): void {
  // Crear el contenedor de fondo (overlay)
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");
  overlay.id = "detail-modal-overlay";

  // Crear la tarjeta de contenido
  const content = document.createElement("div");
  content.classList.add("modal-content", "slide-up");

  // Formatear fecha
  const fechaObj = new Date(pedido.fecha);
  const opciones: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const fechaFormateada = fechaObj.toLocaleDateString("es-ES", opciones);

  // Mapear detalles de los productos a HTML
  const itemsHtml = pedido.detalles.map((det) => {
    const prod = productos.find((p) => p.id === det.idProducto);
    const nombre = prod ? prod.nombre : `Producto #${det.idProducto}`;
    const img = prod ? prod.imagen : "/images/default.png";
    const precioUnitario = prod ? prod.precio : (det.subtotal / det.cantidad);
    return `
      <div class="modal-item-row">
        <img src="${img}" alt="${nombre}" class="modal-item-img" onerror="this.src='/images/default.png';">
        <div class="modal-item-details">
          <span class="modal-item-name">${nombre}</span>
          <span class="modal-item-qty">${det.cantidad} x $${precioUnitario.toFixed(2)}</span>
        </div>
        <span class="modal-item-subtotal">$${det.subtotal.toFixed(2)}</span>
      </div>
    `;
  }).join("");

  // Asignar clase de estilo al badge según el estado
  let badgeClass = "badge-pendiente";
  if (pedido.estado === "CONFIRMADO") badgeClass = "badge-confirmado";
  else if (pedido.estado === "ENTREGADO" || pedido.estado === "TERMINADO") badgeClass = "badge-entregado";
  else if (pedido.estado === "CANCELADO") badgeClass = "badge-cancelado";

  content.innerHTML = `
    <div class="modal-header">
      <div>
        <h3>Detalles del Pedido</h3>
        <p class="modal-order-id">#${pedido.id}</p>
      </div>
      <button class="close-btn" id="close-modal-btn">&times;</button>
    </div>
    <div class="modal-body-scroll">
      <div class="modal-order-meta">
        <div class="modal-meta-row">
          <span class="label">Fecha:</span>
          <span class="value">${fechaFormateada}</span>
        </div>
        <div class="modal-meta-row">
          <span class="label">Estado:</span>
          <span class="order-badge ${badgeClass}">${pedido.estado}</span>
        </div>
        <div class="modal-meta-row">
          <span class="label">Método de Pago:</span>
          <span class="value">${pedido.formaPago.replace("_", " ")}</span>
        </div>
      </div>

      <div class="modal-items-section">
        <h4 class="modal-items-title">Productos comprados</h4>
        <div class="modal-items-list">
          ${itemsHtml}
        </div>
      </div>

      <div class="modal-total-section">
        <span class="label">Total del pedido:</span>
        <span class="value">$${pedido.total.toFixed(2)}</span>
      </div>
    </div>
  `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  // Cerrar modal al hacer clic en la cruz
  const cerrarBtn = content.querySelector("#close-modal-btn");
  cerrarBtn?.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  // Cerrar modal al hacer clic fuera del contenido
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

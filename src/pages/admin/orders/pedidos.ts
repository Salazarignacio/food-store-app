import type { IPedido } from "../../../types/IPedido";

interface IUserJSON {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  role: string;
}

const contenedorPedidos: HTMLElement | null = document.getElementById("contenedor_pedidos");
const filtroEstado = document.getElementById("filtro-estado") as HTMLSelectElement | null;

// Fetch data
const resPedidos = await fetch("../../../../public/data/pedidos.json");
const pedidos: IPedido[] = await resPedidos.json();

const resUsuarios = await fetch("../../../../public/data/usuarios.json");
const usuarios: IUserJSON[] = await resUsuarios.json();

// Helper to find client name
function obtenerNombreCliente(idUsuario: number): string {
  const usuario = usuarios.find((u) => u.id === idUsuario);
  if (usuario) {
    return `${usuario.nombre} ${usuario.apellido}`;
  }
  return "Cliente Desconocido";
}

// Helper to format date in Spanish
function formatFecha(fechaStr: string): string {
  const date = new Date(fechaStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  
  // Format to: "18 de octubre de 2025, 11:19 a. m."
  let formatted = date.toLocaleDateString("es-ES", options);
  
  // Adjust spacing for a. m. / p. m.
  formatted = formatted.replace("a.m.", "a. m.").replace("p.m.", "p. m.");
  formatted = formatted.replace("AM", "a. m.").replace("PM", "p. m.");
  
  return formatted;
}

// Render orders
function renderPedidos(pedidosFiltrados: IPedido[]): void {
  if (!contenedorPedidos) return;
  
  contenedorPedidos.innerHTML = "";
  
  if (pedidosFiltrados.length === 0) {
    contenedorPedidos.innerHTML = `
      <div class="sin-pedidos">
        <p>No hay pedidos en esta sección.</p>
      </div>
    `;
    return;
  }
  
  pedidosFiltrados.forEach((pedido: IPedido) => {
    const card = document.createElement("div");
    card.classList.add("pedido-card");
    
    const clientName = obtenerNombreCliente(pedido.idUsuario);
    const dateFormatted = formatFecha(pedido.fecha);
    
    // Count total products (sum of quantities)
    const cantProductos = pedido.detalles.reduce((acc, d) => acc + d.cantidad, 0);
    
    // Format ID
    const orderIdStr = typeof pedido.id === "string" && pedido.id.startsWith("ORD-")
      ? pedido.id
      : `ORD-${pedido.id}`;
      
    // Status color class
    const statusClass = `badge-${pedido.estado.toLowerCase()}`;
    
    card.innerHTML = `
      <div class="pedido-card-header">
        <div class="pedido-card-info">
          <h3>Pedido #${orderIdStr}</h3>
          <p class="pedido-cliente">Cliente: <span>${clientName}</span></p>
          <p class="pedido-fecha">${dateFormatted}</p>
        </div>
        <div class="pedido-card-status">
          <span class="status-badge ${statusClass}">${pedido.estado}</span>
        </div>
      </div>
      <div class="pedido-card-divider"></div>
      <div class="pedido-card-footer">
        <p class="pedido-cantidad">${cantProductos} producto(s)</p>
        <p class="pedido-total">$${pedido.total.toFixed(2)}</p>
      </div>
    `;
    
    contenedorPedidos.appendChild(card);
  });
}

// Event listener for filtering
filtroEstado?.addEventListener("change", () => {
  const val = filtroEstado.value;
  if (val === "TODOS") {
    renderPedidos(pedidos);
  } else {
    const filtered = pedidos.filter((p) => p.estado === val);
    renderPedidos(filtered);
  }
});

// Initial render
renderPedidos(pedidos);



import type { IProducto } from "../../../types/Product";

const tablaBody: HTMLElement | null = document.getElementById("tabla-body");

const response = await fetch("../../../../public/data/productos.json");
const productos: IProducto[] = await response.json();

console.log(productos);

productos.forEach((element: IProducto) => {
  if (element.eliminado) return;

  const row: HTMLTableRowElement = document.createElement("tr");

  const estadoClase = element.disponible ? "disponible" : "no-disponible";
  const estadoTexto = element.disponible ? "Disponible" : "No disponible";

  row.innerHTML = `
    <td>${element.id}</td>
    <td>
      <img src="${element.imagen}" alt="${element.nombre}" class="producto-img" onerror="this.src='/images/default.png';">
    </td>
    <td class="nombre-producto">${element.nombre}</td>
    <td class="desc-producto">${element.descripcion}</td>
    <td class="precio-producto">$${element.precio.toLocaleString()}</td>
    <td class="stock-producto">${element.stock}</td>
    <td>
      <span class="estado-badge ${estadoClase}">${estadoTexto}</span>
    </td>
    <td>
      <div class="acciones-btn-container">
        <button class="btn-editar">Editar</button>
        <button class="btn-eliminar">Eliminar</button>
      </div>
    </td>
  `;
  tablaBody?.appendChild(row);
});

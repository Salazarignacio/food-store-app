import type { ICategory } from "../../../types/Category";

const tablaBody: HTMLElement | null = document.getElementById("tabla-body");

const respuesta = await fetch("../../../../public/data/categorias.json");
const categorias: ICategory[] = await respuesta.json();

console.log(categorias);

categorias.forEach((element: ICategory) => {
  if (element.eliminado) return;

  const row: HTMLTableRowElement = document.createElement("tr");
  const imgName = element.nombre.toLowerCase();

  row.innerHTML = `
    <td>${element.id}</td>
    <td>
      <img src="/images/${imgName}.png" alt="${element.nombre}" class="categoria-img" onerror="this.src='/images/default.png';">
    </td>
    <td class="nombre-categoria">${element.nombre}</td>
    <td class="desc-categoria">${element.descripcion}</td>
    <td>
      <div class="acciones-btn-container">
        <button class="btn-editar">Editar</button>
        <button class="btn-eliminar">Eliminar</button>
      </div>
    </td>
  `;
  tablaBody?.appendChild(row);
});

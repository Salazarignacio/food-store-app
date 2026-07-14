/* import productos from "../../../../public/data/productos.json"; */
/* import categorias from "../../../../public/data/categorias.json"; */
import type { ICategory } from "../../../types/Category";
import type { IProducto } from "../../../types/Product";
import { logout } from "../../../utils/auth";
import { agregarAlCarrito } from "../../../utils/cart";
import { getProduct } from "../../../utils/localStorage";
import { getUser } from "../../../utils/localStorage";

const user = JSON.parse(getUser() || "{}");
if (!user?.loggedIn) {
  alert("Debes iniciar sesión para acceder a la tienda.");
  window.location.href = "../../auth/login/login.html";
}

const userDiv = document.createElement("div");
userDiv.classList.add("user-info");
userDiv.innerHTML = `<p><i class="fa-solid fa-user"></i> ${user.email}</p>`;
userDiv.addEventListener("click", () => {
  logout();
  alert("Has cerrado sesión.");
});

const productosDiv = document.getElementById("seccion-productos");
const inputBusqueda = document.createElement("input");
const botonesDiv = document.createElement("div");
const cantidadProductos = document.getElementById(
  "cantidad-productos",
) as HTMLDivElement;

inputBusqueda.type = "text";
inputBusqueda.placeholder = "Buscar productos...";
inputBusqueda.addEventListener("input", manejarInputBusqueda);

botonesDiv.classList.add("botones");

export const obtenerDatos = async <T>(ruta: string): Promise<T> => {
  const response = await fetch(ruta);
  const data = await response.json();
  return data;
};

const categorias: ICategory[] = await obtenerDatos<ICategory[]>(
  "../../../../public/data/categorias.json",
);
const productos: IProducto[] = await obtenerDatos<IProducto[]>(
  "../../../../public/data/productos.json",
);

categorias.forEach((categoria: ICategory) => {
  const btn = document.createElement("button");
  const img = document.createElement("img");
  img.classList.add("categoria-img");
  btn.textContent = categoria.nombre;
  btn.setAttribute("data-id", categoria.id.toString());
  botonesDiv.classList.add("btn-categoria");
  img.src = `/images/${categoria.nombre.toLowerCase()}.png`;
  img.alt = `Imagen de ${categoria.nombre}`;
  btn.appendChild(img);
  botonesDiv.appendChild(btn);
});

function render(prods: IProducto[]): void {
  if (productosDiv) {
    const cantidadEnCarrito =
      JSON.parse((getProduct() as string) || "[]").length || 0;
    cantidadProductos.innerHTML += `<p class="imagen-cart cantidad-productos">${cantidadEnCarrito}</p>`;
    productosDiv.innerHTML = "";
    const productosDiv2 = document.createElement("div");
    productosDiv2.classList.add("busqueda-productos");
    productosDiv2.appendChild(userDiv);
    productosDiv2.appendChild(inputBusqueda);
    productosDiv2.appendChild(botonesDiv);
    productosDiv.appendChild(productosDiv2);

    inputBusqueda.focus();

    if (prods.length === 0) {
      productosDiv.innerHTML += `<div class="sin-productos"><p>No se encontraron productos.</p> <button id='btn-volver' class='btn-agregar'>Volver a ver todos</button></div>`;
      const btnVolver = document.getElementById("btn-volver");

      btnVolver?.addEventListener("click", () => {
        render(productos);
      });
      return;
    }
    const productosDiv3 = document.createElement("div");
    productosDiv3.classList.add("listado-productos");

    prods = prods.filter((p) => p.disponible && !p.eliminado);

    prods.forEach((producto: IProducto) => {
      const div = document.createElement("div");
      div.classList.add("producto");

      div.innerHTML = `
      <div class="contenedor-agregar">
      <a class="detail-nav" href="../../store/product-detail/product-detail.html?id=${producto.id}">
      <img src="${producto.imagen}" alt="${producto.nombre}"></a>
      </div>
      
      <h3>${producto.nombre}</h3>
      <p class="descripcion">${producto.descripcion}</p>
      
      <p class="precio">$${producto.precio.toLocaleString()}</p>
      <div class="agregar-carrito">
      
      <input type="number" min="1" max="${producto.stock}" value="1" id="cantidad-${producto.id}" class="input-cantidad">
      <button class="btn-agregar" data-id="${producto.id}">Agregar</button>
      
      </div>
      <p class="disponible">${producto.disponible ? "Disponible" : "No disponible"}</p>

    `;
      productosDiv3.appendChild(div);
    });
    productosDiv.appendChild(productosDiv3);
    productosDiv.appendChild(userDiv);
    manejarAgregarAlCarrito();
  }
}

const botones = botonesDiv.querySelectorAll("button");

botonesDiv.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  const button = target.closest("button");
  if (!button) return;

  if (button.classList.contains("active")) {
    button.classList.remove("active");
    render(productos);
    return;
  }

  botones.forEach((b) => b.classList.remove("active"));
  button.classList.add("active");

  const cate = button.getAttribute("data-id");

  const filtradosproducts: IProducto[] = productos.filter((p) =>
    p.categoria_id.some((c: number) => c === Number(cate)),
  );

  render(filtradosproducts);
});

function manejarInputBusqueda(e: Event): void {
  const query = (e.target as HTMLInputElement).value.toLowerCase();
  const filtradosproducts: IProducto[] = productos.filter((p) =>
    p.nombre.toLowerCase().includes(query),
  );

  render(filtradosproducts);
}

function manejarAgregarAlCarrito(): void {
  const botones = document.querySelectorAll(".btn-agregar");

  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id"));
      const cantidad =
        Number(
          (document.getElementById(`cantidad-${id}`) as HTMLInputElement)
            ?.value,
        ) || 1;
      agregarAlCarrito(id, productos, cantidad);
    });
  });
}

render(productos);

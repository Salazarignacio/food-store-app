/* import productos from "../../../../public/data/productos.json"; */
import { agregarAlCarrito } from "../../../utils/cart";
import { getProduct } from "../../../utils/localStorage";
import { getUser } from "../../../utils/localStorage";
import { logout } from "../../../utils/auth";
import { IProducto } from "../../../types/Product";
import { obtenerDatos } from "../home/home";

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
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
const productoDiv = document.getElementById("product-detail");
const cantidadProductos = document.getElementById(
  "cantidad-productos",
) as HTMLDivElement;

const productos: IProducto[] = await obtenerDatos<IProducto[]>(
  "../../../../public/data/productos.json",
);

const producto = productos.find((p) => p.id === id);

if (producto && productoDiv) {
  const cantidadEnCarrito =
    JSON.parse((getProduct() as string) || "[]").length || 0;
  cantidadProductos.innerHTML += `<p class="imagen-cart cantidad-productos">${cantidadEnCarrito}</p>`;
  productoDiv.innerHTML = `
  <div class="producto-detail">
  <img src="${producto.imagen}" />
  <div class="contenedor">
  <h2>${producto.nombre}</h2>
  <p>${producto.descripcion}</p>
  <p>Stock: ${producto.stock}</p>
  <p>${producto.disponible ? "Disponible" : "No disponible"}</p>
  
  <p class="precio">$${producto.precio.toLocaleString()}</p>
  <div class="agregar-carrito">
  <p>Unidades disponibles: ${producto.stock}</p>
  <div class="contenedor-agregar">
  
  <input type="number" min="1" max="${producto.stock}" value="1" id="cantidad-${producto.id}" class="input-cantidad">
  <button class="btn-agregar" data-id="${producto.id}">Agregar</button>
  </div>
  </div>
  
  
  
  </div>
    `;

  productoDiv.appendChild(userDiv);

  const btnAgregar = document.querySelector(`.btn-agregar[data-id="${id}"]`);

  btnAgregar?.addEventListener("click", () => {
    const cantidad =
      Number(
        (document.getElementById(`cantidad-${id}`) as HTMLInputElement)?.value,
      ) || 1;

    agregarAlCarrito(id, productos, cantidad);
  });
}

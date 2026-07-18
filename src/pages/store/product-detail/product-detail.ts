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
  const isAgotado = !producto.disponible || producto.stock <= 0;
  
  productoDiv.innerHTML = `
    <div class="producto-detail">
      <div class="producto-detail-img-container">
        <img src="${producto.imagen}" alt="${producto.nombre}" />
      </div>
      <div class="producto-detail-info">
        <span class="estado-badge ${producto.disponible && producto.stock > 0 ? 'disponible' : 'no-disponible'}">
          ${producto.disponible && producto.stock > 0 ? "Disponible" : "Agotado"}
        </span>
        <h2>${producto.nombre}</h2>
        <p class="descripcion-detail">${producto.descripcion}</p>
        <p class="precio">$${producto.precio.toLocaleString()}</p>
        
        <div class="agregar-carrito">
          ${
            isAgotado
              ? `<p class="stock-info agotado"><i class="fa-solid fa-circle-xmark"></i> Sin stock disponible</p>`
              : `<p class="stock-info"><i class="fa-solid fa-box-archive"></i> Unidades disponibles: <span>${producto.stock}</span></p>`
          }
          <div class="contenedor-agregar">
            <input type="number" min="1" max="${producto.stock}" value="1" id="cantidad-${producto.id}" class="input-cantidad" ${isAgotado ? 'disabled' : ''}>
            <button class="btn-agregar" data-id="${producto.id}" ${isAgotado ? 'disabled' : ''}>
              ${isAgotado ? 'Agotado' : 'Agregar al Carrito'}
            </button>
          </div>
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

    agregarAlCarrito(id, productos, cantidad, user);
  });
}

import type { IProducto } from "../../../types/Product";
import {
  agregarCantidad,
  eliminarDelCarrito,
  quitarCantidad,
  vaciarCarrito,
} from "../../../utils/cart";
import { getProduct } from "../../../utils/localStorage";
import { getUser } from "../../../utils/localStorage";
import { logout } from "../../../utils/auth";

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
const seccionDiv = document.getElementById("seccion-carrito");
const carritoDiv = document.createElement("div");
const vaciarBtn = document.getElementById(
  "vaciar-carrito",
) as HTMLButtonElement;
carritoDiv.classList.add("seccion-carrito");
seccionDiv?.appendChild(carritoDiv);

const cartItems: IProducto[] = getProduct()
  ? JSON.parse(getProduct() as string)
  : [];
const totalDiv = document.createElement("div");

function renderCart(): void {
  if (cartItems.length === 0) {
    if (carritoDiv) {
      carritoDiv.innerHTML = '<p class="vacio">El carrito está vacío.</p>';
    }
  } else {
    if (carritoDiv) {
      carritoDiv.innerHTML = cartItems
        .map(
          (producto) => `
      <div class="producto-cart">
      <div><img src="${producto.imagen}" alt="${producto.nombre}"></div>
      <h3>${producto.nombre}</h3>
      <button class="btn-agregar" data-id="${producto.id}">+</button>
      <p>${producto.cantidad || 1}</p>
      <button class="btn-quitar" data-id="${producto.id}">-</button>
        <p>$${producto.precio.toLocaleString()}</p>
    
        <p>$${(producto.precio * (producto.cantidad || 1)).toLocaleString()}</p>
        <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
      </div>
    `,
        )
        .join("");
    }
  }
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

  const total = cartItems.reduce((acc, producto) => {
    return acc + producto.precio * (producto.cantidad || 1);
  }, 0);

  totalDiv.innerHTML = `<h2>Total: $${total.toLocaleString()}</h2>`;
  totalDiv.classList.add("total");
  if (seccionDiv) {
    carritoDiv?.appendChild(userDiv);
    seccionDiv.appendChild(totalDiv);
  }
}
vaciarBtn.addEventListener("click", () => {
  vaciarCarrito();
});

renderCart();

import { IUser } from "../types/IUser";
import type { IProducto } from "../types/Product";
import { getProduct, saveProduct } from "./localStorage";

export const agregarAlCarrito = (
  id: number,
  products: IProducto[],
  cantidad: number,
  usuario: IUser
) => {
  if (!usuario?.loggedIn) {
    alert("Debes iniciar sesión para agregar productos al carrito.");
    window.location.href = "../../auth/login/login.html";
    return;
  }
  const producto = products.find((p) => p.id === id);
  const productsCart: IProducto[] = getProduct()
    ? JSON.parse(getProduct() as string)
    : [];

  if (producto) {
    const productoEnCarrito: IProducto | undefined = productsCart.find((p) => p.id === id);

    if (productoEnCarrito && productoEnCarrito.cantidad) {
      productoEnCarrito.cantidad += cantidad;
    } else {
      productsCart.push({ ...producto, cantidad: cantidad });
    }

    saveProduct(productsCart);
    console.log(productsCart);
  }
  window.location.reload();
};

export const agregarCantidad = (id: number) => {
  const productsCart: IProducto[] = getProduct()
    ? JSON.parse(getProduct() as string)
    : [];
    const encontrado : IProducto | undefined = productsCart.find((p) => p.id ===id);
    if(encontrado){
      encontrado.cantidad = (encontrado.cantidad || 1) + 1;
      saveProduct(productsCart);
      window.location.reload();
    }
}
export const quitarCantidad = (id: number) => {
  const productsCart: IProducto[] = getProduct()
    ? JSON.parse(getProduct() as string)
    : [];
    const encontrado : IProducto | undefined = productsCart.find((p) => p.id ===id);
    if(encontrado){
      encontrado.cantidad = (encontrado.cantidad || 1) - 1;
      saveProduct(productsCart);
      window.location.reload();
    }
}

export const eliminarDelCarrito = (id: number) => {
  const productsCart: IProducto[] = getProduct()
    ? JSON.parse(getProduct() as string)
    : [];

  const updatedCart = productsCart.filter((p) => p.id !== id);
  saveProduct(updatedCart);
  window.location.reload();
};

export const vaciarCarrito = () => {
  saveProduct([]);
  window.location.reload();
};

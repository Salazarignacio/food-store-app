import type { IUser } from "../types/IUser";
import type { Rol } from "../types/Rol";
import { getUser, removeUser } from "./localStorage";
import { navigate } from "./navigate";

export const checkAuhtUser = (
  redireccion1: string,
  redireccion2: string,
  rol: Rol,
) => {
  console.log("comienzo de checkeo");

  const user = getUser();

  if (!user) {
    console.log("no existe en local");
    navigate(redireccion1); 
    
    return;
  } else {
    const parseUser: IUser = JSON.parse(user);
    if (parseUser.role.toLocaleLowerCase() !== rol) {
      navigate(redireccion2);
      return;
    }
  }
};

export const logout = () => {
  removeUser();
  navigate("/src/pages/auth/login/login.html");
};

export const checkoutUser = () => {
  const userData = getUser();
  if (!userData) return;

  const user = JSON.parse(userData);
  const role = user.role ? user.role.toLowerCase() : "";

  const btnPanelAdmin = document.getElementById("btn-panel-admin");
  const btnMisPedidos = document.getElementById("btn-mis-pedidos");
  const cartNav = document.getElementById("cantidad-productos");

  if (role === "admin") {
    if (btnPanelAdmin) btnPanelAdmin.classList.remove("invisible");
    if (btnMisPedidos) btnMisPedidos.classList.add("invisible");
    if (cartNav) cartNav.classList.add("invisible");
  } else if (role === "client") {
    if (btnPanelAdmin) btnPanelAdmin.classList.add("invisible");
    if (btnMisPedidos) btnMisPedidos.classList.remove("invisible");
    if (cartNav) cartNav.classList.remove("invisible");
  }
};

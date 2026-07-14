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

import type { IUser } from "../../../types/IUser";

import { getUsersLocalStorage, saveUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";
import { Rol } from "../../../types/Rol";
import { UserDTO } from "../../../types/UserDTO";

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;
const ingresarBtn = document.getElementById(
  "ingresar-btn",
) as HTMLButtonElement;

inputEmail.addEventListener("input", () => {
  if (inputEmail.value !== "" && inputPassword.value !== "") {
    ingresarBtn?.removeAttribute("disabled");
    ingresarBtn.classList.remove("disabled");
  } else {
    ingresarBtn?.setAttribute("disabled", "true");
    ingresarBtn.classList.add("disabled");
  }
});
inputPassword.addEventListener("input", () => {
  if (inputEmail.value !== "" && inputPassword.value !== "") {
    ingresarBtn?.removeAttribute("disabled");
    ingresarBtn.classList.remove("disabled");
  } else {
    ingresarBtn?.setAttribute("disabled", "true");
    ingresarBtn.classList.add("disabled");
  }
});

form.addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();

  const obtenerUsuariosJSON = async (): Promise<any[]> => {
    const response = await fetch("/data/usuarios.json");
    const data = await response.json();
    return data;
  };

  const usuariosJSON = await obtenerUsuariosJSON();

  const valueEmail = inputEmail.value;
  const valuePassword = inputPassword.value;

  const usuarioJSON: IUser | undefined = usuariosJSON.find(
    (u) => u.email === valueEmail && u.password === valuePassword,
  );
  const usuariosStorage = getUsersLocalStorage() || [];

  const usuarioStorage = usuariosStorage.find(
    (u) => u.email === valueEmail && u.password === valuePassword,
  );
  const usuarioAutenticado = usuarioJSON || usuarioStorage;

  if (usuarioAutenticado) {
    const Role: Rol = usuarioAutenticado?.role;
    const loggedInUser: UserDTO = {
      email: valueEmail,
      loggedIn: true,
      role: Role,
    };

    saveUser(loggedInUser);

    let ruta: any =
      loggedInUser.role.toLowerCase() === "admin"
        ? "/src/pages/admin/adminHome/adminHome.html"
        : "/src/pages/store/home/home.html";

    navigate(ruta);
  } else {
    alert("Credenciales incorrectass");
    return;
  }
});

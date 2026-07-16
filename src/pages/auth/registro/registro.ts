import type { IUser } from "../../../types/IUser";
import { Rol } from "../../../types/Rol";
import { UserDTO } from "../../../types/UserDTO";
import {
  getUsersLocalStorage,
  saveUser,
  saveUsersLocalStorage,
} from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

const form = document.getElementById("form") as HTMLFormElement;
const usersJson = getUsersLocalStorage();
const users: IUser[] = usersJson ? usersJson : [];

let usuarios: any[] = [];

fetch("/data/usuarios.json")
  .then((response) => response.json())
  .then((data) => {
    usuarios = data;
  });

inputEmail.addEventListener("input", () => {
  if (inputEmail.value !== "" && inputPassword.value !== "") {
    form.querySelector("button")?.removeAttribute("disabled");
    form.querySelector("button")?.classList.remove("disabled");
  }
});
inputPassword.addEventListener("input", () => {
  if (inputEmail.value !== "" && inputPassword.value !== "") {
    form.querySelector("button")?.removeAttribute("disabled");
    form.querySelector("button")?.classList.remove("disabled");
  } else {
    form.querySelector("button")?.setAttribute("disabled", "true");
    form.querySelector("button")?.classList.add("disabled");
  }
});

inputPassword.addEventListener("input", () => {
  if (inputEmail.value !== "" && inputPassword.value !== "") {
    form.querySelector("button")?.removeAttribute("disabled");
    form.querySelector("button")?.classList.remove("disabled");
  } else {
    form.querySelector("button")?.setAttribute("disabled", "true");
    form.querySelector("button")?.classList.add("disabled");
  }
});

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const valueEmail = inputEmail.value;
  const valuePassword = inputPassword.value;
  const valueRol: Rol = "client";

  const existe = users?.some((user) => user.email === valueEmail) || usuarios?.some((u) => u.email === valueEmail);

  if (!existe) {
    const user: IUser = {
      id: Date.now(),
      email: valueEmail,
      loggedIn: true,
      password: valuePassword,
      role: valueRol,
    };

    const userDTO: UserDTO = {
      email: valueEmail,
      loggedIn: true,
      role: valueRol,
    };

    saveUsersLocalStorage(user);
    saveUser(userDTO);
    let ruta : any = valueRol  === "client" ? "/src/pages/store/home/home.html" : "/src/pages/admin/home/home.html";
    navigate(ruta);
  } else {
    alert("El usuario ya existe");
  }
});

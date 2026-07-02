import type { IUser } from "../../../types/IUser";
import usuarios from "../../../../public/data/usuarios.json";

import { getUsersLocalStorage } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";
import { Rol } from "../../../types/Rol";

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const users: any[] = usuarios || [];
  console.log(users);
  
  const valueEmail = inputEmail.value;
  const valuePassword = inputPassword.value;
  
  const user = users.find(
    (u) => u.email === valueEmail && u.password === valuePassword,
  );
  const usersStorage: IUser[] = getUsersLocalStorage() || [];
  console.log(usersStorage);
  const userStorage = usersStorage.find(
    (u) => u.email === valueEmail && u.password === valuePassword,
  );

  if (!user && !userStorage) {
    alert("Credenciales incorrectass");
    return;
  }

  const Role: Rol = user?.role || userStorage?.role;
  const loggedInUser: IUser = {
    email: valueEmail,
    password: valuePassword,
    role: Role,
    loggedIn: true,
  };

  const parseUser = JSON.stringify(loggedInUser);
  localStorage.setItem("userData", parseUser);

  if (loggedInUser.role.toLowerCase() === "admin") {
    navigate("/src/pages/admin/home/home.html");
  } else if (loggedInUser.role.toLowerCase() === "client") {
    navigate("/src/pages/client/home/home.html");
  }
});

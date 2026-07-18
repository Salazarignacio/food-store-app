import { IUser } from "../../../types/IUser";
import { checkAuhtUser, logout } from "../../../utils/auth";
import { getUser } from "../../../utils/localStorage";

const buttonLogout = document.getElementById(
  "btn-logout"
) as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});

const mailUser : HTMLElement | null = document.getElementById("mail-user");
const getUserJSON : any = getUser();
const user = JSON.parse(getUserJSON || "{}"); 
if (user && user.email && mailUser) {
  const role = user.role ? user.role.toLowerCase() : "";
  if (role === "client") {
    mailUser.classList.add("invisible");
  }
  mailUser.innerHTML = `<p>${user.email}</p>`;
}




const initPageAdmin = () => {
  console.log("inicio de pagina");
  checkAuhtUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/store/home/home.html",
    "admin"
  );
};
initPageAdmin();

import { checkAuhtUser, logout } from "../../../utils/auth";

const buttonLogout = document.getElementById(
  "btn-logout"
) as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});


const initPageAdmin = () => {
  console.log("inicio de pagina");
  checkAuhtUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/client/home/home.html",
    "admin"
  );
};
initPageAdmin();

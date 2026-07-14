import type { Rol } from "./Rol";

export interface UserDTO {
  email: string;
  loggedIn: boolean;
  role: Rol;
}

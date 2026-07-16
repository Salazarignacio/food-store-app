import type { IUser } from "../types/IUser";
import type { IProducto } from "../types/Product";
import { UserDTO } from "../types/UserDTO";
import { IPedido } from "../types/IPedido";

/* USER */

export const saveUser = (user: UserDTO) => {
  const parseUser = JSON.stringify(user);
  localStorage.setItem("userData", parseUser);
};
export const getUser = () => {
  const userData = localStorage.getItem("userData");
  return userData;
};
export const removeUser = () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("productData");
};

/* USERS */

export const saveUsersLocalStorage = (user: IUser) => {
  const users : IUser[] = getUsersLocalStorage() || [];
  users.push(user);
  const parseUsers = JSON.stringify(users);
  localStorage.setItem("usersData", parseUsers);
};

export const getUsersLocalStorage = () : IUser[] => {
  const usersData = localStorage.getItem("usersData");
  return usersData ? JSON.parse(usersData) : [];
};

export const removeUsersLocalStorage = () => {
  localStorage.removeItem("usersData");
}
  
/* PRODUCT */

export const saveProduct = (product: IProducto[]) => {
  const parseProduct = JSON.stringify(product);
  localStorage.setItem("productData", parseProduct);
};

export const getProduct = () => {
  return localStorage.getItem("productData");
};

export const removeProduct = () => {
  localStorage.removeItem("productData");
};

/* ORDERS */

export const saveOrder = (order: IPedido) => {
  const orders: IPedido[] = getOrders();
  orders.push(order);
  localStorage.setItem("ordersData", JSON.stringify(orders));
};

export const getOrders = (): IPedido[] => {
  const ordersData = localStorage.getItem("ordersData");
  return ordersData ? JSON.parse(ordersData) : [];
};

export const removeOrders = () => {
  localStorage.removeItem("ordersData");
};

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        //d:aplicaion/dist/
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        registro: resolve(__dirname, "src/pages/auth/registro/registro.html"),
        adminHome: resolve(__dirname, "src/pages/admin/adminHome/adminHome.html"),
        categories: resolve(
          __dirname,
          "src/pages/admin/categories/categories.html",
        ),
        products: resolve(__dirname, "src/pages/admin/products/products.html"),
        pedidos: resolve(__dirname, "src/pages/admin/orders/pedidos.html"),
        orders: resolve(__dirname, "src/pages/client/orders/orders.html"),
        storeHome: resolve(__dirname, "src/pages/store/home/home.html"),
        cart: resolve(__dirname, "src/pages/store/cart/cart.html"),
        product: resolve(
          __dirname,
          "src/pages/store/product-detail/product-detail.html",
        ),
      },
    },
  },
  base: "/",
});

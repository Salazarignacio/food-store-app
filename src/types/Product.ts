export interface IProducto {
  id: number;
  eliminado: boolean;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
  cantidad?: number;
  disponible: boolean;
  categoria_id: number[];
}

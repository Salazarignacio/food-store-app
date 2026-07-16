export interface IDetallePedido {
  idProducto: number;
  cantidad: number;
  subtotal: number;
}

export interface IPedido {
  id: string | number; // e.g. "ORD-1760797178248" or number from default JSON
  fecha: string; // ISO date string or formatted date
  estado: "PENDIENTE" | "CONFIRMADO" | "TERMINADO" | "CANCELADO" | "ENTREGADO";
  total: number;
  formaPago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "MERCADO_PAGO";
  idUsuario: number;
  telefono?: string;
  direccion?: string;
  notas?: string;
  detalles: IDetallePedido[];
}

const contenedor: HTMLElement | null = document.getElementById("contenedor");

const respuesta = await fetch("../../../../public/data/categorias.json");
const categorias = await respuesta.json();

console.log(categorias);

categorias.forEach((element: any) => {
  const categoria_card: HTMLElement = document.createElement("div");
  categoria_card.innerHTML = `<div>
    <ul>
        <li>ID</li> <li>Imagen</li> <li>Nombre</li> <li>Descripcion</li> <li>Acciones</li>
    </ul>
</div>
<div>
    <ul>
        <li>${element.id}</li> <li>${element.nombre}</li> <li>${element.nombre}</li> <li>${element.descripcion}</li> <li><button>Editar</button><button>Eliminar</button></li>
    </ul>
</div>`;
  contenedor?.appendChild(categoria_card);
});

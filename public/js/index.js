const socket = io();

// Escucha el evento "updateList" para actualizar la lista en tiempo real
const listContainer = document.querySelector('.list-container');
socket.on('updateList', async (products) => {
  listContainer.innerHTML = '';

  if (products?.length === 0) {
    const p = document.createElement('p');
    p.innerHTML = "La lista esta vacia"
    listContainer.appendChild(p);
    return
  }

  products?.forEach((product) => {

    const li = document.createElement("li");

    li.innerHTML = `
    <picture>${product.thumbnails.map(thumbnail =>
      `<img src="${thumbnail.path}" alt="${thumbnail.name}">`).join('')}
    </picture>
    <div class="list-description">
      <h2>${product.title}</h2>
      <p>${product.description}</p>
      <p><strong>Precio: $/</strong> ${product.price}</p>
      <p><strong>Código:</strong> ${product.code}</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <p><strong>Categoría:</strong> ${product.category}</p>
    </div>
    <div class="btn">
        <button class="btn-delete" data-product-id="${product.id}">Eliminar</button>
    </div>
    `;
    listContainer.appendChild(li);

  });
});

// Obtener el formulario y escuchar el evento de submit
const form = document.querySelector('#add-item-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Obtener los datos del formulario
  const data = {
    title: form.title.value,
    description: form.description.value,
    price: form.price.value,
    code: form.code.value,
    stock: form.stock.value,
    category: form.category.value,
  };

  // Leer y procesar cada imagen seleccionada
  const fileInput = document.querySelector('input[type="file"]');
  const files = fileInput.files;
  const imagePromises = [];
  for (const file of files) {
    imagePromises.push(readAndProcessImage(file));
  }
  // Esperar a que se procesen todas las imágenes antes de enviar el arreglo completo
  try {
    const images = await Promise.all(imagePromises);
    data.thumbnails = images ?? [];
    // Enviar los datos del formulario y las imágenes procesadas al servidor mediante socket.io
    socket.emit('submit-form', data);
    form.reset();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
});

// Escuchar la respuesta del servidor del envio del formulario y muestra la informacion en pantalla
socket.on('form-response', (res) => {
  const resultado = document.querySelector('#resultado');
  const span = resultado.querySelector('#resultado span');

  const message = res.message.code || res.message;
  if (span) return;
  const newSpan = document.createElement('span');
  newSpan.innerHTML = message;
  resultado.appendChild(newSpan);

  setTimeout(() => {
    resultado.removeChild(newSpan);
  }, 2000);

});


// Obtener los elementos del DOM para el modal delete btn
const modal = document.getElementById("myModal");
const btnConfirm = document.querySelector(".btn-delete-confirm");
const span = document.getElementsByClassName("close")[0];

span.onclick = function () {
  modal.style.display = "none";
}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

let idProducto = null;
listContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    modal.style.display = "block";
    const productId = e.target.dataset.productId;
    idProducto = productId;
  }
});

btnConfirm.addEventListener('click', () => {
  socket.emit('delete-product', idProducto);
  modal.style.display = "none";
})

function readAndProcessImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Crear un objeto que contenga el nombre y los datos de la imagen
      const imgObj = { name: file.name, data: reader.result };
      resolve(imgObj);
    };
    reader.onerror = error => reject(error);
  });
}





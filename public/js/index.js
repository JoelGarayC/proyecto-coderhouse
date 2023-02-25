const socket = io();

// Escucha el evento "updateList" para actualizar la lista en tiempo real
const listContainer = document.querySelector('#list-container');
socket.on('updateList', async (products) => {
  listContainer.innerHTML = '';

  if (products?.length === 0) {
    const p = document.createElement('p');
    p.innerHTML = "La lista esta vacia"
    listContainer.appendChild(p);
    return
  }

  products?.forEach((product) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p><strong>Precio:</strong> ${product.price}</p>
      <p><strong>Código:</strong> ${product.code}</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <p><strong>Categoría:</strong> ${product.category}</p>
      <div>
        <button class="btn-delete" data-product-id="${product.id}">Eliminar</button>
      </div>
    `;
    listContainer.appendChild(li);
  });
});

// enviar informacion desde el formulario
const form = document.getElementById('add-item-form');
form.addEventListener('submit', (e) => {
  // Evitar que la página se refresque
  e.preventDefault();
  // Obtener los datos del formulario
  const data = {
    title: form.title.value,
    description: form.description.value,
    price: form.price.value,
    thumbnails: form.thumbnails.value,
    code: form.code.value,
    stock: form.stock.value,
    category: form.category.value,
  }
  //enviar mediante socket.io
  socket.emit('submit-form', data);
});

// Escuchar la respuesta del servidor del envio del formulario
socket.on('form-response', (res) => {
  const resultado = document.querySelector('#resultado');
  resultado.innerHTML = res.message;
});

// emitir evento para eliminar el producto
listContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    const productId = e.target.dataset.productId;
    // Emitir un evento al servidor para eliminar el producto correspondiente
    socket.emit('delete-product', productId);
  }
});
let carrito = []
let contenedorCarrito = document.getElementById("carrito")
let totalCarrito = document.getElementById("total")
let carritoDropdown = document.getElementById("carrito-dropdown")
let cantidadProducto = document.getElementById("cantidad-productos")

// ESTA FUNCION ELIMINA PRODUCTOS DEL ARRAY CARRITO

function deleteCarrito(idProducto) {
    carrito = carrito.map((producto) => 
        producto.id === idProducto ? {...producto, cantidad: producto.cantidad - 1} : producto
    ).filter((producto) => producto.cantidad > 0)

    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarCarrito()
}


//ESTA FUNCION VA ACTUALIZANDO EL CARRITO DE COMPRAS

function actualizarCarrito() {
    contenedorCarrito.innerHTML = ""; // Limpiar el contenedor del carrito

    carrito.forEach((producto) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <h4>${producto.nombre}</h4>
            <p>Precio: $${producto.precio}</p>
            <button class="plus-button">+</button>
            <span class="counter">${producto.cantidad}</span>
            <button class="minus-button">-</button>
            <button class="delete-button">Eliminar</button> <!-- Botón para eliminar el producto -->
        `;
        contenedorCarrito.appendChild(li);

        const plusButton = li.querySelector('.plus-button');
        const minusButton = li.querySelector('.minus-button');
        const counter = li.querySelector('.counter');
        const deleteButton = li.querySelector('.delete-button'); // Referencia al botón de eliminar

        // Evento para aumentar la cantidad
        plusButton.addEventListener('click', () => {
            producto.cantidad += 1;
            counter.innerText = producto.cantidad;
            actualizarCarrito();
        });

        // Evento para disminuir la cantidad
        minusButton.addEventListener('click', () => {
            if (producto.cantidad > 1) {
                producto.cantidad -= 1;
                counter.innerText = producto.cantidad;
                actualizarCarrito();
            } else {
                deleteCarrito(producto.id); // Llamar a la función para eliminar el producto
            }
        });

        // Evento para eliminar el producto del carrito
        deleteButton.addEventListener('click', () => {
            deleteCarrito(producto.id); // Llama a la función para eliminar el producto
            actualizarCarrito(); // Actualiza el carrito después de eliminar
        });
    });

    // Calcular el total y la cantidad de productos en el carrito
    let total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    totalCarrito.innerText = `Total: $${total}`;

    let cantidad = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    cantidadProducto.innerText = cantidad; 
}

// Función para eliminar un producto del carrito
function deleteCarrito(productId) {
    carrito = carrito.filter(producto => producto.id !== productId); // Filtra el carrito para eliminar el producto
}
    

// ESTA FUNCION AGREGA PRODUCTOS AL ARRAY CARRITO

if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    actualizarCarrito()
}
    
function addCarrito(idProducto) {
    const producto = productos.find((producto) => producto.id === idProducto)
    const productoEnCarrito = carrito.find((producto) => producto.id === idProducto)

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1
    } else {
        carrito.push({...producto, cantidad: 1})
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarCarrito()
}
    


// ESTA FUNCION SUMA EL TOTAL DEL CARRITO

const calcularTotal = () => {
    return carrito.reduce ((total, producto) => total + (producto.precio * producto.cantidad), 0)
} 



// BOTON PARA VACIAR CARRITO

let vaciarCarrito = document.getElementById("vaciar-carrito")

vaciarCarrito.addEventListener("click", () => {
    carrito = []
    localStorage.removeItem("carrito")
    actualizarCarrito()
})

// BOTON DE REALIZAR COMPRA Y MENSAJE DE COMPRA REALIZADA

let modal = document.getElementById("modal")
let comprarCarrito = document.getElementById("comprar")
let closeBtn = document.querySelector(".modal-close")

let nombre = document.getElementById("nombre")
let email = document.getElementById("email")
let telefono = document.getElementById("telefono")
let confirmarCompra = document.getElementById("confirmarCompra")
let resumenModal = document.getElementById("resumenModal")

comprarCarrito.addEventListener("click", () => {
    if (carrito.length > 0 ) {
        modal.style.display = "flex"
    } else {
        Swal.fire({
            icon: "error",
            title: "El carrito esta vacio",
            text: "Añade productos al carrito primero",
          })
    }
})


let carritoBtn = document.getElementById("carrito-btn")
carritoBtn.addEventListener("click", () => {
    carritoDropdown.classList.toggle("visible")
})



closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
})


window.addEventListener("click", (e) => {
    if (e.target == modal) {
        modal.style.display = "none"
    }
})




confirmarCompra.addEventListener("click", (event) => {
    event.preventDefault()

    try {
        
        if (nombre.value.trim() !== "" && email.value.trim() !== "" && telefono.value.trim() !== "") {
            
            const resumen = `
                <h2>Resumen de la Compra</h2>
                <p><strong>Nombre del Cliente:</strong> ${nombre.value}</p>
                <p><strong>Email:</strong> ${email.value}</p>
                <p><strong>Teléfono:</strong> ${telefono.value}</p>
                <h3>Productos:</h3>
                <ul>
                    ${carrito.map(producto => `
                        <li>${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: $${producto.precio * producto.cantidad}</li>
                    `).join('')}
                </ul>
                <p><strong>Total:</strong> $${carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0)}</p>
                <p>Gracias por su compra. Recibirá más detalles por correo electrónico.</p>
            `

            
            resumenModal.querySelector('#resumenCompra').innerHTML = resumen;
            resumenModal.style.display = "flex"; 

            
            Swal.fire({
                icon: 'success',
                title: 'Compra realizada',
                text: 'A tu correo te llegará el resumen y toda la demás información.',
            }).then(() => {
                carrito = []
                localStorage.removeItem("carrito");
                actualizarCarrito() 
                modal.style.display = "none" 
            })
        } else {
            
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, completa todos los campos.',
            })
        }
    } catch (error) {
        console.error('Error al procesar la compra:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al procesar tu compra. Inténtalo nuevamente más tarde.',
        })
    } finally {
        console.log('Proceso de compra finalizado.')
    }
})


resumenModal.querySelector(".modal-close").addEventListener("click", () => {
    resumenModal.style.display = "none"; 
})


window.addEventListener("click", (e) => {
    if (e.target == resumenModal) {
        resumenModal.style.display = "none"
    }
})
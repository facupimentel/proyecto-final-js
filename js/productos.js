let productos = []
let contenedorProductos = document.getElementById("productos")

// Esta funcion muestra los productos en el main

function mostrarProductos () {
    productos.forEach((producto) => {
        let divProd = document.createElement("div")
        divProd.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" width="120" height="120">
            <h2>${producto.nombre}</h2>
            <h3>$${producto.precio}</h3>
            <button id="compraProd" onclick="addCarrito(${producto.id})">Comprar</button>`
        contenedorProductos.appendChild(divProd)
            
    })
}
mostrarProductos()


// Función para obtener los productos del archivo .json
function obtenerProductos() {
    fetch('./json/productos.json')  
        .then(response => response.json()) 
        .then(data => {
            productos = data
            mostrarProductos()
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error)
        })
}

obtenerProductos();



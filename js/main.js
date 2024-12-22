function guardarAlmacenamientoLocal(llave, valor_a_guardar) {
    localStorage.setItem(llave, JSON.stringify(valor_a_guardar));
}
function obtenerAlmacenamientoLocal(llave) {
    const datos = JSON.parse(localStorage.getItem(llave));
    return datos || [];
}

localStorage.removeItem("productos");

const productosIniciales = [
    { nombre: "Jackson Dinky JS22 DKA", valor: 199.99, existencia: 5, urlImagen: "../img/guitar11.jpg" },
    { nombre: "Gibson Les Paul", valor: 2299.00, existencia: 2, urlImagen: "../img/guitar.webp" },
    { nombre: "Dean Dimebag", valor: 929.00, existencia: 3, urlImagen: "../img/guitar2.webp" },
    { nombre: "Eddie Van Halen guitar", valor: 1999.99, existencia: 1, urlImagen: "../img/guitar3.webp" },
    { nombre: "Schecter Guitar", valor: 1399.00, existencia: 4, urlImagen: "../img/guitar4.jpg" },
    { nombre: "Fender", valor: 4700.00, existencia: 2, urlImagen: "../img/guitar5.webp" },
    { nombre: "ESP LTD hetfield guitar", valor: 1499.99, existencia: 3, urlImagen: "../img/guitar6.jpg" },
    { nombre: "Epiphone 1959 ES-355", valor: 1299.99, existencia: 2, urlImagen: "../img/guitar7.webp" },
    { nombre: "Jackson JS Series King", valor: 249.99, existencia: 5, urlImagen: "../img/guitar8.webp" },
    { nombre: "Epiphone Limited-Edition", valor: 199.00, existencia: 6, urlImagen: "../img/guitar10.webp" }
];

guardarAlmacenamientoLocal("productos", productosIniciales);

let productos = obtenerAlmacenamientoLocal("productos");
let lista = [];
let valortotal = 0;

const contenedor = document.getElementById("contenedor");
const numero = document.getElementById("numero");
const contenedorCompra = document.getElementById("contenedorCompra");
const productosCompra = document.getElementById("productosCompra");
const total = document.getElementById("total");
const x = document.getElementById("x");
const body = document.body;
const finalizarCompraModal = document.getElementById("finalizarCompraModal");
const carritoIcono = document.querySelector(".carrito");

window.addEventListener("load", () => {
    renderizarProductos(); 
    contenedorCompra.classList.add("none"); 
});

function renderizarProductos() {
    contenedor.innerHTML = ""; 

    productos.forEach((producto, indice) => {
        if (producto.existencia > 0) {
            contenedor.innerHTML += `
                <div class="producto">
                    <img src="${producto.urlImagen}" alt="${producto.nombre}" />
                    <div class="informacion">
                        <p>${producto.nombre}</p>
                        <p class="precio">$${producto.valor.toFixed(2)}</p>
                        <button onclick="comprar(${indice})">Comprar</button>
                    </div>
                </div>
            `;
        } else {
            contenedor.innerHTML += `
                <div class="producto agotado">
                    <img src="${producto.urlImagen}" alt="${producto.nombre}" />
                    <div class="informacion">
                        <p>${producto.nombre}</p>
                        <p class="precio">$${producto.valor.toFixed(2)}</p>
                        <p class="soldOut">Agotado</p>
                    </div>
                </div>
            `;
        }
    });
}

function comprar(indice) {
    const producto = productos[indice];

    if (producto.existencia > 0) {
        lista.push({
            nombre: producto.nombre,
            precio: producto.valor
        });

        producto.existencia -= 1; 
        guardarAlmacenamientoLocal("productos", productos); 
        renderizarProductos();

        numero.textContent = lista.length;
        numero.classList.add("diseñoNumero");
    }
}

function mostrarElementosLista() {
    productosCompra.innerHTML = ""; 
    valortotal = 0; 

    lista.forEach((item, indice) => {
        productosCompra.innerHTML += `
            <div class="elementoCarrito">
                <div class="img">
                    <button onclick="eliminar(${indice})" class="botonTrash">🗑️</button>
                    <p>${item.nombre}</p>
                </div>
                <p>$${item.precio.toFixed(2)}</p>
            </div>
        `;
        valortotal += item.precio;
    });

    total.innerHTML = `<p>Valor Total:</p> <p><span>$${valortotal.toFixed(2)}</span></p>`;
}

function eliminar(indice) {
    const productoAEliminar = lista[indice];
    const producto = productos.find(p => p.nombre === productoAEliminar.nombre);

    if (producto) {
        producto.existencia += 1; 
        guardarAlmacenamientoLocal("productos", productos); 
    }

    lista.splice(indice, 1); 
    numero.textContent = lista.length;

    if (lista.length === 0) {
        numero.classList.remove("diseñoNumero");
    }

    mostrarElementosLista();
    renderizarProductos();
}

carritoIcono.addEventListener("click", () => {
    finalizarCompraModal.classList.remove("none");
    finalizarCompraModal.classList.add("abierto"); // Clase para animación (si la tienes).
    document.body.style.overflow = "hidden"; // Deshabilitar scroll en el fondo.
    mostrarElementosLista(); // Muestra los productos en el carrito cuando se abre el modal
});

// Cerrar modal
x.addEventListener("click", () => {
    finalizarCompraModal.classList.add("none");
    finalizarCompraModal.classList.remove("abierto");
    document.body.style.overflow = "auto"; // Restaurar scroll.
});

// Cerrar modal al hacer clic fuera del contenido
finalizarCompraModal.addEventListener("click", (e) => {
    if (e.target === finalizarCompraModal) {
        finalizarCompraModal.classList.add("none");
        document.body.style.overflow = "auto";
    }
});

function mostrarProductosEnResumen() {
    const listaProductosCarrito = document.getElementById("listaProductosCarrito");
    listaProductosCarrito.innerHTML = ""; // Limpiar antes de agregar

    lista.forEach((producto, indice) => {
        listaProductosCarrito.innerHTML += `
            <div class="productoCarrito">
                <span>${producto.nombre}</span>
                <span>$${producto.precio.toFixed(2)}</span>
            </div>
        `;
    });
}

// Llama esta función cuando abras el modal
carritoIcono.addEventListener("click", () => {
    mostrarProductosEnResumen();
});




const ordenSelect = document.getElementById("orden");

// Evento para cambiar el orden al seleccionar una opción
ordenSelect.addEventListener("change", () => {
    const orden = ordenSelect.value; // "asc" o "desc"
    ordenarProductosPorPrecio(orden);
});

function ordenarProductosPorPrecio(orden) {
    // Ordenar productos según el criterio seleccionado
    const productosOrdenados = [...productos].sort((a, b) => {
        if (orden === "asc") {
            return a.valor - b.valor; // Ordenar de menor a mayor
        } else if (orden === "desc") {
            return b.valor - a.valor; // Ordenar de mayor a menor
        }
    });

    renderizarProductos(productosOrdenados); // Renderizar productos ordenados
}












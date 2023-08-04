if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration);
      })
      .catch(error => {
        console.error('Error al registrar el Service Worker:', error);
      });
  }

let botonInstalar = document.getElementById('botonInstalar');
let divInstalar = document.getElementById('instalacion');

function instalarApp() {
    if (eventoInstalar) {
        eventoInstalar.prompt();
        eventoInstalar.userChoice
            .then(respuesta => {
                if (respuesta.outcome == 'accepted') {
                    console.log('El usuario acepto instalar la app');
                    divInstalar.style.display = 'none';
                } else {
                    console.log('El usuario no acepto instalar la app');
                }
            })
    }
}

function mostrarBtnInstalar() {
    if (botonInstalar != undefined) {
        divInstalar.style.display = 'block';
        botonInstalar.addEventListener('click', instalarApp)
    }
}
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    eventoInstalar = e;
    mostrarBtnInstalar();
})



window.addEventListener('online', function(){
    let header = document.querySelector(".encabezado");
    let metaT = document.querySelector("meta[name=theme-color]");
    let proce = document.querySelector(".proce");

    
    if(this.navigator.onLine){
        metaT.setAttribute("content", "#343a40")
        header.classList.remove("offline")

        caches.open("pwa-gxgames-archivos-cache").then(cache => {
            cache.add("checkout.html")
        })

        proce.classList.remove("none")
     }
})
window.addEventListener('offline', function(){
    let header = document.querySelector(".encabezado");
    let metaT = document.querySelector("meta[name=theme-color]");
    let proce = document.querySelector(".proce");


        if(!this.navigator.onLine){
            metaT.setAttribute("content", "red")
            header.classList.add("offline")

            caches.open("pwa-gxgames-archivos-cache").then(cache => {
                cache.delete("checkout.html")
            })

            proce.classList.add("none")
        }
})





//Cargo y muestro a los vendedores
const obtenerDataVender = async () => {
    try {
      let url = 'https://jsonplaceholder.typicode.com/users/';
      const response = await fetch(url);
      const dataVender = await response.json();
      mostrarData(dataVender);
    } catch (error) {
      console.log(error);
    }
  };
  
  const mostrarData = (dataVender) => {
    console.log(dataVender);
    let body = "";
    for (let i = 0; i < dataVender.length; i++) {
      body += `<tr><td>${dataVender[i].id}</td><td>${dataVender[i].name}</td><td>${dataVender[i].email}</td></tr>`;
    }
    document.getElementById('dataVender').innerHTML = body;
  };
  
  obtenerDataVender();



var arregloProductos = [];

/**
 * Carga el array de productos
 * @returns {Promise<void>} array de productos
 */
async function cargarArray(){ //carga el array de productos
    const hayProductos = mostrarLocalStorageProductos(); //chequea si hay productos en el local storage
    if(hayProductos) { //si hay productos en el local storage los muestra
        mostrarTodosLosProductos(hayProductos); 
        
    }else{
        try { //intento hacer la llamada a la api
            await fetch('https://fakestoreapi.com/products') //llamada a la api
                .then(res=>res.json()) //convierto la respuesta a json
                .then(json=>{ //guardo el json en el array
                    mostrarTodosLosProductos(json); //muestra todos los productos
                    localStorage.setItem("productos", JSON.stringify(json)); 

                    
                })
        } catch (error) { //si hay error lo muestro en consola
            
        }
    }
}

let contenedorProducto = document.querySelector("#productosTienda"); 
let carritoDeCompras = new Carrito(); 
let cantidadDeProductos  = document.querySelector("#monstrarCantidad");
let removerTodosLosProductos = document.querySelector("#removeAllProd");
let tuTotalCantidad = document.querySelector("#tuTotalCantidad");

let totalCantidadCheckout = document.querySelector("#totalCantidadCheckout");



/**
 * Muestra todos los productos en el contenedorProducto
 * @param {*} arreglo  array de productos
 */
function mostrarTodosLosProductos(arreglo){ 
    arregloProductos = arreglo;
    arreglo.forEach((p)=>{ //recorro el array de productos
        let productoObject = new Producto(p.title, p.description, p.price, p.image, p.category, p.id,null); //creo un objeto producto
        contenedorProducto.append(productoObject.imprimirProducto()); //imprimo el producto en el contenedor
    })
}

/**
 * Agrega un producto al carrito
 * @param {*} idProducto  id del producto
 */
async function agregarAlCarrito(idProducto){ 
    try {
        await fetch('https://fakestoreapi.com/products/'+ idProducto)
        .then(res=>res.json())
        .then(json=>{
            let productoObject = new Producto(json.title, json.description, json.price, json.image, json.category, json.id, null);
            arregloProductos.push(productoObject);
            carritoDeCompras.agregarProducto(productoObject);
        })
    } catch (error) {
        alerta('No se pudo conectar a la API!', 'warning');
        let productos = mostrarLocalStorageProductos();
        let productoObject = productos.filter(p=>p.id == idProducto)[0];
        console.log(productoObject);
        arregloProductos.push(productoObject);
        carritoDeCompras.agregarProducto(productoObject);
    }
    

    actualizarLocalStorage(); //actualizo el local storage  

    cantidadDeProductos.innerText = carritoDeCompras.cantidadDeProductos();  //actualizo la cantidad de productos en el carrito
    tuTotalCantidad.innerText = carritoDeCompras.cantidadDeProductos();     
    
    imprimirCarrito()

}


/**
 * Funcion que lanza un alerta 
 * @param {*} message  mensaje del alerta
 * @param {*} type  tipo de alerta (success, danger, warning, info)
 */
function alerta(message, type){
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    alertPlaceholder.text = ""
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
console.log(wrapper);
}



/**
 * Imprime el carrito en el modal
 * 
 */
function imprimirCarrito(){ 
    let contenedorItemProducto = document.querySelector("#contenedorItemCarrito");

    let misProductos = carritoDeCompras.devolverProductos();
    contenedorItemProducto.replaceChildren();
    totalCompra ();
    misProductos.forEach(element => {
        contenedorItemProducto.append(carritoDeCompras.mostrarCardProducto(element));
    });
}

/**
 * Quita un producto del carrito
 * @param {*} idProducto  id del producto
 * @param {*} element  elemento html
 */
function quitarProductoDelCarrito (idProducto,element){ 

    let contenedorItem = element.parentNode.parentNode;
    
    contenedorItem.remove();
    carritoDeCompras.quitarProductoDelCarrito(idProducto);

    actualizarLocalStorage();

    cantidadDeProductos.innerText = carritoDeCompras.cantidadDeProductos(); 
    tuTotalCantidad.innerText = carritoDeCompras.cantidadDeProductos(); 
    totalCompra ();

}

/**
 * Muestra el total de la compra en el carrito
 */
function totalCompra (){ 
    let tuTotal = document.querySelector(".tuTotal");
    tuTotal.innerText = carritoDeCompras.mostrarPrecioTotalDeLaCompra(); 
}

vaciarCarrito.addEventListener("click", function(){
    carritoDeCompras.quitarTodosLosProducto();
    document.querySelector("#contenedorItemCarrito").replaceChildren();

    totalCompra ();

    actualizarLocalStorage();

    cantidadDeProductos.innerText = carritoDeCompras.cantidadDeProductos(); 
    tuTotalCantidad.innerText = carritoDeCompras.cantidadDeProductos(); 

});

/**
 * Muestra el modal con el detalle del producto
 * @param {*} idProd  id del producto
 */
function mostrarModalDetalle(idProd){ 
    try {
        fetch('https://fakestoreapi.com/products/'+ idProd)
            .then(res=>res.json())
            .then(json=>{
                let productoObject = new Producto(json.title, json.description, json.price, json.image, json.category, json.id, null);
                arregloProductos.push(productoObject);
                document.querySelector("#contenedorDescripLargo").replaceChildren();
                document.querySelector("#contenedorDescripLargo").append(productoObject.imprimirModal(productoObject));
            })
    } catch (error) {
        console.log(error)
    }
}

/**
 * Actualiza el local storage con el carrito de compras
 */
function actualizarLocalStorage() {
    localStorage.setItem("productosCarrito", JSON.stringify(carritoDeCompras.devolverProductos()));
    //localStorage.setItem("productosCarrito", JSON.stringify(carritoDeCompras));
}

/**
 * Devuelve el local storage
 * @returns local storage    
 */
function mostrarLocalStorage() { 
    return JSON.parse(localStorage.getItem("productosCarrito")); 
}

/**
 * Muestra el local storage
 * @returns local storage
 */
function mostrarLocalStorageProductos() { 
    return JSON.parse(localStorage.getItem("productos"));
}

cargarArray() //carga el array de productos



let formulario = document.getElementById('formulario');
  let respuesta = document.getElementById('respuesta');

formulario.addEventListener('submit', function(e){
    e.preventDefault();
    console.log('me diste un click')

    var datos = new FormData(formulario);

    console.log(datos)
    console.log(datos.get('usuario'))
    console.log(datos.get('pass'))

    fetch('login.php',{
        method: 'POST',
        body: datos
    })
        .then( res => res.json())
        .then( data => {
            console.log(data)
            if(data === 'error'){
                respuesta.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Llena todos los campos
                </div>
                `
            }else{
                respuesta.innerHTML = `
                <div class="alert alert-primary" role="alert">
                    ${data}
                </div>
                `
            }
        } )
})
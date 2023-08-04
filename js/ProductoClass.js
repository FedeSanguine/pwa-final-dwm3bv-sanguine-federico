class Producto{
  nombre;
  descripcion;
  precio;
  urlImagen;
  categoria;
  id;
  descripcionlarga;

  constructor(nombre, descripcion, precio,imagen, categoria, id,descripcionlarga){
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.urlImagen = imagen;
    this.categoria = categoria;
    this.id = id;
    this.descripcionlarga = descripcionlarga;
  }
  
  imprimirProducto() {
    //este es el div contenedor del card
    let divContenedorProducto = document.createElement("div");
    divContenedorProducto.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

    //este es el div card
    let divCard = document.createElement("div");
    divCard.className = "card shadow-sm mx-auto bg-lightgray ";
    divCard.setAttribute("data.id",`${this.id}`);

    //esta imagen va dentro del div card
    let imgCardPrducto = document.createElement("img");
    imgCardPrducto.className = "img-fluid";
    imgCardPrducto.setAttribute("src",`${this.urlImagen}`);
    imgCardPrducto.setAttribute("alt",`foto de producto: ${this.nombre}`);

    //este es el body del card
    let divCardBody = document.createElement("div");
    divCardBody.className = "card-body card-container";
    
    //titulo del div card-body
    let tituloCardBody = document.createElement("h3");
    tituloCardBody.className = "card-title fs-4 fw-bold";
    tituloCardBody.innerText = `${this.nombre}`;

    //descripcion del producto 
    let descriptCardBody = document.createElement("p");
    descriptCardBody.className = "card-text";
    descriptCardBody.innerText = `${this.descripcion}`;


    //precio del producto
    let precioCardBody = document.createElement("p");
    precioCardBody.className = "fs-3 fw-semibold";
    precioCardBody.innerText = `$ ${this.precio}`;

    //Div botones
    let divBotones = document.createElement("div");
    divBotones.className = "botones-container";

    //boton de compra del producto
    let botonCompraCardBody = document.createElement("button");
    botonCompraCardBody.className = "btn shadow-sm btn-dark w-100 mb-3 addCart";
    botonCompraCardBody.innerText = "Agregar al carrito";
    botonCompraCardBody.setAttribute("onclick",`agregarAlCarrito(${this.id})`);


    let botonDetalleCardBody = document.createElement("button");
    botonDetalleCardBody.className = "btn shadow-sm btn-dark w-100";
    botonDetalleCardBody.innerText = "Ver detalle";
    botonDetalleCardBody.setAttribute("data-bs-toggle","modal");
    botonDetalleCardBody.setAttribute("data-bs-target","#exampleModal");
    botonDetalleCardBody.setAttribute("onclick",`mostrarModalDetalle(${this.id})`);

    // Agregar botones al div de botones
    divBotones.append(botonCompraCardBody);
    divBotones.append(botonDetalleCardBody);
    
    //card body
    divCardBody.append(tituloCardBody);
    divCardBody.append(descriptCardBody);
    divCardBody.append(precioCardBody);


    //card
    divCard.append(imgCardPrducto);
    divCard.append(divCardBody);

    divCardBody.append(divBotones);
    
    divContenedorProducto.append(divCard)
    
    return divContenedorProducto;      

  }

  imprimirModal(producto){
    
    //este es el div row que contiene las col
    let divContenedorRow = document.createElement("div");
    divContenedorRow.className = "row mx-3";

    //este es el div col con imagen
    let divColConImagen = document.createElement("div");
    divColConImagen.className = "col-12 col-md-3 py-2";

    //esta imagen va dentro del div col
    let imgProducto = document.createElement("img");
    imgProducto.className = "img-fluid  mx-auto";
    imgProducto.setAttribute("src",`${producto.urlImagen}`);
    imgProducto.setAttribute("alt",`foto de producto: ${producto.nombre}`);

    //este es el div col con texto
    let divColConTexto = document.createElement("div");
    divColConTexto.className = "col-md-8 card-body p-5";

    //h3 titulo del detalle
    let tituloDetalle = document.createElement("h3");
    tituloDetalle.className = "card-text fw-bold text-dark-violet fs-2";
    tituloDetalle.innerText = `${producto.nombre}`;

    //h4 descripCorta del detalle
    let productoDescripcionCorta = document.createElement("h3");
    productoDescripcionCorta.className = "card-text fw-bold text-dark-violet fs-5";
    productoDescripcionCorta.innerText = `${producto.descripcion}`;

    //p descripcion larga del producto
    let productoDescripcionLarga = document.createElement("p");
    productoDescripcionLarga.className = "fs-5";
    productoDescripcionLarga.innerText = `${producto.descripcionlarga}`;

    //precio del producto
    let precioProductoDetalle = document.createElement("p");
    precioProductoDetalle.className = "fs-3 fw-bold";
    precioProductoDetalle.innerText = `$ ${producto.precio}`;

    let botonCompraCardBody = document.createElement("button");
    botonCompraCardBody.className = "btn shadow-sm btn-dark  my-3 addCart";
    botonCompraCardBody.innerText = "Agregar al carrito";
    botonCompraCardBody.setAttribute("onclick",`agregarAlCarrito(${this.id})`);

    

    //div col con texto (le agrego los elementos)
    divColConTexto.append(tituloDetalle);
    divColConTexto.append(productoDescripcionCorta);
    divColConTexto.append(productoDescripcionLarga);
    divColConTexto.append(precioProductoDetalle);
    divColConTexto.append(botonCompraCardBody);
    


    //div col con imagen (le agrego la imagen)
    divColConImagen.append(imgProducto);


    //div row que contiene las col (le agrego las dos col)
    divContenedorRow.append(divColConImagen);
    divContenedorRow.append(divColConTexto);


    return divContenedorRow;

  }
}
//Variables

var catalogo = new Array
const urlAPI = 'https://animechan.vercel.app/api/random'


// Clases 
class Producto {
    constructor(id, nombre, volumen, precio, cantidad) {
        this.id = id;
        this.nombre = nombre;
        this.volumen = volumen;
        this.precio = precio;
        this.cantidad = cantidad
    }

    crearCard(selector) {
        $(selector).append(`
            <div class=" col-5 col-md-4 col-lg-3 m-lg-1">
                <div class="card producto${this.id}">
                    <img src="images/producto${this.id}.webp" class="card-img " alt="${this.nombre}">
                    <div class="card-body"> 
                        <p>${this.nombre}</p>
                        <p>Volumen: ${this.volumen}</p>
                        <p>Precio: ${this.precio}</p>
                    </div>
                </div>
            </div>`
)
        
    }

}

// Funciones 

function elegirProducto(producto){
    let carroProductos = localStorage.getItem('productosEnCarro');
    carroProductos = JSON.parse(carroProductos);

    if (carroProductos != null){

        if(carroProductos[producto.id] == undefined){
            carroProductos = {
                ...carroProductos,
                [producto.id]: producto
            }
            producto.cantidad = 0;
        }
        carroProductos[producto.id].cantidad += 1;

    } else{
        producto.cantidad = 1;
        carroProductos = {
            [producto.id]: producto
        }
    }
        
    localStorage.setItem("productosEnCarro", JSON.stringify(carroProductos));

}

function precioOrden(producto){
    let costoTotal = localStorage.getItem('costoTotal');
    
    if (costoTotal != null){
        costoTotal = parseInt(costoTotal);
        localStorage.setItem("costoTotal",costoTotal + producto.precio);
    } else{
        localStorage.setItem("costoTotal",producto.precio);
    }
    

}

function mostrarCompra(){
    let carroProductos = localStorage.getItem("productosEnCarro");
    carroProductos = JSON.parse(carroProductos);
    let costoTotal = localStorage.getItem('costoTotal');
    if(carroProductos){
        $(".productosComprados").html('')
        Object.values(carroProductos).map(item =>{
            $(".productosComprados").append(
                `<div class="productos col-3">
                    <p>${item.nombre} Volumen: ${item.volumen}</p>
                </div>
                <div class="price col-3">${item.precio}</div>
                <div class="cantidad col-3">${item.cantidad}</div>
                <div class="total col-3">${item.cantidad * item.precio}</div>`)

        });

        $(".productosComprados").append(
            `<div class="totalPagar col-9">
                <p>Total</p>
            </div>
            <div class="priceTotal col-3">${costoTotal}</div>`)

    }
}

mostrarCompra()

function eliminarCarrito(){
    localStorage.setItem("productosEnCarro",null);
    localStorage.setItem('costoTotal',"0");
    $(".productosComprados").html('');
}


// Eventos


$.ajax({
    method: "GET",
    url: "productos.json",
    async: false,
    success: function(respuesta){
        for (const producto of respuesta) {
            let prod = new Producto(producto.id,producto.nombre,producto.volumen,producto.precio);
            catalogo.push(prod);
        }
    }
})

$(document).ready(()=> {

    for (const producto of catalogo) {
        producto.crearCard(".producto");
    }


    for (let i = 0; i<catalogo.length; i++) {
        $(`.producto${(i+1)}`).on("click", () => {
            elegirProducto(catalogo[i]);
            precioOrden(catalogo[i]);
            mostrarCompra();
        })

    }

    $(".btnLimpiar").on("click", () => {
        eliminarCarrito();
    })

    $(".btnComprar").on("click", () => {
            
        $(".cart").slideUp(1000);
        $("section").append(`
        <div class="row intro  justify-content-center mb-5 jumbotron jumbotron-fluid mensajeCompra" style="display:none">
            <h1 class="col-12 display-4">GRACIAS POR SU COMPRA</h1>
        </div>`
        );

        $.ajax({
            method: "GET",
            url: urlAPI,
            success: function(respuesta){
                $(".mensajeCompra").append(`
                    <h2>Frase del dia </h2>
                    <p>${respuesta.quote}</p>
                    <p>"${respuesta.character}"</p>
                    <p> En ${respuesta.anime}</p>`)
            }
        })

        $(".mensajeCompra").fadeIn(2000)
                            .delay(2000);;
        eliminarCarrito()
        
    })

    
})

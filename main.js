//Variables

let catalogo = new Array;
let carro = new Carro;
let nombre= "";
let email = "";
let direccion = "";
let medioPago= "";

// Funciones 

/* Funcion para recuperar los datos de Local Storage, Si existen datos se parsean, se obtiene un array que se utiliza como array del carro */ 

function cargarCarro(){

    if (localStorage.getItem("productosEnCarro") != null){
        let productoCarro = localStorage.getItem("productosEnCarro");
        let productosCargados=JSON.parse(productoCarro);
        carro.productos = productosCargados;
        carro.mostrarCarro(".productosComprados");
        carro.totalCantidad(".carritoDinamico")
    } 
}

cargarCarro();



/*Al seleccionar producto , se verifica si el mismo existe en el array del objeto carro. Si existe se suma una unidad a la cantidad,
Si no existe a la cantidad se le da el valor de uno y se pushea el nuevo objeto al array del carro. Finalmente se guardan los datos
en el localStorage*/

function elegirProducto(producto){
    let productoSeleccionado = producto;

    let productoCarro = carro.productos.find(element => element.id === producto.id);
    if (productoCarro != undefined){
        productoCarro.cantidad += 1;
    } else{
        productoSeleccionado.cantidad = 1;
        carro.addProducto(productoSeleccionado);
    }

    localStorage.setItem("productosEnCarro", JSON.stringify(carro.productos))

}

/* Funcion para eliminar los productos en el carro, limpia localStorage y actualiza html */

function eliminarCarrito(){
    localStorage.clear();
    carro.productos = [];
    $(".productosComprados").html("")
    carro.totalCantidad(".carritoDinamico")
}

/* Funcion para limpiar el formulario, ya sea por boton o al finalizar el proceso */
function limpiarFormulario(){
    $("#nombre").val("");
    $("#email").val("");
    $("#direccion").val("");
    $("#medioPago").val("Seleccione una Opcion")
}

// Eventos

/* Carga los productos del archivo json, se crean los objetos y se agregan al catalogo */

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

/* Eventos para detectar los cambios en el formulario. Al ser similares creo que se podria haber estandarizado el codigo para utilizar 
una sola funcion, pero no encontre la forma optima de hacerlo*/
$("#nombre").on("change", () => {
    nombre = $("#nombre").val();
})

$("#email").on("change", () => {
    email = $("#email").val();
})

$("#medioPago").on("change", () => {
    medioPago = $("#medioPago").val();
})

$("#direccion").on("change", () => {
    direccion = $("#direccion").val();
})


$(document).ready(()=> {

    //Se crean las cards del catalogo con el metodo del objeto
    for (const producto of catalogo) {
        producto.crearCard(".producto");
    }

    //Evento para agregar productos al carrito, y con los metodos de la clase se manipula el DOM
    for (let i = 0; i<catalogo.length; i++) {
        $(`.producto${(i+1)}`).on("click", () => {
            elegirProducto(catalogo[i]);
            carro.mostrarCarro(".productosComprados");
            carro.totalCantidad(".carritoDinamico")
        })

    }
    carro.totalCantidad(".carritoDinamico");

    $(".btnLimpiar").on("click", () => {
        eliminarCarrito();
    })

    /* Evento para continuar con el proceso, si no hay productos en el carro se envia un mensaje, 
    caso contrario se procede a llenar los datos  */
    $(".btnComprar").on("click", () => {
        if (carro.productos == ""){
            Swal.fire({
                icon: 'warning',
                title: 'No hay productos en su carrito',
              })
        }else{
            $(".cart").slideUp(1000);
            $(".comprasResumen").fadeIn(1000);
            Swal.fire('Complete los datos, seleccione direccion de envio y metodo de pago')
        }    
    })

    /* Se verifica el formulario, controlamos que las casillas hayan sido completadas y
    que el mail incluya un arroba*/

    $(".enviarForm").on("click", () => {
        if (nombre == "" || direccion == "" || medioPago == "" || direccion == "" || email == "") {
            Swal.fire({
                icon: 'warning',
                title: 'Faltan Datos',
                text: 'Complete el formulario para continuar',
              })
        }else if (email.includes("@") == false){
            Swal.fire({
                icon: 'warning',
                title: 'Direccion de mail no valida',
                text: 'Incluya un arroba @',
              })
        }else{
            /* Si paso la validacion se crea el pedido con los datos del formulario. El costo se obtiene aplicando los metodos
            de la clase carro y la clase compra*/ 
            let pedido = new Compra(nombre,direccion,medioPago,email);
            pedido.aplicarDescuento(carro.costo());
            $(".formPedido").slideUp(1000);
            $(".formButtons").slideUp(1000);
            $(".baseCart").html(`
            <div class="row intro mt-5 jumbotron jumbotron-fluid mensajeCompra" style="display:none">
                <h1 class="col-12 display-4">GRACIAS POR SU COMPRA</h1>
                <h2>Resumen de compra</h2>
                <p>Costo final : ${pedido.costo} </p>
                <p>Contacto aportado : ${pedido.email} </p>
                <p>Direccion de envio : ${pedido.direccion} </p>

            </div>`
            );
            $(".mensajeCompra").fadeIn(2000)
            eliminarCarrito();
            limpiarFormulario();
        }
        
    })

    $(".limpiarForm").on("click", () => {
        limpiarFormulario();
    })

    
})

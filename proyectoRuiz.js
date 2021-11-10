
/* Clases */ 
class Pelicula {
    constructor(titulo, estreno, duracion, id, precio, cantidad) {
        this.titulo = titulo;
        this.estreno = estreno;
        this.duracion = duracion;
        this.id = id;
        this.precio = precio;
        this.cantidad = cantidad
    }

    descripcion(){
        alert(`Se selecciono la pelicula ${this.titulo} estrenada en ${this.estreno}, con una duracion de ${this.duracion} minutos \nCon un precio de ${this.precio} pesos por entrada`);
    }


}

const pelicula1 = new Pelicula("Kimetsu no Yaiba: Mugen Ressha-hen",2020,117,1,600);
const pelicula2 = new Pelicula("Akira", 1988, 124, 2, 700);
const pelicula3 = new Pelicula("El viaje de Chihiro", 2001, 120, 3, 800);

const catalogo = [pelicula1, pelicula2, pelicula3];

/*Funciones */

function elegirPelicula(pelicula){
    let carroProductos = localStorage.getItem('peliculasEnCarro');
    carroProductos = JSON.parse(carroProductos);

    if (carroProductos != null){

        if(carroProductos[pelicula.titulo] == undefined){
            carroProductos = {
                ...carroProductos,
                [pelicula.titulo]: pelicula
            }
            pelicula.cantidad = 0;
        }
        carroProductos[pelicula.titulo].cantidad += 1;

    } else{
        pelicula.cantidad = 1;
        carroProductos = {
            [pelicula.titulo]: pelicula
        }
    }
        
    localStorage.setItem("peliculasEnCarro", JSON.stringify(carroProductos));

}

function precioOrden(pelicula){
    let costoTotal = localStorage.getItem('costoTotal');
    
    if (costoTotal != null){
        costoTotal = parseInt(costoTotal);
        localStorage.setItem("costoTotal",costoTotal + pelicula.precio);
    } else{
        localStorage.setItem("costoTotal",pelicula.precio);
    }
    

}

function mostrarCompra(){
    let carroProductos = localStorage.getItem("peliculasEnCarro");
    carroProductos = JSON.parse(carroProductos);
    let costoTotal = localStorage.getItem('costoTotal');
    if(carroProductos){
        $(".peliculasCompradas").html('')
        Object.values(carroProductos).map(item =>{
            $(".peliculasCompradas").append(
                `<div class="peliculas col-3">
                    <p>${item.titulo}</p>
                </div>
                <div class="price col-3">${item.precio}</div>
                <div class="cantidad col-3">${item.cantidad}</div>
                <div class="total col-3">${item.cantidad * item.precio}</div>`)

        });

        $(".peliculasCompradas").append(
            `<div class="totalPagar col-9">
                <p>Total</p>
            </div>
            <div class="priceTotal col-3">${costoTotal}</div>`)

    }
}

mostrarCompra()

function eliminarCarrito(){
    localStorage.setItem("peliculasEnCarro",null);
    localStorage.setItem('costoTotal',"0");
    $(".peliculasCompradas").html('');
}


/* Eventos*/

for (const pelicula of catalogo) {
    $(".pelicula").append(`
        <div class=" col-5 col-md-4 col-lg-3 m-lg-1">
            <div class="card">
                <img src="images/pelicula${pelicula.id}.webp" class="card-img pelicula${pelicula.id}" alt="${pelicula.titulo}">
            </div>
        </div>`
    )}



for (let i = 0; i<catalogo.length; i++) {
    $(`.pelicula${(i+1)}`).on("click", () => {
        elegirPelicula(catalogo[i]);
        precioOrden(catalogo[i]);
        mostrarCompra();
    })

}

$(".btnLimpiar").on("click", () => {
    eliminarCarrito();
})


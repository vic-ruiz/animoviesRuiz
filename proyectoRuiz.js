var total = 0;
var precio = 0;
var cantidad = 0;

/* Clases */ 
class Pelicula {
    constructor(titulo, estreno, duracion, id, precio, horarios, cantidad) {
        this.titulo = titulo;
        this.estreno = estreno;
        this.duracion = duracion;
        this.id = id;
        this.precio = precio;
        this.horarios = horarios;
        this.cantidad = cantidad
    }

    descripcion(){
        alert(`Se speliculao la pelicula ${this.titulo} estrenada en ${this.estreno}, con una duracion de ${this.duracion} minutos \nCon un precio de ${this.precio} pesos por entrada`);
    }


}


const pelicula1 = new Pelicula("Kimetsu no Yaiba: Mugen Ressha-hen",2020,117,1,600);
const pelicula2 = new Pelicula("Akira", 1988, 124, 2, 700);
const pelicula3 = new Pelicula("El viaje de Chihiro", 2001, 120, 3, 800);

const catalogo = [pelicula1, pelicula2, pelicula3];

/*Funciones */


function ordenCompra(pelicula) {
    let peliculaComprada = localStorage.getItem('cantidadCompra');
    peliculaComprada = parseInt(peliculaComprada);

    if(peliculaComprada){
        localStorage.setItem('cantidadCompra',peliculaComprada+1);
    } else{
        localStorage.setItem('cantidadCompra',1);

    }

    elegirPelicula(pelicula);
}

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
    let cart = document.getElementsByClassName("peliculasCompradas")[0];
    if(carroProductos){
        cart.innerHTML = '';
        Object.values(carroProductos).map(item =>{
            cart.innerHTML += `
                <div class="peliculas col-3">
                    <p>${item.titulo}</p>
                </div>
                <div class="price col-3">${item.precio}</div>
                <div class="cantidad col-3">${item.cantidad}</div>
                <div class="total col-3">${item.cantidad * item.precio}</div>`;
        });

        cart.innerHTML += `
        <div class="totalPagar col-9">
                    <p>Total</p>
                </div>
                <div class="priceTotal col-3">${costoTotal}</div>
        `

    }
}

mostrarCompra()








/* Eventos*/

let mostrarCatalogo = document.getElementById("mostrarCatalogo")
let catalogoClick = document.getElementsByClassName("btn")[0];
catalogoClick.addEventListener("click", () => {
    mostrarCatalogo.innerHTML=``;
    for (const pelicula of catalogo) {
        let contenedor = document.createElement("div");
        contenedor.innerHTML = `<div class="col-md-3 col-4">
                                    <h3 class="card">${pelicula.id}-${pelicula.titulo}</h3>
                                    <p class="card"> Precio: ${pelicula.precio} $ </p>
                                </div>
                                `;
    
        mostrarCatalogo.appendChild(contenedor);

    }

})


let compraClick = document.querySelectorAll(".card-img");

for (let i = 0; i<compraClick.length; i++) {
    compraClick[i].addEventListener("click", () => {
        ordenCompra(catalogo[i]);
        precioOrden(catalogo[i]);
        mostrarCompra();
    })

}


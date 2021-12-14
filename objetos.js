class Producto {
    constructor(id, nombre, volumen, precio) {
        this.id = id;
        this.nombre = nombre;
        this.volumen = volumen;
        this.precio = precio;
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

class Carro {
    constructor(){
        this.productos = [];
    }

    addProducto(pro){
        this.productos.push(pro)
    }

    
    mostrarCarro(selector){
        $(selector).html('');
        let costoTotal = 0;
        Object.values(this.productos).map(item =>{
            $(selector).append(
                `<div class="productos col-3">
                    <p>${item.nombre} Volumen: ${item.volumen}</p>
                </div>
                <div class="price col-3">${item.precio}</div>
                <div class="cantidad col-3">${item.cantidad}</div>
                <div class="total col-3">${item.cantidad * item.precio}</div>`)

        })
        
        Object.values(this.productos).map(item =>{
            costoTotal += (item.cantidad * item.precio);
        });
        $(selector).append(
            `<div class="totalPagar col-9">
                <p>Total</p>
            </div>
            <div class="priceTotal col-3">${costoTotal}</div>`);
    }


    totalCantidad(selector){
        $(selector).html('')
        let cantidadCarro = 0;
        Object.values(this.productos).map(item =>{
            cantidadCarro += (item.cantidad);
        });
        $(selector).append(
            `<a class="nav-link" aria-current="page" href="shoppingCart.html"> Carrito ${cantidadCarro}</a>`)
    }   

    costo(){
        let costoTotal = 0;
        Object.values(this.productos).map(item =>{
            costoTotal += (item.cantidad * item.precio);
        });
        return costoTotal;
    }

}

class Compra{
    constructor(nombre, direccion, metodo, email, costo){
        this.nombre = nombre;
        this.direccion = direccion;
        this.metodo = metodo;
        this.email = email;
        this.costo = costo;
    }

    aplicarDescuento(costo){
        let costoInicial = costo;
        switch (this.metodo) {
            case "credito":
                this.costo = costoInicial*1.1;
                break;
            case "debito":
                this.costo = costoInicial*0.9;
                break;
            default:
                this.costo = costoInicial;
        }
    }

}
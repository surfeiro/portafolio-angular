import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';
import { reject } from 'q';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos: Producto[] = [];
  productosFiltrado: Producto[] = [];

  constructor( private http: HttpClient ) {

    this.cargarProductos();

  }

  private cargarProductos() {

    return new Promise( ( relsolve, reject ) =>{  

        this.http.get(`https://angular-html-aee6c.firebaseio.com/productos-idx.json`)
        .subscribe( (resp: Producto[]) => {
          this.productos = resp;
          setTimeout(() => { //pausa para ver la animacion
            this.cargando = false;
        }, 1000);
        relsolve();
        });

    });


  }

  getProducto( id: string ){
      return this.http.get(`https://angular-html-aee6c.firebaseio.com/productos/${ id }.json`);

  }

  buscarProducto (termino: string) {

    if ( this.productos.length === 0) {
      // cargar productos
      this.cargarProductos().then( () => {
        // ejecutar despues de tener los productos
        // aplicar filtro
        this.filtrarProductos( termino );
      });
    } else{
      // aplicar el filtro
      this.filtrarProductos( termino );
    }
  }

  private filtrarProductos( termino: string ) {

    // console.log( this.productosFiltrado );
    this.productosFiltrado = [];

    termino = termino.toLocaleLowerCase();

    this.productos.forEach( prod => {

      const tituloLower = prod.titulo.toLocaleLowerCase();

      if ( prod.categoria.indexOf( termino ) >= 0 || tituloLower.indexOf( termino ) ) {
        this.productosFiltrado.push( prod );
      }
    });
  }

}

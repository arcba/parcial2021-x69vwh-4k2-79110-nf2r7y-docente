import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Producto } from '../../models/producto';
import { ModalDialogService } from "../../services/modal-dialog.service";
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'] 
})



export class ProductosComponent implements OnInit {
  Titulo = 'Producto';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Producto: Producto[] = null;
  RegistrosTotal: number;
  Pagina = 1; // inicia pagina 1
  submitted: boolean = false;
  FormReg: FormGroup;

  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;
  SinBusquedasRealizadas = true;

  constructor(
    public formBuilder: FormBuilder,
    private ProductosService: ProductosService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.Buscar();
    this.Resetear();
  };
    

  Resetear(){
    this.FormReg = this.formBuilder.group({
    ProductoID: [0],
    ProductoNombre: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    ProductoFechaAlta: [
    "",
    [
    Validators.required,
    Validators.pattern(
    "(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}"
    )
    ]
    ],
    ProductoStock: [
    "",
    [Validators.required, Validators.minLength(4), Validators.maxLength(100000
    )]
    ],
    });
    }
    Agregar() {
    this.AccionABMC = "A";
    this.Resetear();
    this.FormReg.reset(this.FormReg.value);
    this.submitted = false;
    this.FormReg.markAsUntouched();
    
    }
    Modificar(e) {
    this.submitted = false;
    this.FormReg.markAsPristine();
    this.FormReg.markAsUntouched();
   // this.BuscarPorId(e, "M");
    }
    
    Volver(){
    this.AccionABMC = "L";
    }
    Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormReg.invalid) {
    return;
    }
    const itemCopy = { ...this.FormReg.value };
    var arrFecha = itemCopy.ProductoFechaAlta.substr(0, 10).split("/");
    if (arrFecha.length == 3)
    itemCopy.ProductoFechaAlta =
    new Date(
    arrFecha[2],
    arrFecha[1] - 1,
    arrFecha[0]
    ).toISOString();
    // agregar post
    if (itemCopy.ProductoID == 0 || itemCopy.ProductoID == null) {
    this.ProductosService.post(itemCopy).subscribe((res: any) => {
    this.Volver();
    this.modalDialogService.Alert('Registro agregado correctamente.');
    this.Buscar();
    });
    } else {
    // modificar put
    this.ProductosService
    .put(itemCopy.ProductoID, itemCopy)
    .subscribe((res: any) => {
    
    this.Volver();
    this.modalDialogService.Alert('Registro modificado correctamente.');
    this.Buscar();
    });
    }
    }
    Buscar() {
    this.SinBusquedasRealizadas = false;
    this.ProductosService
    .get()
    .subscribe((res:Producto[]) => {
    this.Producto = res;
    });
    }
    Eliminar(e){
    this.modalDialogService.Confirm(
    "Esta seguro de eliminar esta empresa?",
    undefined,
    undefined,
    undefined,
    () =>
    this.ProductosService
    .delete(e.ProductoID)
    .subscribe((res: any) =>
    this.Buscar()
    ),
    null
    );
    }
    Consultar() {
    
    }
}
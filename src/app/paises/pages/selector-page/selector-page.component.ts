import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaiseCompletoInterfaces, PaisSmallInterface } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {
  //Llenar selectores
  regiones : string[]             = [];
  paises   : PaisSmallInterface[] = [];
  fronteras: PaisSmallInterface[] = [];

  // UI
  cargando: boolean = false;

  constructor(
    private formBuilder  : FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // Evalua cambios en el continente
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(() => {
          this.paises = [];
          this.miFormulario.get(['pais'])?.reset('');
          this.cargando = true;
        }),
        switchMap( region => this.paisesService.getPaisesRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });

    // Evalua los cambios en el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() =>{
          this.fronteras = [];
          this.miFormulario.get(['frontera'])?.reset('');
          this.cargando = true;
        }),
        switchMap( pais => this.paisesService.getPaisesFrontera(pais)),
        switchMap( pais => this.paisesService.getArregloFronteras( pais ? pais![0]?.borders : []))
      )
      .subscribe( paises => {
          if(paises.length > 0){
            console.log(paises);
            this.fronteras = paises;
          }
          this.cargando = false;
        }
      )





    //Cuando cambia la region(continenete)
    /*this.miFormulario.get('region')?.valueChanges
      .subscribe( region => {

        this.paisesService.getPaises(region)
          .subscribe( paises => {
            console.log(paises)
            this.paises = paises;
          })
      })*/

  }


  miFormulario: FormGroup = this.formBuilder.group({
    region  : ['', Validators.required],
    pais    : ['', Validators.required],
    frontera: ['', Validators.required]
  })


  guardar(){
    console.log(this.miFormulario.value);
  }

}

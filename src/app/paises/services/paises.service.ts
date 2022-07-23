import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PaisSmallInterface, PaiseCompletoInterfaces } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  private baseUrl: string = 'https://restcountries.com/v3.1'

  constructor(private http: HttpClient) { }

  getPaisesRegion( region: string): Observable<PaisSmallInterface[]>{

    return this.http.get<PaisSmallInterface[]>(
      `${this.baseUrl}/region/${region}?fields=name,cca3`)
  }

  getPaisesFrontera( pais: string): Observable<PaiseCompletoInterfaces[] | null>{

    if(!pais){
      return of(null)
    }
    return this.http.get<PaiseCompletoInterfaces[]>(
      `${this.baseUrl}/alpha/${pais}`)
  }

  getPaisesFronteraSmall( pais: string): Observable<PaisSmallInterface>{


    return this.http.get<PaisSmallInterface>(
      `${this.baseUrl}/alpha/${pais}?fields=cca3,name`)
  }

  getArregloFronteras( borders: string[]): Observable<PaisSmallInterface[]>{

    if(!borders){
      return of ([]);
    }

    const peticiones: Observable<PaisSmallInterface>[] = [];

    borders.forEach(codigo => {

      const peticion: Observable<PaisSmallInterface> = this.getPaisesFronteraSmall(codigo);

      peticiones.push( peticion);
    });

    return combineLatest( peticiones)
  }

  get regiones(): string[] {
    return [...this._regiones];
  }

}

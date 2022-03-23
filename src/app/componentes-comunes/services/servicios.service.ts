
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class Servicios {
    // lo trae del enviroment dependiendo del ambiente
    BASE_URL_AEROPUERTO = environment.BASE_URL_AEROPUERTO;


    constructor(private http: HttpClient,
        private router: Router) {

        // console.log('Ingresa a Servicios.');
    }


    /**
        * Metodo que realiza un get a un microservicio haciendo uso de un solo parametro 
        * enviando el valor en la url ejemplo http://host.microservicio/metodoGet/parametro
        * @param pUrl url del microservicio ejemplo http://host.microservicio/metodoGet
        * @param pNombreServicio nombre del servicio a llamar. Puede ser null
        * @param pParametro parametro que se envia al servicio este puede ser null si no se envia parametro
        */
    public getData<T>(pUrl: string, pNombreServicio: string | null, pParametro: string | null = null, pJSON: boolean = false): Observable<T> {
        if (pNombreServicio == null) {
            if (pParametro === null) {
                return this.http.get<T>(`${pUrl}`, this.generateHeaders(pJSON));
            } else {
                return this.http.get<T>(`${pUrl}/${pParametro}`, this.generateHeaders(pJSON));
            }
        } else {
            if (pParametro === null) {
                return this.http.get<T>(`${pUrl}/${pNombreServicio}`, this.generateHeaders(pJSON));
            } else {
                return this.http.get<T>(`${pUrl}/${pNombreServicio}/${pParametro}`, this.generateHeaders(pJSON));
            }
        }
    }


    /**
     * 
     * @param pUrl url del microservicio a consumir ejemplo http://host.microservicio/metodoPost
     * @param pParametro parametro del metodo post este puede ser null si no lleva parametro
     * @param pBody body del servicio con la estructura de la interface servicioBody obtiene la variable 
     *              body de la interface que debe contener la estructura de envio del microservicio si se
     *              necesita agregar una nueva estructura se debe agregar en la interface
     * @param pJSON true cuando el metodo tiene content-type application-json, false si no tiene content-type
     */
    public postData(pUrl: string, pNombreServicio: string | null, pBody: Object, pJSON: boolean = true): Observable<any> {
        if (pNombreServicio === null) {
            return this.http.post(pUrl, pBody, this.generateHeaders(pJSON));
        } else {
            return this.http.post(`${pUrl}/${pNombreServicio}`, pBody, this.generateHeaders(pJSON));
        }
    }

    /**
         * funcion para crear el headers que se enviara en los servicios
         * @param json agrega si el contenido sera de tipo json
         * @author Jairo Sarceño
         */

    public generateHeaders(json: boolean = false): object {
        let headers: HttpHeaders;
        if (json) {
            headers = new HttpHeaders({
                'Accept': '*/*',
                'Content-Type': 'application/json'
            });
        } else {
            headers = new HttpHeaders({
                'Accept': '*/*'
            });
        }
        //console.log('header a enviar:', JSON.stringify(headers));
        let httpOptions: object = { "headers": headers };
        return httpOptions;
    }


    public putData<T>(pUrl: string, pParametro: string, pBody: T): Observable<any> {
        let body = null;
        if (pBody)
            body = JSON.stringify(pBody);

        if (pParametro === null) {
            return this.http.put(`${pUrl}`, body, this.generateHeaders(true));
        }
        else {
            return this.http.put(`${pUrl}/${pParametro}`, body, this.generateHeaders(true));
        }
    }

    forcedNavigate(comands: any, extras?: any) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(comands, extras));
    }

    /**
    * Metodo que realiza un get a un microservicio enviando en el url el nombre del parámetro
    * y el valor del parametro en la url ejemplo 
    * http://host.microservicio/metodoGet?NombreParametro=ValorParametro, retornando2
    * @param pUrl url del microservicio http://host.microservicio/metodoGet
    * @param pNombreParametro nombre del parametro a enviar
    * @param pParametro parametro a enviar
    */
    public getDataParametroJson<T>(pUrl: string, pNombreParametro: string, pParametro: string): Observable<T> {
        console.log(`servicio:  ${pUrl}?${pNombreParametro}=${pParametro}`);
        return this.http.get<T>(`${pUrl}?${pNombreParametro}=${pParametro}`, this.generateHeaders(true));
    }

    public handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            if (error.status === 200) {
                // console.log('carga-archivo: sin error HttpErrorResponse');
            } else {
                // console.error('carga-archivo: Ocurrio un error:', error.error.message);
            }

        } else {
            if (error.status === 200) {
                // console.log('carga-archivo: sin error HttpErrorResponse');
            } else {
                // console.error('carga-archivo::Código de respuesta ' + error.status +', body was: ' + error.error);
            }
        }
        return throwError(
            'carga-archivo: Algo malo paso, por favor intente mas tarde.');
    };

}
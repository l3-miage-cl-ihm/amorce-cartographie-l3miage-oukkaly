import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLngLiteral, Polyline } from 'leaflet';

export interface ResponseOpenRoute{
  bbox: number[],
  metadata: string,
  routes: RouteOpenRoute[]
}

export interface RouteOpenRoute{
  geometry : string
}

@Injectable({
  providedIn: 'root'
})
export class OpenRouteService {

  readonly commuteType = "driving-car"
  readonly authHeader = "['Authorization' : '5b3ce3597851110001cf6248792f958cf4884d94ac7ea7ce3958ffaa']";
  constructor(private http: HttpClient) { }

 /* getRoute(points : readonly LatLngLiteral[]){
    const coor = points.map((coor) => `[${coor.lng},${coor.lat}]`);
    const body = `{"coordinates":[${coor}]}`;
    const header = new HttpHeaders({
      'Authorization': '5b3ce3597851110001cf6248792f958cf4884d94ac7ea7ce3958ffaa',
      'Content-Type': 'application/json'
    })
    const options = {headers: header}
    return this.http.post<ResponseOpenRoute>(`https://api.openrouteservice.org/v2/directions/driving-car`,body, options );
  }*/
  /**
   * Utilisé pour l'affichage de l'itinéraire entre 2 points
   * @param start
   * @param end
   * @return un observable contenant l'itinéraire encodé reliant start et end
   */
  getRoute(start : LatLngLiteral[]) {
    const literalToString = start.map( (coor) => `[${coor.lng}, ${coor.lat}]`);
    // const coordStart: string = `[${start.lng}, ${start.lat}]`;
    // const coordEnd: string = `[${end.lng}, ${end.lat}]`;
    const body = `{"coordinates":[${literalToString}]}`;
    const headers = new HttpHeaders({
      'Authorization': '5b3ce3597851110001cf6248792f958cf4884d94ac7ea7ce3958ffaa',
      'Content-Type': 'application/json'
    })
    const options = {headers};
    return this.http.post<ResponseOpenRoute>(`https://api.openrouteservice.org/v2/directions/driving-car`,body, options );
  }
}

import { CommonModule } from '@angular/common';
import { Component, Signal, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapOptions, tileLayer, LatLng, LatLngLiteral, marker, icon, Icon, LeafletMouseEvent, Layer, Polyline, polyline, PolylineOptions } from 'leaflet';
import { OpenRouteService } from './services/open-route.service';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LeafletModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  readonly defaultIcon = computed( () => icon({
    ...Icon.Default.prototype.options,
    iconUrl: 'assets/marker-icon.png',
    iconRetinaUrl: 'assets/marker-icon-2x.png',
    shadowUrl: 'assets/marker-shadow.png'
  }) );

  readonly center = signal<LatLng>( new LatLng(45.166672, 5.71667) );
  readonly zoom = signal<number>(11);

  readonly places = signal< LatLngLiteral[]>([
    { lat: 45.193866812447716, lng: 5.768449902534485 }, // UFR IM2AG
    { lat: 45.197866812447716, lng: 5.768449902534485 }, // UFR IM2AG
  ]);
  readonly map = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' });
  readonly sigPlaces = computed(()=> this.places().map( ({lat, lng}) => marker([lat, lng], {icon: this.defaultIcon()}) ));
  readonly _sigRoutes = signal<Polyline[]>([]/*()=> [new Polyline(this.places() as LatLng[], {color: '#0d9148'} as PolylineOptions)]*/);
  readonly sigRoutes = computed(()=> this._sigRoutes());
  readonly layers: Signal<Layer[]> = computed(() => (
    [
      this.map ,
      ...this.sigPlaces(),
      ...this.sigRoutes(),
    ]
  ));
  // polyline
  // circle / zone
  // isocrone c'est pour voir à partir de coordonnées , combien de temps on met avec un vélo , a pied , transport


  // le track by il assure que quand le css il va appliquer une transition à un fragement HTml ,
  // si le fragement il est fraichement crée -> pas d'état précédent -> il applique pas la transition

  constructor(private service: OpenRouteService){

  }

  addMarker(point : LeafletMouseEvent){
    this.places.update((places) => [...places,point.latlng]);
  }

  removeButton(point: LatLngLiteral){
    this.places.update((points) => points.filter((pnt) => pnt !== point));
  }

  /*async addRoute(){
    const newLayerEncoded = await firstValueFrom(this.service.getRoute(this.places()));
     const poly = require("@mapbox/polyline");
    const layer = poly.decode(newLayerEncoded.routes[0].geometry);
    console.log
    this.sigRoutes.update( (routes) => [...routes,newLayer]);
  }*/
  /**
   * Utilisée pour décoder la ligne geometry renvoyé par l"API OpenRoutes
   * @param polylineString
   * @return Tableau de coord GPS
   */
  decodePolyline(polylineString: string): LatLngLiteral[] {
  let index = 0;
  const len = polylineString.length;
  let lat = 0;
  let lng = 0;
  const coordinates = [];

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;

    do {
      b = polylineString.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = polylineString.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return coordinates;
}

  /**
   * Ajoute l'itinéraire entre les 2 premiers points de places à la map
   */
  async addRoute(){
    const newLayerEncoded = await firstValueFrom(this.service.getRoute(this.places()));
    const layer = newLayerEncoded.routes.map((val)=>this.decodePolyline(val.geometry));
    const route = polyline(layer, { color: '#0d9148' });
    console.log(route)
    this._sigRoutes.update( (routes) => [...routes,route]);
  }

}


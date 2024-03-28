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
  readonly sigRoutes = computed<Polyline[]>(()=> [new Polyline(this.places() as LatLng[], {color: '#0d9148'} as PolylineOptions)]);
  
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

  allerVoirEmbrun(): void {
    this.center.set(new LatLng(44.566672, 6.5));
    this.zoom.set(13);
  }

  allerVoirParis(): void {
    this.center.set(new LatLng(48.856613, 2.352222));
    this.zoom.set(12);
  }

  allerVoirUFR(): void {
    this.center.set(new LatLng(45.19379120519956, 5.768213868141175));
    this.zoom.set(18);
  }

  removeButton(point: LatLngLiteral){
    this.places.update((points) => points.filter((pnt) => pnt !== point));
  }

  async addRoute(){
    const newLayerEncoded = await firstValueFrom(this.service.getRoute(this.places()));
    // const poly = require("@mapbox/polyline");
    // const layer = poly.decode(newLayerEncoded.routes[0].geometry);
    // console.log
    // this.sigRoutes.update( (routes) => [...routes,newLayer]);
  }

}


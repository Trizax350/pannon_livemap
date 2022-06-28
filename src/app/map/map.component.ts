import { Component, AfterViewInit, OnInit } from '@angular/core';
import { MapService } from '../services/map.service';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { formatDate } from '@angular/common';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit, OnInit {
  map: any;
  marker: any;
  timer = 1000;
  model: Array<any> = [];
  maplayer = L.layerGroup();
  markers = L.layerGroup();
  zones = L.layerGroup();

  lastUpdateTimeGlobal: any;
  updateMapVal = 0;

  constructor(private http: HttpClient, private MapService: MapService) { }

  ngOnInit(): void {
    L.Icon.Default.imagePath = "../../assets/img/";
    this.getAllTags();
    setInterval(() => this.createMarkers(this.map), this.timer);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  createMarkers(map: L.Map): void {
    var icon = new L.Icon.Default();
    icon.options.shadowSize = [0,0];
    
    this.MapService.getAllTags().subscribe(data => {
      this.model = data;
      for(const c of data){
        const Tag_ID = c.Position.Tag_ID;
        const x = c.Position.Pos_x;
        const y = c.Position.Pos_y;
        const z = c.Position.Pos_z;
        const Pos_Time = formatDate(c.Position.Time, 'yyyy/MM/dd H:m:ss', 'en');
        const Temp = c.Data.Temp;
        const Noise = c.Data.Noise;
        const Vib = c.Data.Vib;
        const Steam = c.Data.Steam;
        const Data_Time = formatDate(c.Data.Time, 'yyyy/MM/dd H:m:ss', 'en');
        const Act_product = c.Machines.Act_product;
        const Andon = c.Machines.Andon;
        const Cycle_time = c.Machines.Cycle_time;
        const Produced = c.Machines.Produced;
        const Status = c.Machines.Status;
        const Machine_Time = formatDate(c.Machines.Time, 'yyyy/MM/dd H:m:ss', 'en');

        if(((this.lastUpdateTimeGlobal < Pos_Time) || 
        (this.lastUpdateTimeGlobal < Data_Time) || 
        (this.lastUpdateTimeGlobal < Machine_Time) || 
        (this.lastUpdateTimeGlobal === undefined))){
          if((Pos_Time > Data_Time) && (Pos_Time > Machine_Time)){
            this.lastUpdateTimeGlobal = Pos_Time;
          } else if((Data_Time > Pos_Time) && (Data_Time > Machine_Time)){
            this.lastUpdateTimeGlobal = Data_Time;
          } else if((Machine_Time > Pos_Time) && (Machine_Time > Data_Time)){
            this.lastUpdateTimeGlobal = Machine_Time;
          }

          this.updateMapVal = 1;
        }

        if(this.updateMapVal == 1){
          this.markers.clearLayers();
          this.updateMapVal = 0;
        }
        
        this.marker = L.marker([x, y], {icon : icon}).addTo(this.markers).bindPopup(
          "Tag ID: <b>"+Tag_ID+"</b>, X/Y/Z: <b>"+x+" / "+y+" / "+z+"</b>"+
          "<br>Updated: <b>"+Pos_Time+"</b>"+
          "<br><br>Temp: <b>"+Temp+"°C</b>, "+"Noise: <b>"+Noise+"</b>, "+"Vib: <b>"+Vib+"</b>, "+"Steam: <b>"+Steam+"</b>"+
          "<br>Updated: <b>"+Data_Time+"</b>"+
          "<br><br>Act product: <b>"+Act_product+"</b>, "+"Andon: <b>"+Andon+"</b>, "+"Cycle time: <b>"+Cycle_time+"</b>"+"<br>Produced: <b>"+Produced+"</b>, "+"Status: <b>"+Status+"</b>"+
          "<br>Updated: <b>"+Machine_Time+"</b>"
        );
      }
    });
  }

  getAllTags(){
    this.MapService.getAllTags().subscribe(data => {
      this.model = data;
      //console.log(data);
    });
  }

  private initMap(): void {
    var baseLayer = {};
    
    var checkLayers = {
      "Map": this.maplayer,
      "Markers": this.markers,
      "Zones": this.zones,
    };

    this.map = L.map('map').setView([0, 0], 2);
    this.map.invalidateSize(); 
    this.markers.addTo(this.map);
    this.zones.addTo(this.map);

    const tiles = L.tileLayer('../assets/img/{z}/{x}/{y}.png', {
      minZoom: 2,
      maxZoom: 3,
      noWrap: true
    })

    this.maplayer.addLayer(tiles.addTo(this.map)).addTo(this.map);

    L.control.layers(baseLayer, checkLayers).addTo(this.map);

    //Zones
    var latLng = L.latLng(12, 47);
    var currentPoint = this.map.latLngToContainerPoint(latLng);
    var width = 90;
    var height = 550;
    var xDifference = width / 2;
    var yDifference = height / 2;
    var southWest = L.point((currentPoint.x - xDifference), (currentPoint.y - yDifference));
    var northEast = L.point((currentPoint.x + xDifference), (currentPoint.y + yDifference));
    var bounds = L.latLngBounds(this.map.containerPointToLatLng(southWest),this.map.containerPointToLatLng(northEast));
    this.zones.addLayer(L.rectangle(bounds, {color: "grey", weight: 2}).addTo(this.map).bindPopup("Folyosó"));

    var latLng = L.latLng(65, -40);
    var currentPoint = this.map.latLngToContainerPoint(latLng);
    var width = 58;
    var height = 58;
    var xDifference = width / 2;
    var yDifference = height / 2;
    var southWest = L.point((currentPoint.x - xDifference), (currentPoint.y - yDifference));
    var northEast = L.point((currentPoint.x + xDifference), (currentPoint.y + yDifference));
    var bounds = L.latLngBounds(this.map.containerPointToLatLng(southWest),this.map.containerPointToLatLng(northEast));
    this.zones.addLayer(L.rectangle(bounds, {color: "grey", weight: 2}).addTo(this.map).bindPopup("1. állomás"));

    var latLng = L.latLng(-30, -18);
    var currentPoint = this.map.latLngToContainerPoint(latLng);
    var width = 95;
    var height = 120;
    var xDifference = width / 2;
    var yDifference = height / 2;
    var southWest = L.point((currentPoint.x - xDifference), (currentPoint.y - yDifference));
    var northEast = L.point((currentPoint.x + xDifference), (currentPoint.y + yDifference));
    var bounds = L.latLngBounds(this.map.containerPointToLatLng(southWest),this.map.containerPointToLatLng(northEast));
    this.zones.addLayer(L.rectangle(bounds, {color: "grey", weight: 2}).addTo(this.map).bindPopup("2. állomás"));

    var latLng = L.latLng(-30, -58);
    var currentPoint = this.map.latLngToContainerPoint(latLng);
    var width = 70;
    var height = 90;
    var xDifference = width / 2;
    var yDifference = height / 2;
    var southWest = L.point((currentPoint.x - xDifference), (currentPoint.y - yDifference));
    var northEast = L.point((currentPoint.x + xDifference), (currentPoint.y + yDifference));
    var bounds = L.latLngBounds(this.map.containerPointToLatLng(southWest),this.map.containerPointToLatLng(northEast));
    this.zones.addLayer(L.rectangle(bounds, {color: "grey", weight: 2}).addTo(this.map).bindPopup("3. állomás"));

    var latLng = L.latLng(13, -68);
    var currentPoint = this.map.latLngToContainerPoint(latLng);
    var width = 55;
    var height = 58;
    var xDifference = width / 2;
    var yDifference = height / 2;
    var southWest = L.point((currentPoint.x - xDifference), (currentPoint.y - yDifference));
    var northEast = L.point((currentPoint.x + xDifference), (currentPoint.y + yDifference));
    var bounds = L.latLngBounds(this.map.containerPointToLatLng(southWest),this.map.containerPointToLatLng(northEast));
    this.zones.addLayer(L.rectangle(bounds, {color: "grey", weight: 2}).addTo(this.map).bindPopup("4. állomás"));

    var latLng = L.latLng(47, -32.5);
    var currentPoint = this.map.latLngToContainerPoint(latLng);
    var width = 100;
    var height = 48;
    var xDifference = width / 2;
    var yDifference = height / 2;
    var southWest = L.point((currentPoint.x - xDifference), (currentPoint.y - yDifference));
    var northEast = L.point((currentPoint.x + xDifference), (currentPoint.y + yDifference));
    var bounds = L.latLngBounds(this.map.containerPointToLatLng(southWest),this.map.containerPointToLatLng(northEast));
    this.zones.addLayer(L.rectangle(bounds, {color: "grey", weight: 2}).addTo(this.map).bindPopup("5. állomás"));
  }
}
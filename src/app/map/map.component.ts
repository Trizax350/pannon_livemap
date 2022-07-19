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
  zonelayer = L.layerGroup();
  zones: Array<any> = [];

  lastUpdateTimeGlobal: any;

  constructor(private http: HttpClient, private MapService: MapService) { }

  ngOnInit(): void {
    L.Icon.Default.imagePath = "../../assets/img/";
    this.getAllTagsPonton();
    this.getZonesPonton();
    setInterval(() => this.createMarkers(this.map), this.timer);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  createMarkers(map: L.Map): void {
    var icon = new L.Icon.Default();
    icon.options.shadowSize = [0,0];
    
    const roundTo = function(num: number, places: number) {
      const factor = 10 ** places;
      return Math.round(num * factor) / factor;
    };

    this.MapService.getAllTagsPonton().subscribe(data => {
      this.model = data;
      for(const c of data){
        const Pos_Time = formatDate(c.Tag_loc_processed.ts, 'yyyy/MM/dd H:m:ss', 'en');

        if((this.lastUpdateTimeGlobal < Pos_Time) || 
        (this.lastUpdateTimeGlobal === undefined)){
          this.lastUpdateTimeGlobal = Pos_Time;
          this.markers.clearLayers();
          console.log("Updated: "+ this.lastUpdateTimeGlobal);
        }
      }

      for(const c of data){
        const Tag_ID = c.Tag_loc_processed.tag_id;
        const geom = c.geom;
        var coordinates = geom.replace('POINT Z (','');
        var coordinates = coordinates.replace(')','');

        var splitted = coordinates.split(" ");

        const x = -splitted[0];
        const y = splitted[1];
        const z = splitted[2];
        
        const Pos_Time = formatDate(c.Tag_loc_processed.ts, 'yyyy/MM/dd H:m:ss', 'en');

        this.marker = L.marker([x, y], {icon : icon}).addTo(this.markers).bindPopup(
          "Tag ID: <b>"+Tag_ID+"</b>, X/Y/Z: <b>"+roundTo(x, 2)+" / "+roundTo(y, 2)+" / "+z+"</b>"+
          "<br>Updated: <b>"+Pos_Time+"</b>"
        );
      }
    });
  }

  getAllTagsPonton(){
    this.MapService.getAllTagsPonton().subscribe(data => {
      this.model = data;
      console.log(data);
    });
  }

  getZonesPonton(){
    this.MapService.getZonesPonton().subscribe(data => {
      this.zones = data;
      console.log(data);
    });
  }

  private initMap(): void {
    var baseLayer = {};
    
    var checkLayers = {
      "Map": this.maplayer,
      "Markers": this.markers,
      "Zones": this.zonelayer,
    };

    this.map = L.map('map').setView([0, 0], 2);
    this.map.invalidateSize(); 
    this.markers.addTo(this.map);
    this.zonelayer.addTo(this.map);

    const tiles = L.tileLayer('../assets/img/{z}/{x}/{y}.png', {
      minZoom: 0, 
      maxZoom: 5,
      noWrap: true
    })

    this.maplayer.addLayer(tiles.addTo(this.map)).addTo(this.map);

    L.control.layers(baseLayer, checkLayers).addTo(this.map);

    //Zones
    this.MapService.getZonesPonton().subscribe(data => {
      this.model = data;
      for(const c of data){
        const Title = c.title;
        const Shape = c.shape;

        var latlngs: [number, number][] = [
          [-Shape[0].x, Shape[0].y],
          [-Shape[1].x, Shape[1].y],
          [-Shape[2].x, Shape[2].y],
          [-Shape[3].x, Shape[3].y]]
        this.zonelayer.addLayer(L.polygon(latlngs, {color: "grey"}).addTo(this.map).bindTooltip(Title));
      }
    });
  }
}
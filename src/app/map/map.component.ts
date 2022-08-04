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
  zoneTimer = 10000;
  model: Array<any> = [];
  maplayer = L.layerGroup();
  markers = L.layerGroup();
  zonelayer = L.layerGroup();
  zones: Array<any> = [];
  colorz: Array<any> = [];
  machines: Array<any> = [];

  lastUpdateTimeGlobal: Date = new Date('2010.01.01');

  constructor(private http: HttpClient, private MapService: MapService) { }

  ngOnInit(): void {
    L.Icon.Default.imagePath = "../../assets/img/";
    this.getAllTagsPonton();
    this.getZonesPonton();
    setInterval(() => this.createMarkers(this.map), this.timer);
    setInterval(() => this.createZones(), this.zoneTimer);
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.createZones();
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
        const Pos_Time_Date = new Date(Pos_Time);
        
        if((this.lastUpdateTimeGlobal < Pos_Time_Date) || 
        (this.lastUpdateTimeGlobal === undefined)){
          this.lastUpdateTimeGlobal = Pos_Time_Date;
          this.markers.clearLayers();
          console.log("TagPos updated: "+ this.lastUpdateTimeGlobal);
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
      
        this.MapService.getTagDataByID(Tag_ID).subscribe(tagdata => {
          this.model = tagdata;

          const TagDataString = JSON.stringify(tagdata);
          const TagDataObj = JSON.parse(TagDataString);
    
          if(TagDataObj?.Time != undefined){
            const Data_Time = formatDate(TagDataObj.Time, 'yyyy/MM/dd H:m:ss', 'en');
            const Data_Time_Date = new Date(Data_Time);
            
            if(this.lastUpdateTimeGlobal < Data_Time_Date){
              this.lastUpdateTimeGlobal = Data_Time_Date;
              this.markers.clearLayers();
              console.log("TagData updated: "+ this.lastUpdateTimeGlobal);
            }

            const Vib = TagDataObj.Vib;
            const Temp = TagDataObj.Temp;
            const Steam = TagDataObj.Steam;
            const Noise = TagDataObj.Noise;
            const Data_Time_Text = formatDate(TagDataObj.Time, 'yyyy/MM/dd H:m:ss', 'en');

            const popupText = "Tag ID: <b>"+Tag_ID+"</b>, X/Y/Z: <b>"+roundTo(x, 2)+" / "+roundTo(y, 2)+" / "+z+"</b>"+
            "<br>Pos updated: <b>"+Pos_Time+"</b><br><br>Vib: <b>"+Vib+"</b> Temp: <b>"+Temp+"</b> Steam: <b>"+Steam+"</b> Noise: <b>"+Noise+
            "</b><br> Sensor updated: <b>"+Data_Time_Text+"</b>"

            this.marker = L.marker([x, y], {icon : icon}).addTo(this.markers).bindPopup(popupText);
          } else {
            const popupText = "Tag ID: <b>"+Tag_ID+"</b>, X/Y/Z: <b>"+roundTo(x, 2)+" / "+roundTo(y, 2)+" / "+z+"</b>"+
            "<br>Pos updated: <b>"+Pos_Time+"</b><br><br>No sensor data"

            this.marker = L.marker([x, y], {icon : icon}).addTo(this.markers).bindPopup(popupText);
          }
        });
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
  }

  createZones(): void{
    this.MapService.getZonesPonton().subscribe(data => {
      this.model = data;
      for(const c of data){
        const ID = c.id;
        const Title = c.title;
        const Shape = c.shape;

        let colorval = "grey";
        this.MapService.getZoneColorByID(ID).subscribe(data => {
          this.colorz = data;

          const colorzString = JSON.stringify(this.colorz);
          const colorzObj = JSON.parse(colorzString);

          if(colorzObj?.Machine_ID != undefined){
            this.MapService.getMachineByID(colorzObj.Machine_ID).subscribe(data => {
              this.machines = data;
  
              const machineString = JSON.stringify(this.machines);
              const machineObj = JSON.parse(machineString);
              
              if(colorzObj.Type == "Greater"){
                if(colorzObj.Machine_param == "Cycle_time"){
                  if(colorzObj.Machine_value < machineObj.Cycle_time){
                    colorval = colorzObj.Color;
                  }
                } else if(colorzObj.Machine_param == "Produced"){
                  if(colorzObj.Machine_value < machineObj.Produced){
                    colorval = colorzObj.Color;
                  }
                } else if(colorzObj.Machine_param == "Act_product"){
                  if(colorzObj.Machine_value < machineObj.Act_product){
                    colorval = colorzObj.Color;
                  }
                } else if(colorzObj.Machine_param == "Status"){
                  if(colorzObj.Machine_value < machineObj.Status){
                    colorval = colorzObj.Color;
                  }
                } else if(colorzObj.Machine_param == "Andon"){
                  if(colorzObj.Machine_value < machineObj.Andon){
                    colorval = colorzObj.Color;
                  }
                }
              } else if(colorzObj.Type == "Less"){
                if(colorzObj.Machine_param == "Cycle_time"){
                  if(colorzObj.Machine_value > machineObj.Cycle_time){
                    colorval = colorzObj.Color;
                  }
                } else if(colorzObj.Machine_param == "Produced"){
                  if(colorzObj.Machine_value > machineObj.Produced){
                    colorval = colorzObj.Color;
                  }
                } else if(colorzObj.Machine_param == "Act_product"){
                  if(colorzObj.Machine_value > machineObj.Act_product){
                    colorval = colorzObj.Color;
                  }
                } else if(colorzObj.Machine_param == "Status"){
                  if(colorzObj.Machine_value > machineObj.Status){
                    colorval = colorzObj.Color;
                  }
                } else if(colorzObj.Machine_param == "Andon"){
                  if(colorzObj.Machine_value > machineObj.Andon){
                    colorval = colorzObj.Color;
                  }
                }
              } else {
                if(colorzObj.Machine_param == "Cycle_time"){
                  if(colorzObj.Machine_value == machineObj.Cycle_time){
                    colorval = colorzObj.Color;
                  }
                } else if(colorzObj.Machine_param == "Produced"){
                  if(colorzObj.Machine_value == machineObj.Produced){
                    colorval = colorzObj.Color;
                  }
                } else if(colorzObj.Machine_param == "Act_product"){
                  if(colorzObj.Machine_value == machineObj.Act_product){
                    colorval = colorzObj.Color;
                  }
                } else if(colorzObj.Machine_param == "Status"){
                  if(colorzObj.Machine_value == machineObj.Status){
                    colorval = colorzObj.Color;
                  }
                } else if(colorzObj.Machine_param == "Andon"){
                  if(colorzObj.Machine_value == machineObj.Andon){
                    colorval = colorzObj.Color;
                  }
                }
              }

              var latlngs: [number, number][] = [
                [-Shape[0].x, Shape[0].y],
                [-Shape[1].x, Shape[1].y],
                [-Shape[2].x, Shape[2].y],
                [-Shape[3].x, Shape[3].y]]
              this.zonelayer.addLayer(L.polygon(latlngs, {
                fillColor: "transparent",
                weight: 2,
                opacity: 1,
                color: colorval,
                fillOpacity: 1
              }).addTo(this.map).bindTooltip(Title));
            });
          }
        });

        var latlngs: [number, number][] = [
          [-Shape[0].x, Shape[0].y],
          [-Shape[1].x, Shape[1].y],
          [-Shape[2].x, Shape[2].y],
          [-Shape[3].x, Shape[3].y]]
        this.zonelayer.addLayer(L.polygon(latlngs, {
          fillColor: "transparent",
          weight: 2,
          opacity: 1,
          color: colorval,
          fillOpacity: 1
        }).addTo(this.map).bindTooltip(Title));
      }
    });
  }
}
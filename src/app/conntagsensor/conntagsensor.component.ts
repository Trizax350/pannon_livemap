import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ConnTagSensorService } from '../services/conn-tag-sensor.service';
import { conntagsensor } from './conntagsensor.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditconntagsensordialogComponent } from '../editconntagsensordialog/editconntagsensordialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-conntagsensor',
  templateUrl: './conntagsensor.component.html',
  styleUrls: ['./conntagsensor.component.scss']
})

export class ConntagsensorComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'Tag_ID', 'Sensor', 'Edit', 'Delete'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public popoverTitle: string = '<b><u>Jóváhagyás szükséges</u></b>';
  public popoverMessage: string = '<b><u>Biztosan elvégzed a műveletet?</u><b>';
  public confirmClicked: boolean = true;
  public cancelClicked: boolean = true;
  public cancelText: string = "<b>Nem</b>";
  public placement: string ="right";
  public confirmText: string ="<b>Igen</b>";
  public appendToBody: boolean = false;

  model: Array<conntagsensor> = [];
  constructor(private http: HttpClient, private ConnTagSensorService: ConnTagSensorService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getConnTagSensor();
  }

  openDialog() {
    this.dialog.open(EditconntagsensordialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getConnTagSensor();
      }
    })
  }

  editConnTagSensorItem(row: any){
    this.dialog.open(EditconntagsensordialogComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getConnTagSensor();
      }
    })
  }

  getConnTagSensor(){
    this.ConnTagSensorService.getConntagsensor().subscribe({
        next:(data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{
        alert("Hiba lépett fel az adatok lekérdezése közben.");
      }
    })
  }

  deleteConnTagSensorItem(conntagsensor: conntagsensor){
    this.ConnTagSensorService.deleteConntagsensorItem(conntagsensor.ID).subscribe({
      next:() => {
        this.ngOnInit();
        alert("Törlés sikeres.");
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
}

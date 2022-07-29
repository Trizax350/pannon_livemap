import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ColorService } from '../services/color.service';
import { color } from './color.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditcoloroptionsdialogComponent } from '../editcolordialog/editcolordialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-coloroptions',
  templateUrl: './coloroptions.component.html',
  styleUrls: ['./coloroptions.component.scss']
})

export class ColorComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'Machine_ID', 'Zone_ID', 'Machine_param', 'Machine_value', 'Type', 'Color', 'Status', 'Edit', 'Delete'];
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

  model: Array<color> = [];
  constructor(private http: HttpClient, private ColorService: ColorService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getColor();
  }

  openDialog() {
    this.dialog.open(EditcoloroptionsdialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getColor();
      }
    })
  }

  editColorItem(row: any){
    this.dialog.open(EditcoloroptionsdialogComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getColor();
      }
    })
  }

  getColor(){
    this.ColorService.getColorOptions().subscribe({
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

  deleteColorItem(color: color){
    this.ColorService.deleteColorOption(color.ID).subscribe({
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
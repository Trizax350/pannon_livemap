import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MachineService } from '../services/machine.service';
import { machine } from './machine.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditmachinedialogComponent } from '../editmachinedialog/editmachinedialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.scss']
})

export class MachineComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'Tag_ID', 'Cycle_time', 'Produced', 'Act_product', 'Status', 'Andon', 'Time', 'Edit', 'Delete'];
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

  model: Array<machine> = [];
  constructor(private http: HttpClient, private MachineService: MachineService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getMachine();
  }

  openDialog() {
    this.dialog.open(EditmachinedialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getMachine();
      }
    })
  }

  editMachineItem(row: any){
    this.dialog.open(EditmachinedialogComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getMachine();
      }
    })
  }

  getMachine(){
    this.MachineService.getMachine().subscribe({
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

  deleteMachineItem(machine: machine){
    this.MachineService.deleteMachineItem(machine.ID).subscribe({
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

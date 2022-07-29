import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AssetService } from '../services/asset.service';
import { asset } from './asset.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-asset-track',
  templateUrl: './asset-track.component.html',
  styleUrls: ['./asset-track.component.scss']
})

export class AssetComponent implements OnInit {
  displayedColumns: string[] = ['id', 'asset', 'tag_id', 'zone', 'entered_at'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  model: Array<asset> = [];
  constructor(private http: HttpClient, private AssetService: AssetService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAssets();
  }

  getAssets(){
    this.AssetService.getAssets().subscribe({
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

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
}


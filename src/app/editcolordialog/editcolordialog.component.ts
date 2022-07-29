import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ColorService } from '../services/color.service';
import { MachineService } from '../services/machine.service';
import { MapService } from '../services/map.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl} from '@angular/forms';

interface StatusValues {
  value: string;
  viewValue: string;
}

interface ColorValues {
  value: string;
  viewValue: string;
}

interface TypeValues {
  value: string;
  viewValue: string;
}

interface MachineParam {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-editcolordialog',
  templateUrl: './editcolordialog.component.html',
  styleUrls: ['./editcolordialog.component.scss']
})

export class EditcoloroptionsdialogComponent implements OnInit {
  colorForm !: FormGroup;
  actionBtn: string = "Mentés";
  MachineList: any;
  ZoneList: any;

  constructor(
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public editData: any, 
    private ColorService: ColorService, 
    private MachineService: MachineService, 
    private MapService: MapService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditcoloroptionsdialogComponent>
  ) { }

  StatusValues: StatusValues[] = [
    {value: 'ACTIVE', viewValue: 'Aktív'},
    {value: 'INACTIVE', viewValue: 'Inaktív'},
  ];

  ColorValues: ColorValues[] = [
    {value: 'white', viewValue: 'Fehér'},
    {value: 'yellow', viewValue: 'Sárga'},
    {value: 'orange', viewValue: 'Narancssárga'},
    {value: 'red', viewValue: 'Piros'},
    {value: 'lightgreen', viewValue: 'Világoszöld'},
    {value: 'green', viewValue: 'Zöld'},
    {value: 'lightblue', viewValue: 'Világoskék'},
    {value: 'blue', viewValue: 'Kék'},
    {value: 'pink', viewValue: 'Rózsaszín'},
    {value: 'cyan', viewValue: 'Ciánkék'},
    {value: 'purple', viewValue: 'Lila'},
    {value: 'lightgrey', viewValue: 'Világosszürke'},
    {value: 'brown', viewValue: 'Barna'},
    {value: 'grey', viewValue: 'Szürke'},
    {value: 'black', viewValue: 'Fekete'},
  ];

  TypeValues: TypeValues[] = [
    {value: 'Less', viewValue: 'Kisebb'},
    {value: 'Equal', viewValue: 'Egyenlő'},
    {value: 'Greater', viewValue: 'Nagyobb'},
  ];

  MachineParam: MachineParam[] = [
    {value: 'Cycle_time', viewValue: 'Cycle time'},
    {value: 'Produced', viewValue: 'Produced'},
    {value: 'Act_product', viewValue: 'Act product'},
    {value: 'Status', viewValue: 'Status'},
    {value: 'Andon', viewValue: 'Andon'},
  ];

  ngOnInit(): void {
    this.MachineService.getMachine().subscribe((data: any) => {
      this.MachineList = data;
    })

    this.MapService.getZonesPonton().subscribe((data: any) => {
      this.ZoneList = data;
    })

    this.colorForm = this.formBuilder.group({
        Machine_ID: ['',Validators.required],
        Zone_ID: ['',Validators.required],
        Machine_param: ['',Validators.required],
        Machine_value: ['',Validators.required],
        Type: ['',Validators.required],
        Color: ['',Validators.required],
        Status: ['',Validators.required]
    })

    if(this.editData){
        this.actionBtn = "Frissítés";
        this.colorForm.controls['Machine_ID'].setValue(this.editData.Machine_ID);
        this.colorForm.controls['Zone_ID'].setValue(this.editData.Zone_ID);
        this.colorForm.controls['Machine_param'].setValue(this.editData.Machine_param);
        this.colorForm.controls['Machine_value'].setValue(this.editData.Machine_value);
        this.colorForm.controls['Type'].setValue(this.editData.Type);
        this.colorForm.controls['Color'].setValue(this.editData.Color);
        this.colorForm.controls['Status'].setValue(this.editData.Status);
    }
  }

  addColorItem(){
    if(!this.editData){
      if(this.colorForm.valid){
        this.ColorService.postColorOption(this.colorForm.value).subscribe({
          next:() => {
            alert("Adatok hozzáadva.");
            this.colorForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{
            alert(err.error.detail);
          }
        })
      }
    } else {
      this.updateColorItem()
    }
  }

  updateColorItem(){
    this.ColorService.putColorOption(this.colorForm.value, this.editData.ID).subscribe({
      next:()=>{
        alert('Adatok frissítve.');
        this.colorForm.reset();
        this.dialogRef.close('update');
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }
}
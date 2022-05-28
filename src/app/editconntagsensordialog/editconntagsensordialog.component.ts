import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MachineService } from '../services/machine.service';
import { ConnTagSensorService } from '../services/conn-tag-sensor.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl} from '@angular/forms';

@Component({
  selector: 'app-editconntagsensordialog',
  templateUrl: './editconntagsensordialog.component.html',
  styleUrls: ['./editconntagsensordialog.component.scss']
})

export class EditconntagsensordialogComponent implements OnInit {
  connTagSensorForm !: FormGroup;
  actionBtn: string = "Mentés";
  TagList: any;
  constructor(
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public editData: any, 
    private MachineService: MachineService, 
    private ConnTagSensorService: ConnTagSensorService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditconntagsensordialogComponent>
  ) { }

  ngOnInit(): void {
    this.MachineService.getAllTagID().subscribe((data: any) => {
      this.TagList = data;
    })

    this.connTagSensorForm = this.formBuilder.group({
        Tag_ID: ['',Validators.required],
        Sensor: ['',Validators.required]
    })

    if(this.editData){
        this.actionBtn = "Frissítés";
        this.connTagSensorForm.controls['Tag_ID'].setValue(this.editData.Tag_ID);
        this.connTagSensorForm.controls['Sensor'].setValue(this.editData.Sensor);
    }
  }

  addConnTagSensorItem(){
    if(!this.editData){
      if(this.connTagSensorForm.valid){
        this.ConnTagSensorService.postConntagsensor(this.connTagSensorForm.value).subscribe({
          next:() => {
            alert("Adatok hozzáadva.");
            this.connTagSensorForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{
            alert(err.error.detail);
          }
        })
      }
    } else {
      this.updateConnTagSensorItem()
    }
  }

  updateConnTagSensorItem(){
    this.ConnTagSensorService.putConntagsensor(this.connTagSensorForm.value, this.editData.ID).subscribe({
      next:()=>{
        alert('Adatok frissítve.');
        this.connTagSensorForm.reset();
        this.dialogRef.close('update');
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MachineService } from '../services/machine.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl} from '@angular/forms';

@Component({
  selector: 'app-editmachinedialog',
  templateUrl: './editmachinedialog.component.html',
  styleUrls: ['./editmachinedialog.component.scss']
})

export class EditmachinedialogComponent implements OnInit {
  machineForm !: FormGroup;
  actionBtn: string = "Mentés";
  TagList: any;
  constructor(
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public editData: any, 
    private MachineService: MachineService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditmachinedialogComponent>
  ) { }

  ngOnInit(): void {
    this.MachineService.getAllTagIDPonton().subscribe((data: any) => {
      this.TagList = data;
    })

    this.machineForm = this.formBuilder.group({
        Tag_ID: ['',Validators.required],
        Cycle_time: ['',Validators.required],
        Produced: ['',Validators.required],
        Act_product: ['',Validators.required],
        Status: ['',Validators.required],
        Andon: ['',Validators.required],
        Reader_ID: [''],
    })

    if(this.editData){
        this.actionBtn = "Frissítés";
        this.machineForm.controls['Tag_ID'].setValue(this.editData.Tag_ID);
        this.machineForm.controls['Cycle_time'].setValue(this.editData.Cycle_time);
        this.machineForm.controls['Produced'].setValue(this.editData.Produced);
        this.machineForm.controls['Act_product'].setValue(this.editData.Act_product);
        this.machineForm.controls['Status'].setValue(this.editData.Status);
        this.machineForm.controls['Andon'].setValue(this.editData.Andon);
        this.machineForm.controls['Reader_ID'].setValue(this.editData.Reader_ID);
    }
  }

  addMachineItem(){
    if(!this.editData){
      if(this.machineForm.valid){
        this.MachineService.postMachine(this.machineForm.value).subscribe({
          next:() => {
            alert("Adatok hozzáadva.");
            this.machineForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{
            alert(err.error.detail);
          }
        })
      }
    } else {
      this.updateMachineItem()
    }
  }

  updateMachineItem(){
    this.MachineService.putMachine(this.machineForm.value, this.editData.ID).subscribe({
      next:()=>{
        alert('Adatok frissítve.');
        this.machineForm.reset();
        this.dialogRef.close('update');
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }
}

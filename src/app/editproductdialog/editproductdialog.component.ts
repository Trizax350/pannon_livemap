import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl} from '@angular/forms';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-editproductdialog',
  templateUrl: './editproductdialog.component.html',
  styleUrls: ['./editproductdialog.component.scss']
})
export class EditproductdialogComponent implements OnInit {
  productForm !: FormGroup;
  actionBtn: string = "Mentés";
  TagList: any;
  constructor(
    private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public editData: any, 
    private ProductService: ProductService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditproductdialogComponent>
  ) { }

  ngOnInit(): void {
    this.ProductService.getAllTagIDPonton().subscribe((data: any) => {
      this.TagList = data;
    })

    this.productForm = this.formBuilder.group({
        Tag_ID: ['',Validators.required],
        RFID_ID: ['',Validators.required],
        Product_name: ['',Validators.required],
        Product_type: ['',Validators.required],
        Delivery_time: ['',Validators.required],
        Produced_time: ['',Validators.required],
        Asset: ['',Validators.required],
    })

    if(this.editData){
        this.actionBtn = "Frissítés";
        this.productForm.controls['Tag_ID'].setValue(this.editData.Tag_ID);
        this.productForm.controls['RFID_ID'].setValue(this.editData.RFID_ID);
        this.productForm.controls['Product_name'].setValue(this.editData.Product_name);
        this.productForm.controls['Product_type'].setValue(this.editData.Product_type);
        this.productForm.controls['Delivery_time'].setValue(this.editData.Delivery_time);
        this.productForm.controls['Produced_time'].setValue(this.editData.Produced_time);
        this.productForm.controls['Asset'].setValue(this.editData.Asset);
    }
  }

  changeDatePickerAll(): any {
    this.productForm.value.Delivery_time = moment(this.productForm.value.Delivery_time).format('YYYY-MM-DD');
    this.productForm.value.Produced_time = moment(this.productForm.value.Produced_time).format('YYYY-MM-DD');
  }

  addProductItem(){
    if(!this.editData){
      if(this.productForm.valid){
        this.ProductService.postProduct(this.productForm.value).subscribe({
          next:() => {
            alert("Adatok hozzáadva.");
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:(err)=>{
            alert(err.error.detail);
          }
        })
      }
    } else {
      this.updateProductItem()
    }
  }

  updateProductItem(){
    this.ProductService.putProduct(this.productForm.value, this.editData.ID).subscribe({
      next:()=>{
        alert('Adatok frissítve.');
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:(err)=>{
        alert(err.error.detail);
      }
    })
  }
}
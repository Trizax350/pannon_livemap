import { InjectionToken, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { EditmachinedialogComponent } from './editmachinedialog/editmachinedialog.component';
import { EditconntagsensordialogComponent } from './editconntagsensordialog/editconntagsensordialog.component';
import { MachineComponent } from './machine/machine.component';
import { ConntagsensorComponent } from './conntagsensor/conntagsensor.component';

import { MapService } from './services/map.service';
import { ConnTagSensorService } from './services/conn-tag-sensor.service';
import { MachineService } from './services/machine.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    MapComponent,
    EditmachinedialogComponent,
    EditconntagsensordialogComponent,
    MachineComponent,
    ConntagsensorComponent
  ],
  entryComponents: [
    EditconntagsensordialogComponent,
    EditmachinedialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    }),
    HttpClientModule
  ],
  providers: [
    MapService,
    ConnTagSensorService,
    MachineService,

    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    { provide: API_BASE_URL, useValue: environment.apiRoot },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

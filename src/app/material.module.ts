import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule
} from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    FlexLayoutModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    FlexLayoutModule
  ],
  declarations: []
})
export class MaterialModule { }

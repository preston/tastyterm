import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatSelectModule,
  MatCardModule,
  MatInputModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatTableModule,
  MatListModule,
  MatSlideToggleModule
} from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTableModule,
    MatListModule,
    MatSlideToggleModule
  ],
  exports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTableModule,
    MatListModule,
    MatSlideToggleModule
  ],
  declarations: []
})
export class MaterialModule { }

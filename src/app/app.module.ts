// Core Modules
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';

// Routing
import { Routes, RouterModule } from '@angular/router';

// Third Party
import { ToasterModule, ToasterService } from 'angular2-toaster/angular2-toaster';
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { CarouselModule } from 'ngx-bootstrap';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';
import { ApiComponent } from './components/api.component';
import { CodeSystemComponent } from './components/code_system.component';
import { ConceptMapComponent } from './components/concept_map.component';
import { CodeVisualizerComponent } from './components/code_visualizer.component';

// Services
import { QuickTermService } from './services/tastyterm.service';
import { CodeSystemService } from './services/code_system.service';
import { ValueSetService } from './services/value_set.service';
import { ConceptMapService } from './services/concept_map.service';

const routing = RouterModule.forRoot(
  [
    { path: '', component: HomeComponent },
    { path: 'api', component: ApiComponent }
  ],
  { enableTracing: true } // <-- debugging purposes only
);

@NgModule({
  declarations: [
    AppComponent,
    ApiComponent,
    HomeComponent,
    CodeSystemComponent,
    CodeVisualizerComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule, // For Toaster
    ToasterModule,
    CarouselModule,
    NgxGraphModule
  ],
  providers: [
    CodeSystemService,
    QuickTermService,
    ConceptMapService,
    ValueSetService,
    ToasterService,
    { provide: 'Window', useValue: window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

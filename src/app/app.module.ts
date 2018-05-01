// Core Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

// Routing
import { Routes, RouterModule } from '@angular/router';

// Third Party
import { ToasterModule, ToasterService } from 'angular2-toaster/angular2-toaster';
import { NgxGraphModule } from "@swimlane/ngx-graph";

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';
import { ApiComponent } from './components/api.component';
import { CodeSystemComponent } from './components/code_system.component';
import { ConceptMapComponent } from './components/concept_map.component';
import { CodeVisualizerComponent } from './components/code_visualizer.component';
import { DirectedGraphComponent } from './components/directed_graph.component';
import { DirectedGraph3dComponent } from './components/directed_graph_3d.component';

// Services
import { AuthenticationService } from './services/authentication.service';
import { QuickTermService } from './services/tastyterm.service';
import { CodeSystemService } from './services/code_system.service';
import { ValueSetService } from './services/value_set.service';
import { ConceptMapService } from './services/concept_map.service';

// App modules
import { MaterialModule } from './material.module';

const routing = RouterModule.forRoot(
  [
    { path: '', component: HomeComponent },
    { path: 'term/:termId', component: HomeComponent },
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
    CodeVisualizerComponent,
    DirectedGraphComponent,
    DirectedGraph3dComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // For Toaster
    routing,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    ToasterModule,
    NgxGraphModule
  ],
  providers: [
    AuthenticationService,
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

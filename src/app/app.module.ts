// Core Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

// Routing
import { RouterModule } from '@angular/router';

// Third Party
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
// import { NgxGraphModule } from "@swimlane/ngx-graph";

// Components
import { AppComponent } from './app.component';
import { LaunchComponent } from './components/launch.component';
import { HomeComponent } from './components/home.component';
import { ApiComponent } from './components/api.component';
import { CodeSystemComponent } from './components/code_system.component';
import { ConceptMapComponent } from './components/concept_map.component';
import { CodeVisualizerComponent } from './components/code_visualizer.component';
import { DirectedGraphComponent } from './components/directed_graph.component';
import { DirectedGraph3dComponent } from './components/directed_graph_3d.component';

// Services
import { AuthenticationService } from './services/authentication.service';
import { TastyTermService } from './services/tastyterm.service';
import { CodeSystemService } from './services/code_system.service';
import { ValueSetService } from './services/value_set.service';
import { ConceptMapService } from './services/concept_map.service';
import { HttpClientModule } from '@angular/common/http';


const routing = RouterModule.forRoot(
  [
    { path: '', component: HomeComponent },
    { path: 'term/:termId', component: HomeComponent },
    { path: 'api', component: ApiComponent },
    { path: 'launch', component: LaunchComponent }
  ],
  { enableTracing: false } // <-- debugging purposes only
);

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    routing,
    FormsModule,
    LayoutModule,
    HttpClientModule,
    ToastrModule.forRoot()

  ],
  declarations: [
    AppComponent,
    LaunchComponent,
    ApiComponent,
    HomeComponent,
    CodeSystemComponent,
    CodeVisualizerComponent,
    DirectedGraphComponent,
    DirectedGraph3dComponent
  ],

  providers: [
    AuthenticationService,
    CodeSystemService,
    TastyTermService,
    ConceptMapService,
    ValueSetService,

    ToastrService,
    { provide: 'Window', useValue: window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

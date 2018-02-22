import {ModuleWithProviders, enableProdMode} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
// import {Http} from '@angular/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';
// import {DragulaModule} from 'ng2-dragula/ng2-dragula';

import {CarouselModule} from 'ngx-bootstrap';

import {AppComponent} from './app/app.component';
import {HomeComponent} from './app/components/home.component';
import {ApiComponent} from './app/components/api.component';
import {CodeSystemComponent} from './app/components/code_system.component';
import {ConceptMapComponent} from './app/components/concept_map.component';

import {QuickTermService} from './app/services/quickterm.service';
import {CodeSystemService} from './app/services/code_system.service';
import {ValueSetService} from './app/services/value_set.service';
import {ConceptMapService} from './app/services/concept_map.service';



enableProdMode();


import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'api', component: ApiComponent }
]
const appRoutingProviders: any[] = [];
const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@NgModule({
    imports: [
        BrowserModule,
        routing,
        FormsModule,
        HttpModule,
      BrowserAnimationsModule, // For Toaster
        ToasterModule,
        CarouselModule
    ],
    declarations: [
        AppComponent,
        ApiComponent,
        HomeComponent,
        CodeSystemComponent
        // CarouselComponent,
        // SlideComponent
    ],   // components and directives
    providers: [
        appRoutingProviders,
        CodeSystemService,
        QuickTermService,
        ConceptMapService,
        ValueSetService,
        ToasterService,
        { provide: 'Window', useValue: window }
    ],                    // services
    bootstrap: [AppComponent]     // root component
})
export class AppModule {
}

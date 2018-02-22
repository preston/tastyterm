import {Component, Output, Inject} from '@angular/core';
import {UUID} from 'angular2-uuid';



import {ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';

import {SlideComponent, CarouselComponent, CarouselModule} from 'ngx-bootstrap';

import {CodeSystem} from '../models/code_system';

import {QuickTermService} from '../services/quickterm.service';
import {CodeSystemService} from '../services/code_system.service';

@Component({
    selector: 'code-systems',
    templateUrl: '/code_systems.html'
})
export class CodeSystemComponent {

    // The current selection, if any.
    codeSystem: CodeSystem;
    codeSystems: Array<CodeSystem>;

    constructor(private quicktermService: QuickTermService,
        private codeSystemService: CodeSystemService,
        private toasterService: ToasterService) {
        this.reload();
    }

    reload() {
        this.codeSystems = new Array<CodeSystem>();
        this.codeSystemService.bundle().subscribe(d => {
            this.codeSystems = d.entry;
        });
    }

    select(codeSystem: CodeSystem) {
        this.codeSystem = codeSystem;
    }

    // create() {
    //     let codeSystem = new CodeSystem();
    //     codeSystem.name = "New CodeSystem " + UUID.UUID();
    //     this.codeSystemService.create(codeSystem).subscribe(d => {
    //         this.toasterService.pop('success', 'CodeSystem Created', 'Please update the details accordingly!');
    //         this.codeSystems.push(d);
    //         this.select(d);
    //     });
    // }
    // update(codeSystem: CodeSystem) {
    //     this.codeSystemService.update(codeSystem).subscribe(d => {
    //         this.toasterService.pop('success', 'CodeSystem Updated');
    //         let i = this.codeSystems.indexOf(codeSystem, 0);
    //         this.codeSystems[i] = d;
    //     });
    // }
    // delete(codeSystem: CodeSystem) {
    //     this.codeSystemService.delete(codeSystem).subscribe(d => {
    //         this.toasterService.pop('success', 'CodeSystem Deleted');
    //         let i = this.codeSystems.indexOf(codeSystem, 0);
    //         if (i >= 0) {
    //             this.codeSystems.splice(i, 1);
    //         }
    //         this.select(null);
    //     });
    // }
}

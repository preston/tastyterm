import {Component, Output, Inject} from '@angular/core';
// import { v4 as uuidv4 } from 'uuid';

import {CodeSystem} from '../models/code_system';

import {TastyTermService} from '../services/tastyterm.service';
import {CodeSystemService} from '../services/code_system.service';

@Component({
    selector: 'code-systems',
    templateUrl: '../views/code_systems.html'
})
export class CodeSystemComponent {

    // The current selection, if any.
    codeSystem: CodeSystem | null = null;
    codeSystems: Array<CodeSystem> | null = null;

    constructor(private quicktermService: TastyTermService,
        private codeSystemService: CodeSystemService
        // private toastrService: ToastrService
        ) {
        this.reload();
    }

    reload() {
        this.codeSystems = new Array<CodeSystem>();
        this.codeSystemService.bundle().subscribe(d => {
            this.codeSystems = d.entry.map(n => n.resource);
        });
    }

    select(codeSystem: CodeSystem) {
        this.codeSystem = codeSystem;
    }

    // create() {
    //     let codeSystem = new CodeSystem();
    //     codeSystem.name = "New CodeSystem " + UUID.UUID();
    //     this.codeSystemService.create(codeSystem).subscribe(d => {
    //         this.ToastrService.pop('success', 'CodeSystem Created', 'Please update the details accordingly!');
    //         this.codeSystems.push(d);
    //         this.select(d);
    //     });
    // }
    // update(codeSystem: CodeSystem) {
    //     this.codeSystemService.update(codeSystem).subscribe(d => {
    //         this.ToastrService.pop('success', 'CodeSystem Updated');
    //         let i = this.codeSystems.indexOf(codeSystem, 0);
    //         this.codeSystems[i] = d;
    //     });
    // }
    // delete(codeSystem: CodeSystem) {
    //     this.codeSystemService.delete(codeSystem).subscribe(d => {
    //         this.ToastrService.pop('success', 'CodeSystem Deleted');
    //         let i = this.codeSystems.indexOf(codeSystem, 0);
    //         if (i >= 0) {
    //             this.codeSystems.splice(i, 1);
    //         }
    //         this.select(null);
    //     });
    // }
}

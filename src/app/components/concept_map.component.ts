import { Component, Output, Inject } from '@angular/core';
// import { v4 as uuidv4 } from 'uuid';



import {  ToastrService } from 'ngx-toastr';


import { Bundle } from '../models/bundle';
import { ConceptMap } from '../models/concept_map';

import { TastyTermService } from '../services/tastyterm.service';
import { ConceptMapService } from '../services/concept_map.service';

@Component({
    selector: 'concept-map',
    // templateUrl: '../views/concept_map.pug'
    template: '<p>FIXME</p>'
})
export class ConceptMapComponent {

    // The current selection, if any.
    conceptMap: ConceptMap | null = null;
    conceptMapBundle: Bundle<ConceptMap> | null = null;
    conceptMaps: Array<ConceptMap> | null = null;

    constructor(private quicktermService: TastyTermService,
        private conceptMapService: ConceptMapService,
        private ToastrService: ToastrService) {
        this.reload();
    }

    reload() {
        this.conceptMaps = new Array<ConceptMap>();
        this.conceptMapService.bundle().subscribe(d => {
            this.conceptMaps = d.entry.map(n => n.resource);
        });
    }

    select(conceptMap: ConceptMap) {
        this.conceptMap = conceptMap;
    }

}

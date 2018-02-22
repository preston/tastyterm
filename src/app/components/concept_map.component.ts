import {Component, Output, Inject} from '@angular/core';
import {UUID} from 'angular2-uuid';



import {ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';

import {SlideComponent, CarouselComponent, CarouselModule} from 'ngx-bootstrap';

import {Bundle} from '../models/bundle';
import {ConceptMap} from '../models/concept_map';

import {QuickTermService} from '../services/quickterm.service';
import {ConceptMapService} from '../services/concept_map.service';

@Component({
    selector: 'concept-map',
    templateUrl: '/concept_map.html'
})
export class ConceptMapComponent {

    // The current selection, if any.
		conceptMap: ConceptMap;
		conceptMapBundle: Bundle<ConceptMap>;
    conceptMaps: Array<ConceptMap>;

    constructor(private quicktermService: QuickTermService,
        private conceptMapService: ConceptMapService,
        private toasterService: ToasterService) {
        this.reload();
    }

    reload() {
        this.conceptMaps = new Array<ConceptMap>();
        this.conceptMapService.bundle().subscribe(d => {
            this.conceptMaps = d.entry;
        });
    }

    select(conceptMap: ConceptMap) {
        this.conceptMap = conceptMap;
    }

}

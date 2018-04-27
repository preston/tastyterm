import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  HostListener,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from "@angular/core";

import * as shape from "d3-shape";
import { HierarchicalGraph } from "../models/hierarchical_graph";
import { ValueSet } from "../models/value_set";
import { Parameters } from "../models/parameters";
import { Node } from "../models/node";
import { Link } from "../models/link";
import { CodeSystem } from "../models/code_system";

import { ValueSetService } from "../services/value_set.service";


@Component({
  selector: "code-visualizer",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "../views/code_visualizer.pug"
})
export class CodeVisualizerComponent implements OnInit {
  @Output() onSelection = new EventEmitter<Node>();

  theme: string = "dark";
  chartType: string = "directed-graph";
  chartGroups = [
    {
      name: "Other Charts",
      charts: [
        {
          name: "Directed Graph",
          selector: "directed-graph",
          inputFormat: "graph",
          options: ["colorScheme", "showLegend"]
        }
      ]
    }
  ];
  chart: any;
  countries: any[];
  graph: { links: any[]; nodes: any[] };
  // Because of some weird block scope and angular change detection
  // behaviour, we need to sadly set class variables for some work in
  // the for loop.
  nodesInLoop: any[] = [];
  linksInLoop: any[] = [];
  view: any[];

  // options
  showLegend: boolean = false;
  orientations: Array<Object> = [
    {
      label: "Left to Right",
      value: "LR"
    },
    {
      label: "Right to Left",
      value: "RL"
    },
    {
      label: "Top to Bottom",
      value: "TB"
    },
    {
      label: "Bottom to Top",
      value: "BT"
    }
  ];
  orientation: string = this.orientations[0]["value"];

  // line interpolation
  curveType: string = "Linear";
  interpolationTypes = [
    { name: "Bundle", value: shape.curveBundle.beta(1) },
    { name: "Cardinal", value: shape.curveCardinal },
    { name: "Catmull Rom", value: shape.curveCatmullRom },
    { name: "Linear", value: shape.curveLinear },
    { name: "Monotone X", value: shape.curveMonotoneX },
    { name: "Monotone Y", value: shape.curveMonotoneY },
    { name: "Natural", value: shape.curveNatural },
    { name: "Step", value: shape.curveStep },
    { name: "Step After", value: shape.curveStepAfter },
    { name: "Step Before", value: shape.curveStepBefore }
  ];
  interpolationType: any;
  interpolationCurve: any;

  schemeType: string = "ordinal";
  colorSchemes = [
    {
      name: "vivid",
      selectable: true,
      group: "Ordinal",
      domain: [
        "#647c8a",
        "#3f51b5",
        "#2196f3",
        "#00b862",
        "#afdf0a",
        "#a7b61a",
        "#f3e562",
        "#ff9800",
        "#ff5722",
        "#ff4514"
      ]
    },
    {
      name: "natural",
      selectable: true,
      group: "Ordinal",
      domain: [
        "#bf9d76",
        "#e99450",
        "#d89f59",
        "#f2dfa7",
        "#a5d7c6",
        "#7794b1",
        "#afafaf",
        "#707160",
        "#ba9383",
        "#d9d5c3"
      ]
    },
    {
      name: "cool",
      selectable: true,
      group: "Ordinal",
      domain: [
        "#a8385d",
        "#7aa3e5",
        "#a27ea8",
        "#aae3f5",
        "#adcded",
        "#a95963",
        "#8796c0",
        "#7ed3ed",
        "#50abcc",
        "#ad6886"
      ]
    },
    {
      name: "fire",
      selectable: true,
      group: "Ordinal",
      domain: [
        "#ff3d00",
        "#bf360c",
        "#ff8f00",
        "#ff6f00",
        "#ff5722",
        "#e65100",
        "#ffca28",
        "#ffab00"
      ]
    },
    {
      name: "solar",
      selectable: true,
      group: "Continuous",
      domain: [
        "#fff8e1",
        "#ffecb3",
        "#ffe082",
        "#ffd54f",
        "#ffca28",
        "#ffc107",
        "#ffb300",
        "#ffa000",
        "#ff8f00",
        "#ff6f00"
      ]
    },
    {
      name: "air",
      selectable: true,
      group: "Continuous",
      domain: [
        "#e1f5fe",
        "#b3e5fc",
        "#81d4fa",
        "#4fc3f7",
        "#29b6f6",
        "#03a9f4",
        "#039be5",
        "#0288d1",
        "#0277bd",
        "#01579b"
      ]
    },
    {
      name: "aqua",
      selectable: true,
      group: "Continuous",
      domain: [
        "#e0f7fa",
        "#b2ebf2",
        "#80deea",
        "#4dd0e1",
        "#26c6da",
        "#00bcd4",
        "#00acc1",
        "#0097a7",
        "#00838f",
        "#006064"
      ]
    },
    {
      name: "flame",
      selectable: false,
      group: "Ordinal",
      domain: [
        "#A10A28",
        "#D3342D",
        "#EF6D49",
        "#FAAD67",
        "#FDDE90",
        "#DBED91",
        "#A9D770",
        "#6CBA67",
        "#2C9653",
        "#146738"
      ]
    },
    {
      name: "ocean",
      selectable: false,
      group: "Ordinal",
      domain: [
        "#1D68FB",
        "#33C0FC",
        "#4AFFFE",
        "#AFFFFF",
        "#FFFC63",
        "#FDBD2D",
        "#FC8A25",
        "#FA4F1E",
        "#FA141B",
        "#BA38D1"
      ]
    },
    {
      name: "forest",
      selectable: false,
      group: "Ordinal",
      domain: [
        "#55C22D",
        "#C1F33D",
        "#3CC099",
        "#AFFFFF",
        "#8CFC9D",
        "#76CFFA",
        "#BA60FB",
        "#EE6490",
        "#C42A1C",
        "#FC9F32"
      ]
    },
    {
      name: "horizon",
      selectable: false,
      group: "Ordinal",
      domain: [
        "#2597FB",
        "#65EBFD",
        "#99FDD0",
        "#FCEE4B",
        "#FEFCFA",
        "#FDD6E3",
        "#FCB1A8",
        "#EF6F7B",
        "#CB96E8",
        "#EFDEE0"
      ]
    },
    {
      name: "neons",
      selectable: false,
      group: "Ordinal",
      domain: [
        "#FF3333",
        "#FF33FF",
        "#CC33FF",
        "#0000FF",
        "#33CCFF",
        "#33FFFF",
        "#33FF66",
        "#CCFF33",
        "#FFCC00",
        "#FF6600"
      ]
    },
    {
      name: "picnic",
      selectable: false,
      group: "Ordinal",
      domain: [
        "#FAC51D",
        "#66BD6D",
        "#FAA026",
        "#29BB9C",
        "#E96B56",
        "#55ACD2",
        "#B7332F",
        "#2C83C9",
        "#9166B8",
        "#92E7E8"
      ]
    },
    {
      name: "night",
      selectable: false,
      group: "Ordinal",
      domain: [
        "#2B1B5A",
        "#501356",
        "#183356",
        "#28203F",
        "#391B3C",
        "#1E2B3C",
        "#120634",
        "#2D0432",
        "#051932",
        "#453080",
        "#75267D",
        "#2C507D",
        "#4B3880",
        "#752F7D",
        "#35547D"
      ]
    },
    {
      name: "nightLights",
      selectable: false,
      group: "Ordinal",
      domain: [
        "#4e31a5",
        "#9c25a7",
        "#3065ab",
        "#57468b",
        "#904497",
        "#46648b",
        "#32118d",
        "#a00fb3",
        "#1052a2",
        "#6e51bd",
        "#b63cc3",
        "#6c97cb",
        "#8671c1",
        "#b455be",
        "#7496c3"
      ]
    }
  ];
  colorScheme = this.colorSchemes[0];

  public hierarchicalGraph = new HierarchicalGraph();

  constructor(private element: ElementRef, private valueSetService: ValueSetService) {
    this.setInterpolationType("Natural");
  }

  setInterpolationType(name: string) {
    this.interpolationType = this.interpolationTypes.find(t => t.name === name);
    this.interpolationCurve = shape.curveLinear;
  }

  ngOnInit() {
    this.selectChart(this.chartType);
    // setInterval(this.updateVisualization.bind(this), 1000);
  }

  @Input() valueSet: ValueSet;
  @Input() codeSystem: CodeSystem;

  ngOnChanges(changes: SimpleChanges) {
    console.log("Visualization input changed to:");
    if (changes.valueSetParameters) {
      this.updateVisualization();
    }
    // console.log(changes.valueSet.previousValue);// previous selected value
  }

  @Input() valueSetParameters: Parameters;
  updateVisualization() {
    if (this.valueSet) {
      console.log("Updating visualization...");
      this.clearGraph();
      let vs = this.valueSet;
      let vsp = this.valueSetParameters;
      let center = new Node(vs.code, vsp.display, 'center');
      this.nodesInLoop.push(center);
      if (vs && vsp) {
        // Call our service method which handles building an object
        // with parent and children already sorted for us.
        this.valueSetService.getParentsAndChildren(
          this.codeSystem,
          vs.code,
          1000).subscribe(family => {
            console.log(family);
            if(family[0]['expansion']['contains']){
              for(let parent of family[0]['expansion']['contains']){
                let parentNode = new Node(parent["code"], parent["display"], 'parent');
                this.nodesInLoop.push(parentNode);
                let parentLink = new Link(center.id, parentNode.id, "parent");
                this.linksInLoop.push(parentLink);
              }
            }
            if(family[1]['expansion']['contains']){
              for(let child of family[1]['expansion']['contains']){
                let childNode = new Node(child["code"], child["display"], 'child');
                this.nodesInLoop.push(childNode);
                let childLink = new Link(childNode.id, center.id, "child");
                this.linksInLoop.push(childLink);
              }
            }
            // Because of some weird block scope and angular change detection
            // behaviour, we need to sadly use the class variables we set.
            // Here we are setting the @Inputs to new objects instead of mutating them in place.
            // Angular change detection would not know the object changed if we simply mutate them.
            // They must be set anew.
            this.hierarchicalGraph.nodes = this.nodesInLoop;
            this.hierarchicalGraph.links = this.linksInLoop;
        });
      }
    } else {
      this.clearGraph();
    }
  }

  clearGraph(){
    this.nodesInLoop = [];
    this.linksInLoop = [];
    this.hierarchicalGraph.reset();
  }
  selectChart(chartSelector) {
    this.chartType = chartSelector;
    for (const group of this.chartGroups) {
      for (const chart of group.charts) {
        if (chart.selector === chartSelector) {
          this.chart = chart;
          return;
        }
      }
    }
  }

  select(data) {
    console.log("Item clicked", data);
    this.onSelection.emit(data);
  }

  onLegendLabelClick(entry) {
    console.log("Legend clicked", entry);
  }

  toggleExpand(node) {
    console.log("toggle expand", node);
  }

  //   TODO REFACTOR This seems really ghetto.
  cache = {};

  /**
   * Generates a short id.
   *
   * Description:
   *   A 4-character alphanumeric sequence (364 = 1.6 million)
   *   This should only be used for JavaScript specific models.
   *   http://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
   *
   *   Example: `ebgf`
   */
  id(): string {
    let newId = (
      "0000" + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)
    ).slice(-4);

    // append a 'a' because neo gets mad
    newId = `a${newId}`;

    // ensure not already used
    if (!this.cache[newId]) {
      this.cache[newId] = true;
      return newId;
    }

    return this.id();
  }

  generateHierarchialGraph() {
    const nodes = [
      {
        id: "start",
        label: "start"
      },
      {
        id: "1",
        label: "Query ThreatConnect",
        rank: "first"
      },
      {
        id: "2",
        label: "Query XForce",
        rank: "first"
      },
      {
        id: "3",
        label: "Format Results"
      },
      {
        id: "4",
        label: "Search Splunk"
      },
      {
        id: "5",
        label: "Block LDAP"
      },
      {
        id: "6",
        label: "Email Results"
      }
    ];

    const links = [
      {
        source: "start",
        target: "1"
      },
      {
        source: "start",
        target: "2"
      },
      {
        source: "1",
        target: "3"
      },
      {
        source: "2",
        target: "4"
      },
      {
        source: "2",
        target: "6"
      },
      {
        source: "3",
        target: "5"
      }
    ];

    return { links, nodes };
  }

  public static generateHierarchialGraph(): Object {
    const nodes = [
      {
        id: "start",
        label: "start"
      },
      {
        id: "1",
        label: "Query ThreatConnect",
        rank: "first"
      },
      {
        id: "2",
        label: "Query XForce",
        rank: "first"
      },
      {
        id: "3",
        label: "Format Results"
      },
      {
        id: "4",
        label: "Search Splunk"
      },
      {
        id: "5",
        label: "Block LDAP"
      },
      {
        id: "6",
        label: "Email Results"
      }
    ];

    const links = [
      {
        source: "start",
        target: "1"
      },
      {
        source: "start",
        target: "2"
      },
      {
        source: "1",
        target: "3"
      },
      {
        source: "2",
        target: "4"
      },
      {
        source: "2",
        target: "6"
      },
      {
        source: "3",
        target: "5"
      }
    ];

    return { links, nodes };
  }
}

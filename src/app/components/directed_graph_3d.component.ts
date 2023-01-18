import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  Input,
  Output,
  SimpleChanges,
  EventEmitter,
  ViewChild
} from "@angular/core";


import { Node } from "../models/node";
import { Link } from "../models/link";
declare var ForceGraph3D: any;
declare var SpriteText: any;
interface Graph {
  nodes: Node[];
  links: Link[];
}

@Component({
  selector: "directed-graph-3d",
  styleUrls: ['../stylesheets/directed-graph-3d.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `<div #rootElement id="rootElement"></div>`
})
export class DirectedGraph3dComponent implements OnInit {
  @Input('links') links: Link[] | null = null;
  @Input('nodes') nodes: Node[] | null = null;
  @Output() onNodeClicked = new EventEmitter<Node>();
  @ViewChild('rootElement') rootElement: ElementRef | null = null;
  viewReady: boolean = false;
  constructor(private element: ElementRef) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.viewReady) {
      if (changes["nodes"] || changes["links"]) {
        if (!changes["nodes"].firstChange || !changes["links"].firstChange) {
          this.renderGraph();
        }
      }
    }
  }
  ngOnInit() {
    //this.renderGraph();
  }
  ngAfterViewInit() {
    this.viewReady = true;
  }
  renderGraph() {
    if (this.links && this.nodes) {
      console.info("Nodes: ", this.nodes);
      console.info("Links: ", this.links);
      const nodes: Node[] = this.nodes;
      const links: Link[] = this.links;

      let myGraph = ForceGraph3D();
      myGraph(this.rootElement?.nativeElement)
        .cameraPosition({ x: 0, y: 0, z: 120 })
        .width(window.innerWidth - 50)
        .height(500)
        .backgroundColor('#FFFFFF00')
        .graphData(this.formatNodes(nodes, links))
        .linkOpacity(0.75)
        .linkColor('#000000')
        .nodeOpacity(0.95)
        .nodeResolution(16)
        .nodeRelSize(4)
        // .nodeLabel((node) => {
        //   return '<div style="color:#323232;">'
        //     + node.label
        //     + ' - '
        //     + node.id
        //     + '</div>';
        // })
        .nodeThreeObject((node: { relationship: any; label: string; id: string; }) => {
          let color: string;
          switch (node.relationship) {
            case 'center':
              color = 'rgb(31, 119, 180)';
              break;
            case 'child':
              color = 'rgb(255, 127, 14)';
              break;
            case 'parent':
              color = 'rgb(44, 160, 44)';
              break;
            default:
              color = '#ccc';
              break;
          }
          const sprite = new SpriteText(
            node.label
            + ' - '
            + node.id
          );
          sprite.color = color;
          sprite.textHeight = 3;
          sprite.fontSize = 30;
          return sprite;
        })
        .linkDirectionalParticles(3)
        .linkDirectionalParticleWidth(0.8)
        .linkDirectionalParticleSpeed(0.002)
        .onNodeHover((node: any) => {
          if (this.rootElement) {
            if (node) {
              this.rootElement.nativeElement.className = 'cursor-pointer';
            } else {
              this.rootElement.nativeElement.className = 'cursor-default';
            }
          }
        })
        .onNodeClick((node: Node | undefined) => {
          this.onNodeClicked.emit(node);
        });
    }
  }

  // This chart seems to interpret parent to child relationships different
  // than our 2D chart. We will flip them here.
  formatNodes(nodes: Node[], links: Link[]) {
    let newNodes = [];
    let newLinks = [];
    for (let node of nodes) {
      if (node.relationship != 'center') {
        newNodes.push({
          id: node.id,
          label: node.label,
          relationship: this.reverseRelationship(node.relationship)
        });
      } else {
        newNodes.push(node);
      }
    }
    for (let link of links) {
      if (link.label != 'center') {
        newLinks.push({
          label: this.reverseRelationship(link.label),
          source: link.target,
          target: link.source
        });
      } else {
        newLinks.push(link);
      }
    }
    return {
      nodes: newNodes,
      links: newLinks
    }
  }

  reverseRelationship(relationship: string) {
    if (relationship == 'center') {
      return 'center';
    } else if (relationship == 'parent') {
      return 'child';
    } else if (relationship == 'child') {
      return 'parent';
    } else {
      return relationship;
    }
  }
}

import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  Input,
  Output,
  SimpleChanges,
  EventEmitter
} from "@angular/core";

import { Simulation, SimulationNodeDatum } from "d3-force";
import * as d3 from "d3";

import { Node } from "../models/node";
import { Link } from "../models/link";

interface Graph {
  nodes: Node[];
  links: Link[];
}

@Component({
  selector: "directed-graph",
  styleUrls: ['../stylesheets/directed-graph.sass'],
  encapsulation: ViewEncapsulation.None,
  template: `<svg width="1200" height="400"></svg>`
})
export class DirectedGraphComponent implements OnInit {
  @Input('links') links: Link[];
  @Input('nodes') nodes: Node[];
  @Output() onNodeClicked = new EventEmitter<Node>();

  simulation: Simulation<any, any>;
  constructor(private element: ElementRef) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.nodes || changes.links) {
      this.renderGraph();
    }
    // console.log(changes.valueSet.previousValue);// previous selected value
  }
  ngOnInit() {

  }

  renderGraph() {
    const svg = d3.select('svg').call(d3.zoom().on("zoom", () => {
      svg.selectAll('g')

        .attr("transform", d3.event.transform)
    }));
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const textSpace = { x: 12, y: 0 };

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Let's clear any nodes that might already be there before we render the graph
    svg.selectAll('g').remove();

    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().distance(120).strength(1).id((d: any) => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(170, 150));

    if(this.links && this.nodes){
      console.info("Nodes: ", this.nodes);
      console.info("Links: ", this.links);
      const nodes: Node[] = this.nodes;
      const links: Link[] = this.links;

      const graph: Graph = <Graph>{ nodes, links };

      const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(graph.links)
        .enter()
        .append( "line" )
        .style( "stroke-width", 2 )
        .attr('marker-end', (d) => "url(#arrowhead)");//attach the arrow from defs;

      const arrow = svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 4)
        .attr('markerHeight', 4)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');

      const node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(graph.nodes)
        .enter();

      const circle = node.append('circle')
        .attr('r', 9)
        .attr('fill', (d: any) => color(d.group));

      node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text((d) => { return d.id; });
      svg.selectAll('text').call(d3.drag()
        .on('start', (d) => this.dragstarted(d))
        .on('drag', (d) => this.dragged(d))
        .on('end', (d) => this.dragended(d))
      ).on("click", (node) => this.nodeClicked(node));

      svg.selectAll('circle').call(d3.drag()
        .on('start', (d) => this.dragstarted(d))
        .on('drag', (d) => this.dragged(d))
        .on('end', (d) => this.dragended(d))
      ).on("click", (node) => this.nodeClicked(node));

      this.simulation
        .nodes(<SimulationNodeDatum[]> graph.nodes)
        .on('tick', () => {
          let source = {x:0,y:0};
          let target = {x:0,y:0};
          link
            .attr('x1', (d: any) => {
              source.x = d.source.x;
              return d.source.x;
            })
            .attr('y1', (d: any) => {
              source.y = d.source.y;
              return d.source.y;
            })
            .attr('x2', (d: any) => {
              target.x = d.target.x;
              return d.target.x;
            })
            .attr('y2', (d: any) => {
              target.y = d.target.y;
              return d.target.y;
            });
          svg.selectAll('circle')
            .attr('cx', (d: any) => { return d.x; })
            .attr('cy', (d: any) => { return d.y; });

          node.selectAll('text')
            .attr('x', (d: any) => { return d.x + textSpace.x; })
            .attr('y', (d: any) => { return d.y + textSpace.y; });
        });

      this.simulation.force<d3.ForceLink<any, any>>('link')
        .links(graph.links);
    }
  }

  nodeClicked(node){
    this.onNodeClicked.emit(node);
  }

  dragstarted(d) {
    if (!d3.event.active) { this.simulation.alphaTarget(0.3).restart(); }
    d.fx = d.x;
    d.fy = d.y;
  }
  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended(d) {
    if (!d3.event.active) {
      this.simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }
}

import { Node } from "./node";
import { Link } from "./link";

export class HierarchicalGraph {
  public nodes: Node[] = [];
  public links: Link[] = [];

  reset() {
    this.nodes = [];
    this.links = [];
  }
}

import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { PipelineStepsStore } from '../pipeline-steps.store';
import { Popover } from '@openng/optimus-ui/popover';
import { Button } from '@openng/optimus-ui/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { StepDto } from '@api/models/pipeline/step-dto';
import { StateClassPipe } from '@shared/styles/state-class.pipe';
import { StateIconPipe } from '@shared/styles/state-icon.pipe';
import { I18nService } from '@shared/i18n/i18n-service';
import * as dagre from '@dagrejs/dagre';
import { curveBasis, line, select } from 'd3';

/** Fixed node box, so the layout is fully deterministic and needs no DOM measurement. */
const NODE_WIDTH = 260;
const NODE_HEIGHT = 52;
/** Breathing room inside the foreignObject so selection/hover outlines aren't clipped. */
const NODE_PADDING = 6;

interface GraphNode {
  id: string;
  step: StepDto;
  label: string;
  iconClass: string;
  stateClass: string;
  x: number;
  y: number;
}

interface GraphEdge {
  key: string;
  path: string;
}

interface GraphLayout {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
}

const EMPTY_LAYOUT: GraphLayout = { nodes: [], edges: [], width: 0, height: 0 };

interface Point {
  x: number;
  y: number;
}

const drawEdge = line<Point>()
  .x((point) => point.x)
  .y((point) => point.y)
  .curve(curveBasis);

let markerIdCounter = 0;

@Component({
  selector: 'app-pipeline-dependency-graph',
  imports: [Popover, Button, TranslocoPipe],
  templateUrl: './pipeline-dependency-graph.html',
  styleUrl: './pipeline-dependency-graph.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The graph is rendered imperatively by d3, so those elements never receive Angular's
  // scoping attributes. All selectors in the stylesheet are namespaced under the root class.
  encapsulation: ViewEncapsulation.None,
})
export class PipelineDependencyGraph {
  protected readonly pipelineStepsStore = inject(PipelineStepsStore);
  private readonly i18nService = inject(I18nService);

  private readonly stateClassPipe = new StateClassPipe();
  private readonly stateIconPipe = new StateIconPipe();

  private readonly popover = viewChild<Popover>('po');
  private readonly svgEl = viewChild<ElementRef<SVGSVGElement>>('graph');

  protected readonly markerId = `pipeline-dependency-arrow-${markerIdCounter++}`;

  /**
   * Runs the steps through dagre's layered (Sugiyama) layout: it assigns ranks so every step sits
   * below all of its dependencies, minimises edge crossings, and routes the edges. Purely a
   * calculation over fixed-size boxes, so it is correct even while the popover is still hidden.
   */
  protected readonly layout = computed<GraphLayout>(() => {
    const steps = this.pipelineStepsStore.steps() ?? [];
    if (steps.length === 0) {
      return EMPTY_LAYOUT;
    }

    const graph = new dagre.graphlib.Graph();
    graph.setGraph({ rankdir: 'TB', nodesep: 30, ranksep: 70, marginx: 16, marginy: 16 });
    graph.setDefaultEdgeLabel(() => ({}));

    const knownNames = new Set(steps.map((step) => step.name));
    for (const step of steps) {
      graph.setNode(step.name, { width: NODE_WIDTH, height: NODE_HEIGHT });
    }
    for (const step of steps) {
      for (const dependencyName of step.dependencies ?? []) {
        // Arrow points from the dependency down to the step that depends on it.
        if (knownNames.has(dependencyName)) {
          graph.setEdge(dependencyName, step.name);
        }
      }
    }

    dagre.layout(graph);

    const nodes: GraphNode[] = steps.map((step) => {
      const positioned = graph.node(step.name);
      return {
        id: step.name,
        step,
        label: this.i18nService.localised(step.displayName, step.name),
        iconClass: this.stateIconPipe.transform(step.state),
        stateClass: this.stateClassPipe.transform(step.state, 'pipeline-dependency-graph__node'),
        x: positioned.x,
        y: positioned.y,
      };
    });

    const edges: GraphEdge[] = graph.edges().map((edge) => ({
      key: `${edge.v}->${edge.w}`,
      path: drawEdge(graph.edge(edge).points) ?? '',
    }));

    const { width, height } = graph.graph();

    return { nodes, edges, width: width ?? 0, height: height ?? 0 };
  });

  constructor() {
    afterRenderEffect(() => {
      const svgElement = this.svgEl()?.nativeElement;
      if (svgElement) {
        this.render(svgElement, this.layout(), this.pipelineStepsStore.step());
      }
    });
  }

  private render(svgElement: SVGSVGElement, layout: GraphLayout, selectedName: string | null | undefined): void {
    const svg = select(svgElement);
    svg
      .attr('width', layout.width)
      .attr('height', layout.height)
      .attr('viewBox', `0 0 ${layout.width} ${layout.height}`);

    // Arrowhead marker, created once per component instance.
    if (svg.select('defs').empty()) {
      svg
        .append('defs')
        .append('marker')
        .attr('id', this.markerId)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('refX', 8)
        .attr('refY', 4)
        .attr('orient', 'auto')
        .attr('markerUnits', 'userSpaceOnUse')
        .append('path')
        .attr('d', 'M0,0 L8,4 L0,8 Z')
        .attr('class', 'pipeline-dependency-graph__arrow');
    }

    // Edges first so the node boxes always paint on top of the lines.
    let edgeLayer = svg.select<SVGGElement>('g.pipeline-dependency-graph__edges');
    if (edgeLayer.empty()) {
      edgeLayer = svg.append('g').attr('class', 'pipeline-dependency-graph__edges');
    }
    let nodeLayer = svg.select<SVGGElement>('g.pipeline-dependency-graph__nodes');
    if (nodeLayer.empty()) {
      nodeLayer = svg.append('g').attr('class', 'pipeline-dependency-graph__nodes');
    }

    edgeLayer
      .selectAll<SVGPathElement, GraphEdge>('path')
      .data(layout.edges, (edge) => edge.key)
      .join('path')
      .attr('d', (edge) => edge.path)
      .attr('marker-end', `url(#${this.markerId})`);

    nodeLayer
      .selectAll<SVGGElement, GraphNode>('g.pipeline-dependency-graph__node-group')
      .data(layout.nodes, (node) => node.id)
      .join((enter) => {
        const group = enter.append('g').attr('class', 'pipeline-dependency-graph__node-group');
        const foreignObject = group
          .append('foreignObject')
          .attr('width', NODE_WIDTH + NODE_PADDING * 2)
          .attr('height', NODE_HEIGHT + NODE_PADDING * 2);
        const box = foreignObject.append('xhtml:div').attr('class', 'pipeline-dependency-graph__node');
        box.append('xhtml:span').attr('class', 'pi');
        box.append('xhtml:span').attr('class', 'pipeline-dependency-graph__node__name');
        return group;
      })
      .attr(
        'transform',
        (node) => `translate(${node.x - NODE_WIDTH / 2 - NODE_PADDING}, ${node.y - NODE_HEIGHT / 2 - NODE_PADDING})`,
      )
      .each((node, index, groups) => {
        const group = select(groups[index]);

        group
          .select('div.pipeline-dependency-graph__node')
          .attr(
            'class',
            `pipeline-dependency-graph__node ${node.stateClass}` +
              (node.step.name === selectedName ? ' pipeline-dependency-graph__node--selected' : ''),
          )
          .attr('title', node.label)
          .on('click', () => this.onNodeClick(node.step));

        group.select('span.pi').attr('class', `pi ${node.iconClass}`);
        group.select('span.pipeline-dependency-graph__node__name').text(node.label);
      });
  }

  private onNodeClick(step: StepDto): void {
    this.pipelineStepsStore.selectStep(step);
    this.popover()?.hide();
  }
}

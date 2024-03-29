import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Item } from 'src/core/interfaces/item';
import * as Enumerable from "linq-es2015";
import { ItemType } from 'src/core/interfaces/item-type';
import * as LeaderLine from 'leader-line-new';
import { Question } from 'src/core/interfaces/question';
import { ItemsChangeNotificationService } from 'src/core/services/items-change-notification.service';
import { Choice } from 'src/core/interfaces/choice';
import { TooltipPosition, TooltipTheme } from 'src/shared/components/tooltip/tooltip.enums';
import { CurrentItemChangeNotificationService } from 'src/core/services/current-item-change-notification.service';

export interface Node {
  id: string;
  order: number;
  type: string;
  text: string;
  father?: string;
  choices?: any;
  itemOrder?: number;
};

export interface Level {
  order: number;
  nodes: Node[];
};

@Component({
  selector: 'app-decision-tree-previewer',
  templateUrl: './decision-tree-previewer.component.html',
  styleUrls: ['./decision-tree-previewer.component.scss']
})
export class DecisionTreePreviewerComponent implements OnInit, OnDestroy  {
  @Input() items: Item[];
  @Output() nodeSelected = new EventEmitter<number>();

  currentItem!: Item;

  itemType = ItemType;

  levels: Level[];
  lines: LeaderLine[];

  tooltipTheme = TooltipTheme;
  tooltipPosition = TooltipPosition;
  
  constructor(private itemsChangeNotificationService: ItemsChangeNotificationService, 
    private currentItemChangeNotificationService: CurrentItemChangeNotificationService, 
    private renderer: Renderer2, private host: ElementRef) {
    this.items = [];
    this.levels = [];
    this.lines = [];
  }

  ngOnInit(): void {
    this.itemsChangeNotificationService.itemsChanged$.subscribe(
      data => {
        this.items = data;
       
        this.levels = [];
        this.removeAllLines();
    
        this.mapListItems(this.items, this.levels);
    
        var self = this;
        setTimeout(() => {
          self.drawDecisionTree();
          self.drawLines();
        }, 1000); 
      });

    this.currentItemChangeNotificationService.currentItemChanged$.subscribe(
        data => {
          if(data !== null){
            this.currentItem = data;
          }
        });

    const observer = new ResizeObserver(entries => {
        var self = this;
        setTimeout(() => {
          self.removeAllLines();
          self.drawDecisionTree();
          self.drawLines();
        }, 0);      
      });

    observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void{
    // Remove all liines
    this.removeAllLines();

    // Reset observer
    this.itemsChangeNotificationService.reset();
  }

  onNodeClick(order?: number){
    this.nodeSelected.emit(order);
  }
  
  private mapListItems(items: Item[], levels: Level[]): any {
    if (!items || items.length === 0) return;

    if (levels.length === 0) {
      var firstItem = <Question>items[0];
      this.levels.push({
        order: 0,
        nodes: [{
          id: 'level' + (levels.length + 1) + '-node1',
          order: 0,
          type: ItemType.Question,
          text: firstItem?.text ?? "",
          choices: firstItem?.choices,
          itemOrder: firstItem?.order
        }]
      });

      return this.mapListItems(items, levels);
    }
    else {
      // Get last level
      var lastLevel = levels[levels.length - 1];

      var qNodes = Enumerable.asEnumerable<Node>(lastLevel.nodes).Where(n => n.type === ItemType.Question && 'choices' in n && n?.choices.length > 0).ToArray();
      if (qNodes.length > 0) {
        let nodesOfNewLevel: Node[] = [];

        qNodes.forEach(qNode => {
          let choices = qNode.choices;

          if (choices !== undefined) {
            choices.forEach((choice: { order: number | undefined; gotoItem: Item }) => {
              if (choice.gotoItem !== undefined && choice.gotoItem !== null) {
                  nodesOfNewLevel.push({
                    id: 'level' + (levels.length + 1) + '-node' + (nodesOfNewLevel.length + 1),
                    order: choice?.order ?? 0,
                    type: choice.gotoItem.$type,
                    text: choice.gotoItem?.text ?? "",
                    father: qNode.id,
                    choices: (choice.gotoItem.$type === ItemType.Question ? (<Question>choice.gotoItem).choices : undefined),
                    itemOrder:  choice.gotoItem?.order
                  });
              }
            });
          }
        });

        levels.push({
          order: levels.length,
          nodes: nodesOfNewLevel
        });

        return this.mapListItems(items, levels);
      }
    }
  }

  private drawDecisionTree() {
    let allNodes: Node[] = [];
    var results = Enumerable.asEnumerable<Level>(this.levels).Select(l => l.nodes).ToArray();
    results.forEach((nodes: Node[]) => {
      allNodes = allNodes.concat(nodes);
    });

    allNodes.forEach((node: Node) => {
      var father = <HTMLElement>document.getElementById(node?.father ?? '');
      if (father) {
        // Father elem
        var fatherNode = Enumerable.asEnumerable<Node>(allNodes).Where(n => n.id === father.id).FirstOrDefault();

        // Nodes of before level
        var fatherLevel = Enumerable.asEnumerable<Level>(this.levels).Where(l => Enumerable.asEnumerable<Node>(l.nodes).Any(n => n.id === father?.id)).First();

        // width of father
        var fatherContainerWidth = (father.parentElement?.offsetWidth ?? 0) / fatherLevel.nodes.length;

        // Number of childs
        var childs = Enumerable.asEnumerable<Node>(allNodes).Where(n => n.father === father.id).ToArray();

        // Child width
        var childWidth = fatherContainerWidth / childs.length;

        // Child position
        var orderNode = (node.order > childs.length) ? childs.length - 1 : node.order;
        var fatherIndex = fatherLevel.nodes.findIndex(f => f.id === father.id);
        var childPosition = (father.offsetLeft - (fatherContainerWidth / 2)) + (childWidth * (orderNode + 1)) - (childWidth / 2);

        // Set position in element
        var child = new ElementRef(document.getElementById(node.id));        
       
        if (child.nativeElement !== undefined && child.nativeElement !== null) {
          this.renderer.setStyle(child.nativeElement, "position", 'absolute');
          this.renderer.setStyle(child.nativeElement, "left", (childPosition >= 0 ? childPosition : 0) + "px");
        }
      }
    });
  }

  private drawLines() {
    let allNodes: Node[] = [];
    var results = Enumerable.asEnumerable<Level>(this.levels).Select(l => l.nodes).ToArray();
    results.forEach((nodes: Node[]) => {
      allNodes = allNodes.concat(nodes);
    });

    allNodes.forEach((node: Node) => {
      var father = <HTMLElement>document.getElementById(node?.father ?? '');
      if (father) {
        // Father node
        var fatherNode = Enumerable.asEnumerable<Node>(allNodes).Where(n => n.id === node?.father).FirstOrDefault();

        // Set position in element
        var child = <HTMLElement>document.getElementById(node.id);

        // Draw line with father
        var choice = Enumerable.asEnumerable<Choice>(fatherNode?.choices).Where(c => c.order === node.order).FirstOrDefault();
        let line = new LeaderLine(father, child, 
          { color: '#4e6688', size: 2, dropShadow: true, middleLabel: LeaderLine.captionLabel(choice !== undefined ? this.truncateText(choice.text) : '')},);
        this.lines.push(line);
      }
    });
  }

  private removeAllLines() {
    this.lines.forEach(line => {
      line.remove();
    });

    this.lines = [];
  }

  private truncateText(text?: string){
    if(!text) return; 

    if(text.length > 25){
      return text.substring(0, 25) + "...   ";
    }
    
    return text;
  }
}

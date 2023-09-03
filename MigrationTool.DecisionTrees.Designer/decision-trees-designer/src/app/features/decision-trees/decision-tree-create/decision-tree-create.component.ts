import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Item } from 'src/core/interfaces/item';
import { DecisionTreeService } from 'src/core/services/decision-tree.service';
import { DecisionTreeDesignerComponent } from '../designer/decision-tree-designer/decision-tree-designer.component';
import { MatDrawer } from '@angular/material/sidenav';


@Component({
  selector: 'app-decision-tree-create',
  templateUrl: './decision-tree-create.component.html',
  styleUrls: ['./decision-tree-create.component.scss']
})
export class DecisionTreeCreateComponent implements OnInit{
  createDecisionTreeForm!: FormGroup;

  items: Item[];

  // Designer
  @ViewChild('designer', { static: true }) designer!: DecisionTreeDesignerComponent;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  @ViewChild('previewer', { static: true }) previewer!: ElementRef;
  
  showMatProgress: boolean;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DecisionTreeCreateComponent>, private decisionTreeService: DecisionTreeService,
    private renderer: Renderer2) {
    this.items = [];

    this.showMatProgress = false;
  }

  ngOnInit(): void {
    this.createDecisionTreeForm = this.fb.group({
      name: new FormControl(null, [Validators.required, Validators.maxLength(150)])
    });

    const observer = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;

      var child = new ElementRef(document.getElementById("drawer-elem"));    
      
      if(width < 600){     
       this.renderer.setStyle(child.nativeElement, "width", '100%');
      }
    });

    observer.observe(this.previewer.nativeElement);
  }

  onCreateClick(): void {
    if (this.createDecisionTreeForm.valid) {
      this.showMatProgress = true;

      const decisionTree = {
        name: this.createDecisionTreeForm.get("name")?.value,
        items: this.items
      };

      // Create decisionTree
      this.decisionTreeService.create(decisionTree)
        .subscribe(result => {
          this.showMatProgress = false;

          this.dialogRef.close(result);
        }, error => console.error(error));
    }
  }

  onNodeSelected(order: number): void {
    this.designer.setSelectedItemByOrder(order);
  }
}

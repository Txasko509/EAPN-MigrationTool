import { Component, ElementRef, Inject, LOCALE_ID, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DecisionTree } from 'src/core/interfaces/decision-tree';
import { Item } from 'src/core/interfaces/item';
import { UtcToLocalTimePipe } from 'src/core/pipes/utc-to-local-time.pipe';
import { DecisionTreeService } from 'src/core/services/decision-tree.service';
import { ItemsChangeNotificationService } from 'src/core/services/items-change-notification.service';
import { formatDate } from '@angular/common';
import { DecisionTreeDesignerComponent } from '../designer/decision-tree-designer/decision-tree-designer.component';
import { MatDrawer } from '@angular/material/sidenav';

export interface DecisionTreeEditDialogData {
  decisionTree: DecisionTree;
}

@Component({
  selector: 'app-decision-tree-edit',
  templateUrl: './decision-tree-edit.component.html',
  styleUrls: ['./decision-tree-edit.component.scss']
})
export class DecisionTreeEditComponent implements OnInit{
  editDecisionTreeForm!: FormGroup;

  items!: Item[];

  // Designer
  @ViewChild('designer', { static: true }) designer!: DecisionTreeDesignerComponent;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  @ViewChild('previewer', { static: true }) previewer!: ElementRef;
  
  showMatProgress: boolean;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: DecisionTreeEditDialogData, 
  private dialogRef: MatDialogRef<DecisionTreeEditComponent>, private decisionTreeService: DecisionTreeService,
  private itemsChangeNotificationService: ItemsChangeNotificationService, private datepipe: UtcToLocalTimePipe,
   @Inject(LOCALE_ID) public locale: string, private renderer: Renderer2) {
   // this.items = [];

    this.showMatProgress = false;
  }

  ngOnInit(): void {
    this.editDecisionTreeForm = this.fb.group({
      idRef: new FormControl({value: this.data.decisionTree.id, disabled: true}),
      createdDate: new FormControl({value:  formatDate(this.datepipe.transform(this.data.decisionTree?.date ?? new Date()), 'dd/MM/yyyy HH:mm', this.locale), disabled: true}),
      name: new FormControl(this.data.decisionTree.name, [Validators.required, Validators.maxLength(150)])
    });

    this.items = this.data.decisionTree.items;

    this.itemsChangeNotificationService.notifyChanges(this.items);

    const observer = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;

      var child = new ElementRef(document.getElementById("drawer-elem"));    
      
      if(width < 600){     
       this.renderer.setStyle(child.nativeElement, "width", '100%');
      }
    });

    observer.observe(this.previewer.nativeElement);
  }

  onUpdateClick(): void {
    if (this.editDecisionTreeForm.valid) {
      this.showMatProgress = true;

      this.data.decisionTree.name = this.editDecisionTreeForm.get("name")?.value;
      this.data.decisionTree.items = this.items;

      // Update decisionTree
      this.decisionTreeService.update(this.data.decisionTree)
        .subscribe(result => {
          this.showMatProgress = false;

          this.dialogRef.close(result);
        }, error => console.error(error));
    }
  }
}

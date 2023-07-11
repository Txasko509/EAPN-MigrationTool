import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from 'src/core/interfaces/item';
import { DecisionTreeService } from 'src/core/services/decision-tree.service';
import { DecisionTreeDesignerComponent } from '../designer/decision-tree-designer/decision-tree-designer.component';


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
  
  showMatProgress: boolean;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DecisionTreeCreateComponent>, private decisionTreeService: DecisionTreeService) {
    this.items = [];

    this.showMatProgress = false;
  }

  ngOnInit(): void {
    this.createDecisionTreeForm = this.fb.group({
      name: new FormControl(null, [Validators.required, Validators.maxLength(150)])
    });
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
}

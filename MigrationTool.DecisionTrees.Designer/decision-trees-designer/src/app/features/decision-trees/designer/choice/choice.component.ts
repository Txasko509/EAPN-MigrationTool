import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Choice } from 'src/core/interfaces/choice';
import { Item } from 'src/core/interfaces/item';
import * as Enumerable from "linq-es2015";

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent  implements OnInit{
  @Input() choice!: Choice;
  @Input() itemsToGo!: Item[];

  @Output() remove = new EventEmitter();
  @Output() gotoItemSelected = new EventEmitter<number>();
  
  choiceForm!: FormGroup;
  constructor(private fb: FormBuilder) {
  }
   
  ngOnInit(): void {  
    this.choiceForm = this.fb.group({
      text: new FormControl(this.choice?.text, [Validators.required, Validators.maxLength(225)]),
      gotoItem: new FormControl(this.choice?.gotoItem?.order)
    });

    this.choiceForm.get("text")?.valueChanges.subscribe(selectedValue => {
      this.choice.text = selectedValue;
    });

    this.choiceForm.get("gotoItem")?.valueChanges.subscribe(selectedValue => {
      var item = Enumerable.asEnumerable<Item>(this.itemsToGo).Where(i => i.order === selectedValue).FirstOrDefault();
      
      this.choice.gotoItem = item;

      this.gotoItemSelected.emit(item.order);
    });
  }

  onRemoveChoiceClick() {
    this.remove.emit(this.choice); 
  }
}

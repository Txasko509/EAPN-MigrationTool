import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Choice } from 'src/core/interfaces/choice';
import { Item } from 'src/core/interfaces/item';

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
      text: new FormControl(this.choice?.text, [Validators.required, Validators.maxLength(150)]),
      gotoItem: new FormControl(this.choice?.gotoItem)
    });

    this.choiceForm.get("text")?.valueChanges.subscribe(selectedValue => {
      this.choice.text = selectedValue;
    });

    this.choiceForm.get("gotoItem")?.valueChanges.subscribe(selectedValue => {
      this.choice.gotoItem = selectedValue;

      this.gotoItemSelected.emit(selectedValue);
    });
  }

  onRemoveChoiceClick() {
    this.remove.emit(this.choice); 
  }
}

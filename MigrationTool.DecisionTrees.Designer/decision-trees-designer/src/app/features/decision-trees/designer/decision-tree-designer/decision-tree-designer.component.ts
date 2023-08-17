import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Item } from 'src/core/interfaces/item';
import { ItemType } from 'src/core/interfaces/item-type';
import * as Enumerable from "linq-es2015";
import { MatDialog } from '@angular/material/dialog';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { Question } from 'src/core/interfaces/question';
import { ItemsChangeNotificationService } from 'src/core/services/items-change-notification.service';
import { Answer } from 'src/core/interfaces/answer';
import { Choice } from 'src/core/interfaces/choice';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from 'src/core/services/spinner.service';
import { CurrentItemChangeNotificationService } from 'src/core/services/current-item-change-notification.service';
import { distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'app-decision-tree-designer',
  templateUrl: './decision-tree-designer.component.html',
  styleUrls: ['./decision-tree-designer.component.scss']
})
export class DecisionTreeDesignerComponent implements OnInit{
  @Input() items: Item[];

  itemsToggleForm!: FormGroup;
  itemTypeToogleForm!: FormGroup;

  questionItemForm!: FormGroup;
  answerItemForm!: FormGroup;

  itemType = ItemType;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private itemsChangeNotificationService: ItemsChangeNotificationService,
    private currentItemChangeNotificationService: CurrentItemChangeNotificationService, private translate: TranslateService, 
    public spinnerService: SpinnerService) {
    this.items = [];  
  }
   
  ngOnInit(): void {  
    this.itemsToggleForm = this.fb.group({
      selectedItem: new FormControl('', [])
    });

    this.itemTypeToogleForm = this.fb.group({
      selectedItemType: new FormControl(null)
    });

    this.questionItemForm = this.fb.group({
      text: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      subText: new FormControl('', [Validators.maxLength(150)])
    });

    this.questionItemForm.valueChanges.subscribe(item => {
      var selectedItem = this.itemsToggleForm.get("selectedItem")?.value;

      selectedItem.text = item.text;
      selectedItem.subText = item.subText;
    });

    this.answerItemForm = this.fb.group({
      text: new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(2000)]),
      subText: new FormControl('', [Validators.maxLength(150)]),
      textLink: new FormControl('', [Validators.maxLength(200)]),
      info: new FormControl({value: '', disabled: true}, [Validators.maxLength(150)])
    });

    this.answerItemForm.valueChanges.subscribe(item => {
      var selectedItem = this.itemsToggleForm.get("selectedItem")?.value;

     // selectedItem.text = item.text;
      selectedItem.subText = item.subText;
      selectedItem.textLink = item.textLink;
      selectedItem.info = item.info;
    });

    this.answerItemForm.controls['textLink'].valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      if(value.length > 0){
        this.answerItemForm.controls['info'].enable();
      }
      else{
        this.answerItemForm.controls['info'].disable();

        this.answerItemForm.patchValue({
          info: ''
        });
      }
    });

    if(this.items.length > 0){
      this.setSelectedItem(this.items[0]);
    }
  }

  onAddItemClick() {
    // New default item (question)
    const question = {} as Question;

    question.$type = ItemType.Question;
    question.order = this.items.length;
    question.choices = [];


    this.items.push(question);

    this.itemsToggleForm.patchValue({
      selectedItem: question
    });

    this.itemTypeToogleForm.patchValue({
      selectedItemType: ItemType.Question
    });

    this.questionItemForm.patchValue({
      text: this.translate.instant('DECISION-TREES.DESIGNER.TEXT-DEFAULT-NODE'),
      subText: ""
    });

    if(this.items.length === 0 || this.items.length === 1){
      this.itemsChangeNotificationService.notifyChanges(this.items);
    }   
    
    this.currentItemChangeNotificationService.notifyChanges(question);
  }

  onRemoveItemClick() {
    var selectedItem = this.itemsToggleForm.get("selectedItem")?.value;
    let index = this.items.indexOf(selectedItem);

    this.items?.splice(index, 1);

    if(index > 0){
      this.setSelectedItem(this.items[(index - 1)]);
    }

    // Remove gotoItem references
    var qItems = Enumerable.asEnumerable<Question>(this.items).Where(i => i.$type === ItemType.Question && 'choices' in i && i.choices !== undefined).ToArray();
    qItems.forEach(qItem => {
      if(qItem.choices !== undefined){
        qItem.choices.forEach(qItem => {
          if(qItem.gotoItem !== null && qItem.gotoItem?.order === selectedItem.order){
            qItem.gotoItem = undefined;
          }
        });
      }      
    });
    
    this.itemsChangeNotificationService.notifyChanges(this.items);
  }

  onSelectedItemClick(item: Item) {
   this.setSelectedItem(item);

   this.currentItemChangeNotificationService.notifyChanges(item);
  }

  onSelectedItemTypeClick(type: ItemType) {
    var selectedItem = this.itemsToggleForm.get("selectedItem")?.value;

    selectedItem.$type = type;

    selectedItem.text = null;
    selectedItem.subText = null;    

    if(type === ItemType.Question){
      selectedItem.choices = [];
    }
    else if(type === ItemType.Answer){
      selectedItem.text = this.translate.instant('DECISION-TREES.DESIGNER.TEXT-DEFAULT-NODE');
      selectedItem.textLink = null;
      selectedItem.info = null;
    }
  }

  onAddChoiceClick() {
    var selectedItemIndex = this.itemsToggleForm.get("selectedItem")?.value;

    var item = Enumerable.asEnumerable<Question>(this.items).ElementAtOrDefault(selectedItemIndex - 1);

    if(item !== undefined){
      item.choices?.push({});      
    }
  }

  onTextEditorClick() {
    this.spinnerService.display(true);

    const dialogRef = this.dialog.open(TextEditorComponent, {
      data: {text: this.itemsToggleForm.get("selectedItem")?.value?.text},
      maxWidth: '98vw',
      width: '750px'
    });

    dialogRef.afterOpened().subscribe(open => {
      setTimeout (() => {
        this.spinnerService.display(false);
      }, 1000);      
    });

    dialogRef.afterClosed().subscribe(content => {
      if (content === undefined || content === null) return;

      var selectedItem = this.itemsToggleForm.get("selectedItem")?.value;
      selectedItem.text = content; 
    });
  }

  private setSelectedItem(item: Item){
    this.itemsToggleForm.patchValue({
      selectedItem: item
    });

    this.itemTypeToogleForm.patchValue({
      selectedItemType: item.$type
    });

    if(this.SelectedItem.$type === ItemType.Question){
      this.questionItemForm.patchValue({
        text: item.text,
        subText: item.subText
      });
    }
    else if(this.SelectedItem.$type === ItemType.Answer){
      this.answerItemForm.patchValue({
       // text: item.text,
        subText: item.subText,
        textLink: (<Answer>item)?.textLink,
        info: (<Answer>item)?.info
      });
    }
  }

  get SelectedItem() {
    return this.itemsToggleForm.get("selectedItem")?.value;
  }

  get IsSelectedItemValid(){
    if(this.items.length === 0) return true;

    var selectedItem = this.itemsToggleForm.get("selectedItem")?.value;

    if(selectedItem == ''){
      return true;
    }

    if(selectedItem.$type === this.itemType.Question){
      let validChoices = true;
      selectedItem.choices.forEach((choice: Choice) => {
        if(choice.text === undefined || choice.text === null || choice.text === ''){
          validChoices = false;
        }
      });

      return this.questionItemForm.valid && validChoices;
    }
    else if(selectedItem.$type === this.itemType.Answer){
      let validTextEditor = true;

      if(selectedItem.text === undefined || selectedItem.text === null || selectedItem.text === ''){
        validTextEditor = false;
      }

      return this.answerItemForm.valid && validTextEditor;
    }
    
    return true;
  }
}

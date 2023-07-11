import { Component, Input, OnInit } from '@angular/core';
import { Choice } from 'src/core/interfaces/choice';
import { Item } from 'src/core/interfaces/item';
import { Question } from 'src/core/interfaces/question';
import { ItemsChangeNotificationService } from 'src/core/services/items-change-notification.service';
import * as Enumerable from "linq-es2015";

@Component({
  selector: 'app-question-choices',
  templateUrl: './question-choices.component.html',
  styleUrls: ['./question-choices.component.scss']
})
export class QuestionChoicesComponent  implements OnInit {
  @Input() question!: Question;
  @Input() itemsFromTree!: Item[];

  constructor(private itemsChangeNotificationService: ItemsChangeNotificationService) {    
  }
   
  ngOnInit(): void {  
  }
  
  onAddChoiceClick() {    
    this.question.choices?.push({order: this.question.choices.length});   
  }

  onRemoveChoiceClick(choice: Choice) {
    if(this.question.choices){
      let index = this.question.choices.indexOf(choice);

      this.question.choices?.splice(index, 1);

      // Reorder choices
      let order = 0;
      this.question.choices.forEach(choice => {
        if(choice.order !== order){
          choice.order = order;
        }
        order++;
      });
  
      this.itemsChangeNotificationService.notifyChanges(this.itemsFromTree);
    }    
  }

  onGotoItemSelected(selected: number) {
    this.itemsChangeNotificationService.notifyChanges(this.itemsFromTree);
  }

  get ItemsForChoices(){
    return Enumerable.asEnumerable<Item>(this.itemsFromTree).Where(i => i.order !== this.question.order).ToArray();
  }
}

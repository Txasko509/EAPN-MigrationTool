import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConfigService } from 'src/app/app.config.service';

export interface TextEditorDialogData {
  text: string;
}

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit{
  textEditorForm!: FormGroup;

  public config: any;
  tinyMceApiKey: string;
  tinyMceConfig: any;
  editor: any;
  
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<TextEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TextEditorDialogData,
    private configApp: AppConfigService) {
    this.tinyMceApiKey = this.configApp.tinyMceApiKey;
  }

  ngOnInit(): void {
    this.textEditorForm = this.fb.group({
      editor: new FormControl(this.data.text, [Validators.required])
    });

    this.configureTinyMce();
  }
  
  handleEditorInit(obj: any): void {
    // Close the dialog, return false
    this.editor = obj.editor;
  }

  onAcceptClick() {    
    var content = this.textEditorForm.get("editor")?.value;

    this.dialogRef.close(content);     
  }

  configureTinyMce() {
    this.tinyMceConfig = {
      icons: 'material',
      skin: 'borderless',
      plugins: 'wordcount paste list link code',
      menubar: false,
      language: 'es',
      min_height: 300,
      paste_block_drop: true,
      extended_valid_elements: '*[*]',
      automatic_uploads: true,      
      toolbar:
        'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | image code'
    };
  }
}

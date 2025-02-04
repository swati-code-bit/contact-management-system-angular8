import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
})
export class FormGeneratorComponent implements OnChanges {
  @Input() jsonInput: string = '';
  @Input() selectedFormId: string = '';
  @Output() formSubmit = new EventEmitter<any>();

  form: FormGroup;
  formFields: any[] = [];
  formName: string = '';
  isJsonValid: boolean = true;

  constructor(private fb: FormBuilder, private formService: FormService) {
    this.form = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jsonInput'] && this.jsonInput) {
      this.generateFormFromJson();
    }
    if (changes['selectedFormId'] && this.selectedFormId) {
      this.generateFormFromDb();
    }
  }

  generateFormFromJson(): void {
    try {
      const schema = JSON.parse(this.jsonInput);
      
      if (schema && schema.fields && Array.isArray(schema.fields)) {
        this.formFields = schema.fields;
        this.createForm();
        this.isJsonValid = true;
      } else {
        this.isJsonValid = false;
      }
    } catch (e) {
      this.isJsonValid = false;
    }
  }

  generateFormFromDb(): void {
    if (!this.selectedFormId) return;

    this.formService.getFormSchemaById(this.selectedFormId).subscribe(
      (formSchema: any) => {
        if (formSchema && formSchema.fields && Array.isArray(formSchema.fields)) {
          this.formFields = formSchema.fields;
          this.formName = formSchema.name;
          this.createForm();
        }
      },
      (error) => {
        console.error('Error fetching form schema:', error);
      }
    );
  }

  createForm(): void {
    const formGroup: { [key: string]: FormControl } = {};
    this.formFields.forEach(field => {
      formGroup[field.name] = new FormControl('', field.required ? Validators.required : null);
    });
    this.form = new FormGroup(formGroup);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }
}

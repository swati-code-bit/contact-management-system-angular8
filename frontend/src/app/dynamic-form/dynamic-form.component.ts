import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { FormField } from "../models/form-field.model";

@Component({
  selector: "app-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.css"],
})
export class DynamicFormComponent implements OnChanges {
  @Input() formFields: FormField[] = []; 
  @Input() form: FormGroup;
  @Input() previewMode: boolean = false;
  @Input() customSubmitHandler: Function;

  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["formFields"] && this.formFields.length) {
      this.createDynamicForm();
      console.log("Form Initialized:", this.form);
    }
  }

  constructor(private fb: FormBuilder) {}

  createDynamicForm(): void {
    let group: any = {};

    this.formFields.forEach((field) => {
      const validators = field.required ? [Validators.required] : [];

      if (field.type === "checkbox" || field.type === "radio") {
        group[field.name] = [
          { value: field.value || false, disabled: field.disabled },
        ];
      } else {
        group[field.name] = [
          { value: field.value || "", disabled: field.disabled },
          validators,
        ];
      }
    });

    this.form = this.fb.group(group);
  }

  isFieldValid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control && control.touched && control.invalid;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);

    if (control && control.hasError("required")) {
      return `${fieldName} is required`;
    }
    if (control && control.hasError("email")) {
      return "Invalid email address";
    }
    if (control && control.hasError("maxlength")) {
      return `Maximum length exceeded for ${fieldName}`;
    }
    if (control && control.hasError("minlength")) {
      return `Minimum length not met for ${fieldName}`;
    }
    if (control && control.hasError("pattern")) {
      return `Invalid value for ${fieldName}`;
    }

    return "Invalid field";
  }

  onSubmit(): void {
    console.log("Form before submit:", this.form);
    if (this.form && this.form.valid) {
      console.log("Form Submitted!", this.form.value);
      this.formSubmit.emit(this.form.value);
      if (this.customSubmitHandler) {
        this.customSubmitHandler(this.form.value);
      }
    } else {
      console.error("Form is invalid or not initialized", this.form);
    }
  }
  
  
}

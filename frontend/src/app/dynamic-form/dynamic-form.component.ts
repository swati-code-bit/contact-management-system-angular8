import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["formFields"] && this.formFields.length) {
      this.createDynamicForm();
    }
  }

  createDynamicForm(): void {
    if (this.formFields && this.formFields.length) {
      const group: { [key: string]: any } = {};

      this.formFields.forEach((field: FormField) => {
        const validators = [];

        if (field.required) {
          validators.push(Validators.required);
        }

        if (field.validations) {
          if (field.validations.maxLength) {
            validators.push(Validators.maxLength(field.validations.maxLength));
          }
          if (field.validations.minLength) {
            validators.push(Validators.minLength(field.validations.minLength));
          }
          if (field.validations.pattern) {
            validators.push(Validators.pattern(field.validations.pattern));
          }
          if (field.validations.email) {
            validators.push(Validators.email);
          }
        }

        group[field.name] = new FormControl(
          { value: field.value || "", disabled: field.disabled || false },
          validators
        );
      });

      this.form = new FormGroup(group);
    }
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
}

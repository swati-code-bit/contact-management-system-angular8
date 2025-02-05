import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { FormField } from "../models/form-field.model";

@Injectable({
  providedIn: "root",
})
export class FormBuilderService {
  constructor(private fb: FormBuilder) {}

  createForm(formFields: FormField[]): FormGroup {
    const group: { [key: string]: any } = {};

    formFields.forEach((field: FormField) => {
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

    return this.fb.group(group);
  }
}

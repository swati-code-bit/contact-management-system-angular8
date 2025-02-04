import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormService } from "../services/form.service";

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  value?: any;
  disabled?: boolean;
  options?: string[];
  checked?: boolean | string;
  validations?: {
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    email?: boolean;
  };
}

@Component({
  selector: "app-config",
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.css"],
})
export class ConfigComponent implements OnInit {
  jsonInput: string = "";
  formFields: FormField[] = [];
  form: FormGroup;
  formName: string = "";
  showPreview: boolean = false;
  formNames: any[] = [];  
  selectedFormId: string = ''; 

  constructor(private fb: FormBuilder, private formService: FormService) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.formService.getFormNames().subscribe(
      (response: any) => {
        console.log('API Response:', response);
        this.formNames = response; 
      },
      (error) => {
        console.error('Error fetching form names', error);
      }
    );
  }

  onFormSelectChange(): void {
    if (this.selectedFormId) {
      this.setForm();
    }
  }

  setForm(): void {
    this.formService.getFormSchemaById(this.selectedFormId).subscribe((formData: any) => {
      this.formFields = formData.schema.formFields;  // Update formFields with the selected form schema
      this.createForm();  // Rebuild the form based on the new schema
    });
  }

  fetchFormSchema(formName: string): void {
    this.formService.getFormSchema(formName).subscribe((formData: any) => {
      this.formFields = formData.schema.formFields;
      this.createForm();
    });
  }

  generateForm(): void {
    try {
      const formStructure = JSON.parse(this.jsonInput);
      if (formStructure && formStructure.formFields) {
        this.formFields = formStructure.formFields;
        this.createForm();
      } else {
        alert("Invalid JSON structure!");
      }
    } catch (e) {
      alert("Invalid JSON format!");
      console.error("JSON parse error:", e);
    }
  }

  createForm(): void {
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

      group[field.name] = [
        {
          value: field.value || "",
          disabled: field.disabled,
        },
        validators,
      ];
    });

    this.form = this.fb.group(group);
  }

  // Helper method to check if a field has errors
  hasError(fieldName: string, errorType: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  // Helper method to get error message
  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return "";

    const errors = control.errors;
    if (errors["required"]) return "This field is required";
    if (errors["maxlength"])
      return `Maximum length is ${errors["maxlength"].requiredLength} characters`;
    if (errors["minlength"])
      return `Minimum length is ${errors["minlength"].requiredLength} characters`;
    if (errors["pattern"]) return "Invalid format";
    if (errors["email"]) return "Invalid email format";

    return "Invalid input";
  }

  submitContact(): void {
    alert("This is just a preview!");
  }

  saveForm(): void {
    if (!this.formName) {
      alert("Please enter a form name.");
      return;
    }

    const formData = {
      formName: this.formName,
      schema: {
        formFields: this.formFields,
      },
    };

    // Use the service to save the form data
    this.formService.saveForm(formData).subscribe(
      (response) => {
        alert("Form saved successfully!");
        console.log(response);
      },
      (error) => {
        alert("Failed to save the form.");
        console.error(error);
      }
    );
  }
}

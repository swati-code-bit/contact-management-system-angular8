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
  showGeneratedPreview: boolean = false;  // Manage generated form preview
  showSelectedPreview: boolean = false;   // Manage selected form preview
  formNames: any[] = [];
  selectedFormId: string = '';
  schema: any = {};

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
    if (this.selectedFormId) {
      this.formService.getFormById(this.selectedFormId).subscribe(
        (response) => {
          this.formName = response.formName;
          this.formFields = response.schema.formFields;
          this.createForm();
          this.showSelectedPreview = true;  // Set the selected form preview visible
        },
        (error) => {
          console.error('Error fetching form data', error);
        }
      );
    }
  }

  generateForm(): void {
    try {
      const formStructure = JSON.parse(this.jsonInput);
      if (formStructure && formStructure.formFields) {
        this.formFields = formStructure.formFields;
        this.createForm();
        this.schema = formStructure;
        this.showGeneratedPreview = true;  // Show generated form preview
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

  handleGeneratedForm(): void {
    if (this.form.valid) {
      console.log("Form is valid and ready to be submitted or saved");
      console.log("Form Schema:", this.schema);
  
      if (this.selectedFormId) {
        console.log("Showing preview for selected form...");
        this.showSelectedPreview = true;
      }
  
      this.submitContact();
    } else {
      console.log("Form is not valid. Please check the inputs.");
    }
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



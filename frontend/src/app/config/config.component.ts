import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FormService } from "../services/form.service";
import { FormField } from "../models/form-field.model";

@Component({
  selector: "app-config",
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.css"],
})
export class ConfigComponent implements OnInit {
  jsonFormInput: string = "";
  jsonFormFields: FormField[] = [];
  dropdownFormFields: FormField[] = [];
  jsonForm: FormGroup;
  dropdownForm: FormGroup;
  formName: string = "";
  showJsonFormPreview: boolean = false;
  showDropdownFormPreview: boolean = false;
  formNames: any[] = [];
  selectedFormId: string = "";
  formSchema: any = {};

  constructor(private fb: FormBuilder, private formService: FormService) {
    this.jsonForm = this.fb.group({});
    this.dropdownForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.dropdownForm = this.fb.group({}); // Initialize the form here

    const storedFormId = localStorage.getItem("selectedFormId");
    if (storedFormId) {
      this.selectedFormId = storedFormId;
      this.loadDropdownForm();
    }

    this.formService.getFormNames().subscribe(
      (response: any) => {
        this.formNames = response;
      },
      (error) => {
        console.error("Error fetching form names", error);
      }
    );
  }

  onDropdownFormSelect(): void {
    if (this.selectedFormId) {
      this.loadDropdownForm();
    }
  }

  loadDropdownForm(): void {
    if (this.selectedFormId) {
      localStorage.setItem("selectedFormId", this.selectedFormId);

      this.formService.getFormById(this.selectedFormId).subscribe(
        (response) => {
          this.formName = response.formName;
          this.dropdownFormFields = response.schema.formFields;
          this.showDropdownFormPreview = true;
          console.log("Selected Form ID:", this.selectedFormId);
        },
        (error) => {
          console.error("Error fetching form data", error);
        }
      );
    }
  }

  generateJsonForm(): void {
    try {
      const formStructure = JSON.parse(this.jsonFormInput);
      if (formStructure && formStructure.formFields) {
        this.jsonFormFields = formStructure.formFields;
        this.formSchema = formStructure;
        this.showJsonFormPreview = true;
      } else {
        alert("Invalid JSON structure!");
      }
    } catch (e) {
      alert("Invalid JSON format!");
      console.error("JSON parse error:", e);
    }
  }

  saveJsonForm(): void {
    if (!this.formName) {
      alert("Please enter a form name.");
      return;
    }

    const formData = {
      formName: this.formName,
      schema: {
        formFields: this.jsonFormFields,
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

  onPreviewJsonForm(): void {
    alert("This is just a preview of the generated JSON form");
  }

  onSubmitJsonForm(formData: any): void {
    // Show alert for preview
    alert("This is just a preview of the generated JSON form");
    console.log("Received form data from DynamicFormComponent:", formData);
  }

  onSubmitDropdownForm(formData: any): void {
    alert("This is just a preview of the selected dropdown form");
    console.log("Received dropdown form data from DynamicFormComponent:", formData);
  }
}

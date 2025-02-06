import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FormService } from "../services/form.service";
import { ContactService } from "../services/contact.service";

@Component({
  selector: "app-add-contact-dynamic",
  templateUrl: "./add-contact-dynamic.component.html",
  styleUrls: ["./add-contact-dynamic.component.css"],
})
export class AddContactDynamicComponent implements OnInit {
  form: FormGroup;
  formFields: any[] = [];

  constructor(
    private formService: FormService,
    private contactService: ContactService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const storedFormId = localStorage.getItem("selectedFormId");
    if (storedFormId) {
      this.fetchFormSchema(storedFormId);
    } else {
      console.log("No form ID found in localStorage.");
    }
    this.form = this.fb.group({});
  }

  fetchFormSchema(formId: string): void {
    this.formService.getFormById(formId).subscribe(
      (response) => {
        this.formFields = response.schema.formFields;
        console.log("Fetched Form Fields:", this.formFields);

        // Initialize form controls before trying to add them dynamically
        const formGroup = {};

        this.formFields.forEach((field) => {
          formGroup[field.name] = this.fb.control(field.value || ""); // Set default value to empty string if not provided
        });

        // Now assign to form
        this.form = this.fb.group(formGroup);
      },
      (error) => {
        console.error("Error fetching form schema:", error);
      }
    );
  }

  addContact(formData: any): void {
    console.log("Received data in add dynamic contact form:", formData);
  }
}

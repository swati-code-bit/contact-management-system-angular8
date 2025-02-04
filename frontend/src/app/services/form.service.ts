import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

interface FormData {
  formName: string;
  schema: {
    formFields: any[];
  };
}

@Injectable({
  providedIn: "root",
})
export class FormService {
  private apiUrl = "http://localhost:5000/api/forms";
  

  constructor(private http: HttpClient) {}

  saveForm(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  getFormNames(): Observable<any> {
    return this.http.get(`${this.apiUrl}/form-names`);
  }

  getFormSchemaById(formId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${formId}`);  // Use form ID in the URL
  }
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FormService {
  private apiUrl = "http://localhost:5000/api/forms";

  constructor(private http: HttpClient) {}

  saveForm(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, formData);
  }

  getFormNames(): Observable<any> {
    return this.http.get(`${this.apiUrl}/form-names`);
  }

  getFormById(formId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${formId}`);
  }
}

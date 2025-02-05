export interface FormField {
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

import { FormGroup } from '@angular/forms';

export class AppUtils {
  public static getFormErrors(theForm: any, formErrors: any): any {
    console.log()
    for (const field in formErrors) {
      if (!formErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      formErrors[field] = {};

      // Get the control
      const control = theForm.get(field);

      if (control && control.dirty && !control.valid) {
        formErrors[field] = control.errors;
      }
    }

    return formErrors;
  }

}

import { FormGroup } from "@angular/forms";

// To validate date
export function DateGreaterOrEqualThan(
  controlNameTo : string,
  controlNameFrom: string
) {
  return (formGroup: FormGroup) => {
    const to = formGroup.controls[controlNameTo];
    const from = formGroup.controls[controlNameFrom];    

    if (to.errors && !to.errors["dateGreaterThan"]) {
      return;
    }

    if(!to.value || !from.value){
      return;
    }

    const toDate = new Date(to.value); 
    const fromDate = new Date(from.value);
    
    toDate.setSeconds(0);
    toDate.setMilliseconds(0);
    fromDate.setSeconds(0);
    fromDate.setMilliseconds(0);    

    if (toDate < fromDate ) {
      to.setErrors({ dateGreaterOrEqualThan: true });
    } else {
      to.setErrors(null);
    }
  };
}
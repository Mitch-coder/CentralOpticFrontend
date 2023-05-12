import { Validators } from "@angular/forms";

export const FormDataValidators =[
    { 'text':['',[Validators.required]] },
    { 'email':['',[Validators.required,Validators.email]] }
]
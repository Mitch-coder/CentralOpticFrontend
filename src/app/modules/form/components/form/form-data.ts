import { Validators } from '@angular/forms';

export interface FormData{
    label: string;
    type: string;
    placeholder: string;
    alert:string;
    icon?: string;
    formControlName: string;
    formValidators: {};
    class?:string;
    option?:string[];
    value?:string | FormDataVal;
    readonly?:boolean;
}

export interface FormDataVal{
    id:number;
    value:string;
    icon?:string;
    class?:string;
}

// export interface FormSelectData{
//     idIcon : string;
//     id : String;
//     idValue : string;
//     nameIcon : string;
//     name : string;
//     nameValue : string
// }
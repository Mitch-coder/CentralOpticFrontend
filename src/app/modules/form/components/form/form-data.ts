import { Validators } from '@angular/forms';

// export const formData =[
//     {
//         label: 'Nombre', //Nombre que se presentara en el texto
//         type: 'text', //El tipo del input que se usara
//         placeholder: 'Porfavor ingrese su nombre',
//         icon: '',
//         formControlName:'name', //Conectar con las reglas de validacion
//         formValidators:{'name':['',[Validators.required]]} //reglas de validacion
//         //primer dato: el nombre de la variable | [texto que se validara(inicializar en vacio), reglas de validacion]
//     }
// ];

export interface FormData{
    label: string;
    type: string;
    placeholder: string;
    alert:string;
    icon: string;
    formControlName: string;
    formValidators: {};
    class?:string;
    option?:string[];
}
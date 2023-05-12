import { Router } from '@angular/router';
import { INavbarData } from './helper';

export const navbarData:INavbarData[]=[
    {
        routeLink: 'dashboard',
        icon: 'fa-solid fa-house',
        label: 'Inicio'
    },
    {
        routeLink: 'cliente',
        icon: 'fa-regular fa-circle-user',
        label: 'Cliente',
        items:[
            {
                routeLink: 'cliente/info',
                icon: 'fa-regular fa-address-card', 
                label: 'Informacion Cliente'
            },
            {
                routeLink: 'cliente/contacto-cliente',
                icon: 'fa-solid fa-mobile-screen-button',
                label: 'Contacto Cliente'
            }
        ]
    },
    {
        routeLink: 'empleado',
        icon: 'fa-solid fa-user-tie',
        label: 'Empleado',
        items:[
            {
                routeLink: 'empleado/info',
                icon: 'fa-regular fa-address-card', 
                label: 'Informacion Empleado'
            },
            {
                routeLink: 'empleado/contacto-empleado',
                icon: 'fa-solid fa-mobile-screen-button',
                label: 'Contacto Empleado'
            }
        ]
    },{
        routeLink: 'producto',
        icon: 'fa-solid fa-tags',
        label: 'Producto'
    },{
        routeLink:'factura',
        icon: 'fa-solid fa-file-invoice-dollar',
        label:'Factura'
    },{
        routeLink:'examen-vista',
        icon: 'fa-regular fa-eye',
        label:'Examen Vista'
    },{
        routeLink:'pago',
        icon: 'fa-solid fa-money-bill-1-wave',
        label:'Pago'
    },{
        routeLink:'detalle-factura',
        icon: 'fa-solid fa-receipt',
        label:'Detalle Factura'
    },{
        routeLink:'registro-bodega',
        icon: 'fa-solid fa-warehouse',
        label:'Registro Bodega'
    },{
        routeLink:'orden-pedido-entrega',
        icon: 'fa-solid fa-file-signature',
        label:'Orden Pedido Entrega'
    },{
        routeLink:'proveedor-producto',
        icon: 'fa-solid fa-truck-ramp-box',
        label:'Proveedor Producto'
    }
];

// <i class="fa-regular fa-circle-user"></i>

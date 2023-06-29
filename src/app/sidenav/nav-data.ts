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
                label: 'Información del Cliente'
            },
            {
                routeLink: 'cliente/contacto-cliente',
                icon: 'fa-solid fa-mobile-screen-button',
                label: 'Contactos del Cliente'
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
                label: 'Información del Empleado'
            },
            {
                routeLink: 'empleado/contacto-empleado',
                icon: 'fa-solid fa-mobile-screen-button',
                label: 'Contactos del Empleado'
            }
        ]
    },
    {
        routeLink:'provedor',
        icon: 'fa-solid fa-address-card',
        label:'Proveedor',
        items:[
            {
                routeLink: 'provedor/info',
                icon: 'fa-regular fa-address-card', 
                label: 'Información del Proveedor'
            },
            {
                routeLink: 'provedor/contacto-proveedor',
                icon: 'fa-solid fa-mobile-screen-button',
                label: 'Contactos del Proveedor'
            }
        ]
    },{
        routeLink:'factura',
        icon: 'fa-solid fa-file-invoice-dollar',
        label:'Factura'
    },{
        routeLink:'detalle-factura',
        icon: 'fa-solid fa-receipt',
        label:'Detalle Factura'
    },
    {
        routeLink: 'producto',
        icon: 'fa-solid fa-tags',
        label: 'Producto'
    },
    {
        routeLink:'proveedor-producto',
        icon: 'fa-solid fa-truck-ramp-box',
        label:'Producto Proveido'
    },{
        routeLink:'examen-vista',
        icon: 'fa-regular fa-eye',
        label:'Examen de Vista'
    },{
        routeLink:'pago',
        icon: 'fa-solid fa-money-bill-1-wave',
        label:'Pago'
    },
    {
        routeLink:'bodega',
        icon: 'fa-solid fa-store',
        label:'Bodega'
    },{
        routeLink:'registro-bodega',
        icon: 'fa-solid fa-warehouse',
        label:'Producto en Bodega'
    },
    {
        routeLink:'laboratorio',
        icon: 'fa-solid fa-flask-vial',
        label:'Laboratorio'
    } ,
    {
        routeLink:'orden-pedido',
        icon: 'fa-regular fa-paste',
        label:'Orden Pedido'
    },
    {
        routeLink:'entrega',
        icon: 'fa-solid fa-truck',
        label:'Entrega'
    }
     // {
    //     routeLink:'orden-pedido-entrega',
    //     icon: 'fa-solid fa-file-signature',
    //     label:'Orden Pedido Entrega'
    // },
    
];

// <i class="fa-regular fa-paste"></i>

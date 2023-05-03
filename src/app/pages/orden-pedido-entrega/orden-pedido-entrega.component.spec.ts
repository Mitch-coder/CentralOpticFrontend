import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenPedidoEntregaComponent } from './orden-pedido-entrega.component';

describe('OrdenPedidoEntregaComponent', () => {
  let component: OrdenPedidoEntregaComponent;
  let fixture: ComponentFixture<OrdenPedidoEntregaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenPedidoEntregaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenPedidoEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

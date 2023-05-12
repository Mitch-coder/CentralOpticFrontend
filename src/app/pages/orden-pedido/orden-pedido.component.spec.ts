import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenPedidoComponent } from './orden-pedido.component';

describe('OrdenPedidoComponent', () => {
  let component: OrdenPedidoComponent;
  let fixture: ComponentFixture<OrdenPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenPedidoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

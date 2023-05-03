import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorProductoComponent } from './proveedor-producto.component';

describe('ProveedorProductoComponent', () => {
  let component: ProveedorProductoComponent;
  let fixture: ComponentFixture<ProveedorProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProveedorProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedorProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

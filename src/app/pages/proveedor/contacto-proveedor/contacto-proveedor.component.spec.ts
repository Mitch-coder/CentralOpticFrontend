import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoProveedorComponent } from './contacto-proveedor.component';

describe('ContactoProveedorComponent', () => {
  let component: ContactoProveedorComponent;
  let fixture: ComponentFixture<ContactoProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactoProveedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoEmpleadoComponent } from './contacto-empleado.component';

describe('ContactoEmpleadoComponent', () => {
  let component: ContactoEmpleadoComponent;
  let fixture: ComponentFixture<ContactoEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactoEmpleadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

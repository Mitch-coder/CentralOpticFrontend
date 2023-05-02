import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenVistaComponent } from './examen-vista.component';

describe('ExamenVistaComponent', () => {
  let component: ExamenVistaComponent;
  let fixture: ComponentFixture<ExamenVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamenVistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

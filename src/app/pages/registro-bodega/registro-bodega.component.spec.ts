import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroBodegaComponent } from './registro-bodega.component';

describe('RegistroBodegaComponent', () => {
  let component: RegistroBodegaComponent;
  let fixture: ComponentFixture<RegistroBodegaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroBodegaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroBodegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSimpleComponent } from './table-simple.component';

describe('TableSimpleComponent', () => {
  let component: TableSimpleComponent;
  let fixture: ComponentFixture<TableSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableSimpleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

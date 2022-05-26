import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionVuelosComponent } from './administracion-vuelos.component';

describe('AdministracionVuelosComponent', () => {
  let component: AdministracionVuelosComponent;
  let fixture: ComponentFixture<AdministracionVuelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionVuelosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionVuelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionEmpleadosComponent } from './administracion-empleados.component';

describe('AdministracionEmpleadosComponent', () => {
  let component: AdministracionEmpleadosComponent;
  let fixture: ComponentFixture<AdministracionEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionEmpleadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

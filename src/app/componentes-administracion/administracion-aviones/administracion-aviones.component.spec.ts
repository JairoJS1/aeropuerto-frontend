import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionAvionesComponent } from './administracion-aviones.component';

describe('AdministracionAvionesComponent', () => {
  let component: AdministracionAvionesComponent;
  let fixture: ComponentFixture<AdministracionAvionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionAvionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionAvionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionAerolineasComponent } from './administracion-aerolineas.component';

describe('AdministracionAerolineasComponent', () => {
  let component: AdministracionAerolineasComponent;
  let fixture: ComponentFixture<AdministracionAerolineasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionAerolineasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionAerolineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

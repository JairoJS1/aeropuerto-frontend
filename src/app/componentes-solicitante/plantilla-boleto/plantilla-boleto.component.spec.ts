import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaBoletoComponent } from './plantilla-boleto.component';

describe('PlantillaBoletoComponent', () => {
  let component: PlantillaBoletoComponent;
  let fixture: ComponentFixture<PlantillaBoletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantillaBoletoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillaBoletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

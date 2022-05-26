import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaBoletoComponent } from './consulta-boleto.component';

describe('ConsultaBoletoComponent', () => {
  let component: ConsultaBoletoComponent;
  let fixture: ComponentFixture<ConsultaBoletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaBoletoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaBoletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

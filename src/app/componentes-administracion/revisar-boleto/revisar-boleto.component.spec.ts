import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisarBoletoComponent } from './revisar-boleto.component';

describe('RevisarBoletoComponent', () => {
  let component: RevisarBoletoComponent;
  let fixture: ComponentFixture<RevisarBoletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisarBoletoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisarBoletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

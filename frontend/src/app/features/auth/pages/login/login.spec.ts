import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Logins } from './login'; 

describe('LoginComponent', () => {
  let component: Logins;
  let fixture: ComponentFixture<Logins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Logins]
    }).compileComponents();

    fixture = TestBed.createComponent(Logins);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

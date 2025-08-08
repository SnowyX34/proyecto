import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuotationsView } from './admin-quotations-view';

describe('AdminQuotationsView', () => {
  let component: AdminQuotationsView;
  let fixture: ComponentFixture<AdminQuotationsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminQuotationsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminQuotationsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

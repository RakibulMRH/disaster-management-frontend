import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisisManagementComponent } from './crisis-management.component';

describe('CrisisManagementComponent', () => {
  let component: CrisisManagementComponent;
  let fixture: ComponentFixture<CrisisManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrisisManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrisisManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminArchiveComponent } from './admin-archive.component';

describe('AdminArchiveComponent', () => {
  let component: AdminArchiveComponent;
  let fixture: ComponentFixture<AdminArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

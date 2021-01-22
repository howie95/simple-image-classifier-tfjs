import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareDataComponent } from './prepare-data.component';

describe('PrepareDataComponent', () => {
  let component: PrepareDataComponent;
  let fixture: ComponentFixture<PrepareDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepareDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

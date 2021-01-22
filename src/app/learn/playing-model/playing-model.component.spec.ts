import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayingModelComponent } from './playing-model.component';

describe('PlayingModelComponent', () => {
  let component: PlayingModelComponent;
  let fixture: ComponentFixture<PlayingModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayingModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayingModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookDataComponent } from './create-book-data.component';

describe('CreateBookDataComponent', () => {
  let component: CreateBookDataComponent;
  let fixture: ComponentFixture<CreateBookDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBookDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBookDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

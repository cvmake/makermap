import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownMultiComponent } from './dropdown-multi.component';

describe('DropdownMultiComponent', () => {
  let component: DropdownMultiComponent;
  let fixture: ComponentFixture<DropdownMultiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownMultiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

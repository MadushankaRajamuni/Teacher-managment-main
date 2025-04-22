import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLeaveComponent } from './add-edit-leave.component';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
describe('AddEditLeaveComponent', () => {
  let component: AddEditLeaveComponent;
  let fixture: ComponentFixture<AddEditLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditLeaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

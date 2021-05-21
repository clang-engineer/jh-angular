import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPoint } from '../point.model';

@Component({
  selector: 'jhi-point-detail',
  templateUrl: './point-detail.component.html',
})
export class PointDetailComponent implements OnInit {
  point: IPoint | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ point }) => {
      this.point = point;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

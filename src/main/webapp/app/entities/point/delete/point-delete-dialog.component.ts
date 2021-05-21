import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPoint } from '../point.model';
import { PointService } from '../service/point.service';

@Component({
  templateUrl: './point-delete-dialog.component.html',
})
export class PointDeleteDialogComponent {
  point?: IPoint;

  constructor(protected pointService: PointService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pointService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

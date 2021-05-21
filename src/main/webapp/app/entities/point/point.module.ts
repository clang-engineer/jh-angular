import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PointComponent } from './list/point.component';
import { PointDetailComponent } from './detail/point-detail.component';
import { PointUpdateComponent } from './update/point-update.component';
import { PointDeleteDialogComponent } from './delete/point-delete-dialog.component';
import { PointRoutingModule } from './route/point-routing.module';

@NgModule({
  imports: [SharedModule, PointRoutingModule],
  declarations: [PointComponent, PointDetailComponent, PointUpdateComponent, PointDeleteDialogComponent],
  entryComponents: [PointDeleteDialogComponent],
})
export class PointModule {}

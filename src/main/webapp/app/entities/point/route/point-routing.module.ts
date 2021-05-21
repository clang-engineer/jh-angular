import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PointComponent } from '../list/point.component';
import { PointDetailComponent } from '../detail/point-detail.component';
import { PointUpdateComponent } from '../update/point-update.component';
import { PointRoutingResolveService } from './point-routing-resolve.service';

const pointRoute: Routes = [
  {
    path: '',
    component: PointComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PointDetailComponent,
    resolve: {
      point: PointRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PointUpdateComponent,
    resolve: {
      point: PointRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PointUpdateComponent,
    resolve: {
      point: PointRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pointRoute)],
  exports: [RouterModule],
})
export class PointRoutingModule {}

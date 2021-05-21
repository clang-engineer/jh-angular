import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'point',
        data: { pageTitle: 'jhipsterAngularApp.point.home.title' },
        loadChildren: () => import('./point/point.module').then(m => m.PointModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}

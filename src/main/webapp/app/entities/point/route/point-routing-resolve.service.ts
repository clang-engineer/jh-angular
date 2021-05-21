import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPoint, Point } from '../point.model';
import { PointService } from '../service/point.service';

@Injectable({ providedIn: 'root' })
export class PointRoutingResolveService implements Resolve<IPoint> {
  constructor(protected service: PointService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPoint> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((point: HttpResponse<Point>) => {
          if (point.body) {
            return of(point.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Point());
  }
}

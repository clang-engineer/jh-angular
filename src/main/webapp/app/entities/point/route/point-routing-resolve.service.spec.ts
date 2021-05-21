jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPoint, Point } from '../point.model';
import { PointService } from '../service/point.service';

import { PointRoutingResolveService } from './point-routing-resolve.service';

describe('Service Tests', () => {
  describe('Point routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PointRoutingResolveService;
    let service: PointService;
    let resultPoint: IPoint | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PointRoutingResolveService);
      service = TestBed.inject(PointService);
      resultPoint = undefined;
    });

    describe('resolve', () => {
      it('should return IPoint returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPoint = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPoint).toEqual({ id: 123 });
      });

      it('should return new IPoint if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPoint = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPoint).toEqual(new Point());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPoint = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPoint).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

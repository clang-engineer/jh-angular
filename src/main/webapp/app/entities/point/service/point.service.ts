import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IPoint, getPointIdentifier } from '../point.model';

export type EntityResponseType = HttpResponse<IPoint>;
export type EntityArrayResponseType = HttpResponse<IPoint[]>;

@Injectable({ providedIn: 'root' })
export class PointService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/points');
  public resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/points');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(point: IPoint): Observable<EntityResponseType> {
    return this.http.post<IPoint>(this.resourceUrl, point, { observe: 'response' });
  }

  update(point: IPoint): Observable<EntityResponseType> {
    return this.http.put<IPoint>(`${this.resourceUrl}/${getPointIdentifier(point) as number}`, point, { observe: 'response' });
  }

  partialUpdate(point: IPoint): Observable<EntityResponseType> {
    return this.http.patch<IPoint>(`${this.resourceUrl}/${getPointIdentifier(point) as number}`, point, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPoint>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPoint[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPoint[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addPointToCollectionIfMissing(pointCollection: IPoint[], ...pointsToCheck: (IPoint | null | undefined)[]): IPoint[] {
    const points: IPoint[] = pointsToCheck.filter(isPresent);
    if (points.length > 0) {
      const pointCollectionIdentifiers = pointCollection.map(pointItem => getPointIdentifier(pointItem)!);
      const pointsToAdd = points.filter(pointItem => {
        const pointIdentifier = getPointIdentifier(pointItem);
        if (pointIdentifier == null || pointCollectionIdentifiers.includes(pointIdentifier)) {
          return false;
        }
        pointCollectionIdentifiers.push(pointIdentifier);
        return true;
      });
      return [...pointsToAdd, ...pointCollection];
    }
    return pointCollection;
  }
}

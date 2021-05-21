import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PointDetailComponent } from './point-detail.component';

describe('Component Tests', () => {
  describe('Point Management Detail Component', () => {
    let comp: PointDetailComponent;
    let fixture: ComponentFixture<PointDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PointDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ point: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PointDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PointDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load point on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.point).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

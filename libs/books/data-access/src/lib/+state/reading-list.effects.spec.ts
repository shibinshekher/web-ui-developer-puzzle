import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { ReadingListItem, okReadsConstant } from '@tmo/shared/models';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne(`${okReadsConstant.API.READING_LIST_API}`).flush([]);
    });
  });

  describe('markBookAsFinished$', () => {
    let item: ReadingListItem;
    let finishedDate: string;

    beforeAll(() => {
      item = createReadingListItem('A');
      finishedDate = new Date().toISOString();
    });

    it('it should successfully add a book to the reading list', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne(`${okReadsConstant.API.READING_LIST_API}`).flush([]);
    });

    it('it should remove the added book, when the API returns an error,', (done) => {
      actions.next(ReadingListActions.markBookAsFinished({ item: item, finishedDate }));

      effects.markBookAsFinished$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedMarkBookAsFinished({ item: item })
        );
        done();
      });

      httpMock
        .expectOne(`${okReadsConstant.API.READING_LIST_API}/${item.bookId}/${okReadsConstant.API.FINISHED}`)
        .flush({}, { status: 500, statusText: 'server error' });
    });
  });
});

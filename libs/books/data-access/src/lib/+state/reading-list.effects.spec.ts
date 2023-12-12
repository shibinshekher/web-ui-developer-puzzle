import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { createBook, createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Book, ReadingListItem } from '@tmo/shared/models';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  let item: ReadingListItem;
  let book: Book;

  beforeAll(() => {
    item = createReadingListItem('A');
    book = createBook('A');
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, MatSnackBarModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
    actions = new ReplaySubject();
  });

  describe('loadReadingList$', () => {
    it('should fetch reading list successfully', done => {
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('addBook$', () => {
    it('should add a book to the reading list successfully', done => {
      book = { ...createBook('A'), isAdded: true };
      actions.next(ReadingListActions.addToReadingList({ book }));

      effects.addBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedAddToReadingList({ book, undo: false })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush({});
    });

    it('should undo the added book when API returns error', done => {
      actions.next(ReadingListActions.addToReadingList({ book: book, undo: false }));
      const result = ReadingListActions.failedAddToReadingList(
        new ErrorEvent('error')
      );

      effects.addBook$.pipe()
        .subscribe((action) => {
        expect(action.type).toEqual(result.type);
        done();
      });

      httpMock
        .expectOne('/api/reading-list')
        .flush({}, { status: 500, statusText: 'server error' });
    });
  });

  describe('confirmAddBook$', () => {
    beforeEach(() => {
      jest.spyOn(effects, 'openMatSnackBar');
    });

    it('should open snackbar when a book is added successfully to reading list', () => {
      actions.next(
        ReadingListActions.confirmedAddToReadingList({ book, undo: false })
      );

      effects.confirmAddBook$.subscribe(() => {
        expect(effects.openMatSnackBar).toHaveBeenCalledWith(
          'Added \"' +`${book.title}`+ '\" to the reading list',
          'Undo',
          ReadingListActions.removeFromReadingList({
            item,
            undo: true
          })
        );
      });
    });

    it('should not open snackbar while performing undo action after removing a book', () => {
      actions.next(
        ReadingListActions.confirmedAddToReadingList({ book, undo: true })
      );

      effects.confirmAddBook$.subscribe(() => {
        expect(effects.openMatSnackBar).not.toHaveBeenCalled();
      });
    });
  });

  describe('removeBook$', () => {
    it('should remove book successfully from reading list', done => {
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList({
            item,
            undo: false
          })
        );
        done();
      });

      httpMock
        .expectOne(`/api/reading-list/${item.bookId}`)
        .flush({});
    });

    it('should undo removed book when API returns error', done => {
      actions.next(ReadingListActions.removeFromReadingList({ item, undo: true }));
      const outcome = ReadingListActions.failedRemoveFromReadingList(
        new ErrorEvent('error')
      );

      effects.removeBook$.pipe()
        .subscribe((action) => {
        expect(action.type).toEqual(outcome.type);
        done();
      });

      httpMock
        .expectOne(`/api/reading-list/${item.bookId}`)
        .flush({}, { status: 500, statusText: 'server error' });
    });
  });

  describe('confirmRemoveBook$', () => {
    beforeEach(() => {
      jest.spyOn(effects, 'openMatSnackBar');
    });

    it('should open snackbar when book is removed successfully from reading list', () => {
      actions.next(ReadingListActions.confirmedRemoveFromReadingList({ item, undo: false }));

      effects.confirmRemoveBook$.subscribe(() => {
        expect(effects.openMatSnackBar).toHaveBeenCalledWith(
          'Removed \"' + `${item.title}` + '\" from the reading list',
          'Undo',
          ReadingListActions.addToReadingList({
            book,
            undo: true
          })
        );
      });
    });

    it('should not open snackbar while performing undo action after adding a book', () => {
      actions.next(ReadingListActions.confirmedRemoveFromReadingList({ item, undo: true }));

      effects.confirmRemoveBook$.subscribe(() => {
        expect(effects.openMatSnackBar).not.toHaveBeenCalled();
      });
    });
  });
});
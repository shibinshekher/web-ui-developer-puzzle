import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, tap } from 'rxjs/operators';
import { Book, okReadsConstant, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { TypedAction } from '@ngrx/store/src/models';
import { Store } from '@ngrx/store';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http
          .get<ReadingListItem[]>(`${okReadsConstant.API.READING_LIST_API}`)
          .pipe(
            map((data) =>
              ReadingListActions.loadReadingListSuccess({ list: data })
            ),
            catchError((error) =>
              of(ReadingListActions.loadReadingListError({ error }))
            )
          )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book, undo }) => {
        const addedBook = {
          ...book,
          isAdded: true
        };
        return this.http
          .post(`${okReadsConstant.API.READING_LIST_API}`, addedBook)
          .pipe(
            map(() =>
            ReadingListActions.confirmedAddToReadingList({
              book: addedBook,
              undo: !!undo
            })
          ),
            catchError((error) =>
              of(ReadingListActions.failedAddToReadingList({ error }))
            )
          );
      })
    )
  );

  confirmAddBook$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReadingListActions.confirmedAddToReadingList),
        tap(({ book, undo }) => {
          if (!undo) {
            const { id, ...rest } = book;
            const item: ReadingListItem = {
              bookId: book.id,
              ...rest
            };

            this.openMatSnackBar(
              okReadsConstant.READING_LIST.ADDED +`${book.title}`+ okReadsConstant.READING_LIST.TO_READING_LIST,
              okReadsConstant.READING_LIST.UNDO,
              ReadingListActions.removeFromReadingList({
                item,
                undo: true
              })
            );
          }
        })
      ),
    {
      dispatch: false
    }
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, undo }) =>
        this.http
          .delete(`${okReadsConstant.API.READING_LIST_API}/${item.bookId}`)
          .pipe(
            map(() =>
              ReadingListActions.confirmedRemoveFromReadingList({
                item,
                undo: !!undo
              })
            ),
            catchError((error) =>
              of(ReadingListActions.failedRemoveFromReadingList({ error }))
            )
          )
      )
    )
  );

  confirmRemoveBook$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReadingListActions.confirmedRemoveFromReadingList),
        tap(({ item, undo }) => {
          if (!undo) {
            const { bookId, ...rest } = item;
            const book: Book = {
              id: item.bookId,
              ...rest
            };

            this.openMatSnackBar(
              okReadsConstant.READING_LIST.REMOVED + `${item.title}` + okReadsConstant.READING_LIST.FROM_READING_LIST,
              okReadsConstant.READING_LIST.UNDO,
              ReadingListActions.addToReadingList({
                book,
                undo: true
              })
            );
          }
        })
      ),
    {
      dispatch: false
    }
  );

  openMatSnackBar = (
    message: string,
    actionText: string,
    action: TypedAction<string>
  ) => {
    this.matSnackBar
      .open(message, actionText, {
        duration: 5000
      })
      .onAction()
      .subscribe(() => {
        this.store.dispatch(action);
      });
  };

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions,
    private http: HttpClient,
    private matSnackBar: MatSnackBar,
    private readonly store: Store) { }
}

import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { searchBooks } from '@tmo/books/data-access';

describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store : MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [
        provideMockStore({
          initialState: { books: { entities: [] }}
        })
      ]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('searchBooks()', () => {
    it('should dispatch searchBooks action after 500ms when received distinct input for search term', fakeAsync(() => {
      component.searchForm.controls.term.setValue('Blockchain');

      tick(500);

      component.searchForm.controls.term.setValue('Algorithms');

      tick(500);

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        searchBooks({ term: 'Blockchain' })
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        searchBooks({ term: 'Algorithms' })
      );
    }));

    it('should not dispatch searchBooks action when received same input for search term', fakeAsync(() => {
      component.searchForm.controls.term.setValue('Blockchain');

      tick(500);

      component.searchForm.controls.term.setValue('Blockchain');

      tick(500);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
    }));
  });

  describe('ngOnDestroy()', () => {
    it('should unsubscribe to input stream when component is destroyed', fakeAsync(() => {
      component.ngOnDestroy();

      component.searchForm.controls.term.setValue('Algorithm');

      tick(500);

      expect(store.dispatch).not.toHaveBeenCalled();
    }));
  });
});
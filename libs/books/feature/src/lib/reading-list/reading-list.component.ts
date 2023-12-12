import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, markBookAsFinished, removeFromReadingList } from '@tmo/books/data-access';
import { ReadingListItem, okReadsConstant } from '@tmo/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$: Observable<ReadingListItem[]> = this.store.select(getReadingList);
  readingListConstants = okReadsConstant;

  constructor(private readonly store: Store) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
  }

  markBookAsFinished(item) {
    this.store.dispatch(markBookAsFinished({ 
      item, 
      finishedDate: new Date().toISOString()
    })
    )
  }
}

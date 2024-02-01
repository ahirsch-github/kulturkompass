import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AttractionTags } from '../../enums/attraction-tags';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {

  searchQuery: string = '';
  searchString: {} = {};
  tagsConfig = AttractionTags;
  @Output() searchTerm = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit() {}

  /**
   * Handles the change event of the search input.
   * @param event - The event object containing the search input value.
   */
  onSearchChange(event: any): void {
    this.searchTerm.emit(event.target.value);
  }
}

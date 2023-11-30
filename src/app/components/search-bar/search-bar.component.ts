import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KulturdatenService } from 'src/app/services/kulturdaten.service';
import { AttractionTags } from '../../enums/attraction-tags';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent  implements OnInit {

  searchQuery: string = '';
  searchString: {} = {};
  tagsConfig = AttractionTags;
  @Output() searchTerm = new EventEmitter<any>();
  
  constructor(private kulturdatenService: KulturdatenService) { }

  ngOnInit() {}

  onSearchChange(event: any): void {
    this.searchTerm.emit(event.target.value);
  }

  attractionSearchbyTag(event: any): void {
    console.log('Search started', event.target.value);
    this.searchString = {
      "searchFilter": {
        "tags": {
          "$in": [
            "attraction.category.Lectures",
            "attraction.category.Music"
          ]
        }
      }
    }
    console.log('Search string', this.searchString);
    this.kulturdatenService.searchAttractionsbyTag([AttractionTags.Lectures, AttractionTags.Music])
    .subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error('Ein Fehler ist aufgetreten:', error);
      }
    });
  }
}

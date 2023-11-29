import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent  implements OnInit {
  
  searchQuery: string = '';

  constructor() { }

  ngOnInit() {}

  onSearchChange(event: any): void {
    console.log('Search started', this.searchQuery);
  }
}

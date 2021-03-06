import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataFilteringService {
  public profilesList: any = [];
  constructor() { }

  setPostList(profiles: any) {
    this.profilesList = profiles;
  }
  filterPosts(searchTerm: string) {
    return this.profilesList.filter(item => {
      return (item.name as string).toLowerCase().includes(searchTerm);
    });
  }
}

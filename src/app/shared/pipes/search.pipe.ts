import { Pipe, PipeTransform } from '@angular/core';
import { ICategory } from '../interfaces/category.interface';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(category: Array<ICategory>, searchText: any): unknown {
    if (!category) {
      return []
    };
    if (!searchText) {
      return category
    };
    return category.filter(elm => elm.nameUa.toLowerCase().includes(searchText.toLowerCase()) || elm.nameEn.toLowerCase().includes(searchText.toLowerCase()));
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value: any) {
    if(value == null) {
      return value;
    }
    const temp = value.split("").reverse();
    let reversedArray = '';
    for(let letter of temp) {
      reversedArray += letter;
    }
    return reversedArray;
  }

}

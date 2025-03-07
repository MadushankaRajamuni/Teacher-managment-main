import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  transform(value: string): string {
    const maxLength = 25;
    const ellipsis = '...';

    if (value.length <= maxLength) {
      return value;
    } else {
      return value.substring(0, maxLength) + ellipsis;
    }
  }

}

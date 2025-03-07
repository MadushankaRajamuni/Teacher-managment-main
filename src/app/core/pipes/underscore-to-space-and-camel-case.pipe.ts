import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'underscoreToSpace'
})
export class UnderscoreToSpaceAndCamelCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    return value.replace(/_/g, ' ');
  }

}

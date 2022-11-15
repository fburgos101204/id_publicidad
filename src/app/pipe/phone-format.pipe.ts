import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {

  transform(rawNum: any) {
    rawNum = "  " + rawNum;

    const countryCodeStr = rawNum.slice(0, 2);
    const areaCodeStr = rawNum.slice(2, 5);
    const midSectionStr = rawNum.slice(5, 8);
    const lastSectionStr = rawNum.slice(8);

    return `${countryCodeStr} ${areaCodeStr} ${midSectionStr}-${lastSectionStr}`;

  }

} 
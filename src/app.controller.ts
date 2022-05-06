import { Controller, Get, Query } from '@nestjs/common';
import * as fs from 'fs';
import { AppService } from './app.service';
import { Countries } from './app.countries';
import { CaseCategories } from './app.casecategories';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  getHello(): {} {
    return {
      message: 'Hello World'
    };
  }

  @Get('country')
  getCountries(): any {
    return Countries;
  }

  @Get('case-category')
  getCaseCategories(): any {
    return CaseCategories;
  }

  @Get('case-type')
  // ?countryCode=${countryCode}&showArchived=false&isActive=true&includeSubTypes=false
  getCaseTypes(@Query('countryCode') countryCode, @Query('checkAvailable') checkAvailable : boolean = false): any {
    try {
      const json = fs.readFileSync(`./case-types/casetype.${countryCode}.json`, {encoding:'utf8', flag:'r'});
      const caseTypes = JSON.parse(json);
      
      if (checkAvailable === true) {
        for (var i = 0; i < caseTypes.length; i++) {
          const c = caseTypes[i];
          c.isAvailable = countryCode === 'US' && (i === 3 || i === 4 || i === 8 || i === 20) ? false : true;
        }
      }
      
      return caseTypes;
    } catch {
      return [];
    }
  }
}

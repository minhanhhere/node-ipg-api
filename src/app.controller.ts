import { Controller, Get, Query } from '@nestjs/common';
import * as fs from 'fs';
import { AppService } from './app.service';
import { Countries } from './app.countries';
import { CaseCategories } from './app.casecategories';
import { CaseDefaultStages } from './app.case-default-stages';
import { CaseDefaultMilestones } from './app.case-default-milestones';

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
  getCaseTypes(@Query('countryCode') countryCode, @Query('checkAvailable') checkAvailable : string): any {
    try {
      const seed = this.getCountryCodeSeed(countryCode);
      const json = fs.readFileSync(`./case-types/casetype.${countryCode}.json`, {encoding:'utf8', flag:'r'});
      const caseTypes = JSON.parse(json);
      
      if (checkAvailable === 'true') {
        for (var i = 0; i < caseTypes.length; i++) {
          const c = caseTypes[i];
          // random logic for isAvailable
          c.isAvailable = (((seed + c.id || 0) % 9) || 9) > 4;
          // c.isAvailable = countryCode === 'US' && (i === 3 || i === 4 || i === 8 || i === 20) ? false : true;
        }
      }
      
      return caseTypes;
    } catch {
      return [];
    }
  }

  @Get('case-default-stages')
  getCaseDefaultStages(): any {
    return CaseDefaultStages;
  }

  @Get('case-default-milestones')
  getCaseDefaultMilestones(): any {
    return CaseDefaultMilestones;
  }

  getCountryCodeSeed(countryCode: string) {
    return countryCode.charCodeAt(0) * 100 + (countryCode.length > 1 ? countryCode.charCodeAt(1) : 0)
  }
}

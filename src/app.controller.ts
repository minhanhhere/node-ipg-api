import { Controller, Get, Query } from '@nestjs/common';
import * as fs from 'fs';
import { AppService } from './app.service';
import { Countries } from './app.countries';
import { CaseCategories } from './app.casecategories';
import { CaseDefaultStages } from './app.case-default-stages';
import { CaseDefaultMilestones } from './app.case-default-milestones';
import { Tasks } from './app.tasks';
import { ReportNotes } from './app.report-notes';
import * as sortBy from 'lodash/sortBy';


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
    const prepend = [
      {
        "countryCode": "--",
        "countryName": "Multi Country",
        "countryCodeISO": "---",
        "isDestination": false,
        "countryApiKey": "95cc9395-2a43-43e8-8ec9-2079a00c2488"
      },
      {
          "countryCode": "GO",
          "countryName": "*Global/Generic",
          "countryCodeISO": "GLB",
          "isDestination": true,
          "countryApiKey": "eb4ef77d-1658-e911-a971-eec0acf7c356"
      }
    ];
    const sorted = sortBy(Countries, t => t.countryName.toLowerCase());
    return [...prepend, ...sorted];
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
      
      return sortBy(caseTypes, t => t.caseType.toLowerCase());
    } catch {
      return [];
    }
  }

  @Get('case-default-stages')
  getCaseDefaultStages(): any {
    return sortBy(CaseDefaultStages, t => t.caseDefaultStageName.toLowerCase());
  }

  @Get('case-default-milestones')
  getCaseDefaultMilestones(): any {
    return sortBy(CaseDefaultMilestones, t => t.caseDefaultMilestoneName.toLowerCase());
  }

  @Get('task-bank')
  getTaskBank(): any {
    return sortBy(Tasks, t => t.taskName.toLowerCase());
  }

  @Get('report-note-bank')
  getReportNoteBank(): any {
    return sortBy(ReportNotes, t => t.description.toLowerCase());
  }

  getCountryCodeSeed(countryCode: string) {
    return countryCode.charCodeAt(0) * 100 + (countryCode.length > 1 ? countryCode.charCodeAt(1) : 0)
  }
}

import { Controller, Get } from '@nestjs/common';
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
}

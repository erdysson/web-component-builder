import {Inject} from 'web-component-builder';

import {AppService} from './app.service';

export class App2Service {
    constructor(@Inject(AppService) private readonly appService: AppService) {}

    app2Log(): void {
        this.appService.appTest();
    }
}

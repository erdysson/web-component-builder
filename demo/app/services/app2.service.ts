import {Injectable, RouterService} from 'web-component-builder';

import {AppService} from './app.service';

@Injectable()
export class App2Service {
    constructor(private readonly appService: AppService, private readonly router: RouterService) {}

    app2Log(): void {
        this.appService.appTest();
    }
}

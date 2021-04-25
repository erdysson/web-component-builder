import {Injectable} from 'web-component-builder';

import {AppService} from './app.service';

@Injectable()
export class App2Service {
    constructor(private readonly appService: AppService) {}

    app2Log(): void {
        this.appService.appTest();
    }
}

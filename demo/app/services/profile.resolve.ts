import {Inject, Resolvable} from 'web-component-builder';

import {AppService} from './app.service';

export class ProfileResolve implements Resolvable {
    constructor(@Inject() private readonly appService: AppService) {}

    resolve(): Promise<unknown> {
        return this.appService.getLanguage();
    }
}

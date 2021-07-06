import {Inject} from '../core/decorators';

import {Routes} from './interfaces';
import {Location} from './location';

export class RouterService {
    private readonly locationUtils = new Location();

    private readonly navigationEndHandlers: Array<(data: unknown) => void> = [];

    constructor(@Inject('Routes') private readonly routeConfig: Routes) {
        console.log('route config in router service', this.routeConfig);
        this.locationUtils.onLocationChange((args) => {
            this.navigationEndHandlers.forEach((callback) => callback(args));
        });
    }

    navigate(url: string, data: unknown = undefined): void {
        this.locationUtils.modifyState(data, url);
    }

    onNavigationEnd(callback: (data: unknown) => void): void {
        this.navigationEndHandlers.push(callback);
    }

    init(): void {
        this.locationUtils.init();
    }
}

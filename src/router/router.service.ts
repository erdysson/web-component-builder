import {Location} from './location';

export class RouterService {
    private readonly locationUtils = new Location();

    constructor() {
        this.locationUtils.onLocationChange((args) => {
            console.log('location changed', args);
        });
    }

    navigate(url: string, data: any = {}): void {
        this.locationUtils.modifyState(data, url);
    }
}

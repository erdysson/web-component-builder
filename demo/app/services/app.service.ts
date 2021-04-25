import {Injectable} from 'web-component-builder';

@Injectable()
export class AppService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    appTest(): void {
        console.log('app test service log');
    }
}

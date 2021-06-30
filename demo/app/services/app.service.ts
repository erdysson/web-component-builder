import {Injectable} from 'web-component-builder';

@Injectable()
export class AppService {
    appTest(): void {
        console.log('app test service log');
    }
}

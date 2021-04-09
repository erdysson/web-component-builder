import {Injectable} from 'web-component-builder/dist/main/lib/core/decorators';

@Injectable()
export class AppService {
    appTest(): void {
        console.log('app test service log');
    }
}

import {Injectable} from '../../src/core/decorators';

@Injectable()
export class LogService {

    log(...input: unknown[]): void {
        console.log(...input);
    }
}

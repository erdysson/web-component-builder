import {Injectable} from '../../core/decorators';

@Injectable()
export class LogService {
    log(...input: unknown[]): void {
        console.log(...input);
    }
}

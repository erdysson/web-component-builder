import {Inject, Injectable} from '../../src/core/decorators';
import {LogService} from './log.service';

@Injectable()
export class TestService {
    private readonly isTest = true;

    constructor(@Inject(LogService) private readonly logService: LogService) {}

    checkIfTest(): void {
        this.logService.log('is test :', this.isTest);
    }
}

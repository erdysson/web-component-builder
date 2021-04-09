import { LogService } from './log.service';
export declare class TestService {
    private readonly logService;
    private readonly isTest;
    constructor(logService: LogService);
    checkIfTest(): void;
}

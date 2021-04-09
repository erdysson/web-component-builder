import { IChanges, IOnChanges, IOnDestroy, IOnInit } from '../../../core/interfaces';
import { LogService } from '../../services/log.service';
import { TestService } from '../../services/test.service';
import './app.component.scss';
export declare class AppComponent implements IOnInit, IOnDestroy, IOnChanges {
    private readonly logService;
    private readonly testService;
    private index;
    constructor(logService: LogService, testService: TestService);
    onInit(): void;
    onChanges(changes?: IChanges): void;
    onDestroy(): void;
}

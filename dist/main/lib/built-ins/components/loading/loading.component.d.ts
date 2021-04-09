import { IOnDestroy, IOnInit } from '../../../core/interfaces';
import { LogService } from '../../services/log.service';
import './loading.component.scss';
export declare class LoadingComponent implements IOnInit, IOnDestroy {
    private readonly logService;
    constructor(logService: LogService);
    onInit(): void;
    onDestroy(): void;
}

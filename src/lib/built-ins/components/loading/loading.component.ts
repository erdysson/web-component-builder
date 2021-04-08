import {Component, Inject} from '../../../core/decorators';
import {IOnDestroy, IOnInit} from '../../../core/interfaces';
import {LogService} from '../../services/log.service';

import loadingTemplate from './loading.component.html';
import './loading.component.scss';

@Component({
    selector: 'loading-component',
    template: loadingTemplate
})
export class LoadingComponent implements IOnInit, IOnDestroy {
    constructor(@Inject(LogService) private readonly logService: LogService) {}

    onInit(): void {
        this.logService.log('loading on init');
    }

    onDestroy(): void {
        this.logService.log('loading on destroy');
    }
}

import {Component, Inject} from '../../../src/core/decorators';
import loadingTemplate from './loading.component.html';
import {IOnDestroy, IOnInit} from '../../../src/core/interfaces';
import {LogService} from '../../services/log.service';
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

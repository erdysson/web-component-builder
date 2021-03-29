import {Component, Inject, Input} from '../../../src/core/decorators';
import {IChanges, IOnChanges, IOnDestroy, IOnInit} from '../../../src/core/interfaces';
import {LogService} from '../../services/log.service';
import {TestService} from '../../services/test.service';
import appTemplate from './app.component.html';

@Component({
    selector: 'app-component',
    template: appTemplate
})
export class AppComponent implements IOnInit, IOnDestroy, IOnChanges {
    @Input()
    private index!: string;

    constructor(
        @Inject(LogService) private readonly logService: LogService,
        @Inject(TestService) private readonly testService: TestService
    ) {
        //
    }
    onInit(): void {
        console.log('hey there!');
        this.testService.checkIfTest();
        this.logService.log('app component on init', 'index :', this.index);
    }

    onChanges(changes?: IChanges): void {
        this.logService.log('changes :', changes);
    }

    onDestroy(): void {
        this.testService.checkIfTest();
        this.logService.log('app component on destroy');
    }
}

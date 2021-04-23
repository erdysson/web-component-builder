import {Component, Inject, IOnInit, Prop} from 'web-component-builder';

import {App2Service} from '../services/app2.service';

@Component({
    selector: 'app-test',
    template: '<div>Hey There</div>'
})
export class Test implements IOnInit {
    @Prop()
    propFromParent!: string[];

    constructor(@Inject(App2Service) private readonly app2: App2Service) {}

    onInit(): void {
        console.log('app-test on init');
        this.app2.app2Log();
    }
}

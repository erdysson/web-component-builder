import {Component, IOnInit, Prop, ViewEncapsulation} from 'web-component-builder';

import {App2Service} from '../services/app2.service';

@Component({
    selector: 'app-test',
    template: '<div>App Test</div>',
    viewEncapsulation: ViewEncapsulation.SHADOW_DOM,
    styles: [
        `
            :host {
                display: block;
                height: 220px;
            }

            :host div {
                background-color: red;
                color: white;
            }
        `
    ]
})
export class Test implements IOnInit {
    @Prop()
    propFromParent!: string[];

    constructor(private readonly app2: App2Service) {}

    onInit(): void {
        this.app2.app2Log();
    }
}

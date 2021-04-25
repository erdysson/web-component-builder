import {Attr, Component, IOnInit, Listen, Prop, ViewChild} from 'web-component-builder';

import {AppService} from '../services/app.service';
import {App2Service} from '../services/app2.service';

@Component({
    selector: 'app-main',
    template: '<div><app-test></app-test></div>'
})
export class App implements IOnInit {
    @Attr()
    index!: number;

    @Attr()
    test!: boolean;

    @Attr()
    data: unknown;

    @Attr()
    str!: string;

    @Attr()
    unknown!: string | null;

    @Attr()
    notExist!: string | null;

    @Prop()
    list!: string[];

    @ViewChild('app-test')
    appTest!: HTMLElement;

    constructor(private readonly app2: App2Service, private readonly app: AppService) {}

    @Listen('click')
    onClick(event: MouseEvent): void {
        console.log('event', event);
        this.logThis();
    }

    onInit(): void {
        console.log('app-main on init', this);
        this.app.appTest();
        this.app2.app2Log();
    }

    private logThis(): void {
        console.log('this', this);
    }
}

import {
    Attr,
    Component,
    IOnInit,
    Listen,
    Prop,
    RouterService,
    ViewChild,
    ViewContainer,
    ViewEncapsulation
} from 'web-component-builder';

import {AppService} from '../services/app.service';
import {App2Service} from '../services/app2.service';

@Component({
    selector: 'app-main',
    template: `
        <div>
            <h2>App Main</h2>
            <button type="button" class="navigate-test">Navigate to test</button>
            <button type="button" class="navigate-app">Navigate to app</button>
            <app-test></app-test>
            <router-component></router-component>
        </div>
    `,
    viewEncapsulation: ViewEncapsulation.NONE,
    styles: [
        `
            app-main {
                background-color: green;
                display: block;
            }
        `
    ]
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

    @ViewContainer()
    hostElement!: HTMLElement;

    constructor(
        private readonly router: RouterService,
        private readonly app2: App2Service,
        private readonly app: AppService
    ) {}

    @Listen('click', '.navigate-test')
    onClickTest(event: MouseEvent): void {
        console.log('clicked to navigate test', event);
        this.router.navigate('/test');
    }

    @Listen('click', '.navigate-app')
    onClickApp(event: MouseEvent): void {
        console.log('clicked to navigate app', event);
        this.router.navigate('/app');
    }

    onInit(): void {
        this.app.appTest();
        this.app2.app2Log();
    }

    private logThis(): void {
        console.log('this', this);
    }
}

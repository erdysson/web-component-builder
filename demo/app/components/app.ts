import {IOnInit} from 'web-component-builder';
import {Attr, Component, Listen, ViewChild} from 'web-component-builder';

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

    @ViewChild('app-test')
    appTest!: HTMLElement;

    @Listen('click')
    onClick(event: MouseEvent): void {
        console.log('event', event);
        this.logThis();
    }

    onInit(): void {
        console.log('app-main on init', this);
    }

    private logThis(): void {
        console.log('this', this);
    }
}

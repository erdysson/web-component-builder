import {IOnInit} from 'web-component-builder';
import {Component, Input, Listen, ViewChild} from 'web-component-builder';

@Component({
    selector: 'app-main',
    template: '<div><app-test></app-test></div>'
})
export class App implements IOnInit {
    @Input()
    index!: number;

    @Input()
    test!: boolean;

    @Input()
    data: unknown;

    @Input()
    str!: string;

    @Input()
    unknown!: string | null;

    @Input()
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

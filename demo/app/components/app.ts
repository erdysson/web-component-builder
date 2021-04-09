import {Component, IOnInit} from 'web-component-builder';

@Component({
    selector: 'app',
    template: '<div>Hey There</div>'
})
export class App implements IOnInit {
    onInit(): void {
        console.log('app on init');
    }
}

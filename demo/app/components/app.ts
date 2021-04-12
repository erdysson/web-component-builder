import {IOnInit} from 'web-component-builder';
import {Component} from 'web-component-builder';

@Component({
    selector: 'app-c',
    template: '<div>Hey There</div>'
})
export class App implements IOnInit {
    onInit(): void {
        console.log('app on init');
    }
}

import {IOnInit} from 'web-component-builder';
import {Component} from 'web-component-builder';

@Component({
    selector: 'app-main',
    template: '<div><app-test></app-test></div>'
})
export class App implements IOnInit {
    onInit(): void {
        console.log('app-main on init');
    }
}

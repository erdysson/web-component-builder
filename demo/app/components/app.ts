import {IOnInit} from 'web-component-builder';
import {Component} from 'web-component-builder/dist/main/lib/core/decorators';

@Component({
    selector: 'app-c',
    template: '<div>Hey There</div>'
})
export class App implements IOnInit {
    onInit(): void {
        console.log('app on init');
    }
}

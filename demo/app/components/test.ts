import {IOnInit} from 'web-component-builder';
import {Component} from 'web-component-builder';

@Component({
    selector: 'app-test',
    template: '<div>Hey There</div>'
})
export class Test implements IOnInit {
    onInit(): void {
        console.log('app-test on init');
    }
}

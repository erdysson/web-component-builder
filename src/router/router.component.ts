import {Component} from '../core/decorators';
import {IOnInit} from '../core/interfaces';

import {RouterService} from './router.service';

@Component({
    selector: 'router-component',
    template: ''
})
export class RouterComponent implements IOnInit {
    constructor(private readonly router: RouterService) {}

    onInit(): void {
        console.log('router component on init');
    }
}

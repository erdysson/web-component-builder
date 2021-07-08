import {Component, Inject, ViewContainer} from '../core/decorators';
import {Class, IOnViewInit} from '../core/interfaces';
import {Metadata} from '../core/metadata';

import {Route, Routes} from './interfaces';
import {Router} from './router';

@Component({
    selector: 'router-component',
    template: ''
})
export class RouterComponent implements IOnViewInit {
    @ViewContainer()
    private hostElement!: HTMLElement;

    constructor(@Inject('Routes') private readonly routeConfig: Routes, @Inject() private readonly router: Router) {}

    onViewInit(): void {
        this.router.onNavigationEnd((route: Route) => {
            const config = Metadata.getComponentConfig(route.component as Class);
            const newRouteElement = document.createElement(config.selector);
            const oldRouteElement = this.hostElement.childNodes.item(0);

            if (oldRouteElement) {
                this.hostElement.replaceChild(newRouteElement, oldRouteElement);
            } else {
                this.hostElement.appendChild(newRouteElement);
            }
        });
        // init routing
        this.router.init();
    }
}

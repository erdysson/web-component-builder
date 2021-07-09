import {Component, Inject, ViewContainer} from '../core/decorators';
import {Class, IOnInit, IOnViewInit} from '../core/interfaces';
import {Metadata} from '../core/metadata';

import {Route, Routes} from './interfaces';
import {Router} from './router';
import {RouterEvent} from './router-event.enum';

@Component({
    selector: 'router-component',
    template: ''
})
export class RouterComponent implements IOnInit, IOnViewInit {
    @ViewContainer()
    private hostElement!: HTMLElement;

    constructor(@Inject('Routes') private readonly routeConfig: Routes, @Inject() private readonly router: Router) {}

    onInit(): void {
        this.router.events.subscribe<Route>(RouterEvent.NAVIGATION_END, (route: Route) => {
            console.log('navigation end called');
            const config = Metadata.getComponentConfig(route.component as Class);
            const newRouteElement = document.createElement(config.selector);
            const oldRouteElement = this.hostElement.childNodes.item(0);

            if (oldRouteElement) {
                this.hostElement.replaceChild(newRouteElement, oldRouteElement);
            } else {
                this.hostElement.appendChild(newRouteElement);
            }
        });
    }

    onViewInit(): void {
        // init routing
        this.router.init();
    }
}

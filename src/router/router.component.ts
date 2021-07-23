import {Component, Inject, ViewContainer} from '../core/decorators';
import {Class, IOnInit, IOnViewInit} from '../core/interfaces';
import {Metadata} from '../core/metadata';

import {Route} from './interfaces';
import {Location} from './location';
import {Router} from './router';
import {RouterEvent} from './router-event.enum';

@Component({
    selector: 'router-component',
    template: ''
})
export class RouterComponent implements IOnInit, IOnViewInit {
    @ViewContainer()
    private hostElement!: HTMLElement;

    constructor(@Inject() private readonly location: Location, @Inject() private readonly router: Router) {}

    onInit(): void {
        this.router.events.subscribe(RouterEvent.NAVIGATION_END, (event: {from: Route; to: Route}) => {
            const config = Metadata.getComponentConfig(event.to.component as Class);
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
        // init location services
        this.location.init();
    }
}

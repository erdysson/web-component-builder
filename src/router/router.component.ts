import {Component, Inject, ViewContainer} from '../core/decorators';
import {Class, IOnInit, NavigationEvent} from '../core/interfaces';
import {Metadata} from '../core/metadata';

import {Location} from './location';
import {PubSub} from './pub-sub';
import {Router} from './router';

@Component({
    selector: 'router-component',
    template: ''
})
export class RouterComponent implements IOnInit {
    @ViewContainer()
    private hostElement!: HTMLElement;

    constructor(
        @Inject() private readonly pubSub: PubSub,
        @Inject() private readonly location: Location,
        @Inject() private readonly router: Router
    ) {}

    onInit(): void {
        this.pubSub.routerNavigationEnd.subscribe((event: NavigationEvent) => {
            const config = Metadata.getComponentConfig(event.to.component as Class);
            const newRouteElement = document.createElement(config.selector);
            const oldRouteElement = this.hostElement.childNodes.item(0);

            if (oldRouteElement) {
                this.hostElement.replaceChild(newRouteElement, oldRouteElement);
            } else {
                this.hostElement.appendChild(newRouteElement);
            }
        });
        // init location services
        this.location.init();
    }
}

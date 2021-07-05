import {Component, Inject, ViewContainer} from '../core/decorators';
import {IOnViewInit} from '../core/interfaces';
import {Metadata} from '../core/metadata';

import {Route, Routes} from './interfaces';
import {RouterService} from './router.service';

@Component({
    selector: 'router-component',
    template: ''
})
export class RouterComponent implements IOnViewInit {
    @ViewContainer()
    private hostElement!: HTMLElement;

    constructor(
        @Inject('Routes') private readonly routeConfig: Routes,
        @Inject() private readonly router: RouterService
    ) {}

    onViewInit(): void {
        console.log('router component on init', this.routeConfig);
        this.router.onNavigationEnd((data: unknown) => {
            console.log('navigation done!', data, window.location);
            const url = window.location.hash;
            let route: Route;
            for (const r of this.routeConfig) {
                if (url === `#${r.path}`) {
                    route = r;
                    break;
                }
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const config = Metadata.getComponentConfig(route.component);
            const routeElement = document.createElement(config.selector);
            this.hostElement.innerHTML = '';
            this.hostElement.appendChild(routeElement);
        });
        // init routing
        this.router.init();
    }
}

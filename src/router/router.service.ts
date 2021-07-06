import {exec, match, parse, Route as ParsedRoute, Segment} from 'matchit';

import {Inject} from '../core/decorators';

import {Route, Routes} from './interfaces';
import {Location} from './location';

export class RouterService {
    private readonly locationUtils = new Location();

    private readonly navigationEndHandlers: Array<(route: Route) => void> = [];

    private readonly routes: ParsedRoute[];

    private currentRoute!: Route;

    constructor(@Inject('Routes') private readonly routeConfig: Routes) {
        console.log('route config in router service', this.routeConfig);
        this.routes = this.routeConfig.map((route: Route) => parse(route.path));
        this.locationUtils.onLocationChange((args) => {
            this.navigationEndHandlers.forEach((callback) => {
                const url = window.location.hash;
                const [path, query] = url.split('?');
                console.log(path, query);
                const route = this.getMatchingRoute(path.replace('#', ''));
                console.log('new route', route);

                if (route.redirectTo) {
                    return this.navigate(route.redirectTo);
                }
                if (this.currentRoute === route) {
                    return;
                }
                callback(route);
                this.currentRoute = route;
            });
        });
    }

    navigate(url: string, data: unknown = undefined): void {
        this.locationUtils.modifyState(data, url);
    }

    onNavigationEnd(callback: (route: Route) => void): void {
        this.navigationEndHandlers.push(callback);
    }

    init(): void {
        this.locationUtils.init();
    }

    private getMatchingRoute(url: string): Route {
        const urlMatch = match(url, this.routes);

        let route!: Route;
        for (const r of this.routeConfig) {
            if (r.path === urlMatch[0].old) {
                route = r;
                break;
            }
        }
        return route;
    }
}

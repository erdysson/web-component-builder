import {match, Route as MatchedRoute, parse} from 'matchit';

import {Inject} from '../core/decorators';
import {Injector} from '../core/injector';
import {Class} from '../core/interfaces';

import {CanActivate, Route, Routes} from './interfaces';
import {Location} from './location';

export class RouterService {
    private readonly locationUtils = new Location();

    private readonly navigationEndHandlers: Array<(route: Route) => void> = [];

    private readonly routes: MatchedRoute[];

    private currentRoute!: Route;

    constructor(
        @Inject('Injector') private readonly injector: Injector,
        @Inject('Routes') private readonly routeConfig: Routes
    ) {
        console.log('route config in router service', this.routeConfig);
        console.log('injector', this.injector);
        this.routes = this.routeConfig.map((route: Route) => parse(route.path));
        this.locationUtils.onLocationChange((args) => {
            this.navigationEndHandlers.forEach(async (callback) => {
                const url = window.location.hash;
                const [path, query] = url.split('?');
                console.log(path, query);
                const route = this.getMatchingRoute(path.replace('#', ''));
                console.log('matched route', route);

                if (route.redirectTo) {
                    return this.navigate(route.redirectTo);
                }
                if (this.currentRoute === route) {
                    return;
                }

                let canActivate: boolean;
                try {
                    canActivate =
                        route.canActivate === undefined
                            ? true
                            : await Promise.all(
                                  route.canActivate.map((guardClass: Class<CanActivate>) => {
                                      const guard: CanActivate = this.injector.inject(guardClass);
                                      return guard.canActivate();
                                  })
                              ).then(() => true);
                } catch (e) {
                    console.error('Can not activate route due to error', e);
                    canActivate = false;
                }

                if (!canActivate) {
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

    // todo : get base
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

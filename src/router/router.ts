import {Inject} from '../core/decorators';
import {Injector} from '../core/injector';
import {Class} from '../core/interfaces';

import {ActiveRoute} from './activate-route';
import {ActivatedRoute} from './activated-route';
import {CanActivate, Route, RouteMatch, Routes} from './interfaces';
import {Location} from './location';
import {RouteParser} from './route-parser';

export class Router {
    private readonly locationUtils;

    private readonly navigationEndHandlers: Array<(route: Route) => void> = [];

    private currentRoute!: Route;

    private readonly parser: RouteParser;

    constructor(
        @Inject('Injector') private readonly injector: Injector,
        @Inject('Routes') private readonly routeConfig: Routes,
        @Inject() private readonly activatedRoute: ActivatedRoute
    ) {
        this.parser = new RouteParser(this.routeConfig.map((route: Route) => route.path));
        this.locationUtils = new Location(this.locationChangeHandler.bind(this));
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

    private locationChangeHandler(path: string, query: string): void {
        this.navigationEndHandlers.forEach(async (callback) => {
            const match = this.parser.match(path, query);
            const route = this.getRouteConfig(match);

            if (route.redirectTo) {
                return this.navigate(route.redirectTo);
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

            this.activatedRoute.activeRoute = new ActiveRoute(match.params, match.queryParams, {}, {});

            if (route === this.currentRoute) {
                return;
            }

            callback(route);
            this.currentRoute = route;
        });
    }

    private getRouteConfig(match: RouteMatch) {
        let route!: Route;
        for (const routeConfig of this.routeConfig) {
            if (routeConfig.path === match.path) {
                route = routeConfig;
                break;
            }
        }
        return route;
    }
}

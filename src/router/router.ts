import {Inject} from '../core/decorators';
import {Injector} from '../core/injector';
import {Class} from '../core/interfaces';

import {ActiveRoute} from './activate-route';
import {ActivatedRoute} from './activated-route';
import {EventEmitter} from './event-emitter';
import {CanActivate, LocationChangeData, Route, RouteMatch, Routes} from './interfaces';
import {Location} from './location';
import {RouteParser} from './route-parser';
import {RouterEvent} from './router-event.enum';

export class Router {
    private readonly locationUtils;

    private currentRoute!: Route;

    private readonly parser: RouteParser;

    readonly events: EventEmitter = new EventEmitter('router');

    constructor(
        @Inject('Injector') private readonly injector: Injector,
        @Inject('Routes') private readonly routeConfig: Routes,
        @Inject() private readonly activatedRoute: ActivatedRoute
    ) {
        this.parser = new RouteParser(this.routeConfig.map((route: Route) => route.path));
        this.locationUtils = new Location();
        this.locationUtils.events.subscribe('LocationChange', async (data: LocationChangeData) => {
            const {path, query} = data;

            const match = this.parser.match(path, query);
            const route = this.getRouteConfig(match);

            if (route.redirectTo) {
                return this.navigate(route.redirectTo);
            }

            // emit navigation start event
            this.events.emit(RouterEvent.NAVIGATION_START, route);

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
                // emit navigation failed event
                this.events.emit(RouterEvent.NAVIGATION_FAILED, route);
                return;
            }

            this.activatedRoute.activeRoute = new ActiveRoute(match.params, match.queryParams, {}, {});

            if (route === this.currentRoute) {
                return;
            }

            this.currentRoute = route;
            this.events.emit(RouterEvent.NAVIGATION_END, route);
        });
    }

    navigate(url: string, data: unknown = undefined): void {
        this.locationUtils.modifyState(data, url);
    }

    init(): void {
        this.locationUtils.init();
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

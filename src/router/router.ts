import {Inject} from '../core/decorators';
import {Injector} from '../core/injector';
import {Class} from '../core/interfaces';

import {EventEmitter} from './event-emitter';
import {CanActivate, LocationChangeData, Resolvable, Route, RouteMatch, Routes} from './interfaces';
import {Location} from './location';
import {LocationEvent} from './location-event.enum';
import {RouteParser} from './route-parser';
import {RouterEvent} from './router-event.enum';

export class Router {
    private readonly parser: RouteParser;

    private currentRoute!: Route;

    readonly events: EventEmitter = new EventEmitter('router');

    constructor(
        @Inject('Injector') private readonly injector: Injector,
        @Inject('Routes') private readonly routeConfig: Routes,
        @Inject() private readonly location: Location
    ) {
        this.parser = new RouteParser(this.routeConfig.map((route: Route) => route.path));
        this.location.events.subscribe(
            LocationEvent.LOCATION_CHANGE,
            async (locationChangeData: LocationChangeData) => {
                const {path, query} = locationChangeData;
                const match = this.parser.match(path, query);
                // emit route match
                this.events.emit(RouterEvent.ROUTE_MATCH, match);

                const route = this.getRouteConfig(match);

                if (route.redirectTo) {
                    return this.navigate(route.redirectTo);
                }

                if (route === this.currentRoute) {
                    return;
                }

                // emit navigation start event
                this.events.emit(RouterEvent.NAVIGATION_START, route);

                const canActivate = await this.activate(route.canActivate);
                if (!canActivate) {
                    // emit navigation end event
                    this.events.emit(RouterEvent.NAVIGATION_FAILED, route);
                    return;
                }

                const canResolve = await this.resolve(route.resolve);
                if (!canResolve) {
                    // emit navigation end event
                    this.events.emit(RouterEvent.NAVIGATION_FAILED, route);
                    return;
                }

                this.currentRoute = route;

                // emit navigation end event
                this.events.emit(RouterEvent.NAVIGATION_END, route);
            }
        );
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

    private async resolve(resolveConfig: Record<string, Class<Resolvable>> | undefined): Promise<boolean> {
        if (!resolveConfig) {
            return true;
        }
        try {
            this.events.emit(RouterEvent.RESOLVE_START, {});
            const resolveData: Record<string, unknown> = {};
            const keys = Object.keys(resolveConfig);
            const results: unknown[] = await Promise.all(
                keys.map((k) => this.injector.inject<Resolvable>(resolveConfig[k]).resolve())
            );
            results.forEach((result: unknown, index: number) => (resolveData[keys[index]] = result));
            console.log('resolve data', resolveData);
            this.events.emit(RouterEvent.RESOLVE_END, resolveData);
            return true;
        } catch (e) {
            return false;
        }
    }

    private async activate(activate: Class<CanActivate>[] | undefined): Promise<boolean> {
        if (!activate) {
            return true;
        }
        try {
            this.events.emit(RouterEvent.ACTIVATION_START, {});
            await Promise.all(
                activate.map((guardClass: Class<CanActivate>) =>
                    this.injector.inject<CanActivate>(guardClass).canActivate()
                )
            );
            this.events.emit(RouterEvent.ACTIVATION_END, {});
            return true;
        } catch (e) {
            console.error('Can not activate route due to error', e);
            this.events.emit(RouterEvent.ACTIVATION_FAILED, {});
            return false;
        }
    }

    navigate(url: string, data: unknown = undefined): void {
        this.location.modifyState(data, url);
    }
}

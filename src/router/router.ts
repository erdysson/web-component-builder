import {Inject} from '../core/decorators';
import {Injector} from '../core/injector';
import {Class} from '../core/interfaces';

import {ActiveRoute} from './activate-route';
import {ActivatedRoute} from './activated-route';
import {EventEmitter} from './event-emitter';
import {CanActivate, Resolvable, RouteMatch} from './interfaces';
import {Location} from './location';
import {RouteMatcher, RouteMatchEvents} from './route-matcher';
import {RouterEvent} from './router-event.enum';

export class Router {
    private routeMatch!: RouteMatch;

    readonly events: EventEmitter = new EventEmitter('router');

    constructor(
        @Inject('Injector') private readonly injector: Injector,
        @Inject() private readonly routeMatcher: RouteMatcher,
        @Inject() private readonly location: Location,
        @Inject() private readonly activatedRoute: ActivatedRoute
    ) {
        this.routeMatcher.events.subscribe(RouteMatchEvents.ROUTE_MATCH, async (routeMatch: RouteMatch) => {
            const {config, params, queryParams, data} = routeMatch;

            if (config.redirectTo) {
                return this.navigate(config.redirectTo);
            }
            // if different route, then trigger navigation start event
            if (routeMatch.config !== this.routeMatch?.config) {
                // emit navigation start event
                this.events.emit(RouterEvent.NAVIGATION_START, {from: this.routeMatch?.config, to: config});
            }

            const canActivate = await this.activate(config.canActivate);
            if (!canActivate) {
                // emit navigation end event
                this.events.emit(RouterEvent.NAVIGATION_FAILED, {from: this.routeMatch?.config, to: config});
                return;
            }

            const [canResolve, resolveData] = await this.resolve(config.resolve);
            if (!canResolve) {
                // emit navigation end event
                this.events.emit(RouterEvent.NAVIGATION_FAILED, {from: this.routeMatch?.config, to: config});
                return;
            }
            // emit navigation end event
            if (routeMatch.config !== this.routeMatch?.config) {
                this.events.emit(RouterEvent.NAVIGATION_END, {from: this.routeMatch?.config, to: config});
            }
            this.routeMatch = routeMatch;
            // emit activated route after route is initialized
            this.activatedRoute.events.emit('ActivatedRoute', new ActiveRoute(params, queryParams, resolveData, data));
        });
    }

    private async resolve(resolveConfig: Record<string, Class<Resolvable>> | undefined): Promise<[boolean, unknown]> {
        if (!resolveConfig) {
            return [true, undefined];
        }
        try {
            this.events.emit(RouterEvent.RESOLVE_START, {});
            const resolveData: Record<string, unknown> = {};
            const keys = Object.keys(resolveConfig);
            const results: unknown[] = await Promise.all(
                keys.map((k) => this.injector.inject<Resolvable>(resolveConfig[k]).resolve())
            );
            results.forEach((result: unknown, index: number) => (resolveData[keys[index]] = result));

            this.events.emit(RouterEvent.RESOLVE_END, resolveData);
            return [true, resolveData];
        } catch (e) {
            return [false, undefined];
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

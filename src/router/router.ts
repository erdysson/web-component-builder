import {Inject, Injectable} from '../core/decorators';
import {Injector} from '../core/injector';
import {Class} from '../core/interfaces';

import {ActiveRoute} from './activate-route';
import {CanActivate, Resolvable, RouteMatch} from './interfaces';
import {Location} from './location';
import {PubSub} from './pub-sub';

@Injectable()
export class Router {
    private routeMatch!: RouteMatch;

    constructor(
        @Inject('Injector') private readonly injector: Injector,
        @Inject() private readonly pubSub: PubSub,
        @Inject() private readonly location: Location
    ) {
        this.pubSub.routeMatch.subscribe(async (routeMatch: RouteMatch) => {
            const {config, params, queryParams, data} = routeMatch;

            if (config.redirectTo) {
                return this.navigate(config.redirectTo);
            }
            // if different route, then trigger navigation start event
            if (routeMatch.config !== this.routeMatch?.config) {
                // emit navigation start event
                this.pubSub.routerNavigationStart.emit({from: this.routeMatch?.config, to: config});
            }

            const canActivate = await this.activate(config.canActivate);
            if (!canActivate) {
                // emit navigation end event
                this.pubSub.routerNavigationFailed.emit({
                    from: this.routeMatch?.config,
                    to: config
                });
                return;
            }

            const [canResolve, resolveData] = await this.resolve(config.resolve);
            if (!canResolve) {
                // emit navigation end event
                this.pubSub.routerNavigationFailed.emit({
                    from: this.routeMatch?.config,
                    to: config
                });
                return;
            }
            // emit navigation end event
            if (routeMatch.config !== this.routeMatch?.config) {
                this.pubSub.routerNavigationEnd.emit({from: this.routeMatch?.config, to: config});
            }
            this.routeMatch = routeMatch;
            // emit activated route after route is initialized
            // todo : check here - may be the problem!
            this.pubSub.activatedRoute.emit(new ActiveRoute(params, queryParams, resolveData, data));
        });
    }

    private async resolve(
        resolveConfig: Record<string, Class<Resolvable>> | undefined
    ): Promise<[boolean, unknown]> {
        if (!resolveConfig) {
            return [true, undefined];
        }
        try {
            const resolveData: Record<string, unknown> = {};
            const keys = Object.keys(resolveConfig);
            const results: unknown[] = await Promise.all(
                keys.map((k) => this.injector.inject<Resolvable>(resolveConfig[k]).resolve())
            );
            results.forEach((result: unknown, index: number) => (resolveData[keys[index]] = result));
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
            await Promise.all(
                activate.map((guardClass: Class<CanActivate>) =>
                    this.injector.inject<CanActivate>(guardClass).canActivate()
                )
            );
            return true;
        } catch (e) {
            console.error('Can not activate route due to error', e);
            return false;
        }
    }

    navigate(url: string, data: unknown = undefined): void {
        this.location.modifyState(data, url);
    }
}

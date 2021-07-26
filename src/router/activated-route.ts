import {Inject, Injectable} from '../core/decorators';

import {ActiveRoute} from './activate-route';
import {Params, QueryParams} from './interfaces';
import {PubSub} from './pub-sub';
import {Subscription} from './subscription';

@Injectable()
export class ActivatedRoute {
    private route!: ActiveRoute;

    constructor(@Inject() private readonly pubSub: PubSub) {
        this.pubSub.activatedRoute.subscribe((route: ActiveRoute) => {
            const {params, queryParams} = route;
            if (!this.route) {
                this.pubSub.activatedRouteParamChange.emit(params);
                this.pubSub.activatedRouteQueryParamChange.emit(queryParams);
            } else {
                if (this.hasParamChange(params)) {
                    this.pubSub.activatedRouteParamChange.emit(params);
                }
                if (this.hasQueryParamChange(queryParams)) {
                    this.pubSub.activatedRouteQueryParamChange.emit(queryParams);
                }
            }
            this.route = route;
        });
    }

    private hasQueryParamChange(queryParams: QueryParams): boolean {
        return Object.keys(queryParams).some(
            (key: string) => queryParams[key] !== this.route.queryParams[key]
        );
    }

    private hasParamChange(params: Params): boolean {
        return Object.keys(params).some((key: string) => params[key] !== this.route.params[key]);
    }

    onParamChange(callback: (params: Params) => void): Subscription {
        return this.pubSub.activatedRouteParamChange.subscribe(callback);
    }

    onQueryParamChange(callback: (queryParams: QueryParams) => void): Subscription {
        return this.pubSub.activatedRouteQueryParamChange.subscribe(callback);
    }

    getSnapshot(): ActiveRoute {
        return this.route;
    }
}

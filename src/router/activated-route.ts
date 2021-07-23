import {Inject} from '../core/decorators';

import {ActiveRoute} from './activate-route';
import {EventEmitter} from './event-emitter';
import {Params, QueryParams} from './interfaces';
import {RouteMatcher} from './route-matcher';
import {Subscription} from './subscription';

export class ActivatedRoute {
    private route!: ActiveRoute;

    readonly events: EventEmitter = new EventEmitter('activated_route');

    constructor(@Inject() private readonly routeMatcher: RouteMatcher) {
        this.events.subscribe('ActivatedRoute', (route: ActiveRoute) => {
            console.log('activated route');
            const {params, queryParams} = route;
            if (!this.route) {
                this.events.emit('ParamChange', params);
                this.events.emit('QueryParamChange', queryParams);
            } else {
                if (this.hasParamChange(params)) {
                    this.events.emit('ParamChange', params);
                }
                if (this.hasQueryParamChange(queryParams)) {
                    this.events.emit('QueryParamChange', queryParams);
                }
            }
            this.route = route;
        });
    }

    private hasQueryParamChange(queryParams: QueryParams): boolean {
        return Object.keys(queryParams).some((key: string) => queryParams[key] !== this.route.queryParams[key]);
    }

    private hasParamChange(params: Params): boolean {
        return Object.keys(params).some((key: string) => params[key] !== this.route.params[key]);
    }

    onParamChange(callback: (params: Params) => void): Subscription {
        return this.events.subscribe('ParamChange', callback);
    }

    onQueryParamChange(callback: (queryParams: QueryParams) => void): Subscription {
        return this.events.subscribe('QueryParamChange', callback);
    }

    getSnapshot(): ActiveRoute {
        return this.route;
    }
}

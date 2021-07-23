import {Inject} from '../core/decorators';
import {ActiveRoute} from './activate-route';

import {EventEmitter} from './event-emitter';
import {Params, QueryParams, RouteMatch} from './interfaces';
import {Router} from './router';
import {RouterEvent} from './router-event.enum';

export class ActivatedRoute {
    private routeMatch!: RouteMatch;

    private readonly instance: ActiveRoute = new ActiveRoute();

    readonly events: EventEmitter = new EventEmitter('activated_route');

    constructor(@Inject() private readonly router: Router) {
        this.router.events.subscribe<RouteMatch>(RouterEvent.ROUTE_MATCH, (matchData: RouteMatch) => {
            console.log('route match', matchData);
            const {params, queryParams} = matchData;

            this.instance.params = params;
            this.instance.queryParams = queryParams;

            if (!this.routeMatch) {
                this.events.emit('ParamChange', params);
                this.events.emit('QueryParamChange', queryParams);
                this.routeMatch = matchData;
            } else {
                if (this.hasParamChange(params)) {
                    this.events.emit('ParamChange', params);
                }
                if (this.hasQueryParamChange(queryParams)) {
                    this.events.emit('QueryParamChange', queryParams);
                }
                this.routeMatch = matchData;
            }
        });

        this.router.events.subscribe(RouterEvent.RESOLVE_END, (resolveData: Record<string, unknown>) => {
            console.log('resolve ended', resolveData);
            this.instance.resolve = resolveData;
        });
    }

    private hasQueryParamChange(queryParams: QueryParams): boolean {
        return Object.keys(queryParams).some((key: string) => queryParams[key] !== this.routeMatch.queryParams[key]);
    }

    private hasParamChange(params: Params): boolean {
        return Object.keys(params).some((key: string) => params[key] !== this.routeMatch.params[key]);
    }

    onParamChange(callback: (params: Params) => void): void {
        this.events.subscribe('ParamChange', callback);
        // initial call
        if (this.routeMatch) {
            callback(this.routeMatch.params);
        }
    }

    onQueryParamChange(callback: (queryParams: QueryParams) => void): void {
        this.events.subscribe('QueryParamChange', callback);
        // initial call
        if (this.routeMatch) {
            callback(this.routeMatch.queryParams);
        }
    }

    getSnapshot(): ActiveRoute {
        return this.instance;
    }
}

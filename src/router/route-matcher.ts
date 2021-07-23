import {exec, match, Route as MatchedRoute, parse, Segment} from 'matchit';

import {Inject} from '../core/decorators';

import {EventEmitter} from './event-emitter';
import {LocationChange, Params, QueryParams, Route, RouteMatch, Routes} from './interfaces';
import {Location} from './location';
import {LocationEvent} from './location-event.enum';

export enum RouteMatchEvents {
    ROUTE_MATCH = 'ROUTE_MATCH'
}

export class RouteMatcher {
    private readonly parsedRoutes: MatchedRoute[];

    readonly events: EventEmitter = new EventEmitter('route-matcher');

    private static parseQueryParams(queryStr = ''): QueryParams {
        return queryStr
            .split('&')
            .filter((queryParamPair: string) => !!queryParamPair)
            .reduce((result: QueryParams, pair: string) => {
                const [key, value] = pair.split('=');
                result[key] = value;
                return result;
            }, {});
    }

    constructor(@Inject('Routes') private readonly routeConfig: Routes, @Inject() private readonly location: Location) {
        // parse configured routes for matching
        this.parsedRoutes = this.routeConfig.map((config: Route) => parse(config.path));
        // listen location change and match route with parsed information
        this.location.events.subscribe(LocationEvent.LOCATION_CHANGE, (locationChange: LocationChange) => {
            const {pathname, search, data} = locationChange;
            const routeMatch: RouteMatch = this.match(pathname, search, data);
            this.events.emit(RouteMatchEvents.ROUTE_MATCH, routeMatch);
        });
    }

    private match(pathname: string, search: string, data?: unknown): RouteMatch {
        search = search.replace('?', '');
        const segments: MatchedRoute = match(pathname, this.parsedRoutes);
        const params: Params = exec(pathname, segments);
        const queryParams: QueryParams = RouteMatcher.parseQueryParams(search);
        const config: Route = this.getRouteConfig(segments);
        return {
            config,
            params,
            queryParams,
            data
        };
    }

    private getRouteConfig(match: Segment[]) {
        let routeConfig!: Route;
        for (const config of this.routeConfig) {
            if (config.path === match[0].old) {
                routeConfig = config;
                break;
            }
        }
        return routeConfig;
    }
}

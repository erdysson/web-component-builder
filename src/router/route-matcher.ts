import {exec, match, Route as MatchedRoute, parse, Segment} from 'matchit';

import {Inject, Injectable} from '../core/decorators';

import {LocationChange, Params, QueryParams, Route, RouteMatch, Routes} from './interfaces';
import {PubSub} from './pub-sub';

@Injectable()
export class RouteMatcher {
    private readonly parsedRoutes: MatchedRoute[];

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

    constructor(
        @Inject() private readonly pubSub: PubSub,
        @Inject('Routes') private readonly routeConfig: Routes
    ) {
        // parse configured routes for matching
        this.parsedRoutes = this.routeConfig.map((config: Route) => parse(config.path));
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

    onLocationChange(locationChange: LocationChange): void {
        const {pathname, search, data} = locationChange;
        const routeMatch: RouteMatch = this.match(pathname, search, data);
        this.pubSub.routeMatch.emit(routeMatch);
    }
}

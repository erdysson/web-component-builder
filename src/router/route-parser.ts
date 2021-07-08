import {exec, match, parse, Route} from 'matchit';

import {Params, QueryParams, RouteMatch} from './interfaces';

export class RouteParser {
    private readonly routes: Route[];

    constructor(paths: string[]) {
        this.routes = paths.map((path: string) => parse(path));
    }

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

    match(pathname: string, query: string): RouteMatch {
        query = query.replace('?', '');
        const urlMatch: Route = match(pathname, this.routes);
        const params: Params = exec(pathname, urlMatch);
        const queryParams: QueryParams = RouteParser.parseQueryParams(query);
        const path = urlMatch[0].old;
        const routeMatch = {
            path,
            params,
            queryParams
        };
        console.log('route match', routeMatch);
        return routeMatch;
    }
}

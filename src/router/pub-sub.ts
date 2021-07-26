import {Injectable} from '../core/decorators';
import {NavigationEvent} from '../core/interfaces';

import {ActiveRoute} from './activate-route';
import {EventEmitter} from './event-emitter';
import {Params, QueryParams, RouteMatch} from './interfaces';

@Injectable()
export class PubSub {
    // route match events
    readonly routeMatch: EventEmitter<RouteMatch> = new EventEmitter<RouteMatch>();
    // activated route events
    readonly activatedRoute: EventEmitter<ActiveRoute> = new EventEmitter<ActiveRoute>();
    readonly activatedRouteParamChange: EventEmitter<Params> = new EventEmitter<Params>();
    readonly activatedRouteQueryParamChange: EventEmitter<QueryParams> = new EventEmitter<QueryParams>();
    // navigation events
    readonly routerNavigationStart: EventEmitter<NavigationEvent> = new EventEmitter<NavigationEvent>();
    readonly routerNavigationEnd: EventEmitter<NavigationEvent> = new EventEmitter<NavigationEvent>();
    readonly routerNavigationFailed: EventEmitter<NavigationEvent> = new EventEmitter<NavigationEvent>();
}

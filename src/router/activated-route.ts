import {ActiveRoute} from './activate-route';
import {EventEmitter} from './event-emitter';
import {Params, QueryParams} from './interfaces';

export class ActivatedRoute {
    private _activeRoute!: ActiveRoute;

    private readonly queryParamChangeCallbackQueue: Array<(queryParams: QueryParams) => void> = [];

    private readonly paramChangeCallbackQueue: Array<(params: Params) => void> = [];

    readonly events: EventEmitter = new EventEmitter('activated_route');

    set activeRoute(activeRoute: ActiveRoute) {
        // initial set
        if (!this._activeRoute) {
            this._activeRoute = activeRoute;
            // this.events.emit('QueryParamChange', this._activeRoute.queryParams);
            this.queryParamChangeCallbackQueue.forEach((cb) => cb(this._activeRoute.queryParams));
            // this.events.emit('ParamChange', this._activeRoute.params);
            this.paramChangeCallbackQueue.forEach((cb) => cb(this._activeRoute.params));
        } else {
            // detect changes
            const hasQueryParamChange = this.hasQueryParamChange(activeRoute);
            const hasParamChange = this.hasParamChange(activeRoute);
            // set new active route
            this._activeRoute = activeRoute;
            // trigger callbacks if necessary
            if (hasQueryParamChange) {
                this.queryParamChangeCallbackQueue.forEach((cb) => cb(this._activeRoute.queryParams));
            }
            if (hasParamChange) {
                this.paramChangeCallbackQueue.forEach((cb) => cb(this._activeRoute.params));
            }
        }
    }

    private hasQueryParamChange(newActiveRoute: ActiveRoute): boolean {
        return Object.keys(newActiveRoute.queryParams).some(
            (key: string) => newActiveRoute.queryParams[key] !== this._activeRoute.queryParams[key]
        );
    }

    private hasParamChange(newActiveRoute: ActiveRoute): boolean {
        return Object.keys(newActiveRoute.params).some(
            (key: string) => newActiveRoute.params[key] !== this._activeRoute.params[key]
        );
    }

    onQueryParamChange(callback: (queryParams: QueryParams) => void): void {
        this.queryParamChangeCallbackQueue.push(callback);
        // initial call
        callback(this._activeRoute.queryParams);
    }

    onParamChange(callback: (params: Params) => void): void {
        this.paramChangeCallbackQueue.push(callback);
        // initial call
        callback(this._activeRoute.params);
    }
}

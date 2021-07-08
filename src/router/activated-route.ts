import {ActiveRoute} from './activate-route';
import {Params, QueryParams} from './interfaces';

export class ActivatedRoute {
    private _activeRoute!: ActiveRoute;

    private readonly queryParamChangeCallbackQueue: Array<(queryParams: QueryParams) => void> = [];
    private readonly paramChangeCallbackQueue: Array<(params: Params) => void> = [];

    get activeRoute(): ActiveRoute {
        return this._activeRoute;
    }

    set activeRoute(activeRoute: ActiveRoute) {
        // initial set
        if (!this.activeRoute) {
            this._activeRoute = activeRoute;
            this.queryParamChangeCallbackQueue.forEach((cb) => cb(this.activeRoute.queryParams));
            this.paramChangeCallbackQueue.forEach((cb) => cb(this.activeRoute.params));
        } else {
            // detect changes
            const hasQueryParamChange = this.hasQueryParamChange(activeRoute);
            const hasParamChange = this.hasParamChange(activeRoute);
            // set new active route
            this._activeRoute = activeRoute;
            // trigger callbacks if necessary
            if (hasQueryParamChange) {
                this.queryParamChangeCallbackQueue.forEach((cb) => cb(this.activeRoute.queryParams));
            }
            if (hasParamChange) {
                this.paramChangeCallbackQueue.forEach((cb) => cb(this.activeRoute.params));
            }
        }
    }

    private hasQueryParamChange(newActiveRoute: ActiveRoute): boolean {
        return Object.keys(newActiveRoute.queryParams).some(
            (key: string) => newActiveRoute.queryParams[key] !== this.activeRoute.queryParams[key]
        );
    }

    private hasParamChange(newActiveRoute: ActiveRoute): boolean {
        return Object.keys(newActiveRoute.params).some(
            (key: string) => newActiveRoute.params[key] !== this.activeRoute.params[key]
        );
    }

    onQueryParamChange(callback: (queryParams: QueryParams) => void): void {
        this.queryParamChangeCallbackQueue.push(callback);
        // initial call
        callback(this.activeRoute.queryParams);
    }

    onParamChange(callback: (params: Params) => void): void {
        this.paramChangeCallbackQueue.push(callback);
        // initial call
        callback(this.activeRoute.params);
    }
}

import {Class} from '../core/interfaces';

declare global {
    interface Window {
        onPushState: (...args: any[]) => void;
        onReplaceState: (...args: any[]) => void;
    }
}

export interface LocationChange {
    pathname: string;
    search: string;
    data?: unknown;
}

export interface RouteMatch {
    config: Route;
    params: Params;
    queryParams: QueryParams;
    data?: unknown;
}

export interface Route {
    path: string;
    component?: Class;
    redirectTo?: string;
    resolve?: Record<string, Class<Resolvable>>;
    canActivate?: Class<CanActivate>[];
    data?: any;
}

export type Routes = Route[];

export interface CanActivate {
    canActivate(): Promise<boolean>;
}

export interface Resolvable<T = unknown> {
    resolve(): Promise<T>;
}

export type Params = Record<string, string>;

export type QueryParams = Record<string, string>;

export type Subscriber<T> = (data: T) => void;

export type SubscriberMap<T = any> = Map<symbol, Subscriber<T>>;

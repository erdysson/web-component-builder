import {Class} from '../core/interfaces';

export {};

declare global {
    interface Window {
        onPushState: (...args: any[]) => void;
        onReplaceState: (...args: any[]) => void;
    }
}

export interface Route {
    path: string;
    component?: Class;
    redirectTo?: string;
    resolve?: Record<string, () => Promise<unknown>>;
    canActivate?: Class<CanActivate>[];
    data?: any;
}

export type Routes = Route[];

export interface CanActivate {
    canActivate(): Promise<boolean>;
}

export interface RouteMatch {
    path: string;
    params: Params;
    queryParams: QueryParams;
}

export type Params = Record<string, string>;
export type QueryParams = Record<string, string>;
export type Resolve = Record<string, any>;

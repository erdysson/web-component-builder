import {Class} from '../core/interfaces';

export {};

declare global {
    interface Window {
        onpushState: (...args: any[]) => void;
    }
}

export interface Route {
    path: string;
    component?: Class;
    redirectTo?: string;
    resolve?: Record<string, () => Promise<unknown>>;
    canActivate?: Class<CanActivate>[];
}

export type Routes = Route[];

export interface CanActivate {
    canActivate(): Promise<boolean>;
}

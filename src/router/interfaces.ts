import {Class} from '../core/interfaces';

export {};

declare global {
    interface Window {
        onpushState: (...args: any[]) => void;
    }
}

export interface Route<T = unknown> {
    path: string;
    component: Class;
    resolve?: Record<string, Promise<T>>;
    canActivate?: Promise<boolean>;
}

export type Routes = Route[];

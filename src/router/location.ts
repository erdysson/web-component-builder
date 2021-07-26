import {Inject, Injectable} from '../core/decorators';

import {PubSub} from './pub-sub';
import {RouteMatcher} from './route-matcher';

@Injectable()
export class Location {
    private readonly history: History = window.history;

    constructor(
        @Inject() private readonly pubSub: PubSub,
        @Inject() private readonly routeMatcher: RouteMatcher
    ) {
        window.onpopstate =
            window.onPushState =
            window.onReplaceState =
                (...args) => {
                    this.stateChangeHandler(args[0].state);
                };

        this.patchWindowPopState();
        this.patchWindowReplaceState();
    }

    private stateChangeHandler(data: unknown): void {
        const {pathname, search} = window.location;
        this.routeMatcher.onLocationChange({pathname, search, data});
    }

    private patchWindowPopState(): void {
        const pushState = this.history.pushState;
        this.history.pushState = function (state: unknown, title: string, url: string) {
            pushState.apply(history, [state, title, url]);
            if (typeof window.onPushState === 'function') {
                window.onPushState({state, title, url});
            }
        };
    }

    private patchWindowReplaceState(): void {
        const replaceState = this.history.replaceState;
        this.history.replaceState = function (state: unknown, title: string, url: string) {
            replaceState.apply(history, [state, title, url]);
            if (typeof window.onReplaceState === 'function') {
                window.onReplaceState({state, title, url});
            }
        };
    }

    modifyState(data: unknown = undefined, uri = '', replaceState = false): void {
        if (replaceState) {
            this.history.replaceState(data, document.title, uri);
        } else {
            this.history.pushState(data, document.title, uri);
        }
    }

    init(): void {
        this.modifyState(this.history.state, window.location.pathname, true);
    }
}

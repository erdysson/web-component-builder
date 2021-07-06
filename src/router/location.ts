export class Location {
    private readonly history: History = window.history;

    private readonly locationChangeCallbackQueue: Array<(state?: unknown) => void> = [];

    constructor() {
        this.patchWindowPopState();

        window.onpopstate = window.onpushState = (...args) => {
            const data = args[0].state;
            this.locationChangeCallbackQueue.forEach((cb) => setTimeout(() => cb(data)));
        };
    }

    private patchWindowPopState(): void {
        const pushState = this.history.pushState;
        this.history.pushState = function (state: unknown, title: string, url: string) {
            if (typeof window.onpushState === 'function') {
                window.onpushState({state});
            }
            return pushState.apply(history, [state, title, url]);
        };
    }

    modifyState(data: unknown = undefined, uri = '', replaceState = false): void {
        const newUri = `#${uri}`;
        if (window.location.hash === newUri) {
            return;
        }
        if (replaceState) {
            this.history.replaceState(data, document.title, newUri);
        } else {
            this.history.pushState(data, document.title, newUri);
        }
    }

    onLocationChange(callback: (state?: unknown) => void): void {
        this.locationChangeCallbackQueue.push(callback);
    }

    init(): void {
        const state = this.history.state;
        this.locationChangeCallbackQueue.forEach((callback) => {
            callback(state);
        });
    }
}

export class Subscription {
    constructor(private readonly unsubscribeCallback: () => void) {}

    unsubscribe(): void {
        this.unsubscribeCallback();
    }
}

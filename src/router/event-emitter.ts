import {Subscriber, SubscriberMap} from './interfaces';
import {Subscription} from './subscription';

export class EventEmitter {
    private readonly subscriptions: Map<string, SubscriberMap> = new Map<string, SubscriberMap>();

    constructor(private readonly namespace: string) {}

    subscribe<T = any>(eventName: string, subscriber: Subscriber<T>): Subscription {
        if (!this.subscriptions.has(eventName)) {
            this.subscriptions.set(eventName, new Map());
        }
        const subscription = this.subscriptions.get(eventName);
        const subscriptionKey = Symbol(eventName);
        subscription?.set(subscriptionKey, subscriber);

        return new Subscription(() => subscription?.delete(subscriptionKey));
    }

    emit<T>(eventName: string, data: T): void {
        const subscription = this.subscriptions.get(eventName);
        if (!subscription) {
            return;
        }
        for (const subscriber of subscription.values()) {
            ((s: Subscriber<T>) => setTimeout(() => s(data)))(subscriber);
        }
    }
}

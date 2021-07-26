import {Subscriber} from './interfaces';
import {Subscription} from './subscription';

export class EventEmitter<T = unknown> {
    private readonly subscriptions: Subscriber<T>[] = [];

    private data!: T;

    subscribe(subscriber: Subscriber<T>): Subscription {
        const index = this.subscriptions.push(subscriber) - 1;
        // initial call
        if (this.data !== undefined) {
            subscriber(this.data);
        }
        return new Subscription(() => this.subscriptions.splice(index, 1));
    }

    emit(data: T): void {
        this.subscriptions.forEach((s: Subscriber<T>) => setTimeout(() => s(data)));
        this.data = data;
    }
}

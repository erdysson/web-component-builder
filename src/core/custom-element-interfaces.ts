export interface ICustomElement {
    observedAttributes?: string[];
    attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
    propertyChangedCallback?(name: string, oldValue: string, newValue: string): void;
    connectedCallback?(): void;
    disconnectedCallback?(): void;
}

export interface ICustomElementEventDetail<K> {
    type: TCustomElementLifecycleEventType;
    cId: symbol;
    data: K;
}

export type TCustomElementLifecycle = 'wc:lifecycle-event';

export type TCustomElementLifecycleEventType =
    | 'construct'
    | 'connected'
    | 'attributeChanged'
    | 'propertyChanged'
    | 'disconnected';

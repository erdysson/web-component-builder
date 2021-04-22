export interface ICustomElement {
    observedAttributes?: string[];
    attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
    propertyChangedCallback?(name: string, oldValue: string, newValue: string): void;
    connectedCallback?(): void;
    disconnectedCallback?(): void;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type TCustomElementEventData<T = {}> = Record<symbol, CustomEventInit<T>>;

export type TCustomElementLifecycleEvent =
    | 'construct'
    | 'connected'
    | 'attributeChanged'
    | 'propertyChanged'
    | 'disconnected';

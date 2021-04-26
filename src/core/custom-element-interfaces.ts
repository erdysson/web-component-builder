export interface ICustomElement extends HTMLElement {
    observedAttributes?: string[];
    attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
    propertyChangedCallback?(name: string, oldValue: string, newValue: string): void;
    connectedCallback?(): void;
    disconnectedCallback?(): void;
}

export enum CustomElementState {
    CONSTRUCTED,
    CONNECTED,
    DISCONNECTED
}

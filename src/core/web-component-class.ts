import {ICustomElement, TCustomElementEventData, TCustomElementLifecycleEvent} from './custom-element-interfaces';
import {IAttrChanges, IClass, IPropChanges} from './interfaces';

export class WebComponentClass extends HTMLElement implements ICustomElement {
    private readonly identifier!: symbol;

    private readonly mappedClassConstructor!: IClass;

    constructor() {
        super();
        this.dispatchLifecycleEvent('construct', {ctor: this.mappedClassConstructor});
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        console.log('wcc:attributeChanged', name, oldValue, newValue);
        this.dispatchLifecycleEvent<IAttrChanges>('propertyChanged', {
            [name]: {
                oldValue,
                newValue
            }
        });
    }

    propertyChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
        console.log('wcc:propertyChanged', name, oldValue, newValue);
        this.dispatchLifecycleEvent<IPropChanges>('propertyChanged', {
            [name]: {
                oldValue,
                newValue
            }
        });
    }

    connectedCallback(): void {
        console.log('wcc:connected');
    }

    disconnectedCallback(): void {
        console.log('wcc:disconnected');
        this.dispatchLifecycleEvent('disconnected', {});
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    private dispatchLifecycleEvent<T = {}>(event: TCustomElementLifecycleEvent, data: T): void {
        window.dispatchEvent(
            new CustomEvent<TCustomElementEventData<T>>(event, {
                detail: {
                    identifier: this.identifier,
                    data
                }
            })
        );
    }
}

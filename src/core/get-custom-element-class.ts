import {CustomElementState, ICustomElement} from './custom-element-interfaces';
import {ViewEncapsulation} from './enums';
import {Class} from './interfaces';
import {Metadata} from './metadata';
import {IEventListenerMetadata, IViewChildMetadata} from './metadata-interfaces';

export function getCustomElementClass(
    attrs: string[],
    props: string[],
    viewEncapsulation: ViewEncapsulation = ViewEncapsulation.NONE,
    styles: string[],
    viewContainer: string,
    viewChildren: IViewChildMetadata[],
    eventListener: IEventListenerMetadata[],
    template: string,
    componentInstanceInjector: () => any
): Class<HTMLElement> {
    return class extends HTMLElement implements ICustomElement {
        static get observedAttributes(): string[] {
            return attrs;
        }

        private readonly mappedInstance: any;

        private state: CustomElementState;

        constructor() {
            super();
            this.mappedInstance = componentInstanceInjector();
            this.state = CustomElementState.CONSTRUCTED;
            // define properties
            this.defineProperties(this);
            // trigger property change to map the values from element to class
            this.assignPropertyValues();
        }

        attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
            // reflect attribute value changes to the mapped instance
            this.mappedInstance[name] = newValue;
            // notify only after connected
            if (this.state === CustomElementState.CONNECTED) {
                // get the type constructor to convert the values to boolean or number, string is default
                const TypeConstructor = Metadata.getTypeMetadata(this.mappedInstance, name);
                // call the attrChanges callback if exist
                this.mappedInstance.onAttrChanges?.bind(this.mappedInstance)({
                    name,
                    oldValue: TypeConstructor(oldValue),
                    newValue: TypeConstructor(newValue)
                });
            }
        }

        propertyChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
            // reflect property value changes to the mapped instance
            this.mappedInstance[name] = newValue;
            this.mappedInstance.onPropChanges?.bind(this.mappedInstance)({
                name,
                oldValue,
                newValue
            });
        }

        connectedCallback(): void {
            this.state = CustomElementState.CONNECTED;
            // insert content of the component
            this.insertContent();
            this.mappedInstance.onInit?.bind(this.mappedInstance)();
        }

        disconnectedCallback(): void {
            this.state = CustomElementState.DISCONNECTED;
            this.mappedInstance.onDestroy?.bind(this.mappedInstance)();
            // todo : check removal of the references in the instances
        }

        private defineProperties(context: ICustomElement): void {
            props.forEach((prop) => {
                Object.defineProperty(context, prop, {
                    get: function () {
                        return this[`_${prop}`];
                    },
                    set: function (value) {
                        context.propertyChangedCallback?.bind(context)(prop, this[prop], value);
                        this[`_${prop}`] = value;
                    }
                });
            });
        }

        private assignPropertyValues(): void {
            (props as unknown as (keyof this)[]).forEach((prop: keyof this) => {
                this.mappedInstance[prop] = this[prop];
            });
        }

        private assignViewContainer(): void {
            if (viewContainer) {
                this.mappedInstance[viewContainer] = this;
            }
        }

        private assignViewChildren(): void {
            viewChildren.forEach((viewChildConfig: IViewChildMetadata) => {
                const elements: NodeListOf<HTMLElement> = this.querySelectorAll<HTMLElement>(
                    viewChildConfig.querySelector
                );
                this.mappedInstance[viewChildConfig.propertyKey] =
                    elements.length === 0
                        ? null
                        : elements.length === 1
                        ? elements.item(0)
                        : Array.from(elements);
            });
        }

        private assignEventListeners(): void {
            eventListener.forEach((eventListenerConfig: IEventListenerMetadata) => {
                const results: NodeListOf<HTMLElement> = eventListenerConfig.querySelector
                    ? this.querySelectorAll<HTMLElement>(eventListenerConfig.querySelector)
                    : ([this] as unknown as NodeListOf<HTMLElement>);
                results.forEach((result: HTMLElement) => {
                    if (eventListenerConfig.predicate()) {
                        result.addEventListener(eventListenerConfig.event, (event: Event) => {
                            this.mappedInstance[eventListenerConfig.propertyKey].bind(this.mappedInstance)(
                                event,
                                result
                            );
                        });
                    }
                });
            });
        }

        private insertContent(): void {
            if (viewEncapsulation) {
                const shadow = this.attachShadow({mode: 'open'});
                if (styles.length) {
                    const style = document.createElement('style');
                    style.textContent = styles.join('\n');
                    shadow.appendChild(style);
                }
                shadow.innerHTML += template;
            } else {
                // inject template
                if (styles.length) {
                    const style = document.createElement('style');
                    style.textContent = styles.join('\n');
                    this.appendChild(style);
                }
                this.insertAdjacentHTML('beforeend', template);
            }
            // assign view container
            this.assignViewContainer();
            // assign view children
            this.assignViewChildren();
            // assign event handlers
            this.assignEventListeners();
        }
    };
}

import {CustomElementState, ICustomElement} from './custom-element-interfaces';
import {Class, IModuleConfig} from './interfaces';
import {Metadata} from './metadata';
import {IEventListenerMetadata, IViewChildMetadata} from './metadata-interfaces';

export class Runtime {
    private readonly providerInstanceMap: WeakMap<Class, any> = new WeakMap<Class, any>();

    private moduleConfig!: IModuleConfig;

    initModule(moduleClass: Class): void {
        this.moduleConfig = Metadata.getModuleConfig(moduleClass);
        const {components} = this.moduleConfig;
        this.registerRuntimeWebComponents(components);
    }

    getConstructorParamsFor(hostClass: Class): any[] {
        const params = Metadata.getConstructorParams(hostClass);
        // init providers that are used in component(s)
        return params.map((providerClass: Class) => {
            // validate and make sure that class is registered in the module
            if (!this.moduleConfig.providers.includes(providerClass)) {
                throw Error('Injected provider is not registered in the module');
            }
            if (!this.providerInstanceMap.has(providerClass)) {
                this.createProviderInstance(providerClass);
            }
            return this.providerInstanceMap.get(providerClass);
        });
    }

    createProviderInstance(providerClass: Class): void {
        // all dependencies are initiated, now create the wrapping provider with injected params
        const constructorParams = this.getConstructorParamsFor(providerClass);
        const providerInstance: InstanceType<typeof providerClass> = new providerClass(...constructorParams);
        this.providerInstanceMap.set(providerClass, providerInstance);
    }

    createComponentInstance(componentClass: Class): any {
        const constructorParams = this.getConstructorParamsFor(componentClass);
        return new componentClass(...constructorParams);
    }

    registerRuntimeWebComponents(components: Class[]): void {
        components.forEach((componentClass: Class) => {
            const config = Metadata.getComponentConfig(componentClass);
            const attrs = Object.keys(Metadata.getComponentAttrConfig(componentClass));
            const props = Object.keys(Metadata.getComponentPropConfig(componentClass));
            const viewContainer = Metadata.getViewContainerConfig(componentClass);
            const viewChildren = Metadata.getViewChildrenConfig(componentClass);
            const eventListeners = Metadata.getEventListenerConfig(componentClass);
            const customElementClass = this.getCustomElementClass(
                attrs,
                props,
                config.shadow,
                config.styles || [],
                viewContainer,
                viewChildren,
                eventListeners,
                config.template,
                () => this.createComponentInstance(componentClass)
            );
            customElements.define(config.selector, customElementClass);
        });
    }

    getCustomElementClass(
        attrs: string[],
        props: string[],
        shadowDOM: boolean,
        styles: string[],
        viewContainer: string,
        viewChildren: IViewChildMetadata[],
        eventListener: IEventListenerMetadata[],
        template: string,
        componentInstanceInjector: () => Class
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
                // insert content of the component
                this.insertContent();

                setTimeout(() => {
                    // after view init
                    this.mappedInstance.onViewInit?.bind(this.mappedInstance)();
                });
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

            propertyChangedCallback(name: string, oldValue: any, newValue: any): void {
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
                this.mappedInstance.onInit?.bind(this.mappedInstance)();
            }

            disconnectedCallback(): void {
                this.state = CustomElementState.DISCONNECTED;
                this.mappedInstance.onDestroy?.bind(this.mappedInstance)();
            }

            private defineProperties(context: ICustomElement): void {
                props.forEach((prop) => buildProperty(context, prop));

                function buildProperty(context: any, prop: string) {
                    Object.defineProperty(context, prop, {
                        get: function () {
                            return this[`_${prop}`];
                        },
                        set: function (value) {
                            context.propertyChangedCallback?.bind(context)(prop, this[prop], value);
                            this[`_${prop}`] = value;
                        }
                    });
                }
            }

            private assignPropertyValues(): void {
                ((props as unknown) as (keyof this)[]).forEach((prop: keyof this) => {
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
                        elements.length === 0 ? null : elements.length === 1 ? elements.item(0) : Array.from(elements);
                });
            }

            private assignEventListeners(): void {
                eventListener.forEach((eventListenerConfig: IEventListenerMetadata) => {
                    const results: NodeListOf<HTMLElement> = eventListenerConfig.querySelector
                        ? document.querySelectorAll<HTMLElement>(eventListenerConfig.querySelector)
                        : (([this] as unknown) as NodeListOf<HTMLElement>);
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
                // setTimeout is required because of the execution order of onInit() calls
                setTimeout(() => {
                    if (shadowDOM) {
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
                });
            }
        };
    }
}

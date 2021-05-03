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
            this.createProviderInstance(providerClass);
            return this.providerInstanceMap.get(providerClass);
        });
    }

    createProviderInstance(providerClass: Class): void {
        if (this.providerInstanceMap.has(providerClass)) {
            return;
        }
        // validate and make sure that class is registered in the module
        if (!this.moduleConfig.providers.includes(providerClass)) {
            throw Error('Injected provider is not registered in the module');
        }
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
                this.defineProperties();
                // trigger property change to map the values from element to class
                this.assignPropertyValues();
                // insert content of the component
                this.insertContent();
            }

            attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
                // reflect attribute value changes to the mapped instance
                this.mappedInstance[name] = newValue;
                // notify only after connected
                if (this.state === CustomElementState.CONNECTED) {
                    // get the type constructor to convert the values to boolean or number, string is default
                    const TypeConstructor = Metadata.getTypeMetadata(this.mappedInstance, name);
                    // call the attrChanges callback if exist
                    this.mappedInstance.onAttrChanges?.bind(this.mappedInstance)(
                        name,
                        TypeConstructor(oldValue),
                        TypeConstructor(newValue)
                    );
                }
            }

            propertyChangedCallback(name: string, oldValue: any, newValue: any): void {
                // reflect property value changes to the mapped instance
                this.mappedInstance[name] = newValue;
                // notify only after connected
                if (this.state === CustomElementState.CONNECTED) {
                    this.mappedInstance.onPropChanges?.bind(this.mappedInstance)(name, oldValue, newValue);
                }
            }

            connectedCallback(): void {
                this.state = CustomElementState.CONNECTED;
                this.mappedInstance.onInit?.bind(this.mappedInstance)();
            }

            disconnectedCallback(): void {
                this.state = CustomElementState.DISCONNECTED;
                this.mappedInstance.onDestroy?.bind(this.mappedInstance)();
            }

            // todo : add view init event and call

            private defineProperties(): void {
                props.forEach((prop) => {
                    Object.defineProperty(this, prop, {
                        get(): any {
                            return this.value;
                        },
                        set(newValue: any): void {
                            const oldValue = this.value;
                            // call the prop changed callback
                            this.propertyChangedCallback(prop, oldValue, newValue);
                            // then update the value
                            this.value = newValue;
                        }
                    });
                });
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
                    const results: NodeListOf<HTMLElement> =
                        this.querySelectorAll<HTMLElement>(viewChildConfig.querySelector) || [];
                    this.mappedInstance[viewChildConfig.propertyKey] =
                        results.length === 0 ? null : results.length === 1 ? results[0] : results;
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
                    const style = document.createElement('style');
                    style.textContent = styles.join('\n');
                    if (shadowDOM) {
                        const shadow = this.attachShadow({mode: 'open'});
                        shadow.appendChild(style);
                        shadow.innerHTML += template;
                    } else {
                        // inject template
                        this.appendChild(style);
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

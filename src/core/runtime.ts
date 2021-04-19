import {IClass, IModuleConfig} from './interfaces';
import {Metadata} from './metadata';
import {
    IInjectMetadataConfig,
    IInputMetadataConfig,
    TComponentInstance,
    TEventListenerMetadata,
    TInputMetadata,
    TViewChildrenMetadata,
    TWcInjectMetadata
} from './metadata-interfaces';

export class Runtime {
    private readonly providerInstanceMap: WeakMap<IClass, unknown> = new WeakMap<IClass, unknown>();

    private moduleConfig!: IModuleConfig;

    initModule(moduleClass: IClass): void {
        this.moduleConfig = Metadata.getModuleConfig(moduleClass);
        const {components} = this.moduleConfig;
        // init components
        components.forEach((componentClass: IClass) => this.initComponent(componentClass));
    }

    initProvider(providerClass: IClass): void {
        const {providers} = this.moduleConfig;
        const providerConfig = Metadata.getProviderConfig(providerClass);
        // validate and make sure that class is registered in the module
        if (!providers.includes(providerClass)) {
            throw Error('Injected provider is not registered in the module');
        }
        // validate and make sure that class is decorated with @Injectable()
        if (!providerConfig) {
            throw Error('Injected provider is not decorated with @Injectable().');
        }
        // create instance only if does not exist
        if (!this.providerInstanceMap.has(providerClass)) {
            this.createProviderInstance(providerClass);
        }
    }

    initComponent(componentClass: IClass): void {
        const {selector, template} = Metadata.getComponentConfig(componentClass);
        const injectMetadata = Metadata.getInjectedProviderConfig(componentClass);
        // init providers that are used in component(s)
        injectMetadata.forEach((injectMetadataConfig: IInjectMetadataConfig) => {
            this.initProvider(injectMetadataConfig.providerClass);
        });
        const constructorParams = this.getHostClassConstructorParams(injectMetadata);
        const inputConfigForComponent = Metadata.getComponentInputConfig(componentClass);
        const viewChildrenConfigForComponent = Metadata.getViewChildrenConfig(componentClass);
        const eventListenerConfigForComponent = Metadata.getEventListenerConfig(componentClass);
        const componentFactory = this.getComponentFactory(
            componentClass,
            constructorParams,
            inputConfigForComponent,
            viewChildrenConfigForComponent,
            eventListenerConfigForComponent,
            template
        );
        // register web component element
        customElements.define(selector, componentFactory);
    }

    createProviderInstance(providerClass: IClass): void {
        const injectMetadata = Metadata.getInjectedProviderConfig(providerClass);
        // create dependency instances first
        injectMetadata.forEach((injectConfig: IInjectMetadataConfig) => {
            this.initProvider(injectConfig.providerClass);
        });
        // all dependencies are initiated, now create the wrapping provider with injected params
        const constructorParams = this.getHostClassConstructorParams(injectMetadata);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const providerInstance: unknown = new providerClass(...constructorParams);
        this.providerInstanceMap.set(providerClass, providerInstance);
    }

    getHostClassConstructorParams(injectMetadata: TWcInjectMetadata): unknown[] {
        return injectMetadata
            .sort(
                (config1: IInjectMetadataConfig, config2: IInjectMetadataConfig) =>
                    config1.targetParameterIndex - config2.targetParameterIndex
            )
            .map((config: IInjectMetadataConfig) => this.providerInstanceMap.get(config.providerClass));
    }

    getComponentFactory(
        componentClass: IClass,
        componentClassConstructorParams: unknown[],
        componentInputs: TInputMetadata,
        componentViewChildren: TViewChildrenMetadata,
        componentEventListeners: TEventListenerMetadata,
        componentTemplate: string
    ): IClass<CustomElementConstructor> {
        return class RunTimeWebComponentClass extends HTMLElement {
            private readonly _componentInstance: TComponentInstance;

            private _initialized = false;

            constructor() {
                super();
                // create mapped component instance
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this._componentInstance = new componentClass(...componentClassConstructorParams);
                // setTimeout is required because in IE11, the order of onInit() is different.
                setTimeout(() => {
                    // the way for it to work on IE11 and applying global styles to the components
                    this.insertAdjacentHTML('beforeend', componentTemplate);
                    // assign dom elements to the component properties
                    this.bindDOMElements();
                    // assign handlers for specified events and elements
                    this.bindEventListeners();
                    // call afterViewInit if exists
                    this._componentInstance.onViewInit?.bind(this._componentInstance)();
                });
            }

            // eslint-disable-next-line @typescript-eslint/ban-types
            private static inferType(from: string, typeConstructor: Function): unknown {
                switch (typeConstructor) {
                    case Boolean:
                        return Boolean(from);
                    case Number:
                        return Number(from);
                    default:
                        return from;
                }
            }

            static get observedAttributes() {
                return componentInputs.map((input: IInputMetadataConfig) => input.inputAttributeName);
            }

            private updateInstanceFields(propertyKey: string, newValue: unknown): void {
                // bind input values to the component instance
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this._componentInstance[propertyKey] = newValue;
            }

            private bindDOMElements(): void {
                componentViewChildren.forEach((config) => {
                    let results;

                    if (!config.querySelector) {
                        results = [this];
                    } else {
                        results = this.querySelectorAll<HTMLElement>(config.querySelector);
                    }
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    this._componentInstance[config.componentPropertyKey] = (() => {
                        switch (results.length) {
                            case 0:
                                return null;
                            case 1:
                                return results[0];
                            default:
                                return results;
                        }
                    })();
                });
            }

            private bindEventListeners(): void {
                componentEventListeners.forEach((config) => {
                    const elements = !config.querySelector
                        ? [this]
                        : this.querySelectorAll<HTMLElement>(config.querySelector);
                    elements.forEach((el: HTMLElement) => {
                        // todo : figure out removing
                        el.addEventListener(config.event, (event: Event) => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            this._componentInstance[config.componentPropertyKey](event, el);
                        });
                    });
                });
            }

            connectedCallback() {
                this._initialized = true;
                // call the onInit if exists
                this._componentInstance.onInit?.bind(this._componentInstance)();
            }

            attributeChangedCallback(name: string, oldValue: string, newValue: string) {
                // find the mapped config for changed attr
                const inputConfigForChange = componentInputs.find(
                    ({inputAttributeName}) => inputAttributeName === name
                ) as IInputMetadataConfig;
                // map the class property name for the reflection of attr changes
                this.updateInstanceFields(
                    inputConfigForChange.componentPropertyKey,
                    RunTimeWebComponentClass.inferType(newValue, inputConfigForChange.typeConstructor)
                );
                if (this._initialized) {
                    // call the onChanges on instance only after initialization & if exists
                    this._componentInstance.onChanges?.bind(this._componentInstance)({[name]: {oldValue, newValue}});
                }
            }

            disconnectedCallback() {
                // call the onDestroy if exists
                this._componentInstance.onDestroy?.bind(this._componentInstance)();
            }
        };
    }
}

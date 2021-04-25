import {ICustomElement, ICustomElementEventDetail, TCustomElementLifecycleEventType} from './custom-element-interfaces';
import {Class, IAttrChanges, IModuleConfig, IPropChanges} from './interfaces';
import {Metadata} from './metadata';
import {IAttrMetadata, IPropMetadata} from './metadata-interfaces';

export class Runtime {
    private readonly providerInstanceMap: WeakMap<Class, any> = new WeakMap<Class, any>();

    private readonly componentInstanceMap: Map<symbol, any> = new Map<symbol, any>();

    private moduleConfig!: IModuleConfig;

    listenComponentLifecycleEvents(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.addEventListener('wc:lifecycle-event', (wcEvent: CustomEvent<ICustomElementEventDetail<unknown>>) => {
            const {cId, type, data} = wcEvent.detail;
            let componentInstance: any;

            switch (type) {
                case 'construct':
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    this.createComponentInstance(data.componentClass, cId);
                    break;
                case 'attributeChanged':
                    componentInstance = this.componentInstanceMap.get(cId);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    componentInstance[(data as IAttrChanges).name] = (data as IAttrChanges).newValue;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    componentInstance.onAttrChanges?.bind(componentInstance)(data as IAttrChanges);
                    break;
                case 'connected':
                    componentInstance = this.componentInstanceMap.get(cId);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    componentInstance.onInit?.bind(componentInstance)();
                    break;
                case 'propertyChanged':
                    // eslint-disable-next-line no-case-declarations
                    componentInstance = this.componentInstanceMap.get(cId);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    componentInstance[(data as IPropChanges).name] = (data as IPropChanges).newValue;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    componentInstance.onPropChanges?.bind(componentInstance)(data as IPropChanges);
                    break;
                case 'disconnected':
                    console.log('cid', cId);
                    componentInstance = this.componentInstanceMap.get(cId);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    componentInstance.onDestroy?.bind(componentInstance)();
                    // remove the instance from map
                    this.componentInstanceMap.delete(cId);
                    break;
            }
        });
    }

    initModule(moduleClass: Class): void {
        this.moduleConfig = Metadata.getModuleConfig(moduleClass);
        const {components} = this.moduleConfig;
        this.listenComponentLifecycleEvents();
        this.registerRuntimeWebComponents(components);
    }

    createProviderInstance(providerClass: Class): void {
        if (this.providerInstanceMap.has(providerClass)) {
            return;
        }
        const {providers} = this.moduleConfig;
        // validate and make sure that class is registered in the module
        if (!providers.includes(providerClass)) {
            throw Error('Injected provider is not registered in the module');
        }
        const dependencies = Metadata.getConstructorParams(providerClass);
        // create dependency instances first
        dependencies.forEach((depClass: Class) => {
            this.createProviderInstance(depClass);
        });
        // all dependencies are initiated, now create the wrapping provider with injected params
        const constructorParams = this.getHostClassConstructorParams(dependencies);
        const providerInstance: InstanceType<typeof providerClass> = new providerClass(...constructorParams);
        this.providerInstanceMap.set(providerClass, providerInstance);
    }

    registerRuntimeWebComponents(components: Class[]): void {
        components.forEach((componentClass: Class) => {
            const attrs = Metadata.getComponentAttrConfig(componentClass);
            const props = Metadata.getComponentPropConfig(componentClass);
            const {selector, template} = Metadata.getComponentConfig(componentClass);
            customElements.define(selector, this.getRuntimeClass(componentClass, attrs, props, template, this));
        });
    }

    createComponentInstance(componentClass: Class, identifier: symbol): void {
        if (this.componentInstanceMap.has(identifier)) {
            throw new Error(
                'Can not have the same identifier for component instance request ' + identifier.valueOf().toString()
            );
        }
        const params = Metadata.getConstructorParams(componentClass);
        // init providers that are used in component(s)
        params.forEach((providerClass: Class) => {
            this.createProviderInstance(providerClass);
        });
        const constructorParams = this.getHostClassConstructorParams(params);
        const componentInstance = new componentClass(...constructorParams);
        this.componentInstanceMap.set(identifier, componentInstance);
    }

    getHostClassConstructorParams(paramClasses: Class[]) {
        return paramClasses.map(
            (providerClass: Class) => this.providerInstanceMap.get(providerClass) as InstanceType<typeof providerClass>
        );
    }

    // getComponentFactory(
    //     componentClass: IClass,
    //     componentClassConstructorParams: unknown[],
    //     componentAttrs: IAttrMetadata,
    //     componentViewChildren: IViewChildMetadata[],
    //     componentEventListeners: IEventListenerMetadata[],
    //     componentTemplate: string
    // ): IClass<CustomElementConstructor> {
    //     return class RunTimeWebComponentClass extends HTMLElement {
    //         private readonly _componentInstance: TComponentInstance;
    //
    //         private _initialized = false;
    //
    //         constructor() {
    //             super();
    //             // create mapped component instance
    //             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //             // @ts-ignore
    //             this._componentInstance = new componentClass(...componentClassConstructorParams);
    //             // setTimeout is required because in IE11, the order of onInit() is different.
    //             setTimeout(() => {
    //                 // the way for it to work on IE11 and applying global styles to the components
    //                 this.insertAdjacentHTML('beforeend', componentTemplate);
    //                 // assign dom elements to the component properties
    //                 this.bindDOMElements();
    //                 // assign handlers for specified events and elements
    //                 this.bindEventListeners();
    //                 // call afterViewInit if exists
    //                 this._componentInstance.onViewInit?.bind(this._componentInstance)();
    //             });
    //         }
    //
    //         // eslint-disable-next-line @typescript-eslint/ban-types
    //         private static inferType(from: string, typeConstructor: Function): unknown {
    //             switch (typeConstructor) {
    //                 case Boolean:
    //                     return Boolean(from);
    //                 case Number:
    //                     return Number(from);
    //                 default:
    //                     return from;
    //             }
    //         }
    //
    //         static get observedAttributes() {
    //             return Object.keys(componentAttrs);
    //         }
    //
    //         private updateInstanceFields(propertyKey: string, newValue: unknown): void {
    //             // bind attr values to the component instance
    //             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //             // @ts-ignore
    //             this._componentInstance[propertyKey] = newValue;
    //         }
    //
    //         private bindDOMElements(): void {
    //             componentViewChildren.forEach((config) => {
    //                 let results;
    //
    //                 if (!config.querySelector) {
    //                     results = [this];
    //                 } else {
    //                     results = this.querySelectorAll<HTMLElement>(config.querySelector);
    //                 }
    //                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //                 // @ts-ignore
    //                 this._componentInstance[config.propertyKey] = (() => {
    //                     switch (results.length) {
    //                         case 0:
    //                             return null;
    //                         case 1:
    //                             return results[0];
    //                         default:
    //                             return results;
    //                     }
    //                 })();
    //             });
    //         }
    //
    //         private bindEventListeners(): void {
    //             componentEventListeners.forEach((config) => {
    //                 const elements = !config.querySelector
    //                     ? [this]
    //                     : this.querySelectorAll<HTMLElement>(config.querySelector);
    //                 elements.forEach((el: HTMLElement) => {
    //                     // todo : figure out removing
    //                     el.addEventListener(config.event, (event: Event) => {
    //                         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //                         // @ts-ignore
    //                         this._componentInstance[config.propertyKey](event, el);
    //                     });
    //                 });
    //             });
    //         }
    //
    //         connectedCallback() {
    //             this._initialized = true;
    //             // call the onInit if exists
    //             this._componentInstance.onInit?.bind(this._componentInstance)();
    //         }
    //
    //         attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    //             // find the mapped config for changed attr
    //             const attrConfigForChange = componentAttrs[name];
    //             // map the class property name for the reflection of attr changes
    //             this.updateInstanceFields(
    //                 attrConfigForChange.propertyKey,
    //                 RunTimeWebComponentClass.inferType(newValue, attrConfigForChange.typeConstructor)
    //             );
    //             if (this._initialized) {
    //                 // call the onAttrChanges on instance only after initialization & if exists
    //                 this._componentInstance.onAttrChanges?.bind(this._componentInstance)({
    //                     name,
    //                     oldValue,
    //                     newValue
    //                 });
    //             }
    //         }
    //
    //         disconnectedCallback() {
    //             // call the onDestroy if exists
    //             this._componentInstance.onDestroy?.bind(this._componentInstance)();
    //         }
    //     };
    // }

    getRuntimeClass(
        componentClass: Class,
        attrs: IAttrMetadata,
        props: IPropMetadata,
        template: string,
        runtime: Runtime
    ): CustomElementConstructor {
        class WebComponentClass extends HTMLElement implements ICustomElement {
            static get observedAttributes(): string[] {
                return Object.keys(attrs);
            }

            private readonly cId = Symbol('wc:id');

            constructor() {
                super();
                this.dispatchLifecycleEvent('construct', {componentClass});
                setTimeout(() => this.insertAdjacentHTML('beforeend', template));
            }

            attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
                // console.log('wcc:attributeChanged', name, oldValue, newValue);
                this.dispatchLifecycleEvent<IAttrChanges>('propertyChanged', {
                    name,
                    oldValue,
                    newValue
                });
            }

            propertyChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
                // console.log('wcc:propertyChanged', name, oldValue, newValue);
                this.dispatchLifecycleEvent<IPropChanges>('propertyChanged', {
                    name,
                    oldValue,
                    newValue
                });
            }

            connectedCallback(): void {
                // console.log('wcc:connected');
                this.dispatchLifecycleEvent('connected', {});
            }

            disconnectedCallback(): void {
                // console.log('wcc:disconnected');
                this.dispatchLifecycleEvent('disconnected', {});
            }

            dispatchLifecycleEvent<K>(eventType: TCustomElementLifecycleEventType, data: K): void {
                window.dispatchEvent(
                    new CustomEvent<ICustomElementEventDetail<K>>('wc:lifecycle-event', {
                        detail: {
                            type: eventType,
                            cId: this.cId,
                            data
                        }
                    })
                );
            }
        }
        // add properties with setter
        Object.keys(props).forEach((prop) => {
            Object.defineProperty(WebComponentClass.prototype, prop, {
                set(newValue: unknown) {
                    const oldValue = this.value;
                    // call lc method
                    this.propertyChangedCallback(prop, oldValue, newValue);
                    // then update the value
                    this.value = newValue;
                },
                get() {
                    return this.value;
                }
            });
        });

        return WebComponentClass;
    }
}

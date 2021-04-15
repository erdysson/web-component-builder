import {IClass, IModuleConfig} from './interfaces';
import {Metadata} from './metadata';
import {
    IInjectMetadataConfig,
    IInputMetadataConfig,
    TComponentInstance,
    TInputMetadata,
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
        const componentFactory = this.getComponentFactory(
            componentClass,
            constructorParams,
            inputConfigForComponent,
            template
        );
        // register web component element
        customElements.define(selector, componentFactory);
    }

    createProviderInstance(providerClass: IClass): void {
        const injectMetadata = Metadata.getInjectedProviderConfig(providerClass) || [];
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
        componentTemplate: string
    ): IClass<CustomElementConstructor> {
        return class RunTimeWebComponentClass extends HTMLElement {
            private readonly componentInstance: TComponentInstance;

            constructor() {
                super();
                // create mapped component instance
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.componentInstance = new componentClass(...componentClassConstructorParams);
                // setTimeout is required because in IE11, the order of onInit() is different.
                // to align the functionality across the browsers, setTimeout is needed here
                setTimeout(() => {
                    // the way for it to work on IE11 and applying global styles to the components
                    this.insertAdjacentHTML('beforeend', componentTemplate);
                    // todo : add afterViewInit lc method
                });
            }

            static get observedAttributes() {
                return componentInputs.map((input: IInputMetadataConfig) => input.inputAttributeName);
            }

            connectedCallback() {
                // prevent multiple connectedCallbacks
                if (this.isConnected) {
                    // const observedAttributes = RunTimeWebComponentClass.observedAttributes;
                    // observedAttributes.forEach((attr: string) => {
                    //     // read the initial attribute values
                    //     const [propertyKey, attrValue] = this.getPropertyKeyAttrPair(attr);
                    //     // update the value in component instance
                    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //     // @ts-ignore
                    //     this.componentInstance[propertyKey] = attrValue;
                    // });
                    // call the onInit if exists
                    this.componentInstance.onInit?.bind(this.componentInstance)();
                }
            }
            // todo : fix multi input triggers more than once onChanges in the beginning
            attributeChangedCallback(name: string, oldValue: string, newValue: string) {
                // map the class property name for the reflection of attr changes
                const inputConfigForChange = componentInputs.find((input) => input.inputAttributeName === name);
                // if can not be found, then means there is a problem with code!
                if (!inputConfigForChange) {
                    throw Error(`watched attribute ${name} is not bound properly to the @WcInput() decorated property`);
                }
                // update the value in component instance
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.componentInstance[inputConfigForChange.componentPropertyKey] = newValue;
                // call the onChanges if exists
                this.componentInstance.onChanges?.bind(this.componentInstance)({[name]: {oldValue, newValue}});
            }

            disconnectedCallback() {
                // call the onDestroy if exists
                this.componentInstance.onDestroy?.bind(this.componentInstance)();
            }

            private getPropertyKeyAttrPair(attr: string): [string, string | null] {
                const value = this.getAttribute(attr);
                const input = componentInputs.find((cInput) => cInput.inputAttributeName === attr);
                // if can not be found, then means there is a problem with code!
                if (!input) {
                    throw Error(`watched attribute ${attr} is not bound properly to the @WcInput() decorated property`);
                }
                return [input.componentPropertyKey, value];
            }
        };
    }
}

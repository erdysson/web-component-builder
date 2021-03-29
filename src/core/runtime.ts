import {IClass}  from './interfaces';
import {IInjectMetadataConfig, IInputMetadataConfig, TComponentInstance, TWcInjectMetadata, TInputMetadata} from './metadata-interfaces';
import {Metadata} from './metadata';

export class Runtime {

    private readonly providerInstanceMap: WeakMap<IClass, unknown> = new WeakMap<IClass, unknown>();

    initModule(moduleClass: IClass): void {
        const { providers, components } = Metadata.getModuleConfig(moduleClass);
        // init providers
        providers.forEach((providerClass: IClass) => this.initProvider(providerClass));
        // init components
        components.forEach((componentClass: IClass) => this.initComponent(componentClass));
    }

    initProvider(providerClass: IClass): void {
        const providerConfig = Metadata.getProviderConfig(providerClass);
        // just validate and make sure that class is decorated with @WCProvider()
        if (!providerConfig) {
            throw Error('Injected provider is not decorated with @WCProvider().');
        }
        this.createProviderInstance(providerClass);
    }

    initComponent(componentClass: IClass): void {
        const { selector, template } = Metadata.getComponentConfig(componentClass);
        const injectMetadata = Metadata.getInjectedProviderConfig(componentClass);
        const constructorParams = this.getHostClassConstructorParams(injectMetadata);
        const inputConfigForComponent = Metadata.getComponentInputConfig(componentClass);
        const componentFactory = this.getComponentFactory(
            componentClass,
            constructorParams,
            inputConfigForComponent,
            template,
        );
        // register web component element
        customElements.define(selector, componentFactory);
    }

    private createProviderInstance(providerClass: IClass): void {
        if (this.providerInstanceMap.has(providerClass)) {
            return;
        }
        const injectMetadata = Metadata.getInjectedProviderConfig(providerClass) || [];
        // create dependency instances first
        injectMetadata.forEach((injectConfig: IInjectMetadataConfig) => {
            this.createProviderInstance(injectConfig.providerClass);
        });
        // all dependencies are initiated, now create the wrapping provider with injected params
        const constructorParams = this.getHostClassConstructorParams(injectMetadata);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const providerInstance: unknown = new providerClass(...constructorParams);
        this.providerInstanceMap.set(providerClass, providerInstance);
    }

    private getHostClassConstructorParams(injectMetadata: TWcInjectMetadata): unknown[] {
        return injectMetadata
            .sort(
                (config1: IInjectMetadataConfig, config2: IInjectMetadataConfig) =>
                    config1.targetParameterIndex - config2.targetParameterIndex,
            )
            .map((config: IInjectMetadataConfig) =>
                this.providerInstanceMap.get(config.providerClass),
            );
    }

    private getComponentFactory(
        componentClass: IClass,
        componentClassConstructorParams: unknown[],
        componentInputs: TInputMetadata,
        componentTemplate: string,
    ): IClass<CustomElementConstructor> {
        return class RunTimeWebComponentClass extends HTMLElement {
            private readonly componentInstance: TComponentInstance;

            constructor() {
                super();
                // create mapped component instance
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.componentInstance = new componentClass(...componentClassConstructorParams);

                const shadow = this.attachShadow({ mode: 'open' });
                shadow.innerHTML = componentTemplate;
            }

            static get observedAttributes() {
                return componentInputs.map(
                    (input: IInputMetadataConfig) => input.inputAttributeName,
                );
            }

            connectedCallback() {
                const observedAttributes = RunTimeWebComponentClass.observedAttributes;
                observedAttributes.forEach((attr: string) => {
                    // read the initial attribute values
                    const [propertyKey, attrValue] = this.getPropertyKeyAttrPair(attr);
                    // update the value in component instance
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    this.componentInstance[propertyKey] = attrValue;
                });

                if (this.isConnected) {
                    // call the onInit if exists
                    if (this.componentInstance.onInit) {
                        this.componentInstance.onInit.bind(this.componentInstance)();
                    }
                }
            }

            attributeChangedCallback(name: string, oldValue: string, newValue: string) {
                // map the class property name for the reflection of attr changes
                const inputConfigForChange = componentInputs.find(
                    input => input.inputAttributeName === name,
                );
                // if can not be found, then means there is a problem with code!
                if (!inputConfigForChange) {
                    throw Error(
                        `watched attribute ${name} is not bound properly to the @WcInput() decorated property`,
                    );
                }
                // update the value in component instance
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.componentInstance[inputConfigForChange.componentPropertyKey] = newValue;
                // call the onChanges if exists
                if (this.componentInstance.onChanges) {
                    this.componentInstance.onChanges.bind(this.componentInstance)({[name]: {oldValue, newValue}});
                }
            }

            disconnectedCallback() {
                // call the onDestroy if exists
                if (this.componentInstance.onDestroy) {
                    this.componentInstance.onDestroy.bind(this.componentInstance)();
                }
            }

            private getPropertyKeyAttrPair(attr: string): [string, string|null] {
                const value = this.getAttribute(attr);
                const input = componentInputs.find(cInput => cInput.inputAttributeName === attr);
                // if can not be found, then means there is a problem with code!
                if (!input) {
                    throw Error(
                        `watched attribute ${attr} is not bound properly to the @WcInput() decorated property`,
                    );
                }
                return [input.componentPropertyKey, value];
            }
        };
    }
}

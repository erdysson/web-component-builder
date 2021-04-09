"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runtime = void 0;
const metadata_1 = require("./metadata");
class Runtime {
    constructor() {
        this.providerInstanceMap = new WeakMap();
    }
    initModule(moduleClass) {
        const { components } = metadata_1.Metadata.getModuleConfig(moduleClass);
        // init components
        components.forEach((componentClass) => this.initComponent(componentClass));
    }
    initProvider(providerClass) {
        const providerConfig = metadata_1.Metadata.getProviderConfig(providerClass);
        // just validate and make sure that class is decorated with @WCProvider()
        if (!providerConfig) {
            throw Error('Injected provider is not decorated with @WCProvider().');
        }
        this.createProviderInstance(providerClass);
    }
    initComponent(componentClass) {
        const { selector, template } = metadata_1.Metadata.getComponentConfig(componentClass);
        const injectMetadata = metadata_1.Metadata.getInjectedProviderConfig(componentClass);
        // init providers that are used in component(s)
        injectMetadata.forEach((injectMetadataConfig) => {
            this.initProvider(injectMetadataConfig.providerClass);
        });
        const constructorParams = this.getHostClassConstructorParams(injectMetadata);
        const inputConfigForComponent = metadata_1.Metadata.getComponentInputConfig(componentClass);
        const componentFactory = this.getComponentFactory(componentClass, constructorParams, inputConfigForComponent, template);
        // register web component element
        customElements.define(selector, componentFactory);
    }
    createProviderInstance(providerClass) {
        if (this.providerInstanceMap.has(providerClass)) {
            return;
        }
        const injectMetadata = metadata_1.Metadata.getInjectedProviderConfig(providerClass) || [];
        // create dependency instances first
        injectMetadata.forEach((injectConfig) => {
            this.createProviderInstance(injectConfig.providerClass);
        });
        // all dependencies are initiated, now create the wrapping provider with injected params
        const constructorParams = this.getHostClassConstructorParams(injectMetadata);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const providerInstance = new providerClass(...constructorParams);
        this.providerInstanceMap.set(providerClass, providerInstance);
    }
    getHostClassConstructorParams(injectMetadata) {
        return injectMetadata
            .sort((config1, config2) => config1.targetParameterIndex - config2.targetParameterIndex)
            .map((config) => this.providerInstanceMap.get(config.providerClass));
    }
    getComponentFactory(componentClass, componentClassConstructorParams, componentInputs, componentTemplate) {
        return class RunTimeWebComponentClass extends HTMLElement {
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
                });
            }
            static get observedAttributes() {
                return componentInputs.map((input) => input.inputAttributeName);
            }
            connectedCallback() {
                const observedAttributes = RunTimeWebComponentClass.observedAttributes;
                observedAttributes.forEach((attr) => {
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
            attributeChangedCallback(name, oldValue, newValue) {
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
                if (this.componentInstance.onChanges) {
                    this.componentInstance.onChanges.bind(this.componentInstance)({ [name]: { oldValue, newValue } });
                }
            }
            disconnectedCallback() {
                // call the onDestroy if exists
                if (this.componentInstance.onDestroy) {
                    this.componentInstance.onDestroy.bind(this.componentInstance)();
                }
            }
            getPropertyKeyAttrPair(attr) {
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
exports.Runtime = Runtime;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY29yZS9ydW50aW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHlDQUFvQztBQVNwQyxNQUFhLE9BQU87SUFBcEI7UUFDcUIsd0JBQW1CLEdBQTZCLElBQUksT0FBTyxFQUFtQixDQUFDO0lBK0lwRyxDQUFDO0lBN0lHLFVBQVUsQ0FBQyxXQUFtQjtRQUMxQixNQUFNLEVBQUMsVUFBVSxFQUFDLEdBQUcsbUJBQVEsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0Qsa0JBQWtCO1FBQ2xCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFzQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVELFlBQVksQ0FBQyxhQUFxQjtRQUM5QixNQUFNLGNBQWMsR0FBRyxtQkFBUSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2pFLHlFQUF5RTtRQUN6RSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ2pCLE1BQU0sS0FBSyxDQUFDLHdEQUF3RCxDQUFDLENBQUM7U0FDekU7UUFDRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELGFBQWEsQ0FBQyxjQUFzQjtRQUNoQyxNQUFNLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxHQUFHLG1CQUFRLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDekUsTUFBTSxjQUFjLEdBQUcsbUJBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMxRSwrQ0FBK0M7UUFDL0MsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLG9CQUEyQyxFQUFFLEVBQUU7WUFDbkUsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLDZCQUE2QixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdFLE1BQU0sdUJBQXVCLEdBQUcsbUJBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNqRixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FDN0MsY0FBYyxFQUNkLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsUUFBUSxDQUNYLENBQUM7UUFDRixpQ0FBaUM7UUFDakMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU8sc0JBQXNCLENBQUMsYUFBcUI7UUFDaEQsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQzdDLE9BQU87U0FDVjtRQUNELE1BQU0sY0FBYyxHQUFHLG1CQUFRLENBQUMseUJBQXlCLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9FLG9DQUFvQztRQUNwQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBbUMsRUFBRSxFQUFFO1lBQzNELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFDSCx3RkFBd0Y7UUFDeEYsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsNkJBQTZCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0UsNkRBQTZEO1FBQzdELGFBQWE7UUFDYixNQUFNLGdCQUFnQixHQUFZLElBQUksYUFBYSxDQUFDLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFTyw2QkFBNkIsQ0FBQyxjQUFpQztRQUNuRSxPQUFPLGNBQWM7YUFDaEIsSUFBSSxDQUNELENBQUMsT0FBOEIsRUFBRSxPQUE4QixFQUFFLEVBQUUsQ0FDL0QsT0FBTyxDQUFDLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FDbEU7YUFDQSxHQUFHLENBQUMsQ0FBQyxNQUE2QixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQ3BHLENBQUM7SUFFTyxtQkFBbUIsQ0FDdkIsY0FBc0IsRUFDdEIsK0JBQTBDLEVBQzFDLGVBQStCLEVBQy9CLGlCQUF5QjtRQUV6QixPQUFPLE1BQU0sd0JBQXlCLFNBQVEsV0FBVztZQUdyRDtnQkFDSSxLQUFLLEVBQUUsQ0FBQztnQkFDUixtQ0FBbUM7Z0JBQ25DLDZEQUE2RDtnQkFDN0QsYUFBYTtnQkFDYixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxjQUFjLENBQUMsR0FBRywrQkFBK0IsQ0FBQyxDQUFDO2dCQUNoRiw4RUFBOEU7Z0JBQzlFLDRFQUE0RTtnQkFDNUUsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDWiw4RUFBOEU7b0JBQzlFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztnQkFDNUQsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBRUQsTUFBTSxLQUFLLGtCQUFrQjtnQkFDekIsT0FBTyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBMkIsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDMUYsQ0FBQztZQUVELGlCQUFpQjtnQkFDYixNQUFNLGtCQUFrQixHQUFHLHdCQUF3QixDQUFDLGtCQUFrQixDQUFDO2dCQUN2RSxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFZLEVBQUUsRUFBRTtvQkFDeEMsb0NBQW9DO29CQUNwQyxNQUFNLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbkUseUNBQXlDO29CQUN6Qyw2REFBNkQ7b0JBQzdELGFBQWE7b0JBQ2IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxHQUFHLFNBQVMsQ0FBQztnQkFDcEQsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNsQiw0QkFBNEI7b0JBQzVCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRTt3QkFDL0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQztxQkFDaEU7aUJBQ0o7WUFDTCxDQUFDO1lBRUQsd0JBQXdCLENBQUMsSUFBWSxFQUFFLFFBQWdCLEVBQUUsUUFBZ0I7Z0JBQ3JFLGlFQUFpRTtnQkFDakUsTUFBTSxvQkFBb0IsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEtBQUssSUFBSSxDQUFDLENBQUM7Z0JBQ2hHLGdFQUFnRTtnQkFDaEUsSUFBSSxDQUFDLG9CQUFvQixFQUFFO29CQUN2QixNQUFNLEtBQUssQ0FBQyxxQkFBcUIsSUFBSSw2REFBNkQsQ0FBQyxDQUFDO2lCQUN2RztnQkFDRCx5Q0FBeUM7Z0JBQ3pDLDZEQUE2RDtnQkFDN0QsYUFBYTtnQkFDYixJQUFJLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsb0JBQW9CLENBQUMsR0FBRyxRQUFRLENBQUM7Z0JBQzdFLCtCQUErQjtnQkFDL0IsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFO29CQUNsQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLEVBQUMsQ0FBQyxDQUFDO2lCQUNqRztZQUNMLENBQUM7WUFFRCxvQkFBb0I7Z0JBQ2hCLCtCQUErQjtnQkFDL0IsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFO29CQUNsQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDO2lCQUNuRTtZQUNMLENBQUM7WUFFTyxzQkFBc0IsQ0FBQyxJQUFZO2dCQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEtBQUssSUFBSSxDQUFDLENBQUM7Z0JBQ25GLGdFQUFnRTtnQkFDaEUsSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDUixNQUFNLEtBQUssQ0FBQyxxQkFBcUIsSUFBSSw2REFBNkQsQ0FBQyxDQUFDO2lCQUN2RztnQkFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9DLENBQUM7U0FDSixDQUFDO0lBQ04sQ0FBQztDQUNKO0FBaEpELDBCQWdKQyJ9
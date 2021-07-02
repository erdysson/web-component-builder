import {getCustomElementClass} from './get-custom-element-class';
import {Class, IModuleConfig} from './interfaces';
import {Metadata} from './metadata';

export class RuntimeContext {
    readonly providerInstanceMap: WeakMap<Class, unknown> = new WeakMap<Class, unknown>();

    private moduleClass!: Class;
    private moduleConfig!: IModuleConfig;

    initModule(moduleClass: Class, contextMap: WeakMap<Class, RuntimeContext>): void {
        console.log('initializing module', moduleClass.name);
        this.moduleClass = moduleClass;
        this.moduleConfig = Metadata.getModuleConfig(moduleClass);
        const {components} = this.moduleConfig;
        // register components from current module
        this.registerRuntimeWebComponents(components, contextMap);
    }

    getProviderFromImportedModuleContext(providerClass: Class, contextMap: WeakMap<Class, RuntimeContext>): unknown {
        let providerInstance: unknown;
        const imports = this.moduleConfig.imports || [];
        for (const importedModuleClass of imports) {
            const context = contextMap.get(importedModuleClass);
            if (context?.moduleConfig.providers.includes(providerClass)) {
                if (!context.providerInstanceMap.has(providerClass)) {
                    context.createProviderInstance(providerClass, contextMap);
                }
                providerInstance = context.providerInstanceMap.get(providerClass);
                break;
            }
        }
        return providerInstance;
    }

    getConstructorParamsFor(hostClass: Class, contextMap: WeakMap<Class, RuntimeContext>): unknown[] {
        const params = Metadata.getConstructorParams(hostClass);
        // init providers that are used in component(s)
        return params.map((providerClass: Class) => {
            // validate and make sure that class is registered in the module
            if (!this.moduleConfig.providers.includes(providerClass)) {
                const providerInstanceFromImportedModule = this.getProviderFromImportedModuleContext(
                    providerClass,
                    contextMap
                );
                // return found provider here
                if (providerInstanceFromImportedModule) {
                    return providerInstanceFromImportedModule;
                }
                throw Error(`provider ${providerClass.name} is not registered in any module`);
            }
            if (!this.providerInstanceMap.has(providerClass)) {
                this.createProviderInstance(providerClass, contextMap);
            }
            return this.providerInstanceMap.get(providerClass);
        });
    }

    createProviderInstance(providerClass: Class, contextMap: WeakMap<Class, RuntimeContext>): void {
        console.log('creating provider instance for', providerClass.name, 'in context of', this.moduleClass.name);
        // all dependencies are initiated, now create the wrapping provider with injected params
        const constructorParams = this.getConstructorParamsFor(providerClass, contextMap);
        const providerInstance: InstanceType<typeof providerClass> = new providerClass(...constructorParams);
        this.providerInstanceMap.set(providerClass, providerInstance);
    }

    createComponentInstance(componentClass: Class, contextMap: WeakMap<Class, RuntimeContext>): any {
        const constructorParams = this.getConstructorParamsFor(componentClass, contextMap);
        return new componentClass(...constructorParams);
    }

    registerRuntimeWebComponents(components: Class[], contextMap: WeakMap<Class, RuntimeContext>): void {
        components.forEach((componentClass: Class) => {
            console.log('registering runtime web component for', componentClass.name);
            const config = Metadata.getComponentConfig(componentClass);
            const attrs = Object.keys(Metadata.getComponentAttrConfig(componentClass));
            const props = Object.keys(Metadata.getComponentPropConfig(componentClass));
            const viewContainer = Metadata.getViewContainerConfig(componentClass);
            const viewChildren = Metadata.getViewChildrenConfig(componentClass);
            const eventListeners = Metadata.getEventListenerConfig(componentClass);
            const customElementClass = getCustomElementClass(
                attrs,
                props,
                config.viewEncapsulation,
                config.styles || [],
                viewContainer,
                viewChildren,
                eventListeners,
                config.template,
                () => this.createComponentInstance(componentClass, contextMap)
            );
            customElements.define(config.selector, customElementClass);
        });
    }
}

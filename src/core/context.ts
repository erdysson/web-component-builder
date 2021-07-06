import {getCustomElementClass} from './get-custom-element-class';
import {Class, IModule, IModuleConfig, IModuleWithProviders, IProvider, IProviderConfig} from './interfaces';
import {Metadata} from './metadata';
import {IInjectMetadata} from './metadata-interfaces';
import {Runtime} from './runtime';
import {IContextProviderInjector, IContextProviderInjectorConfig} from './runtime-interfaces';

export class Context {
    private readonly runtime: Runtime;
    // provider map of the current context
    private readonly providers: Map<string, unknown> = new Map<string, unknown>();

    // injector map of the current context
    private readonly providerInjectors: Map<string, IContextProviderInjectorConfig> = new Map<
        string,
        IContextProviderInjectorConfig
    >();

    private static getModuleClass(module: IModule): Class {
        return typeof module === 'function' ? module : module.module;
    }

    private static getProviderClass(provider: IProvider): Class {
        return typeof provider === 'function' ? provider : (provider.useClass as Class);
    }

    constructor(module: IModule, runtime: Runtime) {
        this.runtime = runtime;
        this.init(module);
    }

    private init(module: IModule): void {
        const moduleClass = Context.getModuleClass(module);
        const moduleConfigProviders = (module as IModuleWithProviders).providers || [];
        const moduleConfig: IModuleConfig = Metadata.getModuleConfig(moduleClass);

        if (!this.runtime.context.has(moduleClass)) {
            this.createImportedContexts(moduleConfig);
            this.createInjectors(moduleConfigProviders as IProviderConfig[], moduleConfig);
            this.defineRuntimeWebComponents(moduleConfig);

            this.runtime.context.set(moduleClass, this);
        }
    }

    private createImportedContexts(moduleConfig: IModuleConfig): void {
        moduleConfig.imports?.forEach((importedModule: IModule) => new Context(importedModule, this.runtime));
    }

    private createInjectors(configProviders: IProviderConfig[], moduleConfig: IModuleConfig): void {
        // config providers
        configProviders.forEach((providerConfig: IProviderConfig) => {
            this.providerInjectors.set(providerConfig.provide, {
                injector: () => {
                    if (!this.providers.has(providerConfig.provide)) {
                        this.providers.set(providerConfig.provide, providerConfig.useValue);
                    }
                },
                exported: true
            });
        });
        // defined providers
        moduleConfig.providers.forEach((provider: IProvider) => {
            let injectorToken: string;
            if (typeof provider === 'function') {
                injectorToken = provider.name;
                this.providerInjectors.set(injectorToken, {
                    injector: () => {
                        if (!this.providers.has(injectorToken)) {
                            const constructorParams = this.getConstructorParams(provider, moduleConfig);
                            this.providers.set(injectorToken, new provider(...constructorParams));
                        }
                    },
                    exported: (moduleConfig.exports || []).indexOf(provider) > -1
                });
            } else {
                injectorToken = (provider as IProviderConfig).provide;
                const ProviderClass = Context.getProviderClass(provider);
                this.providerInjectors.set(injectorToken, {
                    injector: () => {
                        if (!this.providers.has(injectorToken)) {
                            const constructorParams = this.getConstructorParams(ProviderClass, moduleConfig);
                            this.providers.set(injectorToken, new ProviderClass(...constructorParams));
                        }
                    },
                    exported: (moduleConfig.exports || []).indexOf(ProviderClass) > -1
                });
            }
        });
    }

    private getConstructorParams(hostClass: Class, moduleConfig: IModuleConfig): unknown[] {
        const injectMetadataList = Metadata.getInjectedProviderConfig(hostClass);
        return injectMetadataList.map((injectMetadata: IInjectMetadata) => {
            const token = injectMetadata.token;
            if (this.providerInjectors.has(token)) {
                const injectorConfig = this.providerInjectors.get(token) as IContextProviderInjectorConfig;
                injectorConfig.injector();
                return this.providers.get(token);
            } else {
                const imports = moduleConfig.imports || [];
                let providerInstance: unknown;
                for (const importedModule of imports) {
                    const moduleClass: Class = Context.getModuleClass(importedModule);
                    const moduleContext = this.runtime.context.get(moduleClass) as Context;
                    if (moduleContext.providerInjectors.has(token)) {
                        const injectorConfig = moduleContext.providerInjectors.get(
                            token
                        ) as IContextProviderInjectorConfig;
                        if (injectorConfig.exported) {
                            injectorConfig.injector();
                            providerInstance = moduleContext.providers.get(token);
                            break;
                        }
                    }
                }
                if (!providerInstance) {
                    throw Error(`No provider found for ${token} in ${hostClass.name}`);
                }
                return providerInstance;
            }
        });
    }

    private createComponentInstance(componentClass: Class, moduleConfig: IModuleConfig): any {
        const constructorParams = this.getConstructorParams(componentClass, moduleConfig);
        return new componentClass(...constructorParams);
    }

    private defineRuntimeWebComponents(moduleConfig: IModuleConfig): void {
        moduleConfig.components.forEach((componentClass: Class) => {
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
                () => this.createComponentInstance(componentClass, moduleConfig)
            );
            customElements.define(config.selector, customElementClass);
        });
    }
}

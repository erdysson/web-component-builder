import {getCustomElementClass} from './get-custom-element-class';
import {Injector} from './injector';
import {Class, IModule, IModuleConfig, IModuleWithProviders, IProvider, IProviderConfig} from './interfaces';
import {Metadata} from './metadata';
import {IInjectMetadata} from './metadata-interfaces';
import {Runtime} from './runtime';
import {IContextProviderInjectorConfig} from './runtime-interfaces';

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
            // create root injector first
            this.runtime.context.set(moduleClass, this);

            this.createImportedContexts(moduleConfig);
            this.createInjectors(moduleConfigProviders as IProviderConfig[], moduleConfig);
            this.defineRuntimeWebComponents(moduleConfig);
        }
    }

    private createImportedContexts(moduleConfig: IModuleConfig): void {
        moduleConfig.imports?.forEach((importedModule: IModule) => new Context(importedModule, this.runtime));
    }

    private createInjectors(configProviders: IProviderConfig[], moduleConfig: IModuleConfig): void {
        // context injector
        const injectorToken = 'Injector';
        this.providerInjectors.set(injectorToken, {
            inject: () => {
                const rootContext = this.runtime.context.get(this.runtime.rootModule) as Context;
                if (!this.providers.has(injectorToken)) {
                    this.providers.set(injectorToken, new Injector(rootContext.providerInjectors));
                }
                return this.providers.get(injectorToken);
            },
            exported: false
        });
        // config providers
        configProviders.forEach((providerConfig: IProviderConfig) => {
            this.providerInjectors.set(providerConfig.provide, {
                inject: () => {
                    if (!this.providers.has(providerConfig.provide)) {
                        this.providers.set(providerConfig.provide, providerConfig.useValue);
                    }
                    return this.providers.get(providerConfig.provide);
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
                    inject: () => {
                        if (!this.providers.has(injectorToken)) {
                            const constructorParams = this.getConstructorParams(provider, moduleConfig);
                            this.providers.set(injectorToken, new provider(...constructorParams));
                        }
                        return this.providers.get(injectorToken);
                    },
                    exported: (moduleConfig.exports || []).indexOf(provider) > -1
                });
            } else {
                injectorToken = (provider as IProviderConfig).provide;
                const ProviderClass = Context.getProviderClass(provider);
                this.providerInjectors.set(injectorToken, {
                    inject: () => {
                        if (!this.providers.has(injectorToken)) {
                            const constructorParams = this.getConstructorParams(ProviderClass, moduleConfig);
                            this.providers.set(injectorToken, new ProviderClass(...constructorParams));
                        }
                        return this.providers.get(injectorToken);
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
                return injectorConfig.inject();
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
                            providerInstance = injectorConfig.inject();
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

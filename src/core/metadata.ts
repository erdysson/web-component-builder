import 'reflect-metadata';
import {METADATA_KEYS} from './metadata-keys';
import {IClass, IModuleConfig, IComponentConfig, IObject} from './interfaces';
import {IInjectMetadataConfig, TWcInjectMetadata, TInputMetadata} from './metadata-interfaces';

export class Metadata {
    static setModuleConfig(moduleClass: IClass, moduleConfig: IModuleConfig): void {
        Reflect.defineMetadata(METADATA_KEYS.MODULE, moduleConfig, moduleClass);
    }

    static getModuleConfig(moduleClass: IClass): IModuleConfig {
        return Reflect.getMetadata(METADATA_KEYS.MODULE, moduleClass) as IModuleConfig;
    }

    static setComponentConfig(componentClass: IClass, componentConfig: IComponentConfig): void {
        Reflect.defineMetadata(METADATA_KEYS.COMPONENT, componentConfig, componentClass);
    }

    static getComponentConfig(componentClass: IClass): IComponentConfig {
        return Reflect.getMetadata(METADATA_KEYS.COMPONENT, componentClass) as IComponentConfig;
    }

    static setProviderConfig(providerClass: IClass, config: unknown = {}): void {
        Reflect.defineMetadata(METADATA_KEYS.PROVIDER, config, providerClass);
    }

    static getProviderConfig(providerClass: IClass): unknown {
        return Reflect.getMetadata(METADATA_KEYS.PROVIDER, providerClass);
    }

    static setInjectedProviderConfig(hostClass: IClass, providerClass: IClass, targetParameterIndex: number): void {
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.INJECT, hostClass);

        if (!hasMetadata) {
            Reflect.defineMetadata(METADATA_KEYS.INJECT, [{providerClass, targetParameterIndex}] as IInjectMetadataConfig[], hostClass);
        } else {
            const injectMetadata = Metadata.getInjectedProviderConfig(hostClass);
            injectMetadata.push({
                providerClass,
                targetParameterIndex
            });
        }
    }

    static getInjectedProviderConfig(hostClass: IClass): TWcInjectMetadata {
        return Reflect.getMetadata(METADATA_KEYS.INJECT, hostClass) as TWcInjectMetadata;
    }

    static setComponentInputConfig(componentInstance: IObject, componentPropertyKey: string, inputAttributeName: string): void {
        const componentClass: IClass = componentInstance.constructor;
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.INPUT, componentClass);

        if (!hasMetadata) {
            Reflect.defineMetadata(METADATA_KEYS.INPUT, [{componentPropertyKey, inputAttributeName}] as TInputMetadata, componentClass);
        } else {
            const inputMetadata = Metadata.getComponentInputConfig(componentClass);
            inputMetadata.push({componentPropertyKey, inputAttributeName});
        }
    }

    static getComponentInputConfig(componentClass: IClass): TInputMetadata {
        return Reflect.getMetadata(METADATA_KEYS.INPUT, componentClass);
    }
}

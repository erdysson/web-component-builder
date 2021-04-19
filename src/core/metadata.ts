import 'reflect-metadata';
import {IClass, IComponentConfig, IModuleConfig, IObject} from './interfaces';
import {
    IInjectMetadataConfig,
    TEventListenerMetadata,
    TInputMetadata,
    TViewChildrenMetadata,
    TWcInjectMetadata
} from './metadata-interfaces';
import {METADATA_KEYS} from './metadata-keys';

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

    static setProviderConfig(providerClass: IClass, config: unknown): void {
        Reflect.defineMetadata(METADATA_KEYS.PROVIDER, config, providerClass);
    }

    static getProviderConfig(providerClass: IClass): unknown {
        return Reflect.getMetadata(METADATA_KEYS.PROVIDER, providerClass);
    }

    static setInjectedProviderConfig(hostClass: IClass, providerClass: IClass, targetParameterIndex: number): void {
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.INJECT, hostClass);

        if (!hasMetadata) {
            Reflect.defineMetadata(
                METADATA_KEYS.INJECT,
                [{providerClass, targetParameterIndex}] as IInjectMetadataConfig[],
                hostClass
            );
        } else {
            const injectMetadata = Metadata.getInjectedProviderConfig(hostClass);
            injectMetadata.push({
                providerClass,
                targetParameterIndex
            });
        }
    }

    static getInjectedProviderConfig(hostClass: IClass): TWcInjectMetadata {
        return (Reflect.getMetadata(METADATA_KEYS.INJECT, hostClass) || []) as TWcInjectMetadata;
    }

    static setComponentInputConfig(
        componentInstance: IObject,
        componentPropertyKey: string,
        inputAttributeName: string
    ): void {
        const componentClass: IClass = componentInstance.constructor;
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.INPUT, componentClass);
        const typeConstructor = Metadata.getTypeMetadata(componentInstance, componentPropertyKey);

        if (!hasMetadata) {
            Reflect.defineMetadata(
                METADATA_KEYS.INPUT,
                [{componentPropertyKey, inputAttributeName, typeConstructor}] as TInputMetadata,
                componentClass
            );
        } else {
            const inputMetadata = Metadata.getComponentInputConfig(componentClass);
            inputMetadata.push({
                componentPropertyKey,
                inputAttributeName,
                typeConstructor
            });
        }
    }

    static getComponentInputConfig(componentClass: IClass): TInputMetadata {
        return Reflect.getMetadata(METADATA_KEYS.INPUT, componentClass) || [];
    }

    static setViewChildrenConfig(
        componentInstance: IObject,
        componentPropertyKey: string,
        querySelector?: string
    ): void {
        const componentClass: IClass = componentInstance.constructor;
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.VIEW_CHILD, componentClass);

        if (!hasMetadata) {
            Reflect.defineMetadata(
                METADATA_KEYS.VIEW_CHILD,
                [{componentPropertyKey, querySelector}] as TViewChildrenMetadata,
                componentClass
            );
        } else {
            const viewChildrenMetadata = Metadata.getViewChildrenConfig(componentClass);
            viewChildrenMetadata.push({
                componentPropertyKey,
                querySelector
            });
        }
    }

    static getViewChildrenConfig(componentClass: IClass): TViewChildrenMetadata {
        return Reflect.getMetadata(METADATA_KEYS.VIEW_CHILD, componentClass) || [];
    }

    static setEventListenerConfig(
        componentInstance: IObject,
        componentPropertyKey: string,
        event: string,
        querySelector: string,
        predicate: () => boolean
    ): void {
        const componentClass: IClass = componentInstance.constructor;
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.EVENT_LISTENER, componentClass);

        if (!hasMetadata) {
            Reflect.defineMetadata(
                METADATA_KEYS.EVENT_LISTENER,
                [{componentPropertyKey, event, querySelector, predicate}] as TEventListenerMetadata,
                componentClass
            );
        } else {
            const viewChildrenMetadata = Metadata.getEventListenerConfig(componentClass);
            viewChildrenMetadata.push({
                componentPropertyKey,
                event,
                querySelector,
                predicate
            });
        }
    }

    static getEventListenerConfig(componentClass: IClass): TEventListenerMetadata {
        return Reflect.getMetadata(METADATA_KEYS.EVENT_LISTENER, componentClass) || [];
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    static getTypeMetadata(target: IObject, propertyKey: string): Function {
        return Reflect.getMetadata('design:type', target, propertyKey);
    }
}

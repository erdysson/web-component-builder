import 'reflect-metadata';
import {IClass, IComponentConfig, IModuleConfig, IObject} from './interfaces';
import {
    IInjectMetadataConfig,
    TAttrMetadata,
    TEventListenerMetadata,
    TPropMetadata,
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

    static setComponentAttrConfig(componentInstance: IObject, propertyKey: string, name: string): void {
        const componentClass: IClass = componentInstance.constructor;
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.ATTR, componentClass);
        const typeConstructor = Metadata.getTypeMetadata(componentInstance, propertyKey);

        if (!hasMetadata) {
            Reflect.defineMetadata(
                METADATA_KEYS.ATTR,
                [{propertyKey, name, typeConstructor}] as TAttrMetadata,
                componentClass
            );
        } else {
            const attrMetadata = Metadata.getComponentAttrConfig(componentClass);
            attrMetadata.push({
                propertyKey,
                name,
                typeConstructor
            });
        }
    }

    static getComponentAttrConfig(componentClass: IClass): TAttrMetadata {
        return Reflect.getMetadata(METADATA_KEYS.ATTR, componentClass) || [];
    }

    static setComponentPropConfig(componentInstance: IObject, propertyKey: string, name: string): void {
        const componentClass: IClass = componentInstance.constructor;
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.PROP, componentClass);

        if (!hasMetadata) {
            Reflect.defineMetadata(METADATA_KEYS.PROP, [{propertyKey, name}] as TPropMetadata, componentClass);
        } else {
            const propMetadata = Metadata.getComponentPropConfig(componentClass);
            propMetadata.push({propertyKey, name});
        }
    }

    static getComponentPropConfig(componentClass: IClass): TPropMetadata {
        return Reflect.getMetadata(METADATA_KEYS.PROP, componentClass) || [];
    }

    static setViewChildrenConfig(componentInstance: IObject, propertyKey: string, querySelector?: string): void {
        const componentClass: IClass = componentInstance.constructor;
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.VIEW_CHILD, componentClass);

        if (!hasMetadata) {
            Reflect.defineMetadata(
                METADATA_KEYS.VIEW_CHILD,
                [{propertyKey, querySelector}] as TViewChildrenMetadata,
                componentClass
            );
        } else {
            const viewChildrenMetadata = Metadata.getViewChildrenConfig(componentClass);
            viewChildrenMetadata.push({
                propertyKey,
                querySelector
            });
        }
    }

    static getViewChildrenConfig(componentClass: IClass): TViewChildrenMetadata {
        return Reflect.getMetadata(METADATA_KEYS.VIEW_CHILD, componentClass) || [];
    }

    static setEventListenerConfig(
        componentInstance: IObject,
        propertyKey: string,
        event: string,
        querySelector: string,
        predicate: () => boolean
    ): void {
        const componentClass: IClass = componentInstance.constructor;
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.EVENT_LISTENER, componentClass);

        if (!hasMetadata) {
            Reflect.defineMetadata(
                METADATA_KEYS.EVENT_LISTENER,
                [{propertyKey, event, querySelector, predicate}] as TEventListenerMetadata,
                componentClass
            );
        } else {
            const viewChildrenMetadata = Metadata.getEventListenerConfig(componentClass);
            viewChildrenMetadata.push({
                propertyKey,
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

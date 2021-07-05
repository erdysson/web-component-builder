import 'reflect-metadata';
import {Class, IComponentConfig, IModuleConfig} from './interfaces';
import {
    IAttrMetadata,
    IEventListenerMetadata,
    IInjectMetadata,
    IPropMetadata,
    IViewChildMetadata,
    PrimitiveTypeConstructor
} from './metadata-interfaces';
import {METADATA_KEYS} from './metadata-keys';

export class Metadata {
    static setModuleConfig(moduleClass: Class, moduleConfig: IModuleConfig): void {
        Reflect.defineMetadata(METADATA_KEYS.MODULE, moduleConfig, moduleClass);
    }

    static getModuleConfig(moduleClass: Class): IModuleConfig {
        return Reflect.getMetadata(METADATA_KEYS.MODULE, moduleClass) as IModuleConfig;
    }

    static setComponentConfig(componentClass: Class, componentConfig: IComponentConfig): void {
        Reflect.defineMetadata(METADATA_KEYS.COMPONENT, componentConfig, componentClass);
    }

    static getComponentConfig(componentClass: Class): IComponentConfig {
        return Reflect.getMetadata(METADATA_KEYS.COMPONENT, componentClass) as IComponentConfig;
    }

    static setInjectedProviderConfig(hostClass: Class, token: string, parameterIndex: number): void {
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.INJECT, hostClass);
        if (!hasMetadata) {
            Reflect.defineMetadata(METADATA_KEYS.INJECT, [{token, parameterIndex}] as IInjectMetadata[], hostClass);
        } else {
            const injectMetadata = Metadata.getInjectedProviderConfig(hostClass);
            injectMetadata.unshift({
                token,
                parameterIndex
            });
        }
    }

    static getInjectedProviderConfig(hostClass: Class): IInjectMetadata[] {
        return Reflect.getMetadata(METADATA_KEYS.INJECT, hostClass) || [];
    }

    static setComponentAttrConfig(componentInstance: any, propertyKey: string, name: string): void {
        const componentClass: Class = componentInstance.constructor;
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.ATTR, componentClass);
        const typeConstructor = Metadata.getTypeMetadata(componentInstance, propertyKey);

        if (!hasMetadata) {
            Reflect.defineMetadata(
                METADATA_KEYS.ATTR,
                {
                    [name]: {
                        propertyKey,
                        typeConstructor
                    }
                } as IAttrMetadata,
                componentClass
            );
        } else {
            const attrMetadata: IAttrMetadata = Metadata.getComponentAttrConfig(componentClass);
            attrMetadata[name] = {
                propertyKey,
                typeConstructor
            };
        }
    }

    static getComponentAttrConfig(componentClass: Class): IAttrMetadata {
        return Reflect.getMetadata(METADATA_KEYS.ATTR, componentClass) || {};
    }

    static setComponentPropConfig(componentInstance: any, propertyKey: string, name: string): void {
        const componentClass: Class = componentInstance.constructor;
        const hasMetadata: boolean = Reflect.hasMetadata(METADATA_KEYS.PROP, componentClass);

        if (!hasMetadata) {
            Reflect.defineMetadata(
                METADATA_KEYS.PROP,
                {
                    [name]: {
                        propertyKey
                    }
                } as IPropMetadata,
                componentClass
            );
        } else {
            const propMetadata: IPropMetadata = Metadata.getComponentPropConfig(componentClass);
            propMetadata[name] = {
                propertyKey
            };
        }
    }

    static getComponentPropConfig(componentClass: Class): IPropMetadata {
        return Reflect.getMetadata(METADATA_KEYS.PROP, componentClass) || {};
    }

    static setViewContainerConfig(componentInstance: any, propertyKey: string): void {
        const componentClass: Class = componentInstance.constructor;
        Reflect.defineMetadata(METADATA_KEYS.VIEW_CONTAINER, propertyKey, componentClass);
    }

    static getViewContainerConfig(componentClass: Class): string {
        return Reflect.getMetadata(METADATA_KEYS.VIEW_CONTAINER, componentClass);
    }

    static setViewChildrenConfig(componentInstance: any, propertyKey: string, querySelector: string): void {
        const componentClass: Class = componentInstance.constructor;
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.VIEW_CHILD, componentClass);

        if (!hasMetadata) {
            Reflect.defineMetadata(
                METADATA_KEYS.VIEW_CHILD,
                [{propertyKey, querySelector}] as IViewChildMetadata[],
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

    static getViewChildrenConfig(componentClass: Class): IViewChildMetadata[] {
        return Reflect.getMetadata(METADATA_KEYS.VIEW_CHILD, componentClass) || [];
    }

    static setEventListenerConfig(
        componentInstance: any,
        propertyKey: string,
        event: string,
        querySelector: string,
        predicate: () => boolean
    ): void {
        const componentClass: Class = componentInstance.constructor;
        const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.EVENT_LISTENER, componentClass);

        if (!hasMetadata) {
            Reflect.defineMetadata(
                METADATA_KEYS.EVENT_LISTENER,
                [{propertyKey, event, querySelector, predicate}] as IEventListenerMetadata[],
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

    static getEventListenerConfig(componentClass: Class): IEventListenerMetadata[] {
        return Reflect.getMetadata(METADATA_KEYS.EVENT_LISTENER, componentClass) || [];
    }

    static getTypeMetadata(target: any, propertyKey: string): PrimitiveTypeConstructor {
        return Reflect.getMetadata('design:type', target, propertyKey);
    }
}

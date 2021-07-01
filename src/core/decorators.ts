import {
    Class,
    IClassDecorator,
    IComponentConfig,
    IMethodDecorator,
    IModuleConfig,
    IPropertyDecorator
} from './interfaces';
import {Metadata} from './metadata';

export const Module =
    (config: IModuleConfig): IClassDecorator =>
    (target: Class) => {
        Metadata.setModuleConfig(target, config);
    };

export const Component =
    (config: IComponentConfig): IClassDecorator =>
    (target: Class) => {
        Metadata.setComponentConfig(target, config);
    };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Injectable = (): IClassDecorator => (target: Class) => {
    //
};

export const Attr =
    (name?: string): IPropertyDecorator =>
    (target: any, propertyKey: string) => {
        Metadata.setComponentAttrConfig(target, propertyKey, name || propertyKey);
    };

export const Prop =
    (name?: string): IPropertyDecorator =>
    (target: any, propertyKey: string) => {
        Metadata.setComponentPropConfig(target, propertyKey, name || propertyKey);
    };

export const ViewContainer = (): IPropertyDecorator => (target: any, propertyKey: string) => {
    Metadata.setViewContainerConfig(target, propertyKey);
};

export const ViewChild =
    (querySelector: string): IPropertyDecorator =>
    (target: any, propertyKey: string) => {
        Metadata.setViewChildrenConfig(target, propertyKey as string, querySelector);
    };

export const Listen =
    (event: string, querySelector = '', predicate: () => boolean = () => true): IMethodDecorator =>
    (target: any, propertyKey: string) => {
        Metadata.setEventListenerConfig(target, propertyKey as string, event, querySelector, predicate);
    };

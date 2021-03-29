import {IClass, IModuleConfig, IComponentConfig, IObject} from './interfaces';
import {Metadata} from './metadata';

export const Module = (config: IModuleConfig): ClassDecorator =>
    (target: IClass) => Metadata.setModuleConfig(target, config)


export const Component = (config: IComponentConfig): ClassDecorator =>
    (target: IClass) => Metadata.setComponentConfig(target, config)

export const Injectable = (): ClassDecorator =>
    (target: IClass) =>
        Metadata.setProviderConfig(target, true)

export const Inject = (providerClass: IClass): ParameterDecorator =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (target: IClass, propertyKey: string|symbol, parameterIndex: number) =>
        Metadata.setInjectedProviderConfig(target, providerClass, parameterIndex)

export const Input = (name?: string): PropertyDecorator =>
    (target: IObject, propertyKey: string|symbol) =>
        Metadata.setComponentInputConfig(target, propertyKey as string, name || propertyKey as string);

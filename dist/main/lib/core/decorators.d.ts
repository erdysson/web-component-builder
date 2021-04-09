import { IClass, IComponentConfig, IModuleConfig } from './interfaces';
export declare const Module: (config: IModuleConfig) => ClassDecorator;
export declare const Component: (config: IComponentConfig) => ClassDecorator;
export declare const Injectable: () => ClassDecorator;
export declare const Inject: (providerClass: IClass) => ParameterDecorator;
export declare const Input: (name?: string | undefined) => PropertyDecorator;

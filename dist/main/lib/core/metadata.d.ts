import 'reflect-metadata';
import { IClass, IComponentConfig, IModuleConfig, IObject } from './interfaces';
import { TInputMetadata, TWcInjectMetadata } from './metadata-interfaces';
export declare class Metadata {
    static setModuleConfig(moduleClass: IClass, moduleConfig: IModuleConfig): void;
    static getModuleConfig(moduleClass: IClass): IModuleConfig;
    static setComponentConfig(componentClass: IClass, componentConfig: IComponentConfig): void;
    static getComponentConfig(componentClass: IClass): IComponentConfig;
    static setProviderConfig(providerClass: IClass, config?: unknown): void;
    static getProviderConfig(providerClass: IClass): unknown;
    static setInjectedProviderConfig(hostClass: IClass, providerClass: IClass, targetParameterIndex: number): void;
    static getInjectedProviderConfig(hostClass: IClass): TWcInjectMetadata;
    static setComponentInputConfig(componentInstance: IObject, componentPropertyKey: string, inputAttributeName: string): void;
    static getComponentInputConfig(componentClass: IClass): TInputMetadata;
}

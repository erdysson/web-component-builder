import { IClass, IObject, IOnChanges, IOnDestroy, IOnInit } from './interfaces';
export interface IInjectMetadataConfig {
    providerClass: IClass;
    targetParameterIndex: number;
}
export declare type TWcInjectMetadata = IInjectMetadataConfig[];
export interface IInputMetadataConfig {
    componentPropertyKey: string;
    inputAttributeName: string;
}
export declare type TInputMetadata = IInputMetadataConfig[];
export declare type TComponentInstance = Partial<IOnInit & IOnChanges & IOnDestroy & IObject>;

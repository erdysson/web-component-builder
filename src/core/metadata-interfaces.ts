import {IClass, IObject, IOnChanges, IOnDestroy, IOnInit} from './interfaces';

export interface IInjectMetadataConfig {
    providerClass: IClass;
    targetParameterIndex: number;
}

export type TWcInjectMetadata = IInjectMetadataConfig[];

export interface IInputMetadataConfig {
    componentPropertyKey: string;
    inputAttributeName: string;
}

export type TInputMetadata = IInputMetadataConfig[];

export type TComponentInstance = Partial<IOnInit & IOnChanges & IOnDestroy & IObject>;

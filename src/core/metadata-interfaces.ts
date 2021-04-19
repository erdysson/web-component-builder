import {IClass, IObject, IOnChanges, IOnDestroy, IOnInit, IOnViewInit} from './interfaces';

export interface IInjectMetadataConfig {
    providerClass: IClass;
    targetParameterIndex: number;
}

export type TWcInjectMetadata = IInjectMetadataConfig[];

export interface IInputMetadataConfig {
    componentPropertyKey: string;
    inputAttributeName: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    typeConstructor: Function;
}

export type TInputMetadata = IInputMetadataConfig[];

export interface IViewChildrenMetadataConfig {
    componentPropertyKey: string;
    querySelector?: string;
}

export type TViewChildrenMetadata = IViewChildrenMetadataConfig[];

export interface IEventListenerMetadataConfig {
    componentPropertyKey: string;
    event: string;
    querySelector: string;
    predicate: () => boolean;
}

export type TEventListenerMetadata = IEventListenerMetadataConfig[];

export type TComponentInstance = Partial<IOnChanges & IOnInit & IOnViewInit & IOnDestroy & IObject>;

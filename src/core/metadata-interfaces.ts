import {IClass, IObject, IOnAttrChanges, IOnDestroy, IOnInit, IOnViewInit} from './interfaces';

export interface IInjectMetadataConfig {
    providerClass: IClass;
    targetParameterIndex: number;
}

export type TWcInjectMetadata = IInjectMetadataConfig[];

export interface IAttrMetadataConfig {
    propertyKey: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    typeConstructor: Function;
}

export type TAttrMetadata = IAttrMetadataConfig[];

export interface IPropMetadataConfig {
    propertyKey: string;
    name: string;
}

export type TPropMetadata = IPropMetadataConfig[];

export interface IViewChildrenMetadataConfig {
    propertyKey: string;
    querySelector?: string;
}

export type TViewChildrenMetadata = IViewChildrenMetadataConfig[];

export interface IEventListenerMetadataConfig {
    propertyKey: string;
    event: string;
    querySelector: string;
    predicate: () => boolean;
}

export type TEventListenerMetadata = IEventListenerMetadataConfig[];

export type TComponentInstance = Partial<IOnAttrChanges & IOnInit & IOnViewInit & IOnDestroy & IObject>;

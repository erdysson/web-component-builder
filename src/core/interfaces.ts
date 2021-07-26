import {Route} from '../router/interfaces';
import {ViewEncapsulation} from './enums';
// eslint-disable-next-line @typescript-eslint/ban-types
export interface Class<TClass extends {} = {}> extends Function {
    new (...args: any[]): TClass;
}

export interface IClassDecorator {
    (target: Class): void;
}

export interface IPropertyDecorator {
    (target: any, propertyKey: string, descriptor?: PropertyDescriptor): void;
}

export interface IMethodDecorator {
    (target: any, propertyKey: string, descriptor?: PropertyDescriptor): void;
}

export interface IParameterDecorator {
    (target: Class, propertyKey: string, parameterIndex: number): void;
}

export type IModule = Class | IModuleWithProviders;

export type IProvider = Class | IProviderConfig;

export interface IModuleWithProviders {
    module: Class;
    providers: IProvider[];
}

export interface IModuleConfig {
    imports?: IModule[];
    components: Class[];
    providers: IProvider[];
    declarations?: Class[];
    exports?: IProvider[];
}

export interface IProviderConfig {
    provide: string;
    useValue?: unknown;
    useClass?: Class;
}

export interface IComponentConfig {
    selector: string;
    template: string;
    viewEncapsulation?: ViewEncapsulation;
    styles?: string[];
}

export interface IAttrChanges {
    name: string;
    oldValue: unknown;
    newValue: unknown;
}

export interface IPropChanges {
    name: string;
    oldValue: unknown;
    newValue: unknown;
}

export interface IOnAttrChanges {
    onAttrChanges(changes?: IAttrChanges): void;
}

export interface IOnPropChanges {
    onPropChanges(changes?: IPropChanges): void;
}

export interface IOnInit {
    onInit(): void;
}

export interface IOnDestroy {
    onDestroy(): void;
}

export interface NavigationEvent {
    from: Route;
    to: Route;
}

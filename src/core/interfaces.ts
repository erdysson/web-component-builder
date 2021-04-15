// eslint-disable-next-line @typescript-eslint/ban-types
export type IClass<T = unknown> = Function & T;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IObject extends Object {}

export interface IModuleConfig {
    components: IClass[];
    providers: IClass[];
}

export interface IComponentConfig {
    selector: string;
    template: string;
}

export interface IChanges {
    [key: string]: {
        oldValue: string | null;
        newValue: string | null;
    };
}

export interface IOnChanges {
    onChanges(changes?: IChanges): void;
}

export interface IOnInit {
    onInit(): void;
}

export interface IOnViewInit {
    onViewInit(): void;
}

export interface IOnDestroy {
    onDestroy(): void;
}

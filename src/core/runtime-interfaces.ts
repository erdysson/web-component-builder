export interface IProviderInstance {
    exported: boolean;
    instance: unknown;
}

export type IContextProviderInjector = () => unknown;

import {createSandbox, SinonSandbox, SinonSpy} from 'sinon';

import {
    Attr,
    Component,
    IClass,
    IComponentConfig,
    Inject,
    Injectable,
    IObject,
    Listen,
    Module,
    ViewChild
} from '../../src';
import {Metadata} from '../../src/core/metadata';

describe('Decorator functions', () => {
    // dummy component config
    const componentConfig = {
        selector: 'a-selector',
        template: '<div>a-template</div>'
    };
    // sandbox for sinon related ops
    let sandbox: SinonSandbox;

    beforeEach(() => {
        sandbox = createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('@Module() decorator', () => {
        it('should set module metadata correctly', () => {
            const setModuleConfigSpy = sandbox.spy(Metadata, 'setModuleConfig');

            // dummy component class
            class C {}
            // dummy provider class
            class P {}
            // dummy module config
            const moduleConfig = {
                components: [C],
                providers: [P]
            };

            @Module(moduleConfig)
            class M {}

            // run assertions
            expect(setModuleConfigSpy.calledOnce).toBeTrue();
            expect(setModuleConfigSpy.getCall(0).args[0]).toEqual(M);
            expect(setModuleConfigSpy.getCall(0).args[1]).toEqual(moduleConfig);
            expect(Metadata.getModuleConfig(M)).toEqual(moduleConfig);
        });
    });

    describe('@Component() decorator', () => {
        it('should set component metadata correctly', () => {
            // setComponentConfig spy
            const setComponentConfigSpy: SinonSpy<
                [componentClass: IClass, componentConfig: IComponentConfig],
                void
            > = sandbox.spy(Metadata, 'setComponentConfig');

            // sample component
            @Component(componentConfig)
            class C {}

            // run assertions
            expect(setComponentConfigSpy.calledOnce).toBeTrue();
            expect(setComponentConfigSpy.getCall(0).args[0]).toEqual(C);
            expect(setComponentConfigSpy.getCall(0).args[1]).toEqual(componentConfig);
            expect(Metadata.getComponentConfig(C)).toEqual(componentConfig);
        });
    });

    describe('@Injectable() decorator', () => {
        it('should mark class as "Injectable"', () => {
            // setComponentConfig spy
            const setProviderConfigSpy = sandbox.spy(Metadata, 'setProviderConfig');

            // sample provider
            @Injectable()
            class P {}

            // run assertions
            expect(setProviderConfigSpy.calledOnce).toBeTrue();
            expect(setProviderConfigSpy.getCall(0).args[0]).toEqual(P);
            expect(setProviderConfigSpy.getCall(0).args[1]).toBeTrue();
            expect(Metadata.getProviderConfig(P)).toBeTrue();
        });
    });

    describe('@Inject() decorator', () => {
        let sandbox: SinonSandbox;
        let setInjectedProviderConfigSpy: SinonSpy<
            [hostClass: IClass, providerClass: IClass, targetParameterIndex: number],
            void
        >;

        beforeEach(() => {
            sandbox = createSandbox();
            setInjectedProviderConfigSpy = sandbox.spy(Metadata, 'setInjectedProviderConfig');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should have inject config as [], if has no injected providers', () => {
            @Component(componentConfig)
            class C {}

            expect(setInjectedProviderConfigSpy.callCount).toBe(0);

            const metadata = Metadata.getInjectedProviderConfig(C);
            expect(metadata).not.toBeUndefined();
            expect(metadata).toEqual([]);
        });

        it('should set inject metadata correctly to the components', () => {
            class I {}

            @Component(componentConfig)
            class C {
                constructor(@Inject(I) private readonly i: I) {}
            }

            expect(setInjectedProviderConfigSpy.calledOnce).toBeTrue();
            expect(setInjectedProviderConfigSpy.getCall(0).args[0]).toEqual(C);
            expect(setInjectedProviderConfigSpy.getCall(0).args[1]).toEqual(I);
            expect(setInjectedProviderConfigSpy.getCall(0).args[2]).toBe(0);
            // retrieve saved metadata - only the first, since only one injected provider exists
            const {providerClass, targetParameterIndex} = Metadata.getInjectedProviderConfig(C)[0];

            expect(providerClass).toEqual(I);
            expect(targetParameterIndex).toBe(0);
        });

        it('should keep the injected provider order', () => {
            class I {}

            class J {}

            @Component(componentConfig)
            class C {
                constructor(@Inject(I) private readonly i: I, @Inject(J) private readonly j: J) {}
            }

            expect(setInjectedProviderConfigSpy.calledTwice).toBeTrue();
            // decorator execution order : rtl
            // first call
            expect(setInjectedProviderConfigSpy.getCall(0).args[0]).toEqual(C);
            expect(setInjectedProviderConfigSpy.getCall(0).args[1]).toEqual(J);
            expect(setInjectedProviderConfigSpy.getCall(0).args[2]).toBe(1);
            // second call
            expect(setInjectedProviderConfigSpy.getCall(1).args[0]).toEqual(C);
            expect(setInjectedProviderConfigSpy.getCall(1).args[1]).toEqual(I);
            expect(setInjectedProviderConfigSpy.getCall(1).args[2]).toBe(0);
            // retrieve saved metadata
            const [j, i] = Metadata.getInjectedProviderConfig(C);
            // first provider in metadata config
            expect(j.providerClass).toEqual(J);
            expect(j.targetParameterIndex).toBe(1);
            // second provider in metadata config
            expect(i.providerClass).toEqual(I);
            expect(i.targetParameterIndex).toBe(0);
        });
    });

    describe('@Attr() decorator', () => {
        let sandbox: SinonSandbox;
        let setComponentAttrConfigSpy: SinonSpy<[componentInstance: IObject, propertyKey: string, name: string], void>;

        beforeEach(() => {
            sandbox = createSandbox();
            setComponentAttrConfigSpy = sandbox.spy(Metadata, 'setComponentAttrConfig');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should have attr metadata as [], if has no configured attr fields', () => {
            @Component(componentConfig)
            class C {}

            const metadata = Metadata.getComponentAttrConfig(C);
            expect(metadata).not.toBeUndefined();
            expect(metadata).toEqual([]);
        });

        it('should set attr metadata correctly', () => {
            @Component(componentConfig)
            class C {
                @Attr()
                p!: string;

                @Attr('named')
                k!: string;
            }

            expect(setComponentAttrConfigSpy.calledTwice).toBeTrue();
            // first call
            expect(setComponentAttrConfigSpy.getCall(0).args[0]).toBeInstanceOf(Object);
            expect(setComponentAttrConfigSpy.getCall(0).args[0].constructor).toEqual(C);
            expect(setComponentAttrConfigSpy.getCall(0).args[1]).toBe('p');
            expect(setComponentAttrConfigSpy.getCall(0).args[2]).toBe('p');
            // second call
            expect(setComponentAttrConfigSpy.getCall(1).args[0]).toBeInstanceOf(Object);
            expect(setComponentAttrConfigSpy.getCall(1).args[0].constructor).toEqual(C);
            expect(setComponentAttrConfigSpy.getCall(1).args[1]).toBe('k');
            expect(setComponentAttrConfigSpy.getCall(1).args[2]).toBe('named');
        });
    });

    describe('@ViewChild() decorator', () => {
        let sandbox: SinonSandbox;
        let setViewChildConfigSpy: SinonSpy<
            [componentInstance: IObject, propertyKey: string, querySelector?: string | undefined],
            void
        >;

        beforeEach(() => {
            sandbox = createSandbox();
            setViewChildConfigSpy = sandbox.spy(Metadata, 'setViewChildrenConfig');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should set metadata correctly', () => {
            const componentConfig: IComponentConfig = {
                selector: 'comp-with-child-selector1',
                template: '<div>Template 1</div>'
            };

            @Component(componentConfig)
            class C {
                @ViewChild()
                rootElement!: string;

                @ViewChild('.with-selector')
                childElement!: string;
            }

            expect(setViewChildConfigSpy.calledTwice).toBeTrue();
            // first call
            expect(setViewChildConfigSpy.getCall(0).args[0]).toBeInstanceOf(Object);
            expect(setViewChildConfigSpy.getCall(0).args[0].constructor).toEqual(C);
            expect(setViewChildConfigSpy.getCall(0).args[1]).toBe('rootElement');
            expect(setViewChildConfigSpy.getCall(0).args[2]).toBe(undefined);
            // second call
            expect(setViewChildConfigSpy.getCall(1).args[0]).toBeInstanceOf(Object);
            expect(setViewChildConfigSpy.getCall(1).args[0].constructor).toEqual(C);
            expect(setViewChildConfigSpy.getCall(1).args[1]).toBe('childElement');
            expect(setViewChildConfigSpy.getCall(1).args[2]).toBe('.with-selector');

            const metadata = Metadata.getViewChildrenConfig(C);
            expect(metadata).not.toBeUndefined();
            expect(metadata[0]).toEqual({propertyKey: 'rootElement', querySelector: undefined});
            expect(metadata[1]).toEqual({propertyKey: 'childElement', querySelector: '.with-selector'});
        });
    });

    describe('@Listen() decorator', () => {
        let sandbox: SinonSandbox;
        let setEventListenerConfigSpy: SinonSpy<
            [
                componentInstance: IObject,
                propertyKey: string,
                event: string,
                querySelector: string,
                predicate: () => boolean
            ],
            void
        >;

        beforeEach(() => {
            sandbox = createSandbox();
            setEventListenerConfigSpy = sandbox.spy(Metadata, 'setEventListenerConfig');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should set metadata correctly', () => {
            const componentConfig: IComponentConfig = {
                selector: 'comp-with-child-selector1',
                template: '<div>Template 1</div>'
            };

            const predicate = () => true;

            @Component(componentConfig)
            class C {
                @Listen('click')
                rootClickListener(event: Event): void {
                    console.log('event', event);
                }

                @Listen('click', '.child', predicate)
                childClickListener(event: Event): void {
                    console.log('child event', event);
                }
            }

            expect(setEventListenerConfigSpy.calledTwice).toBeTrue();
            // first call
            expect(setEventListenerConfigSpy.getCall(0).args[0]).toBeInstanceOf(Object);
            expect(setEventListenerConfigSpy.getCall(0).args[0].constructor).toEqual(C);
            expect(setEventListenerConfigSpy.getCall(0).args[1]).toBe('rootClickListener');
            expect(setEventListenerConfigSpy.getCall(0).args[2]).toBe('click');
            expect(setEventListenerConfigSpy.getCall(0).args[3]).toBe('');
            expect(setEventListenerConfigSpy.getCall(0).args[4]()).toBeTrue();
            // second call
            expect(setEventListenerConfigSpy.getCall(1).args[0]).toBeInstanceOf(Object);
            expect(setEventListenerConfigSpy.getCall(1).args[0].constructor).toEqual(C);
            expect(setEventListenerConfigSpy.getCall(1).args[1]).toBe('childClickListener');
            expect(setEventListenerConfigSpy.getCall(1).args[2]).toBe('click');
            expect(setEventListenerConfigSpy.getCall(1).args[3]).toBe('.child');
            expect(setEventListenerConfigSpy.getCall(1).args[4]).toEqual(predicate);

            const metadata = Metadata.getEventListenerConfig(C);
            expect(metadata).not.toBeUndefined();
            // 1st
            expect(metadata[0].propertyKey).toEqual('rootClickListener');
            expect(metadata[0].event).toEqual('click');
            expect(metadata[0].querySelector).toEqual('');
            expect(typeof metadata[0].predicate).toBe('function');
            // 2nd
            expect(metadata[1].propertyKey).toEqual('childClickListener');
            expect(metadata[1].event).toEqual('click');
            expect(metadata[1].querySelector).toEqual('.child');
            expect(metadata[1].predicate).toEqual(predicate);
        });
    });
});

import {createSandbox, SinonSandbox, SinonSpy} from 'sinon';

import {Component, IClass, IComponentConfig, Inject, Injectable, Input, IObject, Metadata, Module} from '../../src';

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

    describe('@Input() decorator', () => {
        let sandbox: SinonSandbox;
        let setComponentInputConfigSpy: SinonSpy<
            [componentInstance: IObject, componentPropertyKey: string, inputAttributeName: string],
            void
        >;

        beforeEach(() => {
            sandbox = createSandbox();
            setComponentInputConfigSpy = sandbox.spy(Metadata, 'setComponentInputConfig');
        });

        afterEach(() => {
            sandbox.restore();
        });

        it('should have input metadata as [], if has no configured input fields', () => {
            @Component(componentConfig)
            class C {}

            // expect(setComponentInputConfigSpy.callCount).to.be.equal(0);
            const metadata = Metadata.getComponentInputConfig(C);
            expect(metadata).not.toBeUndefined();
            expect(metadata).toEqual([]);
        });

        it('should set input metadata correctly', () => {
            @Component(componentConfig)
            class C {
                @Input()
                p!: string;

                @Input('named')
                k!: string;
            }

            expect(setComponentInputConfigSpy.calledTwice).toBeTrue();
            // first call
            expect(setComponentInputConfigSpy.getCall(0).args[0] instanceof Object).toBeTrue();
            expect(setComponentInputConfigSpy.getCall(0).args[0].constructor).toEqual(C);
            expect(setComponentInputConfigSpy.getCall(0).args[1]).toBe('p');
            expect(setComponentInputConfigSpy.getCall(0).args[2]).toBe('p');
            // second call
            expect(setComponentInputConfigSpy.getCall(1).args[0] instanceof Object).toBeTrue();
            expect(setComponentInputConfigSpy.getCall(1).args[0].constructor).toEqual(C);
            expect(setComponentInputConfigSpy.getCall(1).args[1]).toBe('k');
            expect(setComponentInputConfigSpy.getCall(1).args[2]).toBe('named');
        });
    });
});

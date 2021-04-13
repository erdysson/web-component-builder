import * as chai from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
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
            chai.expect(setModuleConfigSpy.calledOnce).to.be.true;
            chai.expect(setModuleConfigSpy.getCall(0).args[0]).to.be.equal(M);
            chai.expect(setModuleConfigSpy.getCall(0).args[1]).to.be.equal(moduleConfig);
            chai.expect(Metadata.getModuleConfig(M)).to.be.equal(moduleConfig);
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
            chai.expect(setComponentConfigSpy.calledOnce).to.be.true;
            chai.expect(setComponentConfigSpy.getCall(0).args[0]).to.be.equal(C);
            chai.expect(setComponentConfigSpy.getCall(0).args[1]).to.be.equal(componentConfig);
            chai.expect(Metadata.getComponentConfig(C)).to.be.equal(componentConfig);
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
            chai.expect(setProviderConfigSpy.calledOnce).to.be.true;
            chai.expect(setProviderConfigSpy.getCall(0).args[0]).to.be.equal(P);
            chai.expect(setProviderConfigSpy.getCall(0).args[1]).to.be.true;
            chai.expect(Metadata.getProviderConfig(P)).to.be.true;
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

            chai.expect(setInjectedProviderConfigSpy.callCount).to.be.equal(0);

            const metadata = Metadata.getInjectedProviderConfig(C);
            chai.expect(metadata).not.to.be.equal(undefined);
            chai.expect(metadata).to.be.empty;
        });

        it('should set inject metadata correctly to the components', () => {
            class I {}

            @Component(componentConfig)
            class C {
                constructor(@Inject(I) private readonly i: I) {}
            }

            chai.expect(setInjectedProviderConfigSpy.calledOnce).to.be.true;
            chai.expect(setInjectedProviderConfigSpy.getCall(0).args[0]).to.be.equal(C);
            chai.expect(setInjectedProviderConfigSpy.getCall(0).args[1]).to.be.equal(I);
            chai.expect(setInjectedProviderConfigSpy.getCall(0).args[2]).to.be.equal(0);
            // retrieve saved metadata - only the first, since only one injected provider exists
            const {providerClass, targetParameterIndex} = Metadata.getInjectedProviderConfig(C)[0];

            chai.expect(providerClass).to.be.equal(I);
            chai.expect(targetParameterIndex).to.be.equal(0);
        });

        it('should keep the injected provider order', () => {
            class I {}

            class J {}

            @Component(componentConfig)
            class C {
                constructor(@Inject(I) private readonly i: I, @Inject(J) private readonly j: J) {}
            }

            chai.expect(setInjectedProviderConfigSpy.calledTwice).to.be.true;
            // decorator execution order : rtl
            // first call
            chai.expect(setInjectedProviderConfigSpy.getCall(0).args[0]).to.be.equal(C);
            chai.expect(setInjectedProviderConfigSpy.getCall(0).args[1]).to.be.equal(J);
            chai.expect(setInjectedProviderConfigSpy.getCall(0).args[2]).to.be.equal(1);
            // second call
            chai.expect(setInjectedProviderConfigSpy.getCall(1).args[0]).to.be.equal(C);
            chai.expect(setInjectedProviderConfigSpy.getCall(1).args[1]).to.be.equal(I);
            chai.expect(setInjectedProviderConfigSpy.getCall(1).args[2]).to.be.equal(0);
            // retrieve saved metadata
            const [j, i] = Metadata.getInjectedProviderConfig(C);
            // first provider in metadata config
            chai.expect(j.providerClass).to.be.equal(J);
            chai.expect(j.targetParameterIndex).to.be.equal(1);
            // second provider in metadata config
            chai.expect(i.providerClass).to.be.equal(I);
            chai.expect(i.targetParameterIndex).to.be.equal(0);
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

            chai.expect(setComponentInputConfigSpy.callCount).to.be.equal(0);
            const metadata = Metadata.getComponentInputConfig(C);
            chai.expect(metadata).not.to.be.equal(undefined);
            chai.expect(metadata).to.be.empty;
        });

        it('should set input metadata correctly', () => {
            @Component(componentConfig)
            class C {
                @Input()
                p!: string;

                @Input('named')
                k!: string;
            }

            chai.expect(setComponentInputConfigSpy.calledTwice).to.be.true;
            // first call
            chai.expect(setComponentInputConfigSpy.getCall(0).args[0] instanceof Object).to.be.true;
            chai.expect(setComponentInputConfigSpy.getCall(0).args[0].constructor).to.be.equal(C);
            chai.expect(setComponentInputConfigSpy.getCall(0).args[1]).to.be.equal('p');
            chai.expect(setComponentInputConfigSpy.getCall(0).args[2]).to.be.equal('p');
            // second call
            chai.expect(setComponentInputConfigSpy.getCall(1).args[0] instanceof Object).to.be.true;
            chai.expect(setComponentInputConfigSpy.getCall(1).args[0].constructor).to.be.equal(C);
            chai.expect(setComponentInputConfigSpy.getCall(1).args[1]).to.be.equal('k');
            chai.expect(setComponentInputConfigSpy.getCall(1).args[2]).to.be.equal('named');
        });
    });
});

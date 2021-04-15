import {createSandbox, SinonSandbox} from 'sinon';

import {
    bootstrap,
    Component,
    IChanges,
    IComponentConfig,
    IModuleConfig,
    Inject,
    Injectable,
    Input,
    IOnChanges,
    IOnDestroy,
    IOnInit,
    Module,
    Runtime
} from '../../src';

describe('Runtime functions', () => {
    let sandbox: SinonSandbox;

    beforeEach(() => {
        sandbox = createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('bootstrap() should create the runtime object and init module', () => {
        const runtimeInitModuleSpy = sandbox.spy(Runtime.prototype, 'initModule');
        // dummy module config
        @Module({
            components: [],
            providers: []
        })
        class M {}
        // bootstrap the module
        bootstrap(M);

        expect(runtimeInitModuleSpy.calledOnce).toBeTrue();
        expect(runtimeInitModuleSpy.getCall(0).args[0]).toEqual(M);
    });

    it('initModule(moduleClass) should call initComponent(componentClass) in order', () => {
        const initModuleSpy = sandbox.spy(Runtime.prototype, 'initModule');
        const initComponentSpy = sandbox.spy(Runtime.prototype, 'initComponent');

        const componentConfig1: IComponentConfig = {
            selector: 'comp-1',
            template: '<div>Component 1</div>'
        };

        const componentConfig2: IComponentConfig = {
            selector: 'comp-2',
            template: '<div>Component 2</div>'
        };

        @Component(componentConfig1)
        class C1 {}

        @Component(componentConfig2)
        class C2 {}

        const moduleConfig: IModuleConfig = {
            components: [C1, C2],
            providers: []
        };

        @Module(moduleConfig)
        class M {}

        bootstrap(M);

        expect(initModuleSpy.calledOnce).toBeTrue();
        expect(initComponentSpy.callCount).toEqual(2);
        expect(initComponentSpy.getCall(0).args[0]).toEqual(C1);
        expect(initComponentSpy.getCall(1).args[0]).toEqual(C2);
    });

    it('initComponent(componentClass) should init components correctly', () => {
        const initComponentSpy = sandbox.spy(Runtime.prototype, 'initComponent');
        const initProviderSpy = sandbox.spy(Runtime.prototype, 'initProvider');
        const createProviderInstanceSpy = sandbox.spy(Runtime.prototype, 'createProviderInstance');
        const getConstructorParamsSpy = sandbox.spy(Runtime.prototype, 'getHostClassConstructorParams');
        const getComponentFactorySpy = sandbox.spy(Runtime.prototype, 'getComponentFactory');
        const customElementsDefineSpy = sandbox.spy(customElements, 'define');

        const componentConfigA: IComponentConfig = {
            selector: 'comp-a',
            template: '<div>Component A</div>'
        };

        const componentConfigB: IComponentConfig = {
            selector: 'comp-b',
            template: '<div>Component B</div>'
        };

        @Injectable()
        class P1 {}

        @Component(componentConfigA)
        class C1 {
            constructor(@Inject(P1) private p1: P1) {}
        }

        @Component(componentConfigB)
        class C2 {}

        const moduleConfig: IModuleConfig = {
            components: [C1, C2],
            providers: [P1]
        };

        @Module(moduleConfig)
        class M {}

        bootstrap(M);

        // C1, C2
        expect(initComponentSpy.calledTwice).toBeTrue();
        // C1, C2
        expect(initComponentSpy.getCall(0).args[0]).toEqual(C1);
        expect(initComponentSpy.getCall(1).args[0]).toEqual(C2);
        // C1 - only for P1 provider
        expect(initProviderSpy.callCount).toEqual(1);
        expect(initProviderSpy.getCall(0).args[0]).toEqual(P1);
        // P1 initiation
        expect(createProviderInstanceSpy.calledOnce).toBeTrue();
        // constructor params calls - C1, C2, and P1 = 3
        expect(getConstructorParamsSpy.callCount).toEqual(3);
        expect(getConstructorParamsSpy.returned([])).toBeTrue();
        // component factory calls - C1, C2
        expect(getComponentFactorySpy.calledTwice).toBeTrue();
        // C1
        expect(getComponentFactorySpy.getCall(0).args[0]).toEqual(C1);
        // C1 - constructor params
        expect(getComponentFactorySpy.getCall(0).args[1].length).toEqual(1);
        expect(getComponentFactorySpy.getCall(0).args[1][0]).toBeInstanceOf(P1);
        expect(getComponentFactorySpy.getCall(0).args[2]).toEqual([]);
        expect(getComponentFactorySpy.getCall(0).args[3]).toEqual(componentConfigA.template);
        // C2
        expect(getComponentFactorySpy.getCall(1).args[0]).toEqual(C2);
        expect(getComponentFactorySpy.getCall(1).args[1]).toEqual([]);
        expect(getComponentFactorySpy.getCall(1).args[2]).toEqual([]);
        expect(getComponentFactorySpy.getCall(1).args[3]).toEqual(componentConfigB.template);
        // C1, C2
        expect(customElementsDefineSpy.calledTwice).toBeTrue();
        expect(customElementsDefineSpy.getCall(0).args[0]).toEqual(componentConfigA.selector);
        expect(customElementsDefineSpy.getCall(1).args[0]).toEqual(componentConfigB.selector);
    });

    it('initProvider(providerClass) should only be called if the providerClass is injected to a componentClass', () => {
        const initProviderSpy = sandbox.spy(Runtime.prototype, 'initProvider');
        const createProviderInstanceSpy = sandbox.spy(Runtime.prototype, 'createProviderInstance');
        const getConstructorParamsSpy = sandbox.spy(Runtime.prototype, 'getHostClassConstructorParams');

        @Injectable()
        class P1 {}

        @Injectable()
        class P2 {
            constructor(@Inject(P1) private p1: P1) {}
        }

        @Injectable()
        class P3 {}

        @Component({
            selector: 'test-c',
            template: '<div>Test C</div>'
        })
        class C {
            constructor(@Inject(P3) private p3: P3) {}
        }

        @Module({
            components: [C],
            providers: [P1, P2, P3]
        })
        class M {}

        bootstrap(M);
        // only for P3
        expect(initProviderSpy.calledOnce).toBeTrue();
        expect(initProviderSpy.getCall(0).args[0]).toEqual(P3);
        // only for P3
        expect(createProviderInstanceSpy.calledOnce).toBeTrue();
        expect(createProviderInstanceSpy.getCall(0).args[0]).toEqual(P3);
        // C1 and P3
        expect(getConstructorParamsSpy.callCount).toBe(2);
        // constructor params for P3 - []
        expect(getConstructorParamsSpy.returnValues[0]).toEqual([]);
        // constructor params for C - [instanceof P1]
        expect(getConstructorParamsSpy.returnValues[1][0]).toBeInstanceOf(P3);
    });

    it('initProvider(providerClass) should throw exception, if the provider is not marked as @Injectable()', () => {
        const initProviderSpy = sandbox.spy(Runtime.prototype, 'initProvider');
        const createProviderInstanceSpy = sandbox.spy(Runtime.prototype, 'createProviderInstance');

        @Injectable()
        class P1 {}

        class P2 {}

        @Component({
            selector: 'xyz',
            template: '<div>XYZ</div>'
        })
        class C {
            constructor(@Inject(P1) private p1: P1, @Inject(P2) private p2: P2) {}
        }

        @Module({
            components: [C],
            providers: [P1, P2]
        })
        class M {}

        // wrap to try/catch so that test does not fail!
        try {
            bootstrap(M);
            // P1, P2
            expect(initProviderSpy.callCount).toBe(2);
            expect(initProviderSpy.getCall(0)).not.toThrowError();
            expect(initProviderSpy.getCall(1)).toThrowError();
            // only for P1
            expect(createProviderInstanceSpy.calledOnce).toBeTrue();
        } catch (e) {
            //
        }
    });

    it('initProvider(providerClass) should throw exception, if the provider is not registered in the module', () => {
        const initProviderSpy = sandbox.spy(Runtime.prototype, 'initProvider');
        const createProviderInstanceSpy = sandbox.spy(Runtime.prototype, 'createProviderInstance');

        @Injectable()
        class P1 {}

        @Component({
            selector: 'abc',
            template: '<div>ABC</div>'
        })
        class C {
            constructor(@Inject(P1) private p1: P1) {}
        }

        @Module({
            components: [C],
            providers: []
        })
        class M {}
        // wrap to try/catch so that test does not fail!
        try {
            bootstrap(M);
            // P1
            expect(initProviderSpy.callCount).toBe(1);
            expect(initProviderSpy.getCall(0)).toThrowError();
            // no provider should be created
            expect(createProviderInstanceSpy.callCount).toBe(0);
        } catch (e) {
            //
        }
    });

    it('initProvider(providerClass) -> createProviderInstance(providerInstance) should only one instance be created per providerClass', () => {
        const createProviderInstanceSpy = sandbox.spy(Runtime.prototype, 'createProviderInstance');

        @Injectable()
        class P1 {}

        @Injectable()
        class P2 {
            constructor(@Inject(P1) private p1: P1) {}
        }

        @Injectable()
        class P3 {
            constructor(@Inject(P2) private p2: P2, @Inject(P1) private p1: P1) {}
        }

        @Injectable()
        class P4 {
            constructor(@Inject(P1) private p1: P1, @Inject(P3) private p3: P3, @Inject(P2) private p2: P2) {}
        }

        @Component({
            selector: 'my-comp',
            template: '<div>my comp</div>'
        })
        class C {
            constructor(@Inject(P2) private p2: P2, @Inject(P4) private p4: P4) {}
        }

        @Module({
            components: [C],
            providers: [P1, P2, P3, P4]
        })
        class M {}

        bootstrap(M);

        expect(createProviderInstanceSpy.callCount).toEqual(4);
    });

    // todo : add check for afterViewInit
    it('getComponentFactory(...) should transform componentClass` lifecycle methods correctly', (done) => {
        @Injectable()
        class P1 {
            sayHello(name: string): string {
                return `Hello ${name}`;
            }

            sayWelcome(changes?: IChanges): unknown[] {
                return ['Welcome', changes];
            }

            sayGoodbye(name: string): string {
                return `Goodbye ${name}`;
            }
        }

        const componentConfigX: IComponentConfig = {
            selector: 'comp-x',
            template: '<div>Component X</div>'
        };

        @Component(componentConfigX)
        class C1 implements IOnInit, IOnChanges, IOnDestroy {
            constructor(@Inject(P1) private p1: P1) {}

            @Input()
            index!: string;

            onInit(): void {
                console.log(this.p1.sayHello('C1:onInit'));
            }

            onChanges(changes?: IChanges) {
                console.log(...this.p1.sayWelcome(changes));
            }

            onDestroy() {
                console.log(this.p1.sayGoodbye('C1:onDestroy'));
            }
        }

        const moduleConfig: IModuleConfig = {
            components: [C1],
            providers: [P1]
        };

        @Module(moduleConfig)
        class M {}

        // create spies before bootstrap
        const providerSpy = sandbox.spy(P1.prototype);
        const componentSpy = sandbox.spy(C1.prototype);

        bootstrap(M);
        // addition of the component to DOM will initiate web component class instance over mapped factory class
        document.body.insertAdjacentHTML('beforeend', `<div id="comp-x-wrapper"><comp-x index="0"></comp-x></div>`);

        const changes0: IChanges = {index: {oldValue: null, newValue: '0'}};

        // validate initial changes
        expect(componentSpy.onChanges.calledOnce).toBeTrue();
        expect(componentSpy.onChanges.getCall(0).args[0]).toEqual(changes0);

        expect(providerSpy.sayWelcome.calledOnce).toBeTrue();
        expect(providerSpy.sayWelcome.getCall(0).args[0]).toEqual(changes0);

        expect(componentSpy.onChanges.calledBefore(componentSpy.onInit)).toBeTrue();

        expect(componentSpy.onInit.calledOnce).toBeTrue();
        expect(providerSpy.sayHello.calledOnce).toBeTrue();

        setTimeout(() => {
            // wait for async addition of template
            const compX = document.querySelector('comp-x');
            expect(compX).not.toBe(null);
            expect((compX as HTMLElement).innerHTML).toEqual(componentConfigX.template);
            // trigger changes
            (compX as HTMLElement).setAttribute('index', '1');

            const changes1: IChanges = {index: {oldValue: '0', newValue: '1'}};

            // validate changes
            expect(componentSpy.onChanges.calledTwice).toBeTrue();
            expect(componentSpy.onChanges.getCall(1).args[0]).toEqual(changes1);

            expect(providerSpy.sayWelcome.calledTwice).toBeTrue();
            expect(providerSpy.sayWelcome.getCall(1).args[0]).toEqual(changes1);

            // remove the element to trigger onDestroy
            (compX as HTMLElement).remove();

            // validate destroy
            expect(componentSpy.onDestroy.calledOnce).toBeTrue();
            expect(providerSpy.sayGoodbye.calledOnce).toBeTrue();

            // call done since the test is async
            done();
        }, 0);
    });

    it('components should be initiated without errors if there is no lifecycle method', () => {

    });

    it('mismatched input - attribute pairs should throw error', () => {
        // todo
    });

    it('onChanges should not be triggered if there is no component input', () => {
        // todo
    });

    it('multiple input fields should not trigger onChanges more than once before initialization', () => {
        // todo
    });

    it('nested component initiations should be from inner to outer', () => {
        // todo
    });
});

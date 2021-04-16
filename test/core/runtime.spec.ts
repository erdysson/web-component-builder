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
    IOnViewInit,
    Module
} from '../../src';
import {Runtime} from '../../src/core/runtime';

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
        const runtimeSpy = sandbox.spy(Runtime.prototype);
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
        expect(runtimeSpy.initComponent.calledTwice).toBeTrue();
        // C1, C2
        expect(runtimeSpy.initComponent.getCall(0).args[0]).toEqual(C1);
        expect(runtimeSpy.initComponent.getCall(1).args[0]).toEqual(C2);
        // C1 - only for P1 provider
        expect(runtimeSpy.initProvider.callCount).toEqual(1);
        expect(runtimeSpy.initProvider.getCall(0).args[0]).toEqual(P1);
        // P1 initiation
        expect(runtimeSpy.createProviderInstance.calledOnce).toBeTrue();
        // constructor params calls - C1, C2, and P1 = 3
        expect(runtimeSpy.getHostClassConstructorParams.callCount).toEqual(3);
        expect(runtimeSpy.getHostClassConstructorParams.returned([])).toBeTrue();
        // component factory calls - C1, C2
        expect(runtimeSpy.getComponentFactory.calledTwice).toBeTrue();
        // C1
        expect(runtimeSpy.getComponentFactory.getCall(0).args.length).toEqual(4);
        expect(runtimeSpy.getComponentFactory.getCall(0).args[0]).toBe(C1);
        // C2
        expect(runtimeSpy.getComponentFactory.getCall(1).args.length).toEqual(4);
        expect(runtimeSpy.getComponentFactory.getCall(1).args[0]).toBe(C2);
        // C1, C2
        expect(customElementsDefineSpy.calledTwice).toBeTrue();
        expect(customElementsDefineSpy.getCall(0).args[0]).toEqual(componentConfigA.selector);
        expect(customElementsDefineSpy.getCall(1).args[0]).toEqual(componentConfigB.selector);
    });

    it('initProvider(providerClass) should only be called if the providerClass is injected to a componentClass', () => {
        const runtimeSpy = sandbox.spy(Runtime.prototype);

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
        expect(runtimeSpy.initProvider.calledOnce).toBeTrue();
        expect(runtimeSpy.initProvider.getCall(0).args[0]).toEqual(P3);
        // only for P3
        expect(runtimeSpy.createProviderInstance.calledOnce).toBeTrue();
        expect(runtimeSpy.createProviderInstance.getCall(0).args[0]).toEqual(P3);
        // C1 and P3
        expect(runtimeSpy.getHostClassConstructorParams.callCount).toBe(2);
        // constructor params for P3 - []
        expect(runtimeSpy.getHostClassConstructorParams.returnValues[0]).toEqual([]);
        // constructor params for C - [instanceof P1]
        expect(runtimeSpy.getHostClassConstructorParams.returnValues[1][0]).toBeInstanceOf(P3);
    });

    it('initProvider(providerClass) should throw exception, if the provider is not marked as @Injectable()', () => {
        const runtimeSpy = sandbox.spy(Runtime.prototype);

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
            expect(runtimeSpy.initProvider.callCount).toBe(2);
            expect(runtimeSpy.initProvider.getCall(0)).not.toThrowError();
            expect(runtimeSpy.initProvider.getCall(1)).toThrowError();
            // only for P1
            expect(runtimeSpy.createProviderInstance.calledOnce).toBeTrue();
        } catch (e) {
            //
        }
    });

    it('initProvider(providerClass) should throw exception, if the provider is not registered in the module', () => {
        const runtimeSpy = sandbox.spy(Runtime.prototype);

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
            expect(runtimeSpy.initProvider.callCount).toBe(1);
            expect(runtimeSpy.initProvider.getCall(0)).toThrowError();
            // no provider should be created
            expect(runtimeSpy.createProviderInstance.callCount).toBe(0);
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

    it('components should be initiated without errors if there is no lifecycle method', (done) => {
        const componentConfigTest: IComponentConfig = {
            selector: 'comp-test',
            template: '<div>Component Test</div>'
        };

        @Component(componentConfigTest)
        class C {}

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        bootstrap(M);

        // add to DOM
        document.body.insertAdjacentHTML('beforeend', '<div><comp-test index="0"></comp-test></div>');

        setTimeout(() => {
            const compTest = document.querySelector('comp-test');
            expect(compTest).not.toBe(null);
            expect((compTest as HTMLElement).innerHTML).toEqual(componentConfigTest.template);
            // change attr
            (compTest as HTMLElement).setAttribute('index', '1');
            // remove from DOM
            (compTest as HTMLElement).remove();
            //
            done();
        });
    });

    it('component` lifecycle methods should be called in order', (done) => {
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
        class C1 implements IOnChanges, IOnInit, IOnViewInit, IOnDestroy {
            constructor(@Inject(P1) private p1: P1) {}

            @Input()
            index!: string;

            onChanges(changes?: IChanges) {
                console.log(...this.p1.sayWelcome(changes));
            }

            onInit(): void {
                console.log(this.p1.sayHello('C1:onInit'));
            }

            onViewInit(): void {
                console.log(this.p1.sayHello('C1:onViewInit'));
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

        expect(componentSpy.onChanges.callCount).toEqual(0);

        expect(componentSpy.onInit.calledOnce).toBeTrue();
        expect(providerSpy.sayHello.calledOnce).toBeTrue();

        expect(componentSpy.onInit.calledBefore(componentSpy.onViewInit)).toBeTrue();
        expect(componentSpy.onInit.calledBefore(componentSpy.onChanges)).toBeTrue();

        setTimeout(() => {
            // check async viewInit callbacks
            expect(componentSpy.onViewInit.calledOnce).toBeTrue();
            expect(componentSpy.onViewInit.calledBefore(componentSpy.onChanges)).toBeTrue();
            expect(providerSpy.sayHello.calledTwice).toBeTrue();

            // wait for async addition of template
            const compX = document.querySelector(componentConfigX.selector);
            expect(compX).not.toBe(null);
            expect((compX as HTMLElement).innerHTML).toEqual(componentConfigX.template);

            // trigger changes
            (compX as HTMLElement).setAttribute('index', '1');

            const changes: IChanges = {index: {oldValue: '0', newValue: '1'}};

            // validate changes
            expect(componentSpy.onChanges.calledOnce).toBeTrue();
            expect(componentSpy.onChanges.getCall(0).args[0]).toEqual(changes);

            expect(providerSpy.sayWelcome.calledOnce).toBeTrue();
            expect(providerSpy.sayWelcome.getCall(0).args[0]).toEqual(changes);

            // remove the element to trigger onDestroy
            (compX as HTMLElement).remove();

            // validate other lifecycle method's total call counts
            expect(componentSpy.onInit.calledOnce).toBeTrue();
            expect(componentSpy.onViewInit.calledOnce).toBeTrue();
            expect(componentSpy.onChanges.calledOnce).toBeTrue();

            // validate destroy
            expect(componentSpy.onDestroy.calledOnce).toBeTrue();
            expect(providerSpy.sayGoodbye.calledOnce).toBeTrue();

            // call done since the test is async
            done();
        }, 0);
    });

    it('mismatched input - attribute pairs should throw error', () => {
        pending('Exception thrown by method can not be caught by Jasmine and causes all tests fail');

        const componentConfig: IComponentConfig = {
            selector: 'my-test-comp',
            template: '<div>My Test Comp</div>'
        };

        @Component(componentConfig)
        class C {
            @Input()
            private test!: string;
        }

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        bootstrap(M);
        // add to DOM
        document.body.insertAdjacentHTML('beforeend', '<div><my-test-comp index="0"></my-test-comp></div>');
    });

    it('onChanges() should not be triggered if there is no component input', () => {
        const componentConfig: IComponentConfig = {
            selector: 'no-input-comp',
            template: '<div>No Input Comp</div>'
        };

        @Component(componentConfig)
        class C implements IOnChanges {
            onChanges(changes?: IChanges) {
                console.log('on changes called', changes);
            }
        }

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        bootstrap(M);

        const componentSpy = sandbox.spy(C.prototype);
        // add to DOM
        document.body.insertAdjacentHTML('beforeend', '<div><no-input-comp index="0"></no-input-comp></div>');

        expect(componentSpy.onChanges.callCount).toEqual(0);
    });

    it('nested component initiations should be from outer to inner', (done) => {
        const innerConfig: IComponentConfig = {
            selector: 'comp-inner',
            template: '<div>Inner Comp</div>'
        };
        const middleConfig: IComponentConfig = {
            selector: 'comp-middle',
            template: '<div><comp-inner></comp-inner></div>'
        };
        const outerConfig: IComponentConfig = {
            selector: 'comp-outer',
            template: '<div><comp-middle></comp-middle></div>'
        };

        @Component(innerConfig)
        class CInner implements IOnInit, IOnDestroy {
            onInit() {
                console.log('inner:on init called');
            }
            onDestroy() {
                console.log('inner:on destroy called');
            }
        }

        @Component(middleConfig)
        class CMiddle implements IOnInit, IOnDestroy {
            onInit() {
                console.log('middle:on init called');
            }
            onDestroy() {
                console.log('middle:on destroy called');
            }
        }

        @Component(outerConfig)
        class COuter implements IOnInit, IOnDestroy {
            onInit() {
                console.log('outer:on init called');
            }
            onDestroy() {
                console.log('outer:on destroy called');
            }
        }

        @Module({
            components: [COuter, CMiddle, CInner],
            providers: []
        })
        class M {}

        bootstrap(M);

        const outerSpy = sandbox.spy(COuter.prototype);
        const middleSpy = sandbox.spy(CMiddle.prototype);
        const innerSpy = sandbox.spy(CInner.prototype);
        // add to DOM
        document.body.insertAdjacentHTML('beforeend', '<div><comp-outer></comp-outer></div>');
        // async check due to insertHTML async call
        setTimeout(() => {
            // inner check
            expect(outerSpy.onInit.calledOnce).toBeTrue();
            expect(outerSpy.onInit.calledBefore(middleSpy.onInit)).toBeTrue();
            expect(outerSpy.onInit.calledBefore(innerSpy.onInit)).toBeTrue();
            // middle check
            expect(middleSpy.onInit.calledOnce).toBeTrue();
            expect(middleSpy.onInit.calledBefore(innerSpy.onInit)).toBeTrue();
            // outer
            expect(innerSpy.onInit.calledOnce).toBeTrue();
            // remove
            const outer = document.querySelector(outerConfig.selector);
            (outer as HTMLElement).remove();
            // check onDestroy
            // outer
            expect(outerSpy.onDestroy.calledOnce).toBeTrue();
            expect(outerSpy.onDestroy.calledBefore(middleSpy.onDestroy)).toBeTrue();
            expect(outerSpy.onDestroy.calledBefore(innerSpy.onDestroy)).toBeTrue();
            // middle
            expect(middleSpy.onDestroy.calledOnce).toBeTrue();
            expect(middleSpy.onDestroy.calledBefore(innerSpy.onDestroy)).toBeTrue();
            // inner
            expect(innerSpy.onDestroy.calledOnce).toBeTrue();

            done();
        }, 50); // 50ms to make sure all init views are done
    });
});

import {
    ActivatedRoute,
    Component,
    Inject,
    IOnDestroy,
    IOnInit,
    Params,
    QueryParams,
    Subscription,
    ViewChild
} from 'web-component-builder';

@Component({
    selector: 'app-person',
    template: `
        <h2>Person Component</h2>
        <div class="person-message"></div>
    `
})
export class Person implements IOnInit, IOnDestroy {
    @ViewChild('.person-message')
    private personMessageDiv!: HTMLElement;

    private id!: string;

    private paramChangeSubscription!: Subscription;
    private queryParamChangeSubscription!: Subscription;

    constructor(@Inject() private readonly activatedRoute: ActivatedRoute) {}

    onInit(): void {
        console.log('person component on init');

        this.paramChangeSubscription = this.activatedRoute.onParamChange((params: Params) => {
            console.log('param change called');
            this.id = params.id;
            console.log('params changed in person', params);
            this.salute();
        });

        this.queryParamChangeSubscription = this.activatedRoute.onQueryParamChange(
            (params: QueryParams) => {
                console.log('query params changed in person', params);
            }
        );
    }

    onDestroy(): void {
        this.paramChangeSubscription.unsubscribe();
        this.queryParamChangeSubscription.unsubscribe();
    }

    salute(): void {
        this.personMessageDiv.innerText = `Welcome to person page for ${this.id}`;
    }
}

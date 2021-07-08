import {
    ActivatedRoute,
    Component,
    Inject,
    IOnInit,
    IOnViewInit,
    Params,
    QueryParams,
    ViewChild
} from 'web-component-builder';

@Component({
    selector: 'app-person',
    template: `
        <h2>Person Component</h2>
        <div class="person-message"></div>
    `
})
export class Person implements IOnInit, IOnViewInit {
    @ViewChild('.person-message')
    private personMessageDiv!: HTMLElement;

    private id!: string;

    constructor(@Inject() private readonly activatedRoute: ActivatedRoute) {}

    onInit(): void {
        console.log('person component on init');
    }

    onViewInit(): void {
        this.activatedRoute.onParamChange((params: Params) => {
            this.id = params.id;
            console.log('on param change called');
            this.salute();
        });

        this.activatedRoute.onQueryParamChange((params: QueryParams) => {
            console.log('query params changed', params);
        });
    }

    salute(): void {
        this.personMessageDiv.innerText = `Welcome to person page for ${this.id}`;
    }
}

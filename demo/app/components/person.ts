import {Component, IOnViewInit, RouterService, ViewChild} from 'web-component-builder';

@Component({
    selector: 'app-person',
    template: `
        <h2>Person Component</h2>
        <div class="person-message"></div>
    `
})
export class Person implements IOnViewInit {
    @ViewChild('.person-message')
    private personMessageDiv!: HTMLElement;

    constructor(private readonly router: RouterService) {}

    onViewInit(): void {
        console.log('person component view init');
        this.personMessageDiv.innerText = `Welcome to person page for`;
    }
}

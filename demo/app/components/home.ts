import {Component, Inject, IOnInit, Listen, RouterService} from 'web-component-builder';

@Component({
    selector: 'app-home',
    template: `
        <h2>Home Component</h2>
        <div>Welcome to home component</div>
        <button type="button">Go to Profile</button>
    `
})
export class Home implements IOnInit {
    constructor(@Inject() private readonly router: RouterService) {}

    onInit(): void {
        console.log('home component on init');
    }

    @Listen('click', 'button')
    goToProfile(): void {
        this.router.navigate('/profile');
    }
}

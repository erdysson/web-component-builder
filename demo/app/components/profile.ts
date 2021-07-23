import {ActivatedRoute, Component, Inject, IOnInit, Listen, Router} from 'web-component-builder';

@Component({
    selector: 'app-profile',
    template: `
        <h2>Profile Component</h2>
        <div>Welcome to profile component</div>
        <button type="button">Go to Home</button>
    `
})
export class Profile implements IOnInit {
    constructor(@Inject() private readonly router: Router, @Inject() private readonly activatedRoute: ActivatedRoute) {}

    onInit(): void {
        console.log('profile component on init. activated route', this.activatedRoute.getSnapshot());
    }

    @Listen('click', 'button')
    goToProfile(): void {
        this.router.navigate('/home');
    }
}

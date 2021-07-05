import {Component, Inject, IOnInit, Listen, RouterService, ViewEncapsulation} from 'web-component-builder';

import {AppService} from '../services/app.service';

@Component({
    selector: 'app-root',
    template: `
        <h2>App Component</h2>
        <button type="button" class="navigate-home">Navigate to Home</button>
        <button type="button" class="navigate-profile">Navigate to Profile</button>
        <router-component></router-component>
    `
})
export class App implements IOnInit {
    constructor(@Inject() private readonly router: RouterService, @Inject() private readonly app: AppService) {}

    onInit(): void {
        console.log('app component on init');
    }

    @Listen('click', '.navigate-home')
    onClickTest(): void {
        this.router.navigate('/home');
    }

    @Listen('click', '.navigate-profile')
    onClickApp(): void {
        this.router.navigate('/profile');
    }
}

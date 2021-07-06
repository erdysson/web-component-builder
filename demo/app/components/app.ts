import {Component, Inject, IOnInit, Listen, RouterService, ViewEncapsulation} from 'web-component-builder';

import {AppService} from '../services/app.service';

@Component({
    selector: 'app-root',
    template: `
        <h2>App Component</h2>
        <button type="button" class="navigate-home">Navigate to Home</button>
        <button type="button" class="navigate-profile">Navigate to Profile</button>
        <button type="button" class="navigate-person">Navigate to Person</button>
        <button type="button" class="navigate-person-qp">Navigate to Person with QP</button>
        <router-component></router-component>
    `
})
export class App implements IOnInit {
    constructor(@Inject() private readonly router: RouterService, @Inject() private readonly app: AppService) {}

    onInit(): void {
        console.log('app component on init');
    }

    @Listen('click', '.navigate-home')
    onClickHome(): void {
        this.router.navigate('/home');
    }

    @Listen('click', '.navigate-profile')
    onClickProfile(): void {
        this.router.navigate('/profile');
    }

    @Listen('click', '.navigate-person')
    onClickPerson(): void {
        const id = Math.ceil(Math.random() * 100);
        console.log('generated random id', id);
        this.router.navigate('/person/' + id);
    }

    @Listen('click', '.navigate-person-qp')
    onClickPersonQueryParams(): void {
        const id = Math.ceil(Math.random() * 100);
        console.log('generated random id for qp', id);
        this.router.navigate(`/person/${id}?qp=true&num=5`);
    }
}

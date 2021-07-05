import {Routes} from 'web-component-builder';

import {App} from './components/app';
import {Home} from './components/home';
import {Profile} from './components/profile';

export const appRoutes: Routes = [
    {
        path: '/',
        component: App
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/profile',
        component: Profile
    }
];

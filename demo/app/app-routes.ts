import {Routes} from 'web-component-builder';

import {Home} from './components/home';
import {Person} from './components/person';
import {Profile} from './components/profile';

export const appRoutes: Routes = [
    {
        path: '/home',
        component: Home
    },
    {
        path: '/profile',
        component: Profile
    },
    {
        path: '/person/:id',
        component: Person
    },
    {
        path: '*',
        redirectTo: '/home'
    }
];

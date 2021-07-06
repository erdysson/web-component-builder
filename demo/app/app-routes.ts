import {Routes} from 'web-component-builder';

import {Home} from './components/home';
import {Person} from './components/person';
import {Profile} from './components/profile';
import {PersonGuard} from './services/person.guard';

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
        component: Person,
        canActivate: [PersonGuard],
        resolve: {
            test: () => Promise.resolve('test'),
            fail: () => Promise.reject('failed')
        }
    },
    {
        path: '*',
        redirectTo: '/home'
    }
];

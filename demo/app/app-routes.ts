import {Routes} from 'web-component-builder';

import {Home} from './components/home';
import {Person} from './components/person';
import {Profile} from './components/profile';
import {PersonGuard} from './services/person.guard';
import {ProfileResolve} from './services/profile.resolve';

export const appRoutes: Routes = [
    {
        path: '/home',
        component: Home
    },
    {
        path: '/profile',
        component: Profile,
        resolve: {
            language: ProfileResolve
        }
    },
    {
        path: '/person/:id',
        component: Person,
        canActivate: [PersonGuard]
    },
    {
        path: '*',
        redirectTo: '/home'
    }
];

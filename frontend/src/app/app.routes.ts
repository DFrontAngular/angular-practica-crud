import { Routes } from "@angular/router";
import { Home } from "./pages/home/home";
import { Details } from "./pages/details/details";
import { Form } from "./pages/form/form";
import { NotFound } from "./pages/not-found/not-found";

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path:'details/:id',
        component: Details
    },
    {
        path:'form',
        component: Form
    },
    {
        path:'form/:id',
        component: Form
    },
    {
        path:'**',
        component: NotFound
    }
]
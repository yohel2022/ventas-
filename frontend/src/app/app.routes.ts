import { Routes } from '@angular/router';
import { CategoriesListComponent } from './modules/categories/categories-list/categories-list.component';
import { CategoryFormComponent } from './modules/categories/category-form/category-form.component';
import { ProductsListComponent } from './modules/products/products-list/products-list.component';
import { ProductFormComponent } from './modules/products/product-form/product-form.component';
import { ClientsListComponent } from './modules/clients/clients-list/clients-list.component';
import { ClientFormComponent } from './modules/clients/client-form/client-form.component';
import { SalesListComponent } from './modules/sales/sales-list/sales-list.component';
import { SaleFormComponent } from './modules/sales/sale-form/sale-form.component';

export const routes: Routes = [
    // Ruta por defecto
    { path: '', redirectTo: '/categories', pathMatch: 'full' },

    // Rutas de Categorías
    { path: 'categories', component: CategoriesListComponent },
    { path: 'categories/new', component: CategoryFormComponent },
    { path: 'categories/edit/:id', component: CategoryFormComponent },

    // Rutas de Productos
    { path: 'products', component: ProductsListComponent },
    { path: 'products/new', component: ProductFormComponent },
    { path: 'products/edit/:id', component: ProductFormComponent },

    // Rutas de Clientes
    { path: 'clients', component: ClientsListComponent },
    { path: 'clients/new', component: ClientFormComponent },
    { path: 'clients/edit/:id', component: ClientFormComponent },

    // Rutas de Ventas
    { path: 'sales', component: SalesListComponent },
    { path: 'sales/new', component: SaleFormComponent },

    // Ruta para página no encontrada
    { path: '**', redirectTo: '/categories' }
];
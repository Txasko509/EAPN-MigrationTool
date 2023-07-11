import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home/home.component';
import { DecisionTreeListComponent } from './features/decision-trees/decision-tree-list/decision-tree-list.component';
import { ErrorComponent } from 'src/core/error/error.component';
import { PageNotFoundComponent } from './features/generic-pages/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: DecisionTreeListComponent/*, canActivate: [AuthGuard] */},
  { path: 'home', component: HomeComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'decision-trees', component: DecisionTreeListComponent/*, canActivate: [AuthGuard]*/},
 // { path: 'log-in', component: LogInComponent},
 // { path: 'admin/users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent }, 
  //{ path: 'unauthorized', component: PageNotAuthorizedComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

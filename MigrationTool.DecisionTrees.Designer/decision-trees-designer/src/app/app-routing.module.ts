import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home/home.component';
import { DecisionTreeListComponent } from './features/decision-trees/decision-tree-list/decision-tree-list.component';
import { ErrorComponent } from 'src/core/error/error.component';
import { PageNotFoundComponent } from './features/generic-pages/page-not-found/page-not-found.component';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { LogInComponent } from './features/auth/log-in/log-in.component';
import { PageNotAuthorizedComponent } from './features/generic-pages/page-not-authorized/page-not-authorized.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'decision-trees', component: DecisionTreeListComponent, canActivate: [AuthGuard]},
  { path: 'log-in', component: LogInComponent},
  { path: 'error', component: ErrorComponent }, 
  { path: 'unauthorized', component: PageNotAuthorizedComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

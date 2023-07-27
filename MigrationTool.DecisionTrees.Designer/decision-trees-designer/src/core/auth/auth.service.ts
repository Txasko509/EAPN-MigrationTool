import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

const LISTA_URL = '/lista';
@Injectable({ providedIn: 'root' })
export class AuthService {
    private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

    private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
    public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

    private loadedUserProfileSubject$ = new BehaviorSubject<any>({});
    loadedUserProfile$ = this.loadedUserProfileSubject$.asObservable();

    private isLoggedOutSubject$ = new BehaviorSubject<boolean>(false);
    public isLoggedOut$ = this.isLoggedOutSubject$.asObservable();

    private isTokenExpiredSubject$ = new BehaviorSubject<boolean>(false);
    public isTokenExpired$ = this.isTokenExpiredSubject$.asObservable();

    /**
       * Publishes `true` if and only if (a) all the asynchronous initial
       * login calls have completed or errorred, and (b) the user ended up
       * being authenticated.
       *
       * In essence, it combines:
       *
       * - the latest known state of whether the user is authorized
       * - whether the ajax calls for initial log in have all been done
       */
    public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
        this.isAuthenticated$,
        this.isDoneLoading$
    ]).pipe(map(values => values.every(b => b)));


    private navigateToLoginPage() {
        // TODO: Remember current URL
        this.router.navigateByUrl('/login');
    }

    constructor(
        private oAuthService: OAuthService,
        private router: Router,
    ) {
        // Useful for debugging:
        this.oAuthService.events.subscribe(event => {
            if (event instanceof OAuthErrorEvent) {
                console.error('OAuthErrorEvent Object:', event);
            } else {
                console.warn('OAuthEvent Object:', event);
            }
        });

        // This is tricky, as it might cause race conditions (where access_token is set in another
        // tab before everything is said and done there.
        // TODO: Improve this setup. See: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/issues/2
        window.addEventListener('storage', (event) => {
            // The `key` is `null` if the event was caused by `.clear()`
            if (event.key !== 'access_token' && event.key !== null) {
                return;
            }

            console.warn('Noticed changes to access_token (most likely from another tab), updating isAuthenticated');
            this.isAuthenticatedSubject$.next(this.oAuthService.hasValidAccessToken());

            if (!this.oAuthService.hasValidAccessToken()) {
                this.navigateToLoginPage();
            }
        });

        this.oAuthService.events
            .subscribe(_ => {
                this.isAuthenticatedSubject$.next(this.oAuthService.hasValidAccessToken());
            });

        this.oAuthService.events
            .pipe(filter(e => ['token_received'].includes(e.type)))
            .subscribe(e => {
                this.oAuthService.loadUserProfile().then((result) => {
                    // Using the loaded user data
                    this.loadedUserProfileSubject$.next(result);
                });
            });

        this.oAuthService.events
            .pipe(filter(e => ['token_expires'].includes(e.type)))
            .subscribe(e => {
                this.isTokenExpiredSubject$.next(true);
            });

        this.oAuthService.events
            .pipe(filter(e => ['session_terminated', 'session_error', 'logout'].includes(e.type)))
            .subscribe(e =>
                this.isLoggedOutSubject$.next(true));

        this.oAuthService.events.subscribe(event => {
            console.info(event);
        });

        this.oAuthService.events
            .pipe(filter(e => ['session_terminated', 'session_error'].includes(e.type)))
            .subscribe(e =>
                this.navigateToLoginPage());

        this.oAuthService.setupAutomaticSilentRefresh();
    }

    public runInitialLoginSequence(): Promise<void> {
        if (location.hash) {
            console.log('Encountered hash fragment, plotting as table...');
            console.table(location.hash.substr(1).split('&').map(kvp => kvp.split('=')));
        }

        // 0. LOAD CONFIG:
        // First we have to check to see how the IdServer is
        // currently configured:
        return this.oAuthService.loadDiscoveryDocument()

            // For demo purposes, we pretend the previous call was very slow
            .then(() => new Promise<void>(resolve => setTimeout(() => resolve(), 1000)))

            // 1. HASH LOGIN:
            // Try to log in via hash fragment after redirect back
            // from IdServer from initImplicitFlow:
            .then(() => this.oAuthService.tryLogin())

            .then(() => {
                if (this.oAuthService.hasValidAccessToken()) {
                    return Promise.resolve();
                }

                // 2. SILENT LOGIN:
                // Try to log in via a refresh because then we can prevent
                // needing to redirect the user:
                return this.oAuthService.silentRefresh()
                    .then(() => Promise.resolve())
                    .catch(result => {
                        // Subset of situations from https://openid.net/specs/openid-connect-core-1_0.html#AuthError
                        // Only the ones where it's reasonably sure that sending the
                        // user to the IdServer will help.
                        const errorResponsesRequiringUserInteraction = [
                            'interaction_required',
                            'login_required',
                            'account_selection_required',
                            'consent_required',
                        ];

                        if (result
                            && result.reason
                            && errorResponsesRequiringUserInteraction.indexOf(result.reason.error) >= 0) {

                            // 3. ASK FOR LOGIN:
                            // At this point we know for sure that we have to ask the
                            // user to log in, so we redirect them to the IdServer to
                            // enter credentials.
                            //
                            // Enable this to ALWAYS force a user to login.
                            // this.login();
                            //
                            // Instead, we'll now do this:
                            console.warn('User interaction is needed to log in, we will wait for the user to manually log in.');
                            return Promise.resolve();
                        }

                        // We can't handle the truth, just pass on the problem to the
                        // next handler.
                        return Promise.reject(result);
                    });
            })

            .then(() => {
                this.isDoneLoadingSubject$.next(true);

                // Check for the strings 'undefined' and 'null' just to be sure. Our current
                // login(...) should never have this, but in case someone ever calls
                // initImplicitFlow(undefined | null) this could happen.
                if (this.oAuthService.state && this.oAuthService.state !== 'undefined' && this.oAuthService.state !== 'null') {
                    let stateUrl = this.oAuthService.state;
                    if (stateUrl.startsWith('/') === false) {
                        stateUrl = decodeURIComponent(stateUrl);
                    }
                    console.log(`There was state of ${this.oAuthService.state}, so we are sending you to: ${stateUrl}`);
                    this.router.navigateByUrl(stateUrl);
                }
            })
            .catch(() => this.isDoneLoadingSubject$.next(true));
    }

    public login2(targetUrl?: string) {
        // Note: before version 9.1.0 of the library you needed to
        // call encodeURIComponent on the argument to the method.
        this.oAuthService.initLoginFlow(targetUrl || LISTA_URL);
    }

    public login(userName: string, password: string): Promise<void> {

        return this.oAuthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(userName, password).then((resp) => {
            Promise.resolve();

        }).then(() => {
            // Using the loaded user data
        });
    }

    public loadUserProfile(): Promise<void> {

        return this.oAuthService.loadUserProfile().then((result) => {
            // Using the loaded user data
            this.loadedUserProfileSubject$.next(result);

            Promise.resolve();

        }).then(() => {
            // Using the loaded user data
        });
    }

    public logout() { this.oAuthService.logOut(); }
    public refresh() { this.oAuthService.silentRefresh(); }
    public hasValidToken() { return this.oAuthService.hasValidAccessToken(); }

    // These normally won't be exposed from a service like this, but
    // for debugging it makes sense.
    public get accessToken() { return this.oAuthService.getAccessToken(); }
    public get refreshToken() { return this.oAuthService.getRefreshToken(); }
    public get identityClaims() { return this.oAuthService.getIdentityClaims(); }
    public get idToken() { return this.oAuthService.getIdToken(); }
    public get logoutUrl() { return this.oAuthService.logoutUrl; }
}
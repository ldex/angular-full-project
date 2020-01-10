import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CacheRouteReuseStrategy implements RouteReuseStrategy {

    storedRouteHandles = new Map<string, DetachedRouteHandle>();

    // This object contains the list of pages we want to cache
    allowRetriveCache = {
        'products': true
    };

    // Determines if a route should be reused
    shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // We only want to get the cached products list page:
        // - if user comes from the product details page
        // - and we do not force a refresh
        if (this.getPath(before) === 'products/:id' && !curr.queryParamMap.has("refresh") && this.getPath(curr) === 'products') {
            this.allowRetriveCache['products'] = true;
        } else {
            this.allowRetriveCache['products'] = false;
        }
        return before.routeConfig === curr.routeConfig;
    }

    // Determines if this route (and its subtree) should be reattached
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getPath(route);
        if (this.allowRetriveCache[path]) {
            return this.storedRouteHandles.has(this.getPath(route));
        }
        return false;
    }

    // Determines if this route (and its subtree) should be detached to be reused later
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getPath(route);
        if (this.allowRetriveCache.hasOwnProperty(path)) {
            return true;
        }
        return false;
    }

    // Stores the detached route
    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        this.storedRouteHandles.set(this.getPath(route), detachedTree);
    }

    // Retrieves the previously stored route
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle;
    }

    private getPath(route: ActivatedRouteSnapshot): string {
        return route.pathFromRoot
                .map((el: ActivatedRouteSnapshot) => el.routeConfig ? el.routeConfig.path : '')
                .filter(str => str.length > 0)
                .join('/');
    }
}
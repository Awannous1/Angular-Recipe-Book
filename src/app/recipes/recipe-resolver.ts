import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable, map, of, switchMap, take } from "rxjs";
// import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import * as RecipesActions from '../recipes/store/recipe.actions';


export const recipeResolver: ResolveFn<Recipe[] | Observable<Recipe[]> | void> =

(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
Recipe[] | Observable<Recipe[]> | void => {

  // const dataStorageService = inject(DataStorageService);
  const recipeService = inject(RecipeService);
  const store = inject(Store);
  const actions$ = inject(Actions);


  // const recipes = recipeService.getRecipes();

  // if (recipes.length === 0) {
  //   return dataStorageService.fetchRecipes();
  // } else {
  //   return recipes;
  // }
  return store.select('recipes').pipe(
    take(1),
    map(recipeState => {
    return recipeState.recipes;
  }),
  switchMap(recipes => {
    if(recipes.length === 0) {
      store.dispatch( new RecipesActions.FetchRecipes());
  return actions$.pipe(
    ofType(
      RecipesActions.SET_RECIPES),
  take(1)
  );
    }else {
      return of(recipes);
    }
  })
  );
}

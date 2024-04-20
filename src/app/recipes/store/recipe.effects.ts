import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as RecipesActions from './recipe.actions';
import { map, switchMap, withLatestFrom } from "rxjs";
import { Recipe } from "../recipe.model";
import * as fromApp from '../../store/app.reducer';
import { Store } from "@ngrx/store";



export const fetchRecipes = createEffect(
  (
    actions$ = inject(Actions),
    http = inject(HttpClient),
  )=> {
    return actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(
        () => {
          return http.get<Recipe[]>(
            'https://rg-course-recipe-book-bc1ec-default-rtdb.firebaseio.com/recipes.json',
          );
        }),
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
              }),
    map( recipes => {
      return new RecipesActions.SetRecipes(recipes);
    }),
  )},
  { functional: true }
  );

  export const StoreRecipes = createEffect(
    (actions$ = inject(Actions),
    http = inject(HttpClient),
    store = inject(Store<fromApp.AppState>)
    ) => {
      return actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
          return http.put(
            'https://rg-course-recipe-book-bc1ec-default-rtdb.firebaseio.com/recipes.json',
            recipesState.recipes
          );
        })
        )
  },
  {functional: true, dispatch: false}
  );

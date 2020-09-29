import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataStorageService } from '../shared/services/data-storage.service';
import { RecipeService } from '../shared/services/recipe.service';

import { Recipe } from './recipe.model';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
    
    constructor(private dataStorage: DataStorageService,
                private recipesService: RecipeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const recipes = this.recipesService.getRecipes();
        
        if(recipes.length === 0) {
            return this.dataStorage.fetchRecipes();
        } else {
            return recipes;
        }
    }
}
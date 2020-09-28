import {  Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from 'src/app/recipes/recipe.model';
import { Ingredient } from '../ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Injectable({providedIn: 'root'})
export class RecipeService {

    recipesChanged = new Subject<Recipe[]>();

    private recipes:Recipe[] = [
        new Recipe(
            'Tasty Snitchell', 
            'An amazing snitchell just sublime', 
            'https://www.seriouseats.com/2020/05/20200504-vegetable-pancakes-sho-spaeth1.jpg',
            [
                new Ingredient('Meat', 1),
                new Ingredient('French Fries', 20)
            ]),
        new Recipe(
            'Vegetable stew', 
            'Healthy oriental dish what else!', 
            'https://realfood.tesco.com/media/images/RFO-380x250-SouthwestOnePot-2ac5fe2a-450b-48ff-9a08-cf52095f8f16-0-380x250.jpg',
            [
                new Ingredient('Tomatoes', 3),
                new Ingredient('Onions', 20)
            ]),
        new Recipe(
            'Chicken salad', 
            'great breakfast dish', 
            'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/chicken-fajitas-horizontal-jpg-1522721531.jpg',
            [                
                new Ingredient('Chicken breast', 1),
                new Ingredient('Lettuce', 3)
            ])
    ];

    constructor(private shoppingListService:ShoppingListService){}

    getRecipe(index: number) {
        return this.recipes[index];
    }

    getRecipes(){
        return this.recipes.slice();
    }

    onAddToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }
    
    updateRecipe(index: number, recipe:Recipe) {
        this.recipes[index] = recipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index:number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}
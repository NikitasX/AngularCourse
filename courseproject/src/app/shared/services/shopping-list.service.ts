import {  Injectable } from '@angular/core';
import { Ingredient } from '../ingredient.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    getIngredients() {
        return this.ingredients.slice();
    }

    addIngredient(newIngredient:Ingredient) {
        this.ingredients.push(newIngredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}
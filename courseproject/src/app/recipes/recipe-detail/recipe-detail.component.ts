import { Component, Input, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/shared/services/recipe.service';
import { ShoppingListService } from 'src/app/shared/services/shopping-list.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  @Input() recipe: Recipe;

  constructor(private recipeService:RecipeService) { }

  ngOnInit(): void {
  }

  onAddToShoppingList() {
    this.recipeService.onAddToShoppingList(this.recipe.ingredients);
    // for (let newIngredient of this.recipe.ingredients) {
    //   this.shoppingListService.addIngredient(newIngredient);
    // }
    // console.log(this.shoppingListService.getIngredients())
  }

}

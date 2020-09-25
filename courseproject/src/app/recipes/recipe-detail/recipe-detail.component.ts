import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from 'src/app/shared/services/recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number;

  constructor(private recipeService:RecipeService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      });
  }

  onAddToShoppingList() {
    this.recipeService.onAddToShoppingList(this.recipe.ingredients);
    // for (let newIngredient of this.recipe.ingredients) {
    //   this.shoppingListService.addIngredient(newIngredient);
    // }
    // console.log(this.shoppingListService.getIngredients())
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

}

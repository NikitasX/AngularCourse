import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  @Output() recipeDetails = new EventEmitter<Recipe>();

  recipes:Recipe[] = [
    new Recipe('Test Recipe', 'Some desc', 'https://www.seriouseats.com/2020/05/20200504-vegetable-pancakes-sho-spaeth1.jpg'),
    new Recipe('Test Recipe2', 'Some desc', 'https://realfood.tesco.com/media/images/RFO-380x250-SouthwestOnePot-2ac5fe2a-450b-48ff-9a08-cf52095f8f16-0-380x250.jpg'),
    new Recipe('Test Recipe3', 'Some desc', 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/chicken-fajitas-horizontal-jpg-1522721531.jpg')
  ];



  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(outRecipe:Recipe) {
    this.recipeDetails.emit(outRecipe);
  }

}

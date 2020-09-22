import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  recipes:Recipe[] = [
    new Recipe('Test Recipe', 'Some desc', 'https://www.seriouseats.com/2020/05/20200504-vegetable-pancakes-sho-spaeth1.jpg')
  ];



  constructor() { }

  ngOnInit(): void {
  }

}

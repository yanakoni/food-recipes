import { Ingredient } from './ingredient';

type Meal = {
  id: number;
  name: string;
  recipeSource: string;
  instructions: string;
  youtubeLink: string;
  mealThumb: string;
  categoryName: string[];
  areaName: string;
  tags?: string[];
  ingredients: Ingredient[];
};

export type { Meal };

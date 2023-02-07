import { Meal } from './meal';

type Ingredient = {
  id: number;
  ingredientName: string;
  measure: number;
  mealId: Meal['id'];
};

type UserIngredient = {
  ingredientName: string;
  measure: number;
};

export type { Ingredient, UserIngredient };

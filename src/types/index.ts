export type User = {
  id: string;
  name: string;
  email: string;
  skinType?: SkinType;
  skinConcerns?: SkinConcern[];
  allergies?: string[];
};

export enum SkinType {
  Dry = 'dry',
  Oily = 'oily',
  Combination = 'combination',
  Normal = 'normal',
  Sensitive = 'sensitive'
}

export enum SkinConcern {
  Acne = 'acne',
  Aging = 'aging',
  Dryness = 'dryness',
  Redness = 'redness',
  Hyperpigmentation = 'hyperpigmentation',
  Sensitivity = 'sensitivity',
  Dullness = 'dullness'
}

export type FacialAnalysisResult = {
  id: string;
  userId: string;
  imageUrl: string;
  date: Date;
  issues: {
    acne?: number;
    dryness?: number;
    redness?: number;
    pigmentation?: number;
    wrinkles?: number;
  };
  overallScore: number;
};

export type IngredientAnalysis = {
  name: string;
  safety: 'safe' | 'caution' | 'avoid';
  function: string;
  concerns?: string;
  alternatives?: string[];
};

export type SkincareRoutine = {
  id: string;
  userId: string;
  name: string;
  morning: RoutineStep[];
  evening: RoutineStep[];
  createdAt: Date;
  updatedAt: Date;
};

export type RoutineStep = {
  id: string;
  order: number;
  productType: string;
  productName?: string;
  ingredients?: string[];
  instructions: string;
};

export type QuickFix = {
  concern: string;
  solution: string;
  ingredients: string[];
  instructions: string;
};

export type ProgressEntry = {
  id: string;
  userId: string;
  imageUrl: string;
  date: Date;
  notes?: string;
};
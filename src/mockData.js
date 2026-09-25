export const INITIAL_PANTRY = [
  { id: 'staple-1', name: 'eggs', expiringSoon: false },
  { id: 'staple-2', name: 'spinach', expiringSoon: true },
  { id: 'staple-3', name: 'garlic', expiringSoon: false },
  { id: 'staple-4', name: 'rice', expiringSoon: false },
  { id: 'staple-5', name: 'soy sauce', expiringSoon: false },
  { id: 'staple-6', name: 'chicken breast', expiringSoon: false },
];

export const COMMON_STAPLES = [
  { name: 'eggs', emoji: '🥚' },
  { name: 'rice', emoji: '🍚' },
  { name: 'garlic', emoji: '🧄' },
  { name: 'olive oil', emoji: '🫒' },
  { name: 'onion', emoji: '🧅' },
  { name: 'butter', emoji: '🧈' },
];

export const DIETARY_OPTIONS = [
  { id: 'Vegetarian', label: 'Vegetarian', icon: '🥗' },
  { id: 'Vegan', label: 'Vegan', icon: '🌱' },
  { id: 'Gluten-Free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'Kosher', label: 'Kosher', icon: '✡️' },
  { id: 'Halal', label: 'Halal', icon: '🌙' },
  { id: 'Quick (<30min)', label: 'Quick (<30min)', icon: '⚡' },
];

export const SEED_RECIPES = [
  {
    id: 'rec-1',
    name: 'Garlic Chicken & Spinach Rice Bowl',
    hook: 'Sizzling pan-seared chicken breast tossed with wilted spinach over fragrant garlic-infused rice.',
    matchedIngredients: ['chicken breast', 'spinach', 'garlic', 'rice', 'soy sauce'],
    missingIngredients: ['sesame oil', 'green onion'],
    matchScore: 0.85,
    cookTime: '22 min',
    difficulty: 'Easy',
    servings: '2 servings',
    dietaryTags: ['Quick (<30min)', 'High Protein'],
    steps: [
      'Rinse rice and bring to a simmer with water and a pinch of salt until tender and fluffy.',
      'Thinly slice chicken breast and marinate in 1 tbsp soy sauce and 2 minced garlic cloves for 5 minutes.',
      'Heat 1 tbsp oil in a skillet over medium-high heat. Sear chicken until golden brown and cooked through (5-6 min).',
      'Toss in fresh spinach and remaining minced garlic. Stir-fry for 60 seconds until the spinach is just wilted and vibrant green.',
      'Spoon fluffy rice into wide bowls, top with the chicken and garlicky spinach, and drizzle pan juices over top.'
    ],
    substitutionTip: 'Out of soy sauce? Tamari or coconut aminos work wonders, or seasoned chicken broth with a squeeze of lemon.'
  },
  {
    id: 'rec-2',
    name: 'Crispy Garlic Egg Fried Rice',
    hook: 'The quintessential comfort meal: fluffy day-old rice crisping in garlic oil with golden scrambled eggs and wilted greens.',
    matchedIngredients: ['rice', 'eggs', 'garlic', 'soy sauce', 'spinach'],
    missingIngredients: ['toasted sesame seeds'],
    matchScore: 0.90,
    cookTime: '15 min',
    difficulty: 'Easy',
    servings: '2 servings',
    dietaryTags: ['Vegetarian', 'Quick (<30min)'],
    steps: [
      'In a small bowl, beat 3 eggs with a splash of soy sauce.',
      'Heat oil in a wok or heavy nonstick pan over medium-high heat. Pour in eggs and scramble gently until just set, then slide onto a plate.',
      'Add another splash of oil and minced garlic, sautéing for 30 seconds until deeply aromatic.',
      'Add cold cooked rice, breaking up clumps with a wooden spatula. Toss vigorously until grains are hot and slightly crisp.',
      'Fold in fresh spinach and reserved scrambled eggs, drizzling 2 tsp soy sauce around the rim of the pan for caramelization.'
    ],
    substitutionTip: 'Fresh rice too sticky? Spread it on a baking sheet and pop it in the freezer for 10 minutes to dry out.'
  },
  {
    id: 'rec-3',
    name: 'Steamed Chicken with Ginger-Garlic & Soy',
    hook: 'Tender poached chicken breast steeped in savory soy-garlic aromatics alongside tender wilted spinach.',
    matchedIngredients: ['chicken breast', 'garlic', 'soy sauce', 'spinach'],
    missingIngredients: ['ginger', 'chili oil'],
    matchScore: 0.75,
    cookTime: '25 min',
    difficulty: 'Medium',
    servings: '2 servings',
    dietaryTags: ['High Protein', 'Gluten-Free Available'],
    steps: [
      'Gently pound chicken breasts to uniform thickness and score lightly with diagonal cuts.',
      'Combine minced garlic, soy sauce, and 1/4 cup water in a shallow heat-proof dish.',
      'Place chicken in the dish and steam over simmering water in a covered pot or steamer for 14-16 minutes until internal temperature hits 165°F.',
      'During the last 2 minutes, arrange spinach leaves around the chicken to gently steam in the aromatic juices.',
      'Rest for 3 minutes, slice into medallions, and spoon the warm savory sauce all over.'
    ],
    substitutionTip: 'Want extra punch? Add a pinch of crushed red pepper flakes or cracked black pepper to the soy broth.'
  },
  {
    id: 'rec-4',
    name: 'Japanese Oyakodon (Chicken & Egg Rice Bowl)',
    hook: 'Simmered tender chicken and soft-set eggs bathed in a sweet-savory soy broth, served steaming over rice.',
    matchedIngredients: ['chicken breast', 'eggs', 'soy sauce', 'rice', 'garlic'],
    missingIngredients: ['mirin or sugar', 'dashi or chicken broth'],
    matchScore: 0.80,
    cookTime: '18 min',
    difficulty: 'Easy',
    servings: '2 servings',
    dietaryTags: ['Quick (<30min)', 'High Protein'],
    steps: [
      'In a small skillet, simmer 1/3 cup broth, 2 tbsp soy sauce, and 1 tsp sugar or honey with minced garlic.',
      'Cut chicken breast into bite-sized cubes and arrange in a single layer in the simmering broth. Cook for 4 minutes until no longer pink.',
      'Lightly beat 2 eggs (do not overmix; streaks of yolk and white are traditional).',
      'Pour two-thirds of the beaten eggs evenly over the chicken. Cover with a lid and simmer for 1 minute on low.',
      'Pour remaining egg over top, cover for 30 seconds until barely set and glossy, then slide over steaming hot bowls of rice.'
    ],
    substitutionTip: 'No mirin? Use 1 tablespoon water with 1 teaspoon brown sugar or maple syrup for sweet depth.'
  }
];

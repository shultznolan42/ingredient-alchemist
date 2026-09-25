export const INGREDIENTS_CATALOG = [
  // Produce / Veggies & Herbs
  { name: 'spinach', category: 'Vegetable', emoji: '🥬', keywords: ['greens', 'leafy'] },
  { name: 'garlic', category: 'Aromatic', emoji: '🧄', keywords: ['clove'] },
  { name: 'onion', category: 'Aromatic', emoji: '🧅', keywords: ['yellow onion', 'white onion'] },
  { name: 'red onion', category: 'Aromatic', emoji: '🧅', keywords: ['purple onion', 'salad'] },
  { name: 'green onion', category: 'Aromatic', emoji: '🌱', keywords: ['scallion', 'spring onion'] },
  { name: 'tomato', category: 'Vegetable', emoji: '🍅', keywords: ['fresh tomato'] },
  { name: 'cherry tomatoes', category: 'Vegetable', emoji: '🍅', keywords: ['grape tomatoes'] },
  { name: 'potato', category: 'Vegetable', emoji: '🥔', keywords: ['russet', 'yukon', 'spud'] },
  { name: 'sweet potato', category: 'Vegetable', emoji: '🍠', keywords: ['yam'] },
  { name: 'bell pepper', category: 'Vegetable', emoji: '🫑', keywords: ['capsicum', 'sweet pepper'] },
  { name: 'jalapeño', category: 'Vegetable', emoji: '🌶️', keywords: ['hot pepper', 'spicy'] },
  { name: 'chili pepper', category: 'Vegetable', emoji: '🌶️', keywords: ['red pepper', 'spicy'] },
  { name: 'broccoli', category: 'Vegetable', emoji: '🥦', keywords: ['florets'] },
  { name: 'cauliflower', category: 'Vegetable', emoji: '🥦', keywords: ['florets'] },
  { name: 'carrot', category: 'Vegetable', emoji: '🥕', keywords: ['carrots'] },
  { name: 'celery', category: 'Vegetable', emoji: '🥬', keywords: ['stalk'] },
  { name: 'cucumber', category: 'Vegetable', emoji: '🥒', keywords: ['salad'] },
  { name: 'zucchini', category: 'Vegetable', emoji: '🥒', keywords: ['courgette'] },
  { name: 'mushroom', category: 'Vegetable', emoji: '🍄', keywords: ['cremini', 'button', 'portobello'] },
  { name: 'cabbage', category: 'Vegetable', emoji: '🥬', keywords: ['coleslaw', 'green cabbage'] },
  { name: 'kale', category: 'Vegetable', emoji: '🥬', keywords: ['curly kale', 'greens'] },
  { name: 'asparagus', category: 'Vegetable', emoji: '🥦', keywords: ['spears'] },
  { name: 'avocado', category: 'Produce', emoji: '🥑', keywords: ['guacamole'] },
  { name: 'corn', category: 'Vegetable', emoji: '🌽', keywords: ['sweet corn'] },
  { name: 'peas', category: 'Vegetable', emoji: '🫛', keywords: ['green peas'] },
  { name: 'green beans', category: 'Vegetable', emoji: '🫛', keywords: ['string beans'] },
  { name: 'ginger', category: 'Aromatic', emoji: '🫚', keywords: ['fresh ginger root'] },
  { name: 'cilantro', category: 'Herb', emoji: '🌿', keywords: ['coriander'] },
  { name: 'basil', category: 'Herb', emoji: '🌿', keywords: ['fresh basil', 'pesto'] },
  { name: 'parsley', category: 'Herb', emoji: '🌿', keywords: ['flat leaf parsley'] },
  { name: 'rosemary', category: 'Herb', emoji: '🌿', keywords: ['fresh rosemary'] },
  { name: 'thyme', category: 'Herb', emoji: '🌿', keywords: ['fresh thyme'] },
  { name: 'lemon', category: 'Citrus', emoji: '🍋', keywords: ['citrus', 'lemon juice'] },
  { name: 'lime', category: 'Citrus', emoji: '🍈', keywords: ['citrus', 'lime juice'] },

  // Proteins & Meats
  { name: 'eggs', category: 'Protein', emoji: '🥚', keywords: ['egg', 'egg whites'] },
  { name: 'chicken breast', category: 'Poultry', emoji: '🍗', keywords: ['chicken', 'white meat'] },
  { name: 'chicken thighs', category: 'Poultry', emoji: '🍗', keywords: ['dark meat', 'chicken'] },
  { name: 'ground beef', category: 'Meat', emoji: '🥩', keywords: ['minced beef', 'hamburger'] },
  { name: 'steak', category: 'Meat', emoji: '🥩', keywords: ['beef steak', 'sirloin', 'ribeye'] },
  { name: 'pork chops', category: 'Meat', emoji: '🥩', keywords: ['pork'] },
  { name: 'bacon', category: 'Meat', emoji: '🥓', keywords: ['pork belly', 'crispy'] },
  { name: 'salmon', category: 'Seafood', emoji: '🐟', keywords: ['salmon fillet', 'fish'] },
  { name: 'shrimp', category: 'Seafood', emoji: '🦐', keywords: ['prawns', 'shellfish'] },
  { name: 'canned tuna', category: 'Seafood', emoji: '🐟', keywords: ['tuna fish'] },
  { name: 'tofu', category: 'Plant Protein', emoji: '🧊', keywords: ['bean curd', 'firm tofu'] },
  { name: 'tempeh', category: 'Plant Protein', emoji: '🌱', keywords: ['soy'] },

  // Dairy & Cheeses
  { name: 'butter', category: 'Dairy', emoji: '🧈', keywords: ['salted butter', 'unsalted butter'] },
  { name: 'cheddar cheese', category: 'Dairy', emoji: '🧀', keywords: ['sharp cheddar', 'cheese'] },
  { name: 'mozzarella', category: 'Dairy', emoji: '🧀', keywords: ['pizza cheese', 'fresh mozzarella'] },
  { name: 'parmesan', category: 'Dairy', emoji: '🧀', keywords: ['parmigiano', 'grated cheese'] },
  { name: 'feta cheese', category: 'Dairy', emoji: '🧀', keywords: ['crumbled feta', 'greek'] },
  { name: 'milk', category: 'Dairy', emoji: '🥛', keywords: ['whole milk', 'oat milk', 'almond milk'] },
  { name: 'heavy cream', category: 'Dairy', emoji: '🥛', keywords: ['whipping cream'] },
  { name: 'greek yogurt', category: 'Dairy', emoji: '🥣', keywords: ['yogurt', 'plain yogurt'] },
  { name: 'cream cheese', category: 'Dairy', emoji: '🧀', keywords: ['schmear'] },

  // Grains, Pastas & Legumes
  { name: 'rice', category: 'Grains', emoji: '🍚', keywords: ['white rice', 'jasmine rice', 'basmati'] },
  { name: 'brown rice', category: 'Grains', emoji: '🍚', keywords: ['whole grain rice'] },
  { name: 'pasta', category: 'Grains', emoji: '🍝', keywords: ['spaghetti', 'penne', 'noodles'] },
  { name: 'ramen noodles', category: 'Grains', emoji: '🍜', keywords: ['asian noodles'] },
  { name: 'quinoa', category: 'Grains', emoji: '🌾', keywords: ['grain', 'superfood'] },
  { name: 'bread', category: 'Bakery', emoji: '🍞', keywords: ['toast', 'loaf', 'sourdough'] },
  { name: 'tortillas', category: 'Bakery', emoji: '🫓', keywords: ['flour tortilla', 'corn tortilla', 'taco'] },
  { name: 'oats', category: 'Grains', emoji: '🥣', keywords: ['rolled oats', 'oatmeal'] },
  { name: 'chickpeas', category: 'Legume', emoji: '🫘', keywords: ['garbanzo beans'] },
  { name: 'black beans', category: 'Legume', emoji: '🫘', keywords: ['beans', 'canned black beans'] },
  { name: 'lentils', category: 'Legume', emoji: '🫘', keywords: ['brown lentils', 'red lentils'] },
  { name: 'flour', category: 'Baking', emoji: '🌾', keywords: ['all purpose flour'] },

  // Oils, Condiments & Sauces
  { name: 'olive oil', category: 'Oils', emoji: '🫒', keywords: ['extra virgin olive oil'] },
  { name: 'vegetable oil', category: 'Oils', emoji: '🫗', keywords: ['canola oil', 'frying oil'] },
  { name: 'sesame oil', category: 'Oils', emoji: '🫗', keywords: ['toasted sesame oil'] },
  { name: 'soy sauce', category: 'Condiment', emoji: '🍶', keywords: ['shoyu', 'tamari'] },
  { name: 'hot sauce', category: 'Condiment', emoji: '🌶️', keywords: ['sriracha', 'tabasco', 'chili sauce'] },
  { name: 'mustard', category: 'Condiment', emoji: '🌭', keywords: ['dijon mustard', 'yellow mustard'] },
  { name: 'mayonnaise', category: 'Condiment', emoji: '🥣', keywords: ['mayo'] },
  { name: 'honey', category: 'Sweetener', emoji: '🍯', keywords: ['raw honey'] },
  { name: 'maple syrup', category: 'Sweetener', emoji: '🍁', keywords: ['syrup', 'pancake syrup'] },
  { name: 'balsamic vinegar', category: 'Pantry', emoji: '🍇', keywords: ['vinegar', 'glaze'] },
  { name: 'apple cider vinegar', category: 'Pantry', emoji: '🍎', keywords: ['acv', 'vinegar'] },
  { name: 'tomato paste', category: 'Pantry', emoji: '🥫', keywords: ['concentrated tomato'] },
  { name: 'canned tomatoes', category: 'Pantry', emoji: '🥫', keywords: ['diced tomatoes', 'crushed tomatoes'] },
  { name: 'chicken broth', category: 'Pantry', emoji: '🥣', keywords: ['chicken stock', 'bone broth'] },
  { name: 'vegetable broth', category: 'Pantry', emoji: '🥣', keywords: ['veggie stock'] },
  { name: 'coconut milk', category: 'Pantry', emoji: '🥥', keywords: ['canned coconut milk', 'curry'] },
  { name: 'peanut butter', category: 'Pantry', emoji: '🥜', keywords: ['pb', 'spread'] },

  // Spices & Seasonings
  { name: 'black pepper', category: 'Spice', emoji: '🧂', keywords: ['ground pepper', 'peppercorn'] },
  { name: 'sea salt', category: 'Spice', emoji: '🧂', keywords: ['kosher salt', 'table salt'] },
  { name: 'paprika', category: 'Spice', emoji: '🌶️', keywords: ['smoked paprika', 'sweet paprika'] },
  { name: 'cumin', category: 'Spice', emoji: '🌿', keywords: ['ground cumin'] },
  { name: 'oregano', category: 'Spice', emoji: '🌿', keywords: ['dried oregano'] },
  { name: 'chili powder', category: 'Spice', emoji: '🌶️', keywords: ['chili seasoning'] },
  { name: 'cinnamon', category: 'Spice', emoji: '🪵', keywords: ['ground cinnamon'] },
  { name: 'garlic powder', category: 'Spice', emoji: '🧄', keywords: ['dried garlic'] },
  { name: 'onion powder', category: 'Spice', emoji: '🧅', keywords: ['dried onion'] },
  { name: 'red pepper flakes', category: 'Spice', emoji: '🌶️', keywords: ['crushed red pepper'] }
];

/**
 * Searches the catalog with ranking:
 * 1. Exact match
 * 2. Prefix match
 * 3. Word-starts-with match
 * 4. Substring in name
 * 5. Match in keywords
 */
export function searchIngredients(query, currentPantryNames = []) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const pantrySet = new Set(currentPantryNames.map(n => n.toLowerCase().trim()));

  const matches = [];

  for (const item of INGREDIENTS_CATALOG) {
    const itemName = item.name.toLowerCase();
    const inPantry = pantrySet.has(itemName);

    let score = -1;

    if (itemName === q) {
      score = 100;
    } else if (itemName.startsWith(q)) {
      score = 80;
    } else {
      const words = itemName.split(/\s+/);
      if (words.some(w => w.startsWith(q))) {
        score = 60;
      } else if (itemName.includes(q)) {
        score = 40;
      } else if (item.keywords?.some(k => k.toLowerCase().includes(q))) {
        score = 20;
      } else if (item.category?.toLowerCase().startsWith(q)) {
        score = 10;
      }
    }

    if (score > 0) {
      matches.push({
        ...item,
        score,
        inPantry
      });
    }
  }

  // Sort by score descending, then alphabetical
  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return matches.slice(0, 7);
}

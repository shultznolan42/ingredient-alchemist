/**
 * Pantry-aware offline chef. Picks distinct real dishes from the user's
 * ingredients instead of filling the same 4 templates with ingredient names.
 */

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

function prettyFood(name) {
  if (!name) return '';
  const cleaned = name
    .toLowerCase()
    .replace(/\b(breasts?|thighs?|ground|fillets?|cloves?)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.split(' ').map(cap).join(' ');
}

function uniq(list) {
  return [...new Set(list.filter(Boolean))];
}

function shuffle(arr, seed) {
  const copy = [...arr];
  let h = 2166136261;
  const key = String(seed || 'seed');
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  }
  for (let i = copy.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    const j = h % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function firstMatch(list, regex) {
  return list.find((item) => regex.test(item)) || null;
}

function matchesAny(item, regexes) {
  return regexes.some((re) => re.test(item));
}

function analyzePantry(ingredients) {
  const list = ingredients.map((i) => i.toLowerCase().trim()).filter(Boolean);

  const pick = (...regexes) => {
    for (const re of regexes) {
      const hit = firstMatch(list, re);
      if (hit) return hit;
    }
    return null;
  };

  const all = (...regexes) => list.filter((item) => matchesAny(item, regexes));

  const pantry = {
    list,
    chicken: pick(/\bchicken\b/),
    beef: pick(/\bbeef\b/, /\bsteak\b/, /\bground meat\b/),
    pork: pick(/\bpork\b/, /\bbacon\b/, /\bham\b/),
    turkey: pick(/\bturkey\b/),
    fish: pick(/\bsalmon\b/, /\btuna\b/, /\bcod\b/, /\btilapia\b/, /\bfish\b/),
    shrimp: pick(/\bshrimp\b/, /\bprawn\b/),
    tofu: pick(/\btofu\b/, /\btempeh\b/),
    beans: pick(/\bchickpea\b/, /\bblack bean\b/, /\blentil\b/, /\bbean\b/),
    eggs: pick(/\begg/),
    dairy: pick(/\bcheese\b/, /\bparmesan\b/, /\bmozzarella\b/, /\bfeta\b/, /\byogurt\b/, /\bcream\b/, /\bmilk\b/),
    butter: pick(/\bbutter\b/, /\bghee\b/),
    rice: pick(/\brice\b/),
    pasta: pick(/\bpasta\b/, /\bspaghetti\b/, /\bnoodle\b/, /\bramen\b/, /\budon\b/, /\bsoba\b/),
    potato: pick(/\bpotato\b/, /\bsweet potato\b/),
    bread: pick(/\btortilla\b/, /\bbread\b/, /\bpita\b/, /\bwrap\b/, /\bnaan\b/),
    greens: pick(/\bspinach\b/, /\bkale\b/, /\barugula\b/, /\bchard\b/, /\bbok choy\b/, /\bcabbage\b/, /\blettuce\b/),
    tomato: pick(/\btomato\b/),
    onion: pick(/\bonion\b/, /\bshallot\b/, /\bleek\b/, /\bscallion\b/, /\bgreen onion\b/),
    garlic: pick(/\bgarlic\b/),
    ginger: pick(/\bginger\b/),
    soy: pick(/\bsoy sauce\b/, /\btamari\b/, /\bcoconut aminos\b/),
    citrus: pick(/\blemon\b/, /\blime\b/),
    mushroom: pick(/\bmushroom\b/),
    pepper: pick(/\bbell pepper\b/, /\bchili\b/, /\bjalape/, /\bpoblano\b/),
    avocado: pick(/\bavocado\b/),
    coconut: pick(/\bcoconut milk\b/, /\bcoconut cream\b/),
    oil: pick(/\boil\b/),
  };

  pantry.meat = pantry.chicken || pantry.beef || pantry.pork || pantry.turkey;
  pantry.seafood = pantry.fish || pantry.shrimp;
  pantry.protein =
    pantry.meat ||
    pantry.seafood ||
    pantry.tofu ||
    pantry.eggs ||
    pantry.beans ||
    pantry.mushroom;
  pantry.aromatic = pantry.garlic || pantry.onion || pantry.ginger;
  pantry.veg = pantry.greens || pantry.tomato || pantry.pepper || pantry.mushroom || pantry.onion;
  pantry.extras = all(
    /\bherb\b/,
    /\bcumin\b/,
    /\bpaprika\b/,
    /\bchili\b/,
    /\bsesame\b/,
    /\bmiso\b/
  );

  return pantry;
}

function dietFlags(filters) {
  return {
    vegetarian: filters.includes('Vegetarian'),
    vegan: filters.includes('Vegan'),
    glutenFree: filters.includes('Gluten-Free'),
    kosher: filters.includes('Kosher'),
    halal: filters.includes('Halal'),
    quick: filters.includes('Quick (<30min)'),
  };
}

function tags(d, extras = []) {
  return uniq([
    d.vegetarian ? 'Vegetarian' : null,
    d.vegan ? 'Vegan' : null,
    d.glutenFree ? 'Gluten-Free' : null,
    d.kosher ? 'Kosher' : null,
    d.halal ? 'Halal' : null,
    d.quick ? 'Quick (<30min)' : null,
    ...extras,
  ]);
}

function scoreFor(matched, missing, expiringNames) {
  const m = matched.length;
  const n = missing.length;
  let score = m / Math.max(1, m + n);
  if (expiringNames.some((exp) => matched.some((ing) => ing.includes(exp) || exp.includes(ing)))) {
    score = Math.min(0.99, score + 0.1);
  }
  return Math.round(Math.min(0.98, Math.max(0.52, score)) * 100) / 100;
}

function fat(p, d) {
  if (d.vegan) return p.oil || 'olive oil';
  if (d.kosher && p.meat) return p.oil || 'olive oil';
  return p.butter || p.oil || 'olive oil';
}

function soy(p, d) {
  if (d.glutenFree) return p.soy && /tamari|aminos/.test(p.soy) ? p.soy : 'tamari';
  return p.soy || 'soy sauce';
}

function proteinLabel(p, d) {
  if (d.vegan) return p.tofu || p.beans || p.mushroom || 'extra-firm tofu';
  if (d.vegetarian) return p.eggs || p.tofu || p.beans || p.mushroom || 'eggs';
  return p.protein || 'chicken breast';
}

function makeRecipe(base, p, d, expiringNames) {
  const matched = uniq(base.matched.filter((i) => p.list.includes(i)));
  const missing = uniq(base.missing.filter((i) => i && !p.list.includes(i)));
  return {
    id: base.id,
    name: base.name,
    hook: base.hook,
    matchedIngredients: matched.length ? matched : p.list.slice(0, 3),
    missingIngredients: missing.slice(0, 3),
    matchScore: scoreFor(matched, missing, expiringNames),
    cookTime: d.quick ? base.quickTime || '20 min' : base.cookTime,
    difficulty: base.difficulty || 'Easy',
    servings: base.servings || '2 servings',
    dietaryTags: tags(d, base.tags),
    steps: base.steps,
    substitutionTip: base.tip,
  };
}

function buildCandidates(p, d, expiringNames) {
  const protein = proteinLabel(p, d);
  const proteinPretty = prettyFood(protein);
  const greens = p.greens || 'spinach';
  const greensPretty = prettyFood(greens);
  const garlic = p.garlic || 'garlic';
  const onion = p.onion || 'onion';
  const rice = p.rice || 'rice';
  const eggs = p.eggs || 'eggs';
  const tomato = p.tomato || 'crushed tomatoes';
  const citrus = p.citrus || 'lemon';
  const cookingFat = fat(p, d);
  const soySauce = soy(p, d);
  const bread = p.bread || 'warm tortillas';
  const pasta = p.pasta || 'spaghetti';
  const candidates = [];

  const add = (check, recipe) => {
    if (check) candidates.push(recipe);
  };

  const canMeat = !d.vegetarian && !d.vegan && !!p.meat;
  const canEggs = !d.vegan && !!p.eggs;
  const canRice = !!p.rice;
  const canGreens = !!p.greens;

  add(canMeat && canEggs && canRice, () =>
    makeRecipe(
      {
        id: 'oyakodon',
        name: 'Oyakodon (Chicken & Egg Rice Bowl)',
        hook: `Silky eggs draped over savory ${p.chicken} in a soy-garlic broth, served over steaming ${rice}.`,
        matched: [p.chicken, p.eggs, p.rice, p.soy, p.garlic].filter(Boolean),
        missing: ['dashi or chicken broth', 'mirin or a pinch of sugar'],
        cookTime: '18 min',
        quickTime: '18 min',
        tags: ['Japanese', 'Quick (<30min)', 'High Protein'],
        steps: [
          `Simmer 1/3 cup broth with 2 tbsp ${soySauce}, minced ${garlic}, and 1 tsp sugar in a small skillet.`,
          `Add bite-size ${p.chicken} in a single layer and cook 4–5 minutes until just cooked through.`,
          `Beat ${eggs} lightly — leave some white streaks; that's the classic oyakodon look.`,
          `Pour two-thirds of the egg over the chicken, cover, and cook on low 1 minute until barely set.`,
          `Finish with remaining egg, cover 30 seconds, then slide the glossy mixture over hot bowls of ${rice}.`,
        ],
        tip: 'No mirin? Mix 1 tsp brown sugar into a splash of water for the same sweet-savory shine.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(canRice && (p.protein || canEggs), () =>
    makeRecipe(
      {
        id: 'fried-rice',
        name: `Garlic ${proteinPretty} Fried Rice`,
        hook: `Wok-hot ${rice} with caramelized ${garlic}, ${protein}, and a savory soy finish.`,
        matched: [p.rice, p.garlic, p.chicken, p.eggs, p.soy, p.greens, p.onion].filter(Boolean),
        missing: ['toasted sesame oil'],
        cookTime: '20 min',
        quickTime: '18 min',
        difficulty: 'Easy',
        tags: ['Chinese-inspired', 'Quick (<30min)'],
        steps: [
          `If using ${protein} as meat or tofu, dice it small and sear in a hot wok with a little ${cookingFat} until browned; set aside.`,
          canEggs
            ? `Scramble ${eggs} in the same pan until just set, then push to the side.`
            : `Keep the pan ripping hot — fried rice needs aggressive heat.`,
          `Add minced ${garlic}${p.onion ? ` and ${onion}` : ''} and cook 20 seconds until fragrant, not burnt.`,
          `Toss in cold ${rice}, breaking clumps; stir-fry until grains are hot and lightly toasted.`,
          `${p.greens ? `Fold in ${greens} until just wilted, then ` : ''}return the ${protein}, splash in ${soySauce}, and toss hard off the heat.`,
        ],
        tip: 'Day-old rice fries best. Fresh rice? Spread it on a tray and chill 10 minutes first.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(canEggs && canGreens, () =>
    makeRecipe(
      {
        id: 'frittata',
        name: `${greensPretty} & Garlic Frittata`,
        hook: `Oven-puffed eggs folded around wilted ${greens} and toasted ${garlic} — brunch energy, weeknight speed.`,
        matched: [p.eggs, p.greens, p.garlic, p.onion, p.dairy, p.oil, p.butter].filter(Boolean),
        missing: p.dairy ? [] : ['parmesan or feta (optional)'],
        cookTime: '22 min',
        quickTime: '20 min',
        tags: ['Italian', 'Vegetarian'],
        steps: [
          `Heat the oven to 400°F. Beat ${eggs} with a pinch of salt until just combined.`,
          `In an oven-safe skillet, warm ${cookingFat} and soften minced ${garlic}${p.onion ? ` and ${onion}` : ''} for 1 minute.`,
          `Add ${greens} and wilt 1–2 minutes until glossy and collapsed.`,
          `Pour in the eggs, tilt the pan to spread, and cook on the stove 2 minutes until the edges set.`,
          `Bake 8–10 minutes until the center is just firm. Rest 2 minutes, slice into wedges.`,
        ],
        tip: d.kosher && p.meat
          ? 'Keep this meat-free so it stays kosher if you are also serving a meat dish tonight.'
          : 'No oven-safe pan? Finish covered on low heat until the top just sets.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(canRice, () =>
    makeRecipe(
      {
        id: 'congee',
        name: `${proteinPretty} & ${greensPretty} Congee`,
        hook: `Silky rice porridge simmered until spoonable, finished with ${garlic} and ribbons of ${greens}.`,
        matched: [p.rice, p.chicken, p.garlic, p.greens, p.ginger, p.soy].filter(Boolean),
        missing: ['chicken or vegetable broth'],
        cookTime: d.quick ? '28 min' : '40 min',
        quickTime: '28 min',
        difficulty: 'Easy',
        tags: ['Chinese', 'Comfort Food'],
        steps: [
          `Rinse ${rice}. Combine 1/2 cup rice with 4 cups broth or water and smashed ${garlic}${p.ginger ? ` and ${p.ginger}` : ''} in a pot.`,
          `Simmer uncovered, stirring often, until the grains burst and the porridge turns creamy.`,
          canMeat || p.tofu
            ? `Add shredded or thinly sliced ${protein} in the last 8 minutes so it poaches gently.`
            : `Keep simmering until the texture is loose and silky; add water if it gets too thick.`,
          p.greens
            ? `Stir in ${greens} right at the end so they stay bright.`
            : `Taste and loosen with more hot water if needed.`,
          `Season with ${soySauce} and a little white pepper. Ladle into bowls and drizzle with sesame oil if you have it.`,
        ],
        tip: 'Short on time? Use leftover cooked rice and extra broth — it becomes congee in about 15 minutes.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(!d.vegan && (p.tomato || true) && (canEggs || p.beans || p.pepper), () =>
    makeRecipe(
      {
        id: 'shakshuka',
        name: canEggs ? 'Garlic Skillet Shakshuka' : `Smoky ${cap(protein)} Tomato Skillet`,
        hook: canEggs
          ? `Eggs poached in a garlicky tomato-pepper sauce — North African comfort with pantry swagger.`
          : `A thick tomato skillet built around ${protein}, ${garlic}, and warm spices.`,
        matched: [p.eggs, p.tomato, p.garlic, p.onion, p.pepper, p.greens, p.oil].filter(Boolean),
        missing: p.tomato ? ['cumin or smoked paprika'] : ['crushed tomatoes', 'cumin'],
        cookTime: '25 min',
        quickTime: '25 min',
        tags: ['North African', 'Mediterranean'],
        steps: [
          `Sauté ${onion !== 'onion' || p.onion ? onion : 'a small onion'} and ${garlic} in ${cookingFat} until sweet and golden.`,
          `Stir in ${p.pepper || 'a pinch of chili flakes'} and ${p.tomato || 'a can of crushed tomatoes'}; simmer 8 minutes until saucy.`,
          p.greens ? `Fold ${greens} into the sauce until just wilted.` : `Season the sauce with salt, cumin, and paprika.`,
          canEggs
            ? `Make wells with a spoon, crack in ${eggs}, cover, and cook 5–7 minutes until whites set and yolks stay runny.`
            : `Nestle ${protein} into the sauce and simmer until heated through.`,
          `Finish with herbs or a spoon of yogurt if dairy is welcome. Serve with ${p.bread || 'toasted bread'}.`,
        ],
        tip: 'No tomatoes? Roast red peppers plus a splash of vinegar get you surprisingly close.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(canMeat || p.tofu || p.beans, () =>
    makeRecipe(
      {
        id: 'tacos',
        name: `${proteinPretty} ${greensPretty} Street Tacos`,
        hook: `Seared ${protein} with ${garlic} and a quick ${greens} tangle, piled into ${p.bread || 'tortillas'}.`,
        matched: [p.chicken, p.beef, p.tofu, p.beans, p.garlic, p.greens, p.onion, p.citrus, p.bread, p.avocado].filter(Boolean),
        missing: p.bread ? [p.citrus ? null : 'lime'] : ['corn tortillas', 'lime'],
        cookTime: '20 min',
        quickTime: '18 min',
        tags: ['Mexican-inspired', 'Quick (<30min)'],
        steps: [
          `Season ${protein} with salt, ${garlic}, and chili or cumin. Sear in a ripping-hot pan until browned.`,
          p.onion ? `Add ${onion} and cook until charred at the edges.` : `Let the protein pick up a deep crust before flipping.`,
          p.greens ? `Toss ${greens} in the pan juices for 30 seconds — they should wilt, not stew.` : `Deglaze with a squeeze of ${citrus}.`,
          `Warm ${bread} directly over a flame or dry skillet until pliable and spotted.`,
          `Fill, squeeze ${citrus} over the top${p.avocado ? `, add sliced ${p.avocado}` : ''}, and eat immediately.`,
        ],
        tip: 'No tortillas? The same filling over rice becomes an excellent burrito bowl.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(!!p.pasta || (!p.rice && canEggs && !d.vegan), () =>
    makeRecipe(
      {
        id: 'pasta',
        name: p.greens
          ? `${cap(greens)} Aglio e Olio ${p.pasta ? '' : 'with Spaghetti'}`.trim()
          : `Garlic ${cap(protein)} Pasta`,
        hook: `A Roman-simple pasta: ${garlic} blooming in oil, tossed with ${pasta} and ${p.greens || protein}.`,
        matched: [p.pasta, p.garlic, p.greens, p.eggs, p.dairy, p.chicken, p.oil].filter(Boolean),
        missing: p.pasta ? ['chili flakes'] : ['spaghetti', 'chili flakes'],
        cookTime: '22 min',
        quickTime: '20 min',
        tags: ['Italian'],
        steps: [
          `Boil ${pasta} in well-salted water until just shy of al dente. Save a cup of starchy water.`,
          `Gently cook sliced ${garlic} in ${cookingFat} until pale gold — bitter garlic ruins this dish.`,
          p.greens
            ? `Add ${greens} and a pinch of chili flakes; wilt in the garlicky oil.`
            : `Add chili flakes and toss ${protein} through the oil to coat.`,
          `Transfer pasta to the skillet with a splash of pasta water and toss until glossy.`,
          canEggs && !p.meat
            ? `Off heat, work in a beaten ${eggs} yolk or two plus cheese for a silky carbonara-style finish.`
            : `Toss hard, plate, and shower with cheese if you're not keeping the plate meat-and-dairy separate.`,
        ],
        tip: d.glutenFree
          ? 'Use a gluten-free spaghetti or zucchini noodles; the garlic oil does the heavy lifting.'
          : 'Pasta water is the sauce. If it looks dry, add another splash and keep tossing.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(canMeat || p.tofu || p.beans, () =>
    makeRecipe(
      {
        id: 'curry',
        name: `Weeknight ${proteinPretty} Coconut Curry`,
        hook: `A quick golden curry: ${protein}, ${garlic}, and ${p.greens || p.tomato || 'pantry vegetables'} in a coconut gravy.`,
        matched: [p.chicken, p.tofu, p.beans, p.garlic, p.ginger, p.onion, p.greens, p.tomato, p.coconut, p.rice].filter(Boolean),
        missing: [p.coconut ? 'curry powder or garam masala' : 'coconut milk', 'curry powder'],
        cookTime: '28 min',
        quickTime: '28 min',
        difficulty: 'Easy',
        tags: ['Indian-inspired', 'Thai-inspired'],
        steps: [
          `Bloom minced ${garlic}${p.ginger ? ` and ${p.ginger}` : ''} with ${onion} in ${cookingFat} until the pan smells round and sweet.`,
          `Stir in 1–2 tbsp curry powder or paste and toast 30 seconds.`,
          `Add ${protein} and coat in the spices, then pour in coconut milk and a splash of water.`,
          `Simmer 10–12 minutes. Fold in ${p.greens || p.tomato || 'whatever vegetables you have'} for the last few minutes.`,
          `Taste for salt and lime. Serve over ${p.rice || 'hot rice or warm naan'}.`,
        ],
        tip: 'No coconut milk? Use yogurt (if vegetarian and not mixing with forbidden meats) or extra broth plus a spoon of nut butter.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(canMeat && p.garlic, () =>
    makeRecipe(
      {
        id: 'lemon-garlic',
        name: `Lemon-Garlic ${prettyFood(p.chicken || p.meat)} with ${greensPretty}`,
        hook: `Crisp-seared ${p.chicken || p.meat} in a ${citrus}-garlic pan sauce, with a pile of silky ${greens}.`,
        matched: [p.chicken, p.meat, p.garlic, p.greens, p.citrus, p.butter, p.oil].filter(Boolean),
        missing: p.citrus ? ['fresh parsley'] : ['lemon', 'fresh parsley'],
        cookTime: '24 min',
        quickTime: '24 min',
        tags: ['Mediterranean', 'High Protein'],
        steps: [
          `Pat ${p.chicken || p.meat} dry and season well. Sear in ${cookingFat} until deeply golden, 5–6 minutes per side.`,
          `Rest the meat on a plate. In the same pan, soften ${garlic} 30 seconds.`,
          `Deglaze with ${citrus} juice and a splash of water or broth, scraping up the browned bits.`,
          p.greens
            ? `Add ${greens} and toss in the sauce until just wilted. Swirl in a knob of ${d.kosher ? 'olive oil' : 'butter'} if allowed.`
            : `Reduce the sauce 1 minute until glossy.`,
          `Slice the meat, spoon over the pan sauce, and serve with ${p.rice || p.bread || 'crusty bread'}.`,
        ],
        tip: 'A dash of soy sauce in the lemon pan sauce adds restaurant-level savoriness without tasting Asian.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(canGreens && (canEggs || p.soy), () =>
    makeRecipe(
      {
        id: 'egg-drop',
        name: canEggs ? `${greensPretty} Egg-Drop Soup` : `Ginger-Garlic ${greensPretty} Broth`,
        hook: canEggs
          ? `Clouds of egg ribbon through a light ${garlic} broth with just-wilted ${greens}.`
          : `A clean, steaming broth that puts ${greens} and ${garlic} front and center.`,
        matched: [p.eggs, p.greens, p.garlic, p.ginger, p.soy, p.chicken].filter(Boolean),
        missing: ['white pepper', 'sesame oil'],
        cookTime: '15 min',
        quickTime: '15 min',
        tags: ['Chinese', 'Quick (<30min)', 'Healthy'],
        steps: [
          `Bring 3 cups water or broth to a simmer with sliced ${garlic}${p.ginger ? ` and ${p.ginger}` : ''}.`,
          p.chicken ? `Poach thin slices of ${p.chicken} in the broth 4 minutes.` : `Season the broth with ${soySauce}.`,
          `Slide in ${greens} and cook 45 seconds — they should stay emerald.`,
          canEggs
            ? `Beat ${eggs}, then drizzle in a thin stream while stirring the broth in one direction to make silk ribbons.`
            : `Simmer 2 more minutes and taste for salt.`,
          `Finish with ${soySauce} and a few drops of sesame oil. Serve immediately.`,
        ],
        tip: 'Stir the soup, not the egg cup — a slow drizzle is what makes those restaurant ribbons.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(canRice && canGreens, () =>
    makeRecipe(
      {
        id: 'spanakorizo',
        name: `Spanakorizo-Style ${greensPretty} Rice`,
        hook: `Greek lemon-garlic rice cooked with a heap of ${greens} until each grain is glossy and herby.`,
        matched: [p.rice, p.greens, p.garlic, p.onion, p.citrus, p.oil, p.dairy].filter(Boolean),
        missing: p.citrus ? ['fresh dill or parsley'] : ['lemon', 'fresh dill'],
        cookTime: '30 min',
        quickTime: '28 min',
        tags: ['Greek', 'Vegetarian'],
        steps: [
          `Sauté ${onion} and ${garlic} in plenty of olive oil until translucent.`,
          `Stir in ${rice} to coat every grain in oil.`,
          `Add water or broth (about 2:1 liquid to rice) and simmer covered until the rice is almost tender.`,
          `Fold in a big handful of ${greens} and cook until they melt into the rice.`,
          `Finish off heat with ${citrus} juice and herbs. Crumble feta on top if dairy is OK.`,
        ],
        tip: canMeat
          ? `Serve alongside seared ${p.chicken || p.meat} to make it a full plate without mixing techniques.`
          : 'This is even better room-temp the next day — a rare rice dish that loves the fridge.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(canMeat && p.soy && p.garlic, () =>
    makeRecipe(
      {
        id: 'soy-garlic-bowl',
        name: `Soy-Garlic ${prettyFood(p.chicken || p.meat)} Rice Bowl`,
        hook: `Sticky soy-garlic glaze on caramelized ${p.chicken || p.meat}, spooned over ${rice || 'hot rice'} with ${greens}.`,
        matched: [p.chicken, p.meat, p.soy, p.garlic, p.rice, p.greens, p.ginger].filter(Boolean),
        missing: ['honey or brown sugar', 'sesame seeds'],
        cookTime: '22 min',
        quickTime: '20 min',
        tags: ['Korean-inspired', 'High Protein'],
        steps: [
          `Stir 2 tbsp ${soySauce} with minced ${garlic}, 1 tsp honey, and a splash of water.`,
          `Sear ${p.chicken || p.meat} in a hot skillet until browned. Pour in the glaze and reduce until sticky.`,
          p.greens
            ? `Push the meat aside and wilt ${greens} in the leftover glaze.`
            : `Let the glaze cling to the meat — it should look lacquered, not soupy.`,
          `Spoon over ${p.rice || 'freshly steamed rice'}.`,
          `Scatter sesame seeds or sliced scallions if you have them.`,
        ],
        tip: 'A teaspoon of gochujang or chili crisp in the glaze turns this into a late-night favorite.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(canEggs, () =>
    makeRecipe(
      {
        id: 'omelette',
        name: `French-ish ${prettyFood(p.greens || p.mushroom || p.cheese || 'herb')} Omelette`,
        hook: `Bistro eggs, barely baveuse in the center, filled with ${p.greens || p.mushroom || garlic}.`,
        matched: [p.eggs, p.greens, p.garlic, p.dairy, p.butter, p.mushroom].filter(Boolean),
        missing: ['chives or parsley'],
        cookTime: '10 min',
        quickTime: '10 min',
        tags: ['French', 'Quick (<30min)'],
        steps: [
          `Beat ${eggs} with a pinch of salt just until the whites and yolks marry — don't froth them.`,
          `Melt ${cookingFat} in a nonstick pan over medium-low. Cook minced ${garlic} 15 seconds.`,
          p.greens || p.mushroom
            ? `Add ${p.greens || p.mushroom} and warm through, then pour in the eggs.`
            : `Pour in the eggs and start stirring with a spatula as if making soft scramble.`,
          `When the bottom sets but the top is still glossy, stop stirring and fold into a cigar.`,
          `Slide onto a warm plate immediately. The center should be tender, not dry.`,
        ],
        tip: 'Low heat is the whole technique. If the pan smokes, you have already gone too far.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(p.potato || p.rice || p.veg, () =>
    makeRecipe(
      {
        id: 'roast-sheet',
        name: `Sheet-Pan ${prettyFood(p.chicken || protein)} & ${prettyFood(p.potato || p.onion || greens)}`,
        hook: `Hands-off high-heat roasting so ${p.chicken || protein} and vegetables share one caramelized pan.`,
        matched: [p.chicken, p.potato, p.onion, p.garlic, p.pepper, p.greens, p.citrus, p.oil].filter(Boolean),
        missing: ['smoked paprika'],
        cookTime: d.quick ? '30 min' : '35 min',
        quickTime: '30 min',
        difficulty: 'Easy',
        tags: ['American', 'Sheet-Pan'],
        steps: [
          `Heat oven to 425°F. Toss ${p.potato || p.onion || 'chopped vegetables'} with oil, salt, and paprika on a sheet pan.`,
          `Nestle ${p.chicken || protein} on the pan. Scatter smashed ${garlic} around everything.`,
          `Roast 20–25 minutes until the protein is cooked and the edges are browned.`,
          p.greens
            ? `In the last 4 minutes, pile ${greens} onto the hot pan to wilt in the drippings.`
            : `Finish with ${citrus} juice right out of the oven.`,
          `Spoon pan juices over the top and serve straight from the tray.`,
        ],
        tip: 'Crowding the pan steams the food. Use two trays if you have a lot of vegetables.',
      },
      p,
      d,
      expiringNames
    )
  );

  add(p.beans || p.tomato || p.pepper, () =>
    makeRecipe(
      {
        id: 'chili',
        name: `${prettyFood(p.beans || protein)} Weeknight Chili`,
        hook: `A short-simmer chili built on ${p.beans || protein}, ${garlic}, and whatever peppers or tomatoes you have.`,
        matched: [p.beans, p.chicken, p.beef, p.tomato, p.garlic, p.onion, p.pepper, p.oil].filter(Boolean),
        missing: p.tomato ? ['chili powder'] : ['crushed tomatoes', 'chili powder'],
        cookTime: '30 min',
        quickTime: '28 min',
        tags: ['Tex-Mex', 'Comfort Food'],
        steps: [
          `Brown ${p.beef || p.chicken || p.beans} with ${onion} and ${garlic} in a heavy pot.`,
          `Stir in chili powder and cook 30 seconds so the spices bloom in the fat.`,
          `Add ${p.tomato || 'crushed tomatoes'} and a splash of water. Simmer 15 minutes.`,
          p.beans && p.beef ? `Stir in ${p.beans} to heat through.` : `Let the chili thicken until it coats a spoon.`,
          `Taste for salt. Serve with rice, tortillas, or a fried egg on top.`,
        ],
        tip: 'A square of dark chocolate or a splash of coffee in the last minute makes chili taste slow-cooked.',
      },
      p,
      d,
      expiringNames
    )
  );

  return candidates
    .map((fn) => {
      try {
        return typeof fn === 'function' ? fn() : fn;
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter((recipe) => {
      const text = `${recipe.name} ${recipe.steps.join(' ')} ${recipe.matchedIngredients.join(' ')}`.toLowerCase();
      if (d.vegan && (/\begg\b/.test(text) && !p.tofu)) {
        if (recipe.matchedIngredients.some((i) => /\begg/.test(i))) return false;
      }
      if (d.vegetarian && recipe.matchedIngredients.some((i) => /\bchicken\b|\bbeef\b|\bpork\b|\bturkey\b|\bshrimp\b|\bfish\b|\bbacon\b/.test(i))) {
        return false;
      }
      if (d.halal && /\bpork\b|\bbacon\b|\bwine\b/.test(text)) return false;
      if (d.kosher && /\bpork\b|\bbacon\b|\bshrimp\b|\bshellfish\b/.test(text)) return false;
      if (d.kosher && p.meat && recipe.matchedIngredients.some((i) => /\bcheese\b|\bmilk\b|\bbutter\b|\bparmesan\b|\bfeta\b/.test(i))) {
        return false;
      }
      return true;
    });
}

export function generateSmartFallbackRecipes(
  ingredients,
  expiringSoonList = [],
  dietaryFilters = [],
  varietySeed = Date.now()
) {
  const pantry = analyzePantry(ingredients);
  const diet = dietFlags(dietaryFilters);
  const expiringNames = expiringSoonList.map((i) => i.toLowerCase().trim());

  let recipes = buildCandidates(pantry, diet, expiringNames);

  if (recipes.length < 4) {
    const leftover = pantry.list;
    const star = leftover[0] || 'pantry staples';
    const second = leftover[1] || 'garlic';
    recipes.push(
      makeRecipe(
        {
          id: 'market-saute',
          name: `Herb-Market ${cap(star)} Sauté`,
          hook: `A cook's-treat skillet that lets ${star} and ${second} stay recognizable, not mashed into a generic hash.`,
          matched: leftover.slice(0, 5),
          missing: ['flaky salt', 'fresh herbs'],
          cookTime: '18 min',
          quickTime: '16 min',
          tags: ['California', 'Quick (<30min)'],
          steps: [
            `Prep ${leftover.slice(0, 3).join(', ') || star} into even pieces so everything finishes together.`,
            `Get a wide pan properly hot, then add a thin film of oil.`,
            `Cook the sturdiest ingredient first. Add quicker items after a crust forms.`,
            `Season in layers — salt early, acid (lemon or vinegar) at the very end.`,
            `Serve in a warm bowl with something starchy on the side if you have it.`,
          ],
          tip: 'The difference between a "medley" and a real dish is browning. Do not crowd the pan.',
        },
        pantry,
        diet,
        expiringNames
      )
    );
  }

  recipes = shuffle(recipes, `${varietySeed}-${pantry.list.join(',')}-${dietaryFilters.join(',')}`);

  const dietTagSet = new Set([
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Kosher',
    'Halal',
    'Quick (<30min)',
    'High Protein',
    'Healthy',
    'Comfort Food',
    'Sheet-Pan',
  ]);

  const cuisineFamily = (recipe) => {
    const raw =
      (recipe.dietaryTags || []).find((t) => !dietTagSet.has(t)) || recipe.id;
    return raw.toLowerCase().replace(/-inspired/g, '').replace(/\s+/g, ' ').trim();
  };

  const usesExpiring = (recipe) =>
    expiringNames.some((exp) =>
      recipe.matchedIngredients.some((m) => m.includes(exp) || exp.includes(m))
    );

  const seenCuisines = new Set();
  const diverse = [];

  const take = (recipe) => {
    if (!recipe || diverse.includes(recipe)) return;
    diverse.push(recipe);
    seenCuisines.add(cuisineFamily(recipe));
  };

  const ranked = [...recipes].sort((a, b) => Number(usesExpiring(b)) - Number(usesExpiring(a)));
  for (const recipe of ranked) {
    const family = cuisineFamily(recipe);
    if (seenCuisines.has(family)) continue;
    take(recipe);
    if (diverse.length === 5) break;
  }

  for (const recipe of recipes) {
    if (diverse.length === 5) break;
    take(recipe);
  }

  return diverse.slice(0, 5);
}

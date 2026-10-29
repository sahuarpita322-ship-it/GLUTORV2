export interface FoodRecommendation {
  id: string;
  category: 'odisha_traditional' | 'indian_staple' | 'global_wholesome' | 'beverage' | 'snack';
  title: string;
  regionalOrigin?: string;
  description: string;
  glycemicImpact: 'low' | 'moderate' | 'balanced_combination';
  macronutrientFocus: string;
  portionTip: string;
  preparationNote: string;
  tags: string[];
}

export const CULTURALLY_TAILORED_FOODS: FoodRecommendation[] = [
  {
    id: 'food_dalma',
    category: 'odisha_traditional',
    title: 'Odisha Dalma (Lentils with Mixed Country Vegetables)',
    regionalOrigin: 'Odisha, India',
    description: 'A traditional Odia stew combining toor or moong dal with raw green papaya, pumpkin, drumstick (sahajan chhuin), brinjal, and raw banana, finished with roasted cumin and dry chili tempering.',
    glycemicImpact: 'low',
    macronutrientFocus: 'High soluble fiber, plant protein, essential micronutrients (beta-carotene, potassium).',
    portionTip: '1.5 to 2 bowls paired with a moderate portion of ragi roti or parboiled rice.',
    preparationNote: 'Cook with minimal oil; let the natural sweetness of pumpkin and pectin in raw papaya provide rich texture without refined thickeners.',
    tags: ['odisha', 'vegetarian', 'fiber_rich', 'protein', 'low_gi'],
  },
  {
    id: 'food_santula',
    category: 'odisha_traditional',
    title: 'Santula (Steamed Vegetables Tempered with Panch Phoron)',
    regionalOrigin: 'Odisha, India',
    description: 'A classic Odia home preparation where pointed gourd (potala), beans, raw papaya, and ridge gourd are gently boiled with crushed garlic and ginger, then lightly tempered in cold-pressed mustard oil with panch phoron.',
    glycemicImpact: 'low',
    macronutrientFocus: 'Ultra-low carbohydrate, high hydration and dietary fiber.',
    portionTip: 'Enjoy liberally as half of your lunch or dinner plate.',
    preparationNote: 'Avoid overcooking to preserve fiber integrity and heat-sensitive vitamins.',
    tags: ['odisha', 'vegan', 'digestive', 'very_low_gi', 'hydrating'],
  },
  {
    id: 'food_saga_bhaja',
    category: 'odisha_traditional',
    title: 'Kosala / Poi Saga (Stir-fried Native Greens with Garlic)',
    regionalOrigin: 'Odisha, India',
    description: 'Fresh regional greens (Kosala, Poi, or Palanga saga) sautéed with crushed garlic, green chillies, and a pinch of turmeric.',
    glycemicImpact: 'low',
    macronutrientFocus: 'Rich in lutein, magnesium, iron, and folate with virtually zero glycemic load.',
    portionTip: '1 generous cup serving alongside your main meal.',
    preparationNote: 'Magnesium in leafy greens plays an important role in cellular insulin sensitivity.',
    tags: ['odisha', 'leafy_greens', 'magnesium', 'antioxidants'],
  },
  {
    id: 'food_mandia_ruti',
    category: 'odisha_traditional',
    title: 'Mandia Ruti (Finger Millet / Ragi Flatbread)',
    regionalOrigin: 'Tribal & Rural Odisha',
    description: 'Unleavened flatbreads made from whole stone-ground finger millet (mandia), an ancient drought-resilient supergrain popular across Koraput and Southern Odisha.',
    glycemicImpact: 'moderate',
    macronutrientFocus: 'Complex low-GI starches, slow-release dietary fiber, high bioavailable calcium.',
    portionTip: '1 to 2 small flatbreads per meal, accompanied by high-fiber dal and vegetables.',
    preparationNote: 'Finger millet starches digest more slowly than refined white flour, promoting smooth postprandial glycemic curves.',
    tags: ['millets', 'gluten_free', 'slow_release', 'calcium_rich'],
  },
  {
    id: 'food_usuna_rice',
    category: 'indian_staple',
    title: 'Parboiled Usuna Rice with Dal & Protein',
    regionalOrigin: 'Eastern & Southern India',
    description: 'Parboiled (usuna) rice retains more thiamine and micronutrients with a lower glycemic index than polished raw white rice. Served with dal and vegetables.',
    glycemicImpact: 'balanced_combination',
    macronutrientFocus: 'Carbohydrate base tempered by resistant starch formed during parboiling and cooling.',
    portionTip: 'Keep rice portion to approximately 1 standard cup (quarter of plate) balanced by equal dal and double vegetables.',
    preparationNote: 'No single staple is universally forbidden. Pair carbohydrates with fiber, healthy fat, and protein to blunt glucose spikes.',
    tags: ['staple', 'resistant_starch', 'portion_controlled'],
  },
  {
    id: 'food_sprouted_moong',
    category: 'indian_staple',
    title: 'Sprouted Moong & Kala Chana Chaat',
    regionalOrigin: 'Pan-Indian',
    description: 'Fresh sprouted green gram and black chickpeas tossed with chopped cucumber, tomato, coriander, lemon juice, and roasted jeera powder.',
    glycemicImpact: 'low',
    macronutrientFocus: 'High enzymatic bioavailability, complete amino acid profile, high soluble fiber.',
    portionTip: 'Ideal morning or late-afternoon snack (1 small bowl).',
    preparationNote: 'Germination reduces phytates and increases vitamin C and prebiotic fibers.',
    tags: ['protein_rich', 'raw', 'prebiotic', 'snack'],
  },
  {
    id: 'food_whole_fruit',
    category: 'global_wholesome',
    title: 'Whole Local Fruits (Guava, Amla, Green Papaya, Apple)',
    regionalOrigin: 'Seasonal / Regional',
    description: 'Fresh whole fruits with edible skin and pulp intact, providing slow-digesting pectin fiber alongside natural fructose.',
    glycemicImpact: 'low',
    macronutrientFocus: 'Soluble fiber, vitamin C, polyphenols.',
    portionTip: '1 medium fruit as a standalone snack between meals rather than combined with a heavy carbohydrate dinner.',
    preparationNote: 'Whole fruits are far preferable to fruit juices, which strip the fiber matrix and trigger rapid glucose influx.',
    tags: ['fruit', 'vitamin_c', 'antioxidant', 'unprocessed'],
  },
  {
    id: 'food_buttermilk',
    category: 'beverage',
    title: 'Spiced Chaas / Ghol (Probiotic Buttermilk)',
    regionalOrigin: 'Traditional Indian',
    description: 'Diluted churned curd seasoned with fresh ginger, mint, roasted cumin, and black salt.',
    glycemicImpact: 'low',
    macronutrientFocus: 'Lactic acid probiotics, hydration, electrolyte replenishment without sugars.',
    portionTip: '1 glass after lunch or during hot hours instead of sweetened sodas or bottled juices.',
    preparationNote: 'Hydration with electrolytes supports renal glucose clearance and digestive equilibrium.',
    tags: ['hydration', 'probiotic', 'sugar_free'],
  },
];

export interface LifestylePrinciple {
  title: string;
  summary: string;
  clinicalRationale: string;
  practicalAction: string;
}

export const CORE_LIFESTYLE_PRINCIPLES: LifestylePrinciple[] = [
  {
    title: 'The Plate Proportion Framework',
    summary: 'Balance your meal by visual volume rather than exhausting micro-calorie counting.',
    clinicalRationale: 'Combining carbohydrates with dietary fiber and protein slows gastric emptying time and dampens the postprandial glucose excursion curve.',
    practicalAction: 'Aim for 1/2 of your plate as non-starchy vegetables/dalma/santula, 1/4 as protein (lentils/dal, paneer, fish, or sprouts), and 1/4 as whole grains (millets, parboiled rice, or roti).',
  },
  {
    title: 'Post-Meal Physical Movement (10–15 Min Brisk Walk)',
    summary: 'A short, gentle walk 20 to 30 minutes following main meals.',
    clinicalRationale: 'Contracting skeletal muscles utilize circulating glucose via GLUT4 translocation independent of insulin, significantly attenuating post-meal blood glucose peaks.',
    practicalAction: 'Walk at a steady, conversational pace around your compound, garden, or indoor hallway for 15 minutes after lunch or dinner.',
  },
  {
    title: 'Circadian Meal & Sleep Consistency',
    summary: 'Maintain consistent meal windows and 7 to 8 hours of quality sleep.',
    clinicalRationale: 'Sleep deprivation and irregular nocturnal snacking spike cortisol and growth hormone, inducing temporary peripheral insulin resistance.',
    practicalAction: 'Finish your final meal at least 2.5 hours before sleeping, and keep bedtimes consistent within a 30-minute window.',
  },
  {
    title: 'Hydration & Mindful Beverage Selection',
    summary: 'Choose water, herbal infusions, and spiced buttermilk over sugar-sweetened beverages.',
    clinicalRationale: 'Liquid sugars (sodas, sweetened juices, syrups) lack a fibrous matrix and absorb rapidly through the duodenum, provoking steep glycemic surges.',
    practicalAction: 'Keep a water jug at your desk; flavor with mint leaves, lemon slices, or roasted jeera instead of packaged beverages.',
  },
  {
    title: 'Medication Safety & Hypoglycemia Awareness',
    summary: 'Always coordinate dietary adjustments with your physician if taking glucose-lowering therapy.',
    clinicalRationale: 'Sudden aggressive carbohydrate cuts in patients taking sulfonylureas or insulin can induce severe, life-threatening hypoglycemia.',
    practicalAction: 'Never alter insulin dosages or abruptly eliminate carbohydrates without direct clinician guidance. Keep 15g fast-acting glucose available if at risk.',
  },
];

import React, { useState } from 'react';
import {
  Apple,
  Utensils,
  Footprints,
  Moon,
  Droplets,
  ShieldAlert,
  Info,
  Check,
  Filter,
  Sparkles,
  Heart,
  ChevronRight
} from 'lucide-react';
import {
  CULTURALLY_TAILORED_FOODS,
  CORE_LIFESTYLE_PRINCIPLES,
  FoodRecommendation
} from '../services/foodGuidance';
import { UserProfile } from '../types';

interface FoodLifestyleProps {
  userProfile: UserProfile | null;
}

export const FoodLifestyle: React.FC<FoodLifestyleProps> = ({ userProfile }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedFood, setSelectedFood] = useState<FoodRecommendation | null>(
    CULTURALLY_TAILORED_FOODS[0]
  );

  // Interactive plate builder state
  const [plateVeg, setPlateVeg] = useState<string>('Odisha Santula / Dalma (Mixed Vegetables & Papaya)');
  const [plateProtein, setPlateProtein] = useState<string>('Sprouted Moong / Toor Dal Stew');
  const [plateGrain, setPlateGrain] = useState<string>('Finger Millet (Mandia) Ruti / Usuna Rice Portion');

  const filteredFoods = CULTURALLY_TAILORED_FOODS.filter((food) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'odisha') return food.category === 'odisha_traditional';
    if (activeCategory === 'indian') return food.category === 'indian_staple';
    if (activeCategory === 'fruits_beverages') return food.category === 'global_wholesome' || food.category === 'beverage';
    return true;
  });

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Nutritional Sciences & Habits
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs font-mono text-slate-400">Culturally Grounded Prevention</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Food, Lifestyle and Prevention
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Practical, evidence-based nutritional strategies and traditional regional recipes—including Odisha culinary heritage—designed for smooth glycemic responses.
          </p>
        </div>

        {userProfile?.dietaryPreference && (
          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-slate-300 self-start md:self-auto">
            <span className="text-slate-500 block text-[10px]">CURRENT PROFILE:</span>
            <span className="text-cyan-400 font-semibold capitalize">
              {userProfile.dietaryPreference.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Medication & Clinical Boundary Notice */}
      <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-4 sm:p-5 flex items-start gap-3 text-xs text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white block">
            Clinical Safety & Medication Invariance Rule
          </span>
          <p className="leading-relaxed">
            Never discontinue prescribed medications, alter insulin dosages, or engage in sudden extreme fasting without the direct supervision of your licensed physician. If you are taking glucose-lowering medications (such as sulfonylureas or insulin), significant changes to carbohydrate intake or exercise must be coordinated with your healthcare team to prevent severe hypoglycemia.
          </p>
        </div>
      </div>

      {/* Interactive Healthy Plate Visualizer */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-teal-400" />
              <span>The Balanced Plate Proportion Tool</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualize meal balance by geometric proportion rather than exhausting calorie micro-counting.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            50% Fiber · 25% Protein · 25% Whole Grain
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual Plate Graphic */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-slate-700 bg-slate-950 shadow-2xl p-2 flex items-center justify-center">
              {/* Left Half: 50% Vegetables / Fiber */}
              <div className="absolute left-2 top-2 bottom-2 w-[calc(50%-4px)] bg-emerald-950/40 border-r-2 border-slate-700 rounded-l-full p-4 flex flex-col justify-center items-center text-center">
                <span className="text-emerald-400 font-mono text-xs font-bold uppercase block">1/2 Non-Starchy Vegetables</span>
                <span className="text-[11px] text-slate-300 mt-1 line-clamp-3 leading-tight">{plateVeg}</span>
                <span className="text-[10px] text-emerald-400/80 font-mono mt-2">Soluble & Insoluble Fiber</span>
              </div>

              {/* Top Right: 25% Protein */}
              <div className="absolute right-2 top-2 w-[calc(50%-4px)] h-[calc(50%-4px)] bg-teal-950/40 border-b-2 border-slate-700 rounded-tr-full p-3 flex flex-col justify-center items-center text-center">
                <span className="text-teal-400 font-mono text-[11px] font-bold uppercase block">1/4 Quality Protein</span>
                <span className="text-[10px] text-slate-300 mt-0.5 line-clamp-2 leading-tight">{plateProtein}</span>
              </div>

              {/* Bottom Right: 25% Whole Grain Carbohydrate */}
              <div className="absolute right-2 bottom-2 w-[calc(50%-4px)] h-[calc(50%-4px)] bg-cyan-950/40 rounded-br-full p-3 flex flex-col justify-center items-center text-center">
                <span className="text-cyan-400 font-mono text-[11px] font-bold uppercase block">1/4 Complex Whole Grains</span>
                <span className="text-[10px] text-slate-300 mt-0.5 line-clamp-2 leading-tight">{plateGrain}</span>
              </div>
            </div>
          </div>

          {/* Plate Builder Selectors */}
          <div className="lg:col-span-6 space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono uppercase mb-1">
                Select 1/2 Plate: Fiber & Vegetables
              </label>
              <select
                value={plateVeg}
                onChange={(e) => setPlateVeg(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Odisha Santula / Dalma (Mixed Vegetables & Papaya)">Odisha Santula / Dalma (Papaya, Gourd, Drumsticks)</option>
                <option value="Kosala & Poi Saga Bhaja (Regional Leafy Greens with Garlic)">Kosala / Poi Saga Bhaja (Leafy Greens with Garlic)</option>
                <option value="Stir-fried Cauliflower, Beans & Methi Leaves">Stir-fried Cauliflower, French Beans & Methi Leaves</option>
                <option value="Fresh Cucumber, Tomato & Sprouted Salad">Fresh Cucumber, Radish & Sprouted Moong Salad</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono uppercase mb-1">
                Select 1/4 Plate: Protein Source
              </label>
              <select
                value={plateProtein}
                onChange={(e) => setPlateProtein(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Thick Toor or Moong Dal Stew">Thick Toor or Yellow Moong Dal Stew</option>
                <option value="Sprouted Kala Chana (Black Chickpeas) with Jeera">Sprouted Kala Chana (Black Chickpeas) with Jeera</option>
                <option value="Fresh Paneer / Tofu Sautéed with Turmeric">Fresh Low-Fat Paneer / Tofu Sautéed with Turmeric</option>
                <option value="Fresh Fish Curry / Steamed Lentil Dumplings">Fresh Freshwater Fish Curry / Steamed Lentil Vada</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono uppercase mb-1">
                Select 1/4 Plate: Carbohydrate Base (Portion-Controlled)
              </label>
              <select
                value={plateGrain}
                onChange={(e) => setPlateGrain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Finger Millet (Mandia) Ruti / 1 Ragi Flatbread">1 Finger Millet (Mandia) Ruti / Ragi Flatbread</option>
                <option value="Parboiled Usuna Rice (1 Standard Measuring Cup)">Parboiled Usuna Rice (1 Standard Measuring Cup)</option>
                <option value="Whole Wheat Atta Roti (1 to 2 small flatbreads)">Whole Wheat Atta Roti (1 to 2 small flatbreads)</option>
                <option value="Steamed Foxtail Millet (Kangni) Pilaf">Steamed Foxtail Millet (Kangni) Pilaf</option>
              </select>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-white">Anti-Taboo Principle:</strong> Rice, potatoes, and fruits are not universally forbidden enemies. The secret lies in pairing them with soluble fiber and protein to slow enzymatic breakdown.
            </div>
          </div>
        </div>
      </div>

      {/* Regional Recipe Catalog: Odisha & Indian Heritage */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Apple className="w-5 h-5 text-cyan-400" />
              <span>Culturally Adapted Nutrition Library</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Highlighting Odisha's nutrient-dense vegetarian staples alongside balanced global options.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 text-xs rounded-md ${
                activeCategory === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory('odisha')}
              className={`px-3 py-1 text-xs rounded-md ${
                activeCategory === 'odisha' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Odisha Heritage
            </button>
            <button
              onClick={() => setActiveCategory('indian')}
              className={`px-3 py-1 text-xs rounded-md ${
                activeCategory === 'indian' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Indian Staples
            </button>
            <button
              onClick={() => setActiveCategory('fruits_beverages')}
              className={`px-3 py-1 text-xs rounded-md ${
                activeCategory === 'fruits_beverages' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Whole Fruits & Drinks
            </button>
          </div>
        </div>

        {/* Recipe Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoods.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedFood(item)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedFood?.id === item.id
                  ? 'bg-slate-950 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                  <span className="text-cyan-400">{item.regionalOrigin || 'Wholesome Nutrition'}</span>
                  <span className={`px-1.5 py-0.5 rounded capitalize ${
                    item.glycemicImpact === 'low'
                      ? 'bg-emerald-950/60 text-emerald-300'
                      : 'bg-teal-950/60 text-teal-300'
                  }`}>
                    {item.glycemicImpact.replace('_', ' ')} GI
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>View Full Preparation Guide</span>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Selected Recipe Deep Dive Modal/Drawer */}
        {selectedFood && (
          <div className="bg-[#080c16] border border-cyan-900/40 rounded-xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400">Preparation & Nutritional Focus</span>
                <h3 className="text-lg font-bold text-white">{selectedFood.title}</h3>
                <span className="text-xs text-slate-400">{selectedFood.regionalOrigin}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">Macronutrient Profile</span>
                <span className="text-slate-300">{selectedFood.macronutrientFocus}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">Portion & Pairing Advice</span>
                <span className="text-slate-300">{selectedFood.portionTip}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">Culinary Tip</span>
                <span className="text-slate-300">{selectedFood.preparationNote}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Core Lifestyle Principles (Movement, Sleep, Hydration) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CORE_LIFESTYLE_PRINCIPLES.map((principle, idx) => (
          <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
                0{idx + 1}
              </span>
              <h4 className="text-sm font-bold text-white">{principle.title}</h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {principle.summary}
            </p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] space-y-1.5">
              <div>
                <span className="text-cyan-400 font-mono uppercase block text-[10px]">Clinical Rationale:</span>
                <span className="text-slate-400">{principle.clinicalRationale}</span>
              </div>
              <div className="pt-1 border-t border-slate-800">
                <span className="text-teal-400 font-mono uppercase block text-[10px]">Actionable Habit:</span>
                <span className="text-slate-200">{principle.practicalAction}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

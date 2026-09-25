# 🍳 What's Cooking — AI Recipe Generator

An AI-powered recipe generator that helps home cooks create delicious meals using ingredients already sitting in their kitchen, minimizing food waste and simplifying weeknight dinners.

---

## ✨ Features

### 1. 🗄️ Left Panel: Interactive Pantry
- **Intelligent Ingredient Dropdown**: Type an ingredient to see live culinary suggestions with category badges, emojis, and fuzzy matching. Prevents adding fake or non-existent ingredients.
- **Keyboard Navigation**: Use <kbd>↑</kbd> and <kbd>↓</kbd> to navigate matches, and press <kbd>Enter</kbd> to add.
- **⏰ "Expiring Soon" Boost**: Click the clock icon on any ingredient (e.g. spinach) to flag it as expiring soon. The AI prioritizes recipes that use these items.
- **Dietary Filters**: Multi-select pills for **Vegetarian**, **Vegan**, **Gluten-Free**, and **Quick (<30min)**.
- **Pre-seeded Demo Data**: Starts pre-filled with *eggs, spinach, garlic, rice, soy sauce, and chicken breast* so the app looks alive and ready for live judging immediately.

### 2. 🍲 Center Panel: Recipe Results
- **2-Column Recipe Grid**: Visual cards with recipe names, appetizing one-line hooks, cook times, and dietary tags.
- **Pantry Match Indicator**: Visual progress bar showing exact ingredients in your kitchen (e.g., *"5/6 ingredients you have"* & 85% match).
- **Amber "Missing" Tags**: Clearly highlights missing staples (e.g. *"Missing: sesame oil"*).
- **Expiring Item Badges**: Displays an animated ⏰ badge on recipes that rescue ingredients flagged as expiring.
- **Dynamic Shimmer Loading**: Skeleton cards with playful rotating messages (*"AI chef is tasting the broth..."*, *"Balancing savory aromatics..."*).

### 3. 📖 Right Panel: Recipe Detail View
- **Ingredients Breakdown**: Split into clean *"You have"* (green checkmarks) vs *"Need to buy"* (amber tags).
- **Interactive Step-by-Step Cooking**: Numbered instructions that cooks can tap to cross off as they progress.
- **Chef's Substitution Callout**: Lightbulb callout box with clever substitutions (e.g., *"No soy sauce? Tamari or coconut aminos work wonders"*).
- **Copy Recipe**: One-click formatted recipe export to clipboard.

### 4. 🤖 Multi-Provider AI Engine
- **Claude 3.5 Sonnet**: Direct browser integration with Anthropic API.
- **OpenAI GPT-4o**: Structured JSON mode integration.
- **Smart Local AI Chef**: Built-in intelligent recipe synthesis engine that crafts personalized recipes even without an API key or when offline, guaranteeing a bulletproof demo experience!
- **API Settings Modal**: Configure keys and active providers on the fly in the header.

### 5. 📱 Fully Responsive Design
- **Desktop (>1024px)**: Full 3-panel split view with independent scrolling columns.
- **Tablets & Mobile (≤1024px)**: Native app experience with bottom navigation tabs (`Pantry`, `Recipes`, `Detail`), badge counts, and 1-tap navigation between pantry editing, recipe selection, and step-by-step cooking.
- **Mobile Back Button**: Easily jump back from recipe details to recipe results.
- **Adaptive Header & Grid**: Fluid single/double column cards and compact touch-friendly buttons on phones.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. (Optional) Provide API Keys
You can either create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Or open the app in your browser and click **API Settings** in the top navigation bar to enter your Claude or OpenAI API key.

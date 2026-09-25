import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Clock, 
  Trash2, 
  Plus, 
  Check, 
  AlertCircle, 
  Settings, 
  RotateCcw, 
  ChefHat, 
  Flame, 
  UtensilsCrossed, 
  ShoppingBag, 
  Copy, 
  CheckCheck, 
  ExternalLink,
  Info,
  ArrowLeft
} from 'lucide-react';
import { INITIAL_PANTRY, DIETARY_OPTIONS, SEED_RECIPES } from './mockData';
import { searchIngredients } from './ingredientsCatalog';
import { generateRecipes, getStoredApiConfig, saveApiConfig } from './api';

export default function App() {
  // 1. Pantry State: Seeded with eggs, spinach, garlic, rice, soy sauce, chicken breast
  const [pantry, setPantry] = useState(INITIAL_PANTRY);
  const [ingredientInput, setIngredientInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  // 2. Dietary filters state (multi-select)
  const [selectedDietary, setSelectedDietary] = useState([]);

  // 3. Recipes & Selection State: pre-populated with SEED_RECIPES
  const [recipes, setRecipes] = useState(SEED_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState(SEED_RECIPES[0]);

  // 4. Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  // 5. Settings / API Config Modal
  const [showSettings, setShowSettings] = useState(false);
  const [apiConfig, setApiConfig] = useState(getStoredApiConfig());
  const [tempApiKey, setTempApiKey] = useState(apiConfig.claudeKey || apiConfig.openAiKey || '');
  const [tempProvider, setTempProvider] = useState(apiConfig.provider || 'demo');

  // 6. Interactive step completion checklist for cooking
  const [completedSteps, setCompletedSteps] = useState({});
  const [copiedNotification, setCopiedNotification] = useState(false);

  // 7. Responsive active tab for smaller screens ('pantry' | 'recipes' | 'detail')
  const [activeMobileTab, setActiveMobileTab] = useState('recipes');

  // Compute autocomplete suggestions based on curated catalog
  const suggestions = ingredientInput.trim()
    ? searchIngredients(ingredientInput, pantry.map((item) => item.name))
    : [];

  // Reset highlight index when input changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [ingredientInput]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fun rotating loading messages
  const loadingPhrases = [
    'AI chef is checking your pantry shelves...',
    'Tasting the broth & adjusting spices...',
    'Simmering creative flavor combinations...',
    'Matching recipes to rescue expiring ingredients...',
    'Plating your custom recipes...'
  ];

  // Rotate loading phrases while generating
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Select verified ingredient from dropdown suggestions or direct input
  const handleSelectIngredient = (ingredient) => {
    const name = typeof ingredient === 'string' ? ingredient : ingredient.name;
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return;

    // Check duplicate
    if (!pantry.some((item) => item.name.toLowerCase() === trimmed)) {
      setPantry((prev) => [
        ...prev,
        { id: `custom-${Date.now()}`, name: trimmed, expiringSoon: false }
      ]);
    }
    setIngredientInput('');
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Add ingredient form submission (Enter key in form or clicking + button)
  const handleAddIngredient = (e) => {
    if (e) e.preventDefault();
    const trimmed = ingredientInput.trim().toLowerCase();
    if (!trimmed) return;

    // If user explicitly highlighted an option via keyboard arrows, add that option
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      handleSelectIngredient(suggestions[highlightedIndex]);
      return;
    }

    // Otherwise directly add whatever the user typed into the text box!
    handleSelectIngredient(trimmed);
  };

  // Keyboard navigation for dropdown
  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
      }
      if (suggestions.length > 0) {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
      }
    } else if (e.key === 'ArrowUp') {
      if (suggestions.length > 0) {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // If user explicitly highlighted a dropdown item with arrow keys, add that
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelectIngredient(suggestions[highlightedIndex]);
      } else {
        // Otherwise directly add what was typed into the box!
        const trimmed = ingredientInput.trim().toLowerCase();
        if (trimmed) {
          handleSelectIngredient(trimmed);
        }
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // Remove ingredient
  const handleRemoveIngredient = (id) => {
    setPantry((prev) => prev.filter((item) => item.id !== id));
  };

  // Toggle "Expiring Soon" flag (⏰)
  const handleToggleExpiring = (id) => {
    setPantry((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, expiringSoon: !item.expiringSoon } : item
      )
    );
  };

  // Toggle dietary filter
  const handleToggleDietary = (filterId) => {
    setSelectedDietary((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  // Clear all pantry ingredients
  const handleClearPantry = () => {
    setPantry([]);
  };

  // Reset to initial demo seed
  const handleResetPantry = () => {
    setPantry(INITIAL_PANTRY);
    setRecipes(SEED_RECIPES);
    setSelectedRecipe(SEED_RECIPES[0]);
    setSelectedDietary([]);
    setErrorMessage(null);
  };

  // Execute Recipe Generation
  const handleFindRecipes = async () => {
    if (pantry.length === 0) return;

    setIsLoading(true);
    setErrorMessage(null);
    setCompletedSteps({});
    setActiveMobileTab('recipes');

    try {
      const ingredientNames = pantry.map((item) => item.name);
      const expiringNames = pantry
        .filter((item) => item.expiringSoon)
        .map((item) => item.name);

      const generated = await generateRecipes({
        ingredients: ingredientNames,
        expiringSoonList: expiringNames,
        dietaryFilters: selectedDietary,
        apiConfig
      });

      if (generated && generated.length > 0) {
        setRecipes(generated);
        setSelectedRecipe(generated[0]);
      } else {
        throw new Error('No recipes could be generated. Please try adding more ingredients.');
      }
    } catch (err) {
      console.error('Recipe generation error:', err);
      setErrorMessage(err.message || 'Failed to generate recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save Settings Modal
  const handleSaveSettings = () => {
    const newConfig = {
      provider: tempProvider,
      claudeKey: tempProvider === 'claude' ? tempApiKey : apiConfig.claudeKey,
      openAiKey: tempProvider === 'openai' ? tempApiKey : apiConfig.openAiKey
    };
    saveApiConfig(newConfig);
    setApiConfig(newConfig);
    setShowSettings(false);
  };

  // Toggle step completion in Recipe Detail
  const handleToggleStep = (index) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Copy recipe to clipboard
  const handleCopyRecipe = () => {
    if (!selectedRecipe) return;
    const text = `🍽️ ${selectedRecipe.name}\n${selectedRecipe.hook}\n\nIngredients:\n${selectedRecipe.matchedIngredients
      .map((i) => `✓ ${i}`)
      .join('\n')}\n${selectedRecipe.missingIngredients
      .map((i) => `• Need: ${i}`)
      .join('\n')}\n\nInstructions:\n${selectedRecipe.steps
      .map((s, idx) => `${idx + 1}. ${s}`)
      .join('\n')}\n\n${
      selectedRecipe.substitutionTip ? `Tip: ${selectedRecipe.substitutionTip}` : ''
    }`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2200);
  };

  const expiringCount = pantry.filter((i) => i.expiringSoon).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-logo-badge">🍳</div>
          <div>
            <div className="brand-title">
              What's Cooking
              <span className="brand-tag">AI Kitchen</span>
            </div>
            <p className="brand-sub">
              Smart recipe generator for what's already in your pantry
            </p>
          </div>
        </div>

        <div className="header-actions">
          <div className="ai-status-pill" title="Current AI Engine">
            <span className="pulse-dot"></span>
            <span className="ai-pill-text">
              {apiConfig.provider === 'claude' && apiConfig.claudeKey
                ? 'Claude 3.5'
                : apiConfig.provider === 'openai' && apiConfig.openAiKey
                ? 'GPT-4o'
                : 'AI Chef'}
            </span>
          </div>

          <button
            onClick={handleResetPantry}
            className="icon-btn-secondary"
            title="Reset demo ingredients"
          >
            <RotateCcw size={14} />
            <span className="btn-text">Reset</span>
          </button>

          <button
            onClick={() => {
              setTempProvider(apiConfig.provider);
              setTempApiKey(
                apiConfig.provider === 'claude'
                  ? apiConfig.claudeKey
                  : apiConfig.openAiKey
              );
              setShowSettings(true);
            }}
            className="icon-btn-secondary"
            title="Configure API Keys"
          >
            <Settings size={14} />
            <span className="btn-text">Settings</span>
          </button>
        </div>
      </header>

      {/* 3-Panel Main Layout */}
      <main className="app-container">
        {/* PANEL 1: PANTRY INPUT */}
        <section
          className={`panel panel-left ${
            activeMobileTab !== 'pantry' ? 'hidden-mobile' : ''
          }`}
        >
          <div>
            <h2 className="panel-header-title">
              <span>Your Pantry</span>
              <span className="results-badge" style={{ fontSize: '0.72rem' }}>
                {pantry.length} items
              </span>
            </h2>
            <p className="panel-subtitle">
              Add what you have. Mark ⏰ on items expiring soon!
            </p>
          </div>

          {/* Text Input with Intelligent Dropdown Autocomplete */}
          <div ref={dropdownRef} className="ingredient-input-wrapper">
            <form onSubmit={handleAddIngredient} className="ingredient-input-form">
              <input
                ref={inputRef}
                type="text"
                className="ingredient-input"
                placeholder="Type an ingredient (e.g. mushrooms)..."
                value={ingredientInput}
                onChange={(e) => {
                  setIngredientInput(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => {
                  if (ingredientInput.trim()) setIsDropdownOpen(true);
                }}
                onKeyDown={handleInputKeyDown}
                autoComplete="off"
              />
              <button
                type="submit"
                className="ingredient-add-btn"
                disabled={!ingredientInput.trim()}
                title="Add ingredient"
              >
                <Plus size={18} />
              </button>
            </form>

            {/* Dropdown Menu */}
            {isDropdownOpen && ingredientInput.trim() && (
              <div className="ingredient-dropdown-menu" role="listbox">
                {suggestions.length > 0 ? (
                  <>
                    <div className="dropdown-header-tip">
                      <span>Suggested Ingredients</span>
                      <span style={{ fontSize: '0.66rem', textTransform: 'none', opacity: 0.75 }}>
                        Click option to pick • ↵ to add "{ingredientInput}"
                      </span>
                    </div>

                    {suggestions.map((item, index) => {
                      const isHighlighted = index === highlightedIndex;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          className={`dropdown-item ${isHighlighted ? 'highlighted' : ''} ${
                            item.inPantry ? 'in-pantry-item' : ''
                          }`}
                          onClick={() => handleSelectIngredient(item)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                        >
                          <div className="dropdown-item-left">
                            <span className="dropdown-item-emoji">{item.emoji || '🥬'}</span>
                            <span className="dropdown-item-name">{item.name}</span>
                          </div>

                          <div className="dropdown-item-right">
                            <span className="dropdown-item-category">{item.category}</span>
                            {item.inPantry ? (
                              <span className="dropdown-item-added">In Pantry</span>
                            ) : (
                              <Plus size={13} style={{ opacity: 0.6 }} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <div className="dropdown-no-results">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Plus size={16} style={{ color: 'var(--terracotta)' }} />
                      <strong>Add "{ingredientInput}" directly</strong>
                    </div>
                    <span style={{ fontSize: '0.78rem' }}>
                      Press <kbd style={{ padding: '2px 5px', background: '#F0EBE3', borderRadius: '4px' }}>↵ Enter</kbd> or tap <strong>+</strong> to add to your pantry
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ingredient Chips */}
          <div className="chips-container">
            <div className="chips-header-row">
              <span className="section-label">
                <span>In Your Kitchen ({pantry.length})</span>
                {expiringCount > 0 && (
                  <span style={{ color: '#D97706', fontWeight: 700 }}>
                    • {expiringCount} expiring!
                  </span>
                )}
              </span>
              {pantry.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearPantry}
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--text-muted)',
                    textDecoration: 'underline'
                  }}
                >
                  Clear all
                </button>
              )}
            </div>

            {pantry.length === 0 ? (
              <div className="chip-empty-placeholder">
                <ShoppingBag size={24} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                Your pantry is empty.<br />
                Type an ingredient above or tap a staple!
              </div>
            ) : (
              <div className="chips-list">
                {pantry.map((item) => (
                  <div
                    key={item.id}
                    className={`chip ${item.expiringSoon ? 'expiring' : ''}`}
                  >
                    <span className="chip-name">{item.name}</span>

                    {/* Expiring Soon Toggle */}
                    <button
                      type="button"
                      className="chip-btn-clock"
                      onClick={() => handleToggleExpiring(item.id)}
                      title={
                        item.expiringSoon
                          ? 'Expiring soon! Click to unmark'
                          : 'Click to mark as Expiring Soon (boosts in results)'
                      }
                    >
                      <Clock
                        size={13}
                        style={{
                          color: item.expiringSoon ? '#EA580C' : 'var(--text-muted)'
                        }}
                      />
                    </button>

                    {/* Remove Chip */}
                    <button
                      type="button"
                      className="chip-btn-remove"
                      onClick={() => handleRemoveIngredient(item.id)}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dietary Filter Pills */}
          <div className="dietary-section">
            <div className="section-label">
              <UtensilsCrossed size={12} />
              <span>Dietary Filters</span>
            </div>
            <div className="filter-pills">
              {DIETARY_OPTIONS.map((filter) => {
                const isActive = selectedDietary.includes(filter.id);
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => handleToggleDietary(filter.id)}
                    className={`filter-pill ${isActive ? 'active' : ''}`}
                  >
                    <span>{filter.icon}</span>
                    <span>{filter.label}</span>
                    {isActive && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action: Find Recipes */}
          <div className="panel-bottom-cta">
            <button
              type="button"
              className="btn-generate"
              disabled={pantry.length === 0 || isLoading}
              onClick={handleFindRecipes}
            >
              <ChefHat size={20} />
              <span>{isLoading ? 'AI Cooking...' : 'Find Recipes'}</span>
            </button>
            {pantry.length === 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Add at least 1 ingredient to find recipes
              </p>
            )}
          </div>
        </section>

        {/* PANEL 2: RECIPE RESULTS */}
        <section
          className={`panel panel-center ${
            activeMobileTab !== 'recipes' ? 'hidden-mobile' : ''
          }`}
        >
          <div className="results-header">
            <div>
              <h2 className="results-title">Recipe Matches</h2>
              <p className="panel-subtitle">
                Tailored to your {pantry.length} pantry ingredients
                {expiringCount > 0 ? ` (${expiringCount} prioritized expiring soon)` : ''}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="results-badge">
                <Flame size={14} style={{ color: 'var(--terracotta)' }} />
                <span>{recipes.length} Delicious Options</span>
              </span>
            </div>
          </div>

          {/* Error Banner with Retry */}
          {errorMessage && (
            <div className="error-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                className="btn-retry"
                onClick={handleFindRecipes}
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton State */}
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="loading-banner">
                <div className="chef-stirring-icon">🍲</div>
                <div className="loading-phrase">{loadingPhrases[loadingPhraseIndex]}</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Analyzing {pantry.length} ingredients with culinary pairing science...
                </p>
              </div>

              <div className="recipes-grid">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-bar" style={{ height: '22px', width: '70%' }}></div>
                    <div className="skeleton-bar" style={{ height: '14px', width: '90%' }}></div>
                    <div className="skeleton-bar" style={{ height: '14px', width: '80%' }}></div>
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                      <div className="skeleton-bar" style={{ height: '24px', width: '80px', borderRadius: '999px' }}></div>
                      <div className="skeleton-bar" style={{ height: '24px', width: '100px', borderRadius: '999px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Recipe Results 2-Column Grid */
            <div className="recipes-grid">
              {recipes.map((recipe) => {
                const isSelected = selectedRecipe?.id === recipe.id;
                const matchPct = Math.round((recipe.matchScore || 0.8) * 100);
                const haveCount = recipe.matchedIngredients?.length || 0;
                const totalCount = haveCount + (recipe.missingIngredients?.length || 0);

                // Does this recipe use any expiring items?
                const usesExpiringItem = pantry
                  .filter((p) => p.expiringSoon)
                  .some((exp) =>
                    recipe.matchedIngredients?.some((m) =>
                      m.toLowerCase().includes(exp.name.toLowerCase())
                    )
                  );

                return (
                  <article
                    key={recipe.id}
                    className={`recipe-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRecipe(recipe);
                      setCompletedSteps({});
                      // On smaller screens, switch directly to detail
                      if (window.innerWidth <= 1024) {
                        setActiveMobileTab('detail');
                      }
                    }}
                  >
                    <div className="card-top-row">
                      <h3 className="card-title">{recipe.name}</h3>
                      {usesExpiringItem && (
                        <span className="tag-expiring" title="Uses an expiring ingredient!">
                          <Clock size={11} /> Expiring
                        </span>
                      )}
                    </div>

                    <p className="card-hook">{recipe.hook}</p>

                    {/* Match Indicator */}
                    <div className="match-indicator-container">
                      <div className="match-row">
                        <span className="match-count">
                          <Check size={13} style={{ color: 'var(--olive)' }} />
                          {haveCount}/{totalCount || haveCount} ingredients you have
                        </span>
                        <span className="match-percent">{matchPct}% match</span>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${matchPct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Card Tags: Missing staples & Dietary */}
                    <div className="card-tags">
                      {recipe.missingIngredients && recipe.missingIngredients.length > 0 ? (
                        <span className="tag-missing">
                          Missing: {recipe.missingIngredients.slice(0, 2).join(', ')}
                          {recipe.missingIngredients.length > 2
                            ? ` +${recipe.missingIngredients.length - 2}`
                            : ''}
                        </span>
                      ) : (
                        <span className="tag-dietary" style={{ background: '#E2ECD5', color: '#364B20' }}>
                          ✓ 100% In Pantry!
                        </span>
                      )}

                      {recipe.dietaryTags?.map((tag) => (
                        <span key={tag} className="tag-dietary">
                          {tag}
                        </span>
                      ))}

                      {recipe.cookTime && (
                        <span className="tag-dietary" style={{ marginLeft: 'auto' }}>
                          ⏱ {recipe.cookTime}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* PANEL 3: RECIPE DETAIL */}
        <section
          className={`panel panel-right ${
            activeMobileTab !== 'detail' ? 'hidden-mobile' : ''
          }`}
        >
          {/* Mobile Back Button */}
          <button
            type="button"
            onClick={() => setActiveMobileTab('recipes')}
            className="mobile-back-to-recipes-btn"
          >
            <ArrowLeft size={16} />
            <span>← Back to Recipes</span>
          </button>

          {selectedRecipe ? (
            <>
              {/* Detail Header */}
              <div className="detail-header-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="results-badge">
                    <Check size={12} />
                    {Math.round((selectedRecipe.matchScore || 0.8) * 100)}% Match
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyRecipe}
                    className="icon-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    title="Copy formatted recipe"
                  >
                    {copiedNotification ? (
                      <>
                        <CheckCheck size={13} style={{ color: 'var(--olive)' }} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <h2 className="detail-title">{selectedRecipe.name}</h2>
                <p className="detail-hook">{selectedRecipe.hook}</p>

                <div className="detail-meta-row">
                  <span className="meta-chip">
                    <Clock size={13} />
                    {selectedRecipe.cookTime || '20 min'}
                  </span>
                  <span className="meta-chip">
                    <UtensilsCrossed size={13} />
                    {selectedRecipe.servings || '2 servings'}
                  </span>
                  <span className="meta-chip">
                    <Flame size={13} />
                    {selectedRecipe.difficulty || 'Easy'}
                  </span>
                </div>
              </div>

              {/* Ingredients Checklist */}
              <div>
                <h3 className="detail-section-title">
                  <ShoppingBag size={16} style={{ color: 'var(--terracotta)' }} />
                  <span>Ingredients Breakdown</span>
                </h3>

                <div className="ingredient-detail-list">
                  {/* Matched Ingredients (You Have) */}
                  {selectedRecipe.matchedIngredients?.map((ing, idx) => (
                    <div key={`have-${idx}`} className="ingredient-item have">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={14} style={{ color: 'var(--olive)' }} />
                        <span style={{ textTransform: 'capitalize' }}>{ing}</span>
                      </div>
                      <span className="ing-badge have">You have</span>
                    </div>
                  ))}

                  {/* Missing Ingredients (Need to buy) */}
                  {selectedRecipe.missingIngredients?.map((ing, idx) => (
                    <div key={`miss-${idx}`} className="ingredient-item missing">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={14} style={{ color: 'var(--amber)' }} />
                        <span style={{ textTransform: 'capitalize' }}>{ing}</span>
                      </div>
                      <span className="ing-badge missing">Need to buy</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 className="detail-section-title" style={{ margin: 0 }}>
                    <ChefHat size={16} style={{ color: 'var(--terracotta)' }} />
                    <span>Step-by-Step Instructions</span>
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Tap step when cooked
                  </span>
                </div>

                <div className="steps-list">
                  {selectedRecipe.steps?.map((step, idx) => {
                    const isDone = completedSteps[idx];
                    return (
                      <div
                        key={idx}
                        className={`step-item ${isDone ? 'completed' : ''}`}
                        onClick={() => handleToggleStep(idx)}
                      >
                        <div className="step-number">
                          {isDone ? <Check size={12} /> : idx + 1}
                        </div>
                        <p style={{ flex: 1 }}>{step}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Substitution Tip Box */}
              {selectedRecipe.substitutionTip && (
                <div className="substitution-box">
                  <div className="substitution-icon">💡</div>
                  <div className="substitution-content">
                    <div className="substitution-title">Chef's Substitution Tip</div>
                    <div>{selectedRecipe.substitutionTip}</div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="detail-empty-state">
              <div className="empty-icon">📖</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-main)' }}>
                No recipe selected
              </h3>
              <p style={{ fontSize: '0.85rem' }}>
                Click on any recipe card in the center panel to view its complete ingredients breakdown, steps, and substitution tips.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Mobile Navigation Tabs */}
      <nav className="mobile-view-tabs" aria-label="Mobile View Navigation">
        <button
          type="button"
          className={`mobile-tab-btn ${activeMobileTab === 'pantry' ? 'active' : ''}`}
          onClick={() => setActiveMobileTab('pantry')}
        >
          <div className="tab-icon-wrap">
            <ShoppingBag size={18} />
            {pantry.length > 0 && <span className="tab-badge">{pantry.length}</span>}
          </div>
          <span>Pantry</span>
        </button>
        <button
          type="button"
          className={`mobile-tab-btn ${activeMobileTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveMobileTab('recipes')}
        >
          <div className="tab-icon-wrap">
            <UtensilsCrossed size={18} />
            {recipes.length > 0 && <span className="tab-badge">{recipes.length}</span>}
          </div>
          <span>Recipes</span>
        </button>
        <button
          type="button"
          className={`mobile-tab-btn ${activeMobileTab === 'detail' ? 'active' : ''}`}
          onClick={() => setActiveMobileTab('detail')}
        >
          <div className="tab-icon-wrap">
            <ChefHat size={18} />
          </div>
          <span>Detail</span>
        </button>
      </nav>

      {/* Settings & API Key Configuration Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">AI Engine Settings</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowSettings(false)}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Choose your recipe generation engine. You can use Anthropic Claude, OpenAI, or the built-in Smart AI Chef engine (which requires no API key).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                SELECT PROVIDER
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button
                  type="button"
                  className={`filter-pill ${tempProvider === 'claude' ? 'active' : ''}`}
                  onClick={() => {
                    setTempProvider('claude');
                    setTempApiKey(apiConfig.claudeKey || '');
                  }}
                  style={{ justifyContent: 'center' }}
                >
                  Claude 3.5
                </button>
                <button
                  type="button"
                  className={`filter-pill ${tempProvider === 'openai' ? 'active' : ''}`}
                  onClick={() => {
                    setTempProvider('openai');
                    setTempApiKey(apiConfig.openAiKey || '');
                  }}
                  style={{ justifyContent: 'center' }}
                >
                  OpenAI GPT-4o
                </button>
                <button
                  type="button"
                  className={`filter-pill ${tempProvider === 'demo' ? 'active' : ''}`}
                  onClick={() => {
                    setTempProvider('demo');
                    setTempApiKey('');
                  }}
                  style={{ justifyContent: 'center' }}
                >
                  Smart Local AI
                </button>
              </div>
            </div>

            {tempProvider !== 'demo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {tempProvider === 'claude' ? 'ANTHROPIC API KEY' : 'OPENAI API KEY'}
                </label>
                <input
                  type="password"
                  className="ingredient-input"
                  style={{ padding: '10px 14px' }}
                  placeholder={
                    tempProvider === 'claude'
                      ? 'sk-ant-api03-...'
                      : 'sk-proj-...'
                  }
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Keys are stored locally in your browser session for live calls.
                </span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                className="icon-btn-secondary"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-generate"
                style={{ width: 'auto', padding: '10px 20px' }}
                onClick={handleSaveSettings}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

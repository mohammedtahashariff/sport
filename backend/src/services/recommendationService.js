// AI Recommendation Engine for SportKart

/**
 * Complementary sports accessories map for bundle & cross-sell logic
 */
const COMPLEMENTARY_CATEGORY_MAP = {
  Cricket: ["Cricket", "Accessories", "Sports Shoes", "Sports Clothing"],
  Football: ["Football", "Sports Shoes", "Sports Clothing", "Accessories"],
  Badminton: ["Badminton", "Sports Shoes", "Accessories", "Sports Clothing"],
  Fitness: ["Gym Accessories", "Fitness", "Running", "Sports Clothing"],
  "Gym Accessories": ["Fitness", "Gym Accessories", "Sports Clothing"],
  Running: ["Sports Shoes", "Running", "Accessories", "Sports Clothing"],
  Tennis: ["Tennis", "Sports Shoes", "Accessories"],
  Basketball: ["Basketball", "Sports Shoes", "Sports Clothing"],
  Volleyball: ["Volleyball", "Sports Shoes", "Sports Clothing"]
};

/**
 * Generates personalized AI recommendations based on user interaction signals
 */
function generatePersonalizedRecommendations({
  allProducts,
  user = null,
  currentProductId = null,
  limit = 8
}) {
  let scoredProducts = [...allProducts];

  // If calculating for a single product details page
  if (currentProductId) {
    const currentProd = allProducts.find(p => p.id === currentProductId || p._id?.toString() === currentProductId);
    if (currentProd) {
      const complementaryCats = COMPLEMENTARY_CATEGORY_MAP[currentProd.category] || [currentProd.category];

      scoredProducts = scoredProducts
        .filter(p => (p.id !== currentProductId && p._id?.toString() !== currentProductId))
        .map(prod => {
          let score = 0;
          let reason = "Popular in your area";

          if (prod.category === currentProd.category) {
            score += 60;
            reason = `More in ${currentProd.category}`;
          } else if (complementaryCats.includes(prod.category)) {
            score += 50;
            reason = `Essential companion for ${currentProd.name.split(" ")[0]}`;
          }

          if (prod.brand === currentProd.brand) {
            score += 25;
            reason = `Matching ${prod.brand} gear`;
          }

          if (prod.rating >= 4.7) score += 15;
          if (prod.isFeatured) score += 10;

          return { ...prod, aiScore: score, aiReason: reason };
        })
        .sort((a, b) => b.aiScore - a.aiScore);

      return scoredProducts.slice(0, limit);
    }
  }

  // If user is authenticated, compute profile-based affinities
  const categoryWeights = {};
  if (user) {
    // Browsing history weighting
    if (user.browsingHistory && user.browsingHistory.length > 0) {
      user.browsingHistory.forEach(item => {
        if (item.category) {
          categoryWeights[item.category] = (categoryWeights[item.category] || 0) + 15;
        }
      });
    }

    // Preferred categories weighting
    if (user.preferredCategories && user.preferredCategories.length > 0) {
      user.preferredCategories.forEach(cat => {
        categoryWeights[cat] = (categoryWeights[cat] || 0) + 25;
      });
    }

    // Search query keyword heuristic
    if (user.searchHistory && user.searchHistory.length > 0) {
      user.searchHistory.forEach(s => {
        const q = (s.query || '').toLowerCase();
        if (q.includes('cricket')) categoryWeights['Cricket'] = (categoryWeights['Cricket'] || 0) + 20;
        if (q.includes('badminton') || q.includes('racket') || q.includes('shuttle')) categoryWeights['Badminton'] = (categoryWeights['Badminton'] || 0) + 20;
        if (q.includes('football') || q.includes('nivia')) categoryWeights['Football'] = (categoryWeights['Football'] || 0) + 20;
        if (q.includes('gym') || q.includes('dumbbell') || q.includes('fitness')) categoryWeights['Fitness'] = (categoryWeights['Fitness'] || 0) + 20;
      });
    }
  }

  // Score all products
  scoredProducts = scoredProducts.map(prod => {
    let score = (prod.rating || 4.5) * 10;
    let reason = "Top Rated in Tiptur";

    const userCatAffinity = categoryWeights[prod.category] || 0;
    if (userCatAffinity > 0) {
      score += userCatAffinity;
      reason = `Based on your interest in ${prod.category}`;
    }

    if (prod.isFeatured) {
      score += 15;
      if (userCatAffinity === 0) reason = "Trending in Local Stores";
    }

    if (prod.discount >= 15) {
      score += 10;
      if (userCatAffinity === 0) reason = `Hot Deal (${prod.discount}% Off)`;
    }

    return { ...prod, aiScore: score, aiReason: reason };
  });

  scoredProducts.sort((a, b) => b.aiScore - a.aiScore);
  return scoredProducts.slice(0, limit);
}

module.exports = {
  generatePersonalizedRecommendations,
  COMPLEMENTARY_CATEGORY_MAP
};

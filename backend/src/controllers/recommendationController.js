const memoryStore = require('../services/memoryDb');
const { generatePersonalizedRecommendations } = require('../services/recommendationService');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

exports.getRecommendations = async (req, res) => {
  try {
    const { productId, limit = 8 } = req.query;

    let user = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        user = memoryStore.findUserById(decoded.id);
      } catch (e) {
        // guest mode
      }
    }

    const allProducts = memoryStore.getProducts();

    // 1. Personalized recommendations
    const personalized = generatePersonalizedRecommendations({
      allProducts,
      user,
      currentProductId: productId,
      limit: parseInt(limit, 10)
    });

    // 2. Trending in Tiptur (High rating + discount)
    const trendingNearYou = allProducts
      .filter(p => p.rating >= 4.7)
      .slice(0, 6)
      .map(p => ({ ...p, aiReason: "🔥 Most purchased in Tiptur this week" }));

    // 3. Category based bundles
    const cricketEssentials = allProducts
      .filter(p => p.category === 'Cricket')
      .slice(0, 4)
      .map(p => ({ ...p, aiReason: "🏏 Cricket tournament favorite" }));

    const badmintonEssentials = allProducts
      .filter(p => p.category === 'Badminton')
      .slice(0, 4)
      .map(p => ({ ...p, aiReason: "🏸 Pro badminton gear" }));

    const fitnessEssentials = allProducts
      .filter(p => p.category === 'Fitness' || p.category === 'Gym Accessories')
      .slice(0, 4)
      .map(p => ({ ...p, aiReason: "💪 Top gym & fitness picks" }));

    res.json({
      success: true,
      personalized,
      trendingNearYou,
      sections: [
        {
          id: 'personalized',
          title: user ? `Personalized for ${user.name.split(' ')[0]}` : "Recommended For You",
          subtitle: "AI-curated sports gear matching your playing style & browsing habits",
          products: personalized
        },
        {
          id: 'trending',
          title: "Popular Near You in Tiptur",
          subtitle: "Highly rated sports gear picked up by local players today",
          products: trendingNearYou
        },
        {
          id: 'cricket',
          title: "Top Cricket Gear & Accessories",
          subtitle: "Premium English Willow bats, match balls, and tournament pads",
          products: cricketEssentials
        },
        {
          id: 'badminton',
          title: "Badminton Court Essentials",
          subtitle: "High-tension graphite rackets and championship shuttlecocks",
          products: badmintonEssentials
        },
        {
          id: 'fitness',
          title: "Home Gym & Fitness Accessories",
          subtitle: "Anti-slip dumbbells, resistance loops, and workout shakers",
          products: fitnessEssentials
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

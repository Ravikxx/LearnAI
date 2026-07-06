// Course: Recommender Systems
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'recsys',
  title: 'Recommender Systems',
  tagline: 'The quiet AI that decides what you see next',
  icon: '📺',
  accent: 'var(--series-13)',
  description: 'The most-used AI on Earth isn\'t a chatbot — it\'s the recommender picking your feed, your next video, your ads. This course shows how it works: the ratings matrix, collaborative filtering, learned user and item embeddings, and the feedback loops that shape what billions of people see.',
  lessons: [
    {
      id: 'the-problem',
      title: 'The recommendation problem',
      minutes: 9,
      steps: [
        { t: 'text', title: 'A giant, mostly-empty grid', md: `
          <p>Picture a colossal table: one row per user, one column per item (movie, product, song). A cell holds how much that user likes that item. The recommender\'s job: <strong>fill in the blanks</strong> — predict the ratings for items a user hasn\'t seen, then show the highest predicted ones.</p>
          <p>The catch is that this matrix is almost entirely empty. With a million users and a million items, any one user has interacted with a vanishing fraction. The data is <strong>massive and extremely sparse</strong> — and that shapes every technique that follows.</p>` },
        { t: 'quiz',
          q: 'At its core, what is a recommender system trying to do with the user–item ratings matrix?',
          opts: [
            'Store every rating every user has already given',
            'Predict the missing entries — how much a user would like items they haven\'t interacted with — then surface the top ones',
            'Sort items alphabetically for each user',
          ],
          a: 1,
          why: 'The known ratings are just the input. The goal is filling the blanks: estimating preference for the vast majority of items a user hasn\'t touched, so the system can recommend the ones it predicts they\'ll love. It\'s prediction over a mostly-empty grid.' },
        { t: 'text', title: 'Explicit vs implicit signals', md: `
          <p>Where do the ratings come from? Two sources:</p>
          <ul>
            <li><strong>Explicit feedback</strong> — the user directly rates something: 5 stars, a thumbs-up. Accurate, but rare — most people don\'t bother rating.</li>
            <li><strong>Implicit feedback</strong> — behavior that reveals preference: watched to the end, clicked, added to cart, replayed, or scrolled past. Abundant and always-on, but noisy (a click isn\'t a guarantee you liked it).</li>
          </ul>
          <p>Real systems lean heavily on implicit signals, because there\'s so much more of it. Every second you spend (or don\'t) is data.</p>` },
        { t: 'quiz',
          q: 'Why do large platforms rely more on implicit feedback (watch time, clicks) than explicit ratings (stars)?',
          opts: [
            'Explicit ratings are illegal to collect',
            'Almost no one leaves explicit ratings, while implicit behavioral signals are abundant and collected automatically — far more data to learn from',
            'Implicit feedback is always perfectly accurate',
          ],
          a: 1,
          why: 'Explicit ratings are gold but scarce — most users never rate anything. Implicit signals (did you finish the video? did you scroll past?) are generated constantly by everyone, giving vastly more training data, even though each signal is noisier than a deliberate rating.' },
      ],
    },
    {
      id: 'collaborative-filtering',
      title: 'Collaborative filtering',
      minutes: 10,
      steps: [
        { t: 'text', title: 'People like you liked...', md: `
          <p>The breakthrough idea needs no understanding of the items at all. <strong>Collaborative filtering</strong> predicts your preferences from the behavior of <em>other</em> users who are similar to you.</p>
          <p>Two flavors of the same intuition:</p>
          <ul>
            <li><strong>User-based</strong> — "find users with taste like yours; recommend what they liked that you haven\'t seen."</li>
            <li><strong>Item-based</strong> — "you liked X; find items that people tend to like alongside X; recommend those." (Amazon\'s classic "customers who bought this also bought.")</li>
          </ul>
          <p>The magic: the system doesn\'t need to know a movie\'s genre or a product\'s specs. It learns purely from the <em>pattern of who-likes-what</em>. The crowd\'s behavior encodes the similarities.</p>` },
        { t: 'quiz',
          q: 'What information does pure collaborative filtering need about the items themselves?',
          opts: [
            'Detailed descriptions: genre, price, specs, tags',
            'None — it works purely from the pattern of which users interacted with which items, no item content required',
            'Only the item\'s price',
          ],
          a: 1,
          why: 'That\'s what makes collaborative filtering powerful and general: it ignores item content entirely and learns from co-occurrence in user behavior. "People who liked these also liked that" needs no genres or descriptions — just the interaction pattern. (Content-based methods, which do use item features, are a separate approach.)' },
        { t: 'text', title: 'The cold-start problem', md: `
          <p>Collaborative filtering has an Achilles\' heel. A <strong>brand-new user</strong> with no history has no similar users to compare against. A <strong>brand-new item</strong> nobody has touched yet can\'t be recommended by co-occurrence. This is the <strong>cold-start problem</strong>.</p>
          <p>It\'s why apps ask "pick a few things you like" when you sign up (bootstrapping your profile), and why new items often get a deliberate exploration boost or fall back on content-based features (genre, description) until enough interaction data accumulates.</p>` },
        { t: 'quiz',
          q: 'A streaming service adds a brand-new show nobody has watched yet. Why can\'t collaborative filtering recommend it well?',
          opts: [
            'The show is too long',
            'With no interaction data, there\'s no co-occurrence pattern to learn from — the cold-start problem — so the system must fall back on content features or deliberate exploration',
            'Collaborative filtering only works for music',
          ],
          a: 1,
          why: 'Collaborative filtering runs entirely on interaction patterns, so a zero-interaction item is invisible to it. That\'s cold start. Systems bridge it with content-based signals (what the show is about) or by intentionally showing it to some users to gather the first data.' },
      ],
    },
    {
      id: 'embeddings-mf',
      title: 'Embeddings & matrix factorization',
      minutes: 11,
      steps: [
        { t: 'text', title: 'Learn a vector for everything', md: `
          <p>Modern recommenders turn collaborative filtering into the geometry you met in the embeddings lessons. The idea, called <strong>matrix factorization</strong>: learn a vector (an embedding) for every user and every item, in the same shared space.</p>
          <p>The dimensions aren\'t labeled, but they capture latent taste factors the model discovers on its own — maybe one axis ends up tracking "gritty ↔ lighthearted," another "mainstream ↔ niche." A user\'s vector says what they like; an item\'s vector says what it offers.</p>
          <p>Predicted preference is then just the <strong>dot product</strong> of the two vectors: aligned user and item vectors → high predicted rating. Training adjusts all the vectors (by gradient descent) so the dot products match the known ratings — then the un-known ones become predictions.</p>` },
        { t: 'widget', name: 'embeddings', title: 'Try it: users and items in one space', md: `
          <p>Imagine each point here is a <em>user</em> or an <em>item</em> placed in the learned taste-space. Click one to see its nearest neighbors — a recommender does exactly this: an item near your user-vector is a strong recommendation. "Nearby in the space" <em>is</em> "predicted to like."</p>` },
        { t: 'quiz',
          q: 'In matrix factorization, how is a user\'s predicted preference for an item computed?',
          opts: [
            'By counting how many times they clicked it',
            'By the dot product (alignment) of the learned user vector and item vector — well-aligned vectors mean high predicted preference',
            'By the item\'s average rating across everyone',
          ],
          a: 1,
          why: 'Both users and items become vectors in one space; their dot product scores the match. Training tunes the vectors so known ratings are reproduced, and the same dot product then predicts unknown ones. It\'s the "meaning as geometry" idea from embeddings, applied to taste: closeness = predicted preference.' },
        { t: 'text', title: 'Why vectors beat raw neighbor-counting', md: `
          <p>Learned embeddings fix collaborative filtering\'s biggest weakness. Raw user-similarity needs two users to have rated the <em>same</em> items to compare them. Embeddings don\'t: by compressing everyone into a shared low-dimensional space, the model connects users through <em>chains</em> of overlapping taste, uncovering structure that direct overlap would miss. It also scales — comparing short vectors is far cheaper than scanning millions of raw histories.</p>
          <p>This is why deep-learning recommenders (two-tower networks, etc.) now dominate: they learn rich user and item embeddings and rank by similarity, exactly the pattern powering search and RAG.</p>` },
        { t: 'quiz',
          q: 'What advantage do learned user/item embeddings have over directly comparing users\' raw rating histories?',
          opts: [
            'They require every pair of users to have rated the same items',
            'They place users and items in a shared compact space, connecting tastes even without direct overlap and making comparisons cheap and scalable',
            'They ignore user behavior entirely',
          ],
          a: 1,
          why: 'Raw neighbor-comparison needs overlapping ratings to work and is expensive at scale. Embeddings compress everyone into a shared space, so the model finds latent taste connections through indirect chains and ranks by cheap vector similarity — more expressive and far more scalable.' },
      ],
    },
    {
      id: 'ranking-loops',
      title: 'Ranking, loops & pitfalls',
      minutes: 10,
      steps: [
        { t: 'text', title: 'From prediction to a feed', md: `
          <p>Predicting preferences is only half the system. The other half is <strong>ranking</strong>: ordering candidate items into the actual feed you see. Real rankers optimize a blend of objectives — predicted enjoyment, yes, but also freshness, diversity, and, for ad-supported platforms, <em>engagement</em> (time spent, clicks) because that drives revenue.</p>
          <p>That last objective is fateful. When the system is tuned to maximize engagement, it recommends whatever keeps you scrolling — which is not always what\'s good for you, or even what you\'d say you prefer.</p>` },
        { t: 'quiz',
          q: 'Many commercial recommenders optimize heavily for "engagement" (time spent, clicks). What\'s the concern?',
          opts: [
            'Engagement always matches what\'s best for the user',
            'What maximizes engagement (outrage, endless autoplay, addictive content) can diverge from what users actually value or would choose on reflection',
            'Engagement is impossible to measure',
          ],
          a: 1,
          why: 'Engagement is a proxy — like every proxy in this site, optimizing it hard can miss the real goal. Content that hooks attention (sensational, outrage-inducing, autoplaying) wins on engagement while diverging from genuine user well-being or stated preference. It\'s the alignment problem, wearing a feed.' },
        { t: 'text', title: 'Feedback loops and filter bubbles', md: `
          <p>Recommenders have a property most ML systems don\'t: <strong>they shape the very data they learn from.</strong> The system shows you things → you interact → those interactions become training data → the system shows you more of that. A <strong>feedback loop</strong>.</p>
          <p>This produces <strong>filter bubbles</strong>: show someone one viewpoint, they engage, so they get more of it, narrowing what they ever see. It can amplify biases (popular items get shown more, becoming more popular regardless of quality) and trap users in narrow content niches. Combating it takes deliberate <strong>exploration</strong> and diversity injection — the same explore/exploit tension from reinforcement learning, now with social stakes.</p>` },
        { t: 'quiz',
          q: 'Why are recommender feedback loops different from, say, a spam classifier\'s behavior?',
          opts: [
            'They aren\'t different at all',
            'A recommender influences what users see and do, so it shapes its own future training data — creating self-reinforcing loops like filter bubbles that a passive classifier doesn\'t cause',
            'Spam classifiers use more data',
          ],
          a: 1,
          why: 'A spam filter observes; a recommender intervenes. By choosing what you see, it changes what you interact with, which becomes its next training data — a loop that can narrow content into filter bubbles and amplify popularity. Countering it needs deliberate exploration and diversity, echoing RL\'s explore/exploit balance.' },
        { t: 'text', title: '🎓 You can read the feed now', md: `
          <p>You understand the AI that quietly shapes what billions of people watch, buy, and read:</p>
          <ul>
            <li><strong>The problem</strong> — fill in a massive, sparse user–item matrix from mostly implicit signals</li>
            <li><strong>Collaborative filtering</strong> — predict from similar users\' behavior, no item content needed; cold start is the catch</li>
            <li><strong>Embeddings &amp; matrix factorization</strong> — learn user/item vectors; dot product = predicted preference</li>
            <li><strong>Ranking &amp; loops</strong> — engagement objectives and feedback loops that create filter bubbles</li>
          </ul>
          <p>Next up: the final concept course, <strong>AI Safety &amp; Alignment</strong> — where the proxy-optimization theme running through every course gets its own deep treatment.</p>` },
      ],
    },
  ],
});

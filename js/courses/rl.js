// Course: Reinforcement Learning
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'rl',
  title: 'Reinforcement Learning',
  tagline: 'Learning from reward: how AI masters games and more',
  icon: '🎮',
  accent: 'var(--series-12)',
  description: 'You met game-playing agents in the survey course and watched one learn in the gridworld. This is the full story of how learning-from-reward actually works: value, Q-learning, exploration, deep RL, and self-play — the paradigm behind AlphaGo and a key ingredient in ChatGPT.',
  lessons: [
    {
      id: 'learning-from-reward',
      title: 'Learning from reward',
      minutes: 10,
      steps: [
        { t: 'text', title: 'A third way to learn', md: `
          <p>Two paradigms you know: <strong>supervised</strong> learning (learn from labeled answers) and <strong>unsupervised</strong> (find structure with no labels). <strong>Reinforcement learning (RL)</strong> is the third, and it\'s different in kind: an <em>agent</em> learns by acting in an <em>environment</em> and receiving <strong>reward</strong>.</p>
          <p>The loop: the agent observes the <strong>state</strong> (the situation, as numbers), picks an <strong>action</strong>, and the environment returns a <strong>reward</strong> plus the next state. Repeat — the agent\'s goal is to maximize total reward over time. Nobody ever tells it the correct action; it must <em>discover</em> which actions lead to reward.</p>` },
        { t: 'quiz',
          q: 'What replaces the "labeled correct answers" of supervised learning in RL?',
          opts: [
            'A human labels the best action at every step',
            'A reward signal — the agent tries actions and learns from the numeric outcome, never told which action was correct',
            'Nothing; RL is a form of supervised learning',
          ],
          a: 1,
          why: 'RL learns from evaluative feedback ("how good was that?") rather than instructive feedback ("here\'s the right answer"). The reward tells the agent how well things went, not what it should have done — which is why RL can master problems no human can label move-by-move.' },
        { t: 'text', title: 'The explore–exploit dilemma', md: `
          <p>An RL agent faces a tension with no perfect answer: should it <strong>exploit</strong> — take the action it currently believes is best — or <strong>explore</strong> — try something new that might be even better (or worse)?</p>
          <p>Pure exploitation gets stuck on the first decent strategy it finds; pure exploration never cashes in on what it learned. Every RL method needs a way to balance the two.</p>
          <div class="callout">💡 It\'s the restaurant problem: always order your usual favorite (exploit) and you\'ll never find a dish you\'d love more (explore). Good agents do mostly-favorite, sometimes-adventurous.</div>` },
        { t: 'widget', name: 'match', title: 'Try it: match the RL term to its meaning', md: `
          <p>Pair each piece of RL vocabulary with what it means.</p>`,
          pairs: [
            ['State', 'The situation the agent observes, represented as numbers'],
            ['Action', 'What the agent chooses to do in a given state'],
            ['Reward', 'The numeric feedback signal the environment returns'],
            ['Agent', 'The learner making decisions by interacting with the environment'],
            ['Exploit', 'Take the action currently believed to be best'],
            ['Explore', 'Try a new action that might turn out better (or worse)'],
          ] },
        { t: 'quiz',
          q: 'An agent always picks the action it currently thinks is best and never tries anything else. What goes wrong?',
          opts: [
            'Nothing — always exploiting is optimal',
            'It can get stuck on a mediocre strategy, never exploring enough to discover a genuinely better one',
            'It explores too much and wastes time',
          ],
          a: 1,
          why: 'Pure exploitation locks in the first decent strategy found and never looks for better. Without exploration, the agent can\'t discover superior actions it hasn\'t tried. Balancing exploit (use what you know) against explore (gather new info) is fundamental to all of RL.' },
      ],
    },
    {
      id: 'value-q-learning',
      title: 'Value & Q-learning',
      minutes: 12,
      steps: [
        { t: 'text', title: 'How good is this situation?', md: `
          <p>To act well, an agent needs to judge not just immediate reward but <em>long-term</em> payoff — a move that scores nothing now but sets up a win later is good. This is a <strong>value</strong>: the total future reward you can expect from a state (or from taking an action in a state).</p>
          <p>The action-value is the <strong>Q-value</strong>, <code>Q(state, action)</code>: "if I take this action here and play well afterward, how much total reward do I expect?" If the agent knew every Q-value, acting optimally would be trivial — in each state, pick the action with the highest Q.</p>` },
        { t: 'quiz',
          q: 'Why does an agent need a notion of "value" rather than just chasing immediate reward?',
          opts: [
            'Immediate reward is always the best guide',
            'Some actions pay off only later; value captures expected long-term reward, so the agent can favor moves that set up future gains',
            'Value and immediate reward are the same thing',
          ],
          a: 1,
          why: 'Greedy immediate-reward chasing misses setups — a sacrifice in chess, a slow investment. Value estimates total future reward, letting the agent prefer actions that lead somewhere good even if they pay nothing right now. Long-horizon thinking is the whole point.' },
        { t: 'text', title: 'The Q-learning update', md: `
          <p>The agent doesn\'t know the Q-values — it learns them from experience. After taking action <code>a</code> in state <code>s</code>, getting reward <code>r</code>, and landing in state <code>s\'</code>, <strong>Q-learning</strong> nudges its estimate:</p>
          <pre><code>Q(s,a) ← Q(s,a) + α · [ r + γ · maxₐ Q(s',a') − Q(s,a) ]</code></pre>
          <p>In words: blend the estimate toward "the reward I just got, plus the value of the best next action." <code>γ</code> (0–1) discounts future reward slightly below immediate reward; <code>α</code> controls how big each nudge is. Run this millions of times and Q-values converge toward the truth.</p>
          <div class="callout">💡 Q-learning is <strong>off-policy</strong>: notice the <code>max</code> — it learns the value of the <em>best</em> next move, even while the agent is exploring random ones. So it can learn the optimal strategy from messy, exploratory experience.</div>` },
        { t: 'widget', name: 'rlagent', title: 'Try it: Q-learning in action', md: `
          <p>The gridworld from the survey course, now with the machinery named. Each cell\'s color is <code>maxₐ Q(s,a)</code> — the value the agent has learned. Press <strong>Train</strong> and watch those Q-values propagate <em>backward</em> from the goal (★) as the update above fires over and over. The arrows are the agent picking the highest-Q action in each state.</p>` },
        { t: 'quiz',
          q: 'Q-learning uses "r + γ·maxₐ Q(s\',a\')" in its update. What does that max term mean it\'s learning?',
          opts: [
            'The value of whatever random action it happened to explore',
            'The value assuming the best possible next action — which is why Q-learning can learn the optimal policy even while exploring suboptimal moves (it\'s off-policy)',
            'The average of all possible next actions',
          ],
          a: 1,
          why: 'The max bootstraps toward optimal play: each state\'s value is updated as if the agent will act best afterward. That off-policy property lets Q-learning explore freely (try random moves for information) while still converging on the optimal strategy. In the widget, this is why value spreads outward from the goal.' },
      ],
    },
    {
      id: 'deep-rl',
      title: 'From tables to deep RL',
      minutes: 11,
      steps: [
        { t: 'text', title: 'Why a table stops working', md: `
          <p>The gridworld has 36 states, so its Q-values fit in a small table. Real problems explode: the possible screens in an Atari game, or board positions in Go (more than the atoms in the universe), can never be enumerated. You\'d never even <em>visit</em> most states once.</p>
          <p>The fix: replace the lookup table with a <strong>neural network</strong> that <em>approximates</em> Q-values. Feed it a state (raw pixels, a board), and it outputs estimated Q-values for each action — and it <strong>generalizes</strong> to states it has never seen, because similar states produce similar outputs.</p>` },
        { t: 'quiz',
          q: 'Why can\'t tabular Q-learning handle a game like Go or a screen of Atari pixels?',
          opts: [
            'The rewards are too small',
            'The number of possible states is astronomically large — you can\'t store or even visit them all in a table, so you need a function that generalizes across states',
            'Tables are slower than networks in every case',
          ],
          a: 1,
          why: 'A table needs one entry per state and must visit each to learn it — impossible when states outnumber the atoms in the universe. A neural network approximates Q over the whole space and generalizes from the states it has seen to ones it hasn\'t, which is what makes RL scale to real problems.' },
        { t: 'text', title: 'Deep Q-networks and policy gradients', md: `
          <p>Two broad families of deep RL:</p>
          <ul>
            <li><strong>Value-based</strong> (e.g. Deep Q-Networks) — a network estimates Q-values; the agent acts greedily on them. DeepMind\'s DQN learned dozens of Atari games from raw pixels this way in 2013–15.</li>
            <li><strong>Policy-based</strong> (policy gradients) — a network directly outputs a <em>policy</em>: a probability over actions. Training nudges up the probability of actions that led to high reward. This handles continuous actions (robot joint torques) that a max-over-actions can\'t.</li>
          </ul>
          <p>Both train with the same gradient descent you already know — only what the network predicts and what the loss rewards differs.</p>` },
        { t: 'widget', name: 'classify', title: 'Try it: value-based or policy-based?', md: `
          <p>Sort each description into the family of deep RL it describes.</p>`,
          buckets: ['Value-based (e.g. DQN)', 'Policy-based (policy gradients)'],
          items: [
            ['A network outputs one Q-value per action; the agent acts greedily on them', 0],
            ['A network outputs a probability distribution over actions directly', 1],
            ['Works naturally with continuous actions, like robot joint torques', 1],
            ['DeepMind\'s DQN learning Atari games from raw pixels', 0],
            ['Training raises the probability of actions that led to high reward', 1],
            ['The agent picks whichever action has the highest estimated value', 0],
          ] },
        { t: 'quiz',
          q: 'A "policy network" in policy-gradient RL outputs what?',
          opts: [
            'A single Q-value for the whole game',
            'A probability distribution over actions — training raises the probability of actions that led to higher reward',
            'The exact reward the agent will receive',
          ],
          a: 1,
          why: 'A policy network maps a state directly to action probabilities. Policy-gradient training increases the likelihood of actions that produced good outcomes and decreases the bad ones. This direct-policy approach shines for continuous action spaces, where taking a max over infinitely many actions (as value methods do) isn\'t possible.' },
      ],
    },
    {
      id: 'self-play-rlhf',
      title: 'Self-play, reward design & RLHF',
      minutes: 11,
      steps: [
        { t: 'text', title: 'Bootstrapping superhuman skill', md: `
          <p>Where do good experiences come from with no human data? For two-player games, the answer is <strong>self-play</strong>: the agent plays millions of games against copies of itself. Wins reinforce the moves that led to them; losses discourage them. Starting from random play, it bootstraps to superhuman skill — and because it isn\'t imitating humans, it invents strategies no human taught it (AlphaGo\'s famous move 37).</p>
          <p>AlphaZero took this to its limit: given only the rules and no human games at all, it reached superhuman Go, chess, and shogi purely through self-play RL. The reward is the only teacher.</p>` },
        { t: 'widget', name: 'order', title: 'Try it: order the self-play loop', md: `
          <p>Click these into the order self-play actually runs in, from a blank slate to superhuman skill.</p>`,
          items: [
            'Start with a random (or lightly trained) policy',
            'Play many games against a copy of itself',
            'Note which moves led to wins vs. losses',
            'Reinforce winning moves, discourage losing ones',
            'Repeat with the improved policy as the new opponent',
            'Skill compounds over millions of games, eventually surpassing human play',
          ] },
        { t: 'quiz',
          q: 'How can a self-play agent surpass all human players despite learning from no human games?',
          opts: [
            'It memorizes every human game in history',
            'It learns purely from what wins against itself, so it explores strategies unconstrained by human habit and can discover better ones',
            'Its programmers hand-code the winning moves',
          ],
          a: 1,
          why: 'Self-play\'s only signal is reward (winning), not imitation. Free from human conventions, it searches the space of strategies and lands on effective but unconventional ideas. That freedom from human priors is precisely why RL agents can leap past human level in well-defined games.' },
        { t: 'text', title: 'Reward design is everything (and dangerous)', md: `
          <p>The reward function defines what the agent optimizes — and a powerful optimizer will exploit any gap between the reward and what you actually meant. This is <strong>reward hacking</strong>: a boat-racing agent that spins in circles collecting bonus points forever instead of finishing the race, because that scored higher.</p>
          <p>Two hard problems compound it: <strong>sparse rewards</strong> (if reward only comes at the very end, there\'s almost no signal to learn from) and <strong>reward specification</strong> (writing a reward that truly captures the goal is deceptively hard). Reward design, not the algorithm, is where most real RL projects live or die.</p>` },
        { t: 'quiz',
          q: 'A racing agent rewarded for "points collected" learns to loop forever hitting the same bonuses instead of finishing. This is...',
          opts: [
            'A bug in the neural network',
            'Reward hacking — the agent maximized the literal reward while ignoring the intended goal, because the two came apart',
            'Proof that RL cannot work',
          ],
          a: 1,
          why: 'The algorithm worked perfectly — it maximized the stated reward. The reward was the flaw: it rewarded points, not finishing. This gap between proxy (points) and intent (win the race) is reward hacking, and it\'s why specifying rewards well is the central practical challenge of RL.' },
        { t: 'text', title: 'RL you\'ve already met: RLHF', md: `
          <p>One more connection closes the loop. <strong>RLHF</strong> — the technique that turned an autocomplete LLM into a helpful assistant — is reinforcement learning. The "environment" is a conversation, the "action" is generating a response, and the "reward" comes from a model trained on human preferences. The LLM is optimized to produce high-reward (human-preferred) answers.</p>
          <p>So RL isn\'t just for games — it\'s how we align language models, carrying every RL lesson with it, including reward hacking (a model gaming the reward model into confident-sounding nonsense).</p>` },
        { t: 'text', title: '🎓 Reward, mastered', md: `
          <p>You now understand the paradigm behind game-playing AI and LLM alignment alike:</p>
          <ul>
            <li><strong>The RL loop</strong> — state, action, reward; learn by doing, balancing explore and exploit</li>
            <li><strong>Value &amp; Q-learning</strong> — estimate long-term payoff; the off-policy update that learns optimal play from exploration</li>
            <li><strong>Deep RL</strong> — networks approximate Q or a policy, generalizing to unseen states</li>
            <li><strong>Self-play &amp; reward design</strong> — bootstrap superhuman skill; beware reward hacking</li>
          </ul>
          <p>Next up: <strong>Recommender Systems</strong> — the quieter but ubiquitous AI that decides what you see next.</p>` },
      ],
    },
  ],
});

// Course 1: AI Foundations
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'foundations',
  title: 'AI Foundations',
  tagline: 'What "learning" actually means for a machine',
  icon: '🌱',
  accent: 'var(--series-1)',
  description: 'Before neural networks and ChatGPT, there\'s one core idea: instead of programming rules, we let machines find patterns in data. This course builds that intuition from zero — no math background needed.',
  lessons: [
    {
      id: 'what-is-ai',
      title: 'What is AI, anyway?',
      minutes: 8,
      steps: [
        { t: 'text', title: 'Two ways to make a machine "smart"', md: `
          <p>Imagine you're building a spam filter for email. You have two options.</p>
          <p><strong>Option 1 — Write rules.</strong> "If the email contains the word FREE in all caps, mark it as spam. If it mentions a prince with a fortune, spam."</p>
          <p><strong>Option 2 — Show examples.</strong> Give the machine 10,000 emails that humans already labeled as spam or not-spam, and let it <em>figure out the patterns itself</em>.</p>
          <p>Option 1 is classic programming. Option 2 is <strong>machine learning</strong> — and it's the engine behind almost everything called "AI" today.</p>` },
        { t: 'quiz',
          q: 'Spammers start writing "FR3E" instead of "FREE" to dodge filters. Which approach handles this better?',
          opts: [
            'The rule-based filter — rules are precise',
            'The machine learning filter — it can learn the new pattern from fresh examples',
            'Neither, spam filters are impossible',
          ],
          a: 1,
          why: 'With rules, a human has to notice the trick and write a new rule — forever, for every trick. A learning system just needs new labeled examples, and it updates its own patterns. This adaptability is the whole point of ML.' },
        { t: 'text', title: 'Why rules break down', md: `
          <p>Rules work great for problems humans can fully describe: tax calculations, chess movement rules, sorting a list.</p>
          <p>But try writing rules for: <em>"Is there a cat in this photo?"</em></p>
          <p>Where do you even start? "If there are pointy ears..." — but the cat might be curled up asleep. "If there's fur..." — so is a dog. Humans recognize cats instantly, but we <strong>can't articulate how we do it</strong>.</p>
          <div class="callout">💡 Machine learning shines exactly where humans can do a task but can't explain the steps: recognizing faces, understanding speech, translating language.</div>` },
        { t: 'quiz',
          q: 'Which of these tasks is the WORST fit for machine learning?',
          opts: [
            'Detecting tumors in X-ray images',
            'Computing the exact sales tax on a purchase',
            'Recognizing your voice saying "Hey Siri"',
          ],
          a: 1,
          why: 'Sales tax has an exact, known formula — just program it directly! ML is for problems where the rules are unknown or too fuzzy to write down. Using ML for exact math would be slower AND less reliable.' },
        { t: 'text', title: 'AI, ML, deep learning — untangling the words', md: `
          <p>These words get used interchangeably, but they're nested like Russian dolls:</p>
          <ul>
            <li><strong>AI</strong> — the big umbrella: any machine doing something that seems intelligent.</li>
            <li><strong>Machine Learning</strong> — a subset of AI: machines that learn from data instead of following hand-written rules.</li>
            <li><strong>Deep Learning</strong> — a subset of ML: learning done with <em>neural networks</em> stacked in many layers. This powers image recognition, voice assistants, and ChatGPT.</li>
          </ul>
          <p>Everything hot in AI right now — chatbots, image generators, self-driving perception — is deep learning.</p>` },
        { t: 'quiz',
          q: 'ChatGPT is best described as...',
          opts: [
            'AI, but not machine learning',
            'Machine learning, but not deep learning',
            'All three: AI, machine learning, AND deep learning',
          ],
          a: 2,
          why: 'ChatGPT is a deep neural network (deep learning), trained on data (machine learning), doing something intelligent-seeming (AI). The dolls nest: everything in the inner circle is also in the outer ones.' },
        { t: 'text', title: 'The recipe', md: `
          <p>Nearly every ML system follows the same recipe:</p>
          <ol>
            <li><strong>Collect data</strong> — examples of inputs and the answers you want (emails + spam labels, photos + "cat/no cat").</li>
            <li><strong>Pick a model</strong> — a flexible mathematical machine with adjustable knobs (called <em>parameters</em>).</li>
            <li><strong>Train</strong> — automatically turn the knobs until the model's answers match the examples.</li>
            <li><strong>Use it</strong> — feed it new inputs it's never seen and trust its answers.</li>
          </ol>
          <p>The next lessons unpack each step. The "turn the knobs automatically" part — training — is where the magic (and the math) lives.</p>` },
        { t: 'quiz',
          q: 'GPT-4 reportedly has over a trillion parameters. In the recipe above, what ARE parameters?',
          opts: [
            'The rules programmers wrote for it',
            'The adjustable knobs that training tunes to fit the data',
            'The number of examples it was trained on',
          ],
          a: 1,
          why: 'Parameters are the knobs. No human sets them by hand — training adjusts all trillion+ of them automatically to make the model good at predicting text. The training data is separate (and even bigger).' },
      ],
    },
    {
      id: 'learning-from-data',
      title: 'Learning from data',
      minutes: 9,
      steps: [
        { t: 'text', title: 'Features and labels', md: `
          <p>Say you want to predict a house's price. The machine can't look at a house — it needs numbers.</p>
          <p><strong>Features</strong> are the input numbers describing each example: square footage, number of bedrooms, distance to downtown.</p>
          <p><strong>The label</strong> is the answer you want to predict: the price.</p>
          <p>A dataset is just a big table: each row is one house, feature columns plus a label column. Learning means finding the relationship between features and labels.</p>` },
        { t: 'quiz',
          q: 'You\'re building a model to predict whether a student passes an exam. Which is the LABEL?',
          opts: [
            'Hours studied',
            'Hours slept the night before',
            'Pass or fail',
          ],
          a: 2,
          why: 'The label is the thing you\'re trying to predict — pass/fail. Hours studied and slept are features: the input clues the model uses to make its prediction.' },
        { t: 'text', title: 'Supervised learning', md: `
          <p>When every training example comes with its correct label, it's called <strong>supervised learning</strong> — like studying with an answer key.</p>
          <p>Two big flavors:</p>
          <ul>
            <li><strong>Regression</strong> — predicting a number: house price, tomorrow's temperature, a video's watch time.</li>
            <li><strong>Classification</strong> — predicting a category: spam/not-spam, cat/dog/bird, which digit is in this image.</li>
          </ul>` },
        { t: 'quiz',
          q: 'Predicting how many minutes your food delivery will take is...',
          opts: [
            'Classification, because the app shows categories like "arriving soon"',
            'Regression, because the answer is a number',
            'Unsupervised learning',
          ],
          a: 1,
          why: 'The raw prediction is a number of minutes → regression. (The app might BUCKET that number into "arriving soon" for display, but the model predicts a quantity.)' },
        { t: 'text', title: 'Learning without an answer key', md: `
          <p>What if you have data but no labels? That's <strong>unsupervised learning</strong>: finding structure in data on its own.</p>
          <p>The classic example is <strong>clustering</strong>: give a streaming service everyone's watch history, and it discovers natural groups — "horror fans," "cooking-show bingers" — without anyone defining those groups first.</p>
          <p>There's also a third paradigm, <strong>reinforcement learning</strong>: an agent learns by trial and error, getting rewards for good moves. It's how AI learned to beat world champions at Go.</p>` },
        { t: 'quiz',
          q: 'Match the scenario: a bank groups customers by spending behavior to discover customer "types" it didn\'t know existed. This is...',
          opts: [
            'Supervised learning — the bank supervises the process',
            'Unsupervised learning — there are no labels, just structure to discover',
            'Reinforcement learning — the bank rewards good customers',
          ],
          a: 1,
          why: 'No answer key exists — the "types" aren\'t known in advance. The algorithm finds the groups itself. That\'s the signature of unsupervised learning.' },
        { t: 'text', title: 'A model is a function with knobs', md: `
          <p>Here's the simplest possible model, for predicting house price from size:</p>
          <p style="text-align:center"><code>price = w × size + b</code></p>
          <p>Just a line! <code>w</code> (the slope: dollars per square foot) and <code>b</code> (the base price) are the model's two <strong>parameters</strong> — its knobs.</p>
          <p>Different knob settings give different lines. Training = finding the knob settings whose line best matches the real data. You'll do exactly that, by hand, in the next lesson.</p>
          <div class="callout">💡 GPT-4's trillion parameters and this line's two parameters are the same kind of thing: knobs that training adjusts. The difference is scale, not concept.</div>` },
        { t: 'quiz',
          q: 'In <code>price = w × size + b</code>, suppose training finds w = 300 and b = 50,000. What does the model predict for a 1,000 sq ft house?',
          opts: [
            '$300,000',
            '$350,000',
            '$50,300',
          ],
          a: 1,
          why: '300 × 1,000 + 50,000 = $350,000. You just ran a machine learning model by hand — inference is literally plugging numbers into the learned function.' },
      ],
    },
    {
      id: 'loss',
      title: 'Loss: measuring "wrong"',
      minutes: 10,
      steps: [
        { t: 'text', title: 'How wrong is the model?', md: `
          <p>Training means adjusting knobs until the model fits the data. But "fits" needs a number — a score that says exactly <em>how wrong</em> the current knob settings are.</p>
          <p>That score is called the <strong>loss</strong> (or cost, or error). The rules of the game:</p>
          <ul>
            <li>Perfect predictions → loss = 0</li>
            <li>Worse predictions → bigger loss</li>
          </ul>
          <p>Training becomes a clean goal: <strong>find the knob settings with the lowest loss.</strong></p>` },
        { t: 'text', title: 'Mean squared error', md: `
          <p>The most common loss for regression: for each data point, take the difference between prediction and truth (the <em>error</em>), square it, then average over all points. This is <strong>mean squared error (MSE)</strong>.</p>
          <p>Why square? Two reasons:</p>
          <ul>
            <li>Errors of −5 and +5 are equally bad — squaring makes both count as 25 instead of canceling out.</li>
            <li>Squaring punishes big misses <em>much</em> harder: being off by 10 costs 100, being off by 1 costs just 1.</li>
          </ul>` },
        { t: 'quiz',
          q: 'Model A misses two points by 3 and 3. Model B misses them by 0 and 6. Using squared error, which is better?',
          opts: [
            'They\'re equal — both miss by 6 total',
            'Model A: 9 + 9 = 18 beats 0 + 36 = 36',
            'Model B: one perfect prediction is best',
          ],
          a: 1,
          why: 'A: 3² + 3² = 18. B: 0² + 6² = 36. Squared error prefers consistently-close over sometimes-perfect-sometimes-terrible. That one big miss is expensive!' },
        { t: 'widget', name: 'fitline', title: 'Try it: fit the line yourself', md: `
          <p>Below are data points (houses: size vs price). <strong>You are the training algorithm.</strong> Drag the two sliders — slope <code>w</code> and intercept <code>b</code> — and watch the loss. Get the loss as low as you can.</p>` },
        { t: 'quiz',
          q: 'While fitting, you probably nudged a slider, checked if loss went down, and kept going that direction. Why is this important?',
          opts: [
            'It isn\'t — computers fit lines instantly by luck',
            'That exact strategy — nudge, check, repeat — is what training algorithms do, automatically',
            'It proves humans are better than machines at this',
          ],
          a: 1,
          why: 'You just performed gradient descent by hand! "Which direction makes loss go down? Move that way. Repeat." The next lesson shows how machines do this — automatically, and even with a trillion knobs at once.' },
        { t: 'text', title: 'The loss landscape', md: `
          <p>Picture every possible knob setting as a location, and the loss at that setting as the <em>altitude</em>. With two knobs (like our w and b), this forms a landscape — a surface with hills (high loss = bad fit) and valleys (low loss = good fit).</p>
          <p><strong>Training is hiking downhill in this landscape</strong>, searching for the lowest valley.</p>
          <p>One problem: with a trillion knobs, you can't check every location. You need a way to know which direction is downhill <em>from where you stand</em>. That's the next lesson.</p>` },
      ],
    },
    {
      id: 'gradient-descent',
      title: 'Gradient descent',
      minutes: 10,
      steps: [
        { t: 'text', title: 'Hiking downhill in fog', md: `
          <p>You're on a foggy mountainside and want to reach the valley. You can't see far — but you can feel the slope under your feet.</p>
          <p>Strategy: feel which way is steepest downhill, take a step that way, repeat.</p>
          <p>That's <strong>gradient descent</strong>. The <em>gradient</em> is the slope of the loss at the current knob settings — calculus computes it exactly, telling each knob which direction (and how strongly) to move to reduce loss.</p>` },
        { t: 'widget', name: 'gradient', title: 'Try it: roll down the loss curve', md: `
          <p>This curve is a loss landscape for a single knob. The ball is the current knob setting. Press <strong>Step</strong> to take one gradient descent step. Then play with the <strong>learning rate</strong> — the size of each step — and see what happens when it's tiny... or too big.</p>` },
        { t: 'quiz',
          q: 'What did you observe with a very LARGE learning rate?',
          opts: [
            'The ball reached the bottom faster and stayed — bigger is always better',
            'The ball overshot the valley, bouncing across it or even climbing higher',
            'Nothing changed — learning rate doesn\'t matter',
          ],
          a: 1,
          why: 'Big steps overshoot the minimum — the ball leaps across the valley and can end up higher than it started, diverging entirely. Too small wastes time; too big explodes. Picking a good learning rate is one of the most important settings in all of deep learning.' },
        { t: 'text', title: 'The full training loop', md: `
          <p>Now you can assemble the complete algorithm that trains everything from spam filters to GPT:</p>
          <ol>
            <li><strong>Predict:</strong> run a batch of training examples through the model.</li>
            <li><strong>Score:</strong> compute the loss (how wrong were we?).</li>
            <li><strong>Compute gradients:</strong> for each knob, find which direction reduces loss.</li>
            <li><strong>Step:</strong> nudge every knob a little in its downhill direction.</li>
            <li><strong>Repeat</strong> — millions of times.</li>
          </ol>
          <div class="callout">💡 This loop is the beating heart of AI. Training GPT-4 was this exact loop, run on thousands of GPUs for months, adjusting a trillion knobs. Nothing conceptually different from your ball rolling downhill.</div>` },
        { t: 'quiz',
          q: 'Local minima: the ball can get stuck in a small dip that isn\'t the deepest valley. Why does this worry people less in giant neural networks?',
          opts: [
            'Big networks have no valleys',
            'With millions of dimensions, there\'s almost always SOME downhill direction to escape through — and the dips it does settle in tend to be good enough',
            'Engineers manually push the ball out',
          ],
          a: 1,
          why: 'In 1D the ball is trapped by two walls. In a million dimensions, a point must be a dead-end in every single direction at once to trap you — vanishingly rare. High-dimensional loss landscapes turn out to be surprisingly forgiving, which is part of why deep learning works at all.' },
      ],
    },
    {
      id: 'overfitting',
      title: 'Overfitting: when learning goes wrong',
      minutes: 9,
      steps: [
        { t: 'text', title: 'The student who memorized the textbook', md: `
          <p>Imagine a student who memorizes every practice exam word-for-word — questions and answers. On those exact exams: perfect score. On a new exam: disaster. They memorized; they never <em>understood</em>.</p>
          <p>Models do this too. A model with enough knobs can effectively memorize its training data, scoring a perfect loss — while learning nothing about the real pattern. This is <strong>overfitting</strong>.</p>
          <p>The goal was never to do well on training data. It's to do well on <strong>new</strong> data. That ability is called <strong>generalization</strong>.</p>` },
        { t: 'quiz',
          q: 'Your model gets 99% accuracy on training data but 62% on new data. What happened?',
          opts: [
            'Great success — 99% is amazing',
            'Overfitting — it memorized the training set instead of learning the pattern',
            'Underfitting — the model is too simple',
          ],
          a: 1,
          why: 'A huge gap between training performance and new-data performance is the classic overfitting signature. The 99% is a mirage. (Underfitting would look like BAD performance on both.)' },
        { t: 'text', title: 'The train/test split', md: `
          <p>How do you catch overfitting? Simple, brilliant trick: <strong>hide some data</strong>.</p>
          <p>Before training, split your data — typically ~80% for <strong>training</strong>, ~20% held back as the <strong>test set</strong>. The model never sees the test set during training.</p>
          <p>After training, evaluate on the test set. It's a surprise exam with questions the student couldn't have memorized. Test performance is the honest measure of your model.</p>
          <div class="callout">⚠️ Cardinal sin of ML: letting test data leak into training. It's grading a student on questions they already saw — the score becomes meaningless. Data leakage quietly ruins real-world projects all the time.</div>` },
        { t: 'quiz',
          q: 'A researcher tunes their model repeatedly, each time checking test-set accuracy and tweaking until test accuracy is high. What\'s the problem?',
          opts: [
            'Nothing — that\'s exactly how you should use a test set',
            'By tuning TO the test set over and over, they\'ve indirectly fit it — it no longer measures generalization',
            'They should have used a bigger model',
          ],
          a: 1,
          why: 'Each peek-and-tweak leaks a little test information into the model choices. After 100 tweaks, the test set is no longer a surprise exam. Real practice uses a THIRD split (validation set) for tuning, touching the test set only once, at the very end.' },
        { t: 'text', title: 'Fighting overfitting', md: `
          <p>The classic remedies:</p>
          <ul>
            <li><strong>More data</strong> — the best cure. It's easy to memorize 10 examples, nearly impossible to memorize 10 billion; the model is forced to learn the actual pattern.</li>
            <li><strong>Simpler model</strong> — fewer knobs = less memorization capacity.</li>
            <li><strong>Regularization</strong> — penalties and tricks (like <em>dropout</em>: randomly disabling parts of the network during training) that discourage memorization.</li>
            <li><strong>Early stopping</strong> — halt training when performance on held-out data stops improving.</li>
          </ul>
          <p>This tension — flexible enough to learn, constrained enough to generalize — runs through all of machine learning.</p>` },
        { t: 'quiz',
          q: 'Why are today\'s giant models (trained on much of the internet) surprisingly resistant to classic overfitting?',
          opts: [
            'They have special anti-memorization chips',
            'The training data is so vast the model can\'t just memorize it — patterns are the only way to compress that much information',
            'They actually overfit completely and it doesn\'t matter',
          ],
          a: 1,
          why: 'Remember: more data is the best cure. Trillions of words won\'t fit in the parameters verbatim, so training forces the model to find general patterns — grammar, facts, reasoning shortcuts — that compress the data. (Though LLMs CAN still memorize rare, repeated snippets — an active research issue.)' },
        { t: 'text', title: '🎓 Foundations complete!', md: `
          <p>You now hold the core mental model of machine learning:</p>
          <ul>
            <li>Models are <strong>functions with knobs</strong> (parameters)</li>
            <li><strong>Loss</strong> measures wrongness; training minimizes it</li>
            <li><strong>Gradient descent</strong> is the downhill hike that does the minimizing</li>
            <li><strong>Generalization</strong>, not training performance, is what counts</li>
          </ul>
          <p>Everything else in AI is elaboration on this. Next up: <strong>Neural Networks</strong> — the flexible model family that took over the world.</p>` },
      ],
    },
  ],
});

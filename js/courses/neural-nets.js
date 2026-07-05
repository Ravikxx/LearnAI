// Course 2: Neural Networks
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'neural-nets',
  title: 'Neural Networks',
  tagline: 'The machinery behind deep learning',
  icon: '🕸️',
  accent: 'var(--series-5)',
  description: 'Neural networks power image recognition, speech, and ChatGPT. Here you\'ll build one neuron by hand, see why stacking them creates intelligence, and train a real network live in your browser.',
  lessons: [
    {
      id: 'the-neuron',
      title: 'The artificial neuron',
      minutes: 9,
      steps: [
        { t: 'text', title: 'A neuron is a tiny voting machine', md: `
          <p>An artificial neuron does one small job: it takes several input numbers, weighs how much each one matters, and produces a single output number.</p>
          <ol>
            <li>Multiply each input by its <strong>weight</strong> (how much that input matters — can be negative!)</li>
            <li>Add the results, plus a <strong>bias</strong> (a baseline nudge up or down)</li>
            <li>Pass the total through an <strong>activation function</strong> to get the output</li>
          </ol>
          <p>Think of a hiring committee member scoring a candidate: experience matters a lot (weight 0.8), typos on the resume count against (weight −0.5), and this member is generally optimistic (bias +1).</p>` },
        { t: 'widget', name: 'perceptron', title: 'Try it: drive a neuron', md: `
          <p>Here's a live neuron deciding <em>"should I go outside?"</em> from two inputs: how sunny it is, and how busy your day is. Move all the sliders. Can you set the weights so that sun pulls the answer up and busyness pulls it down?</p>` },
        { t: 'quiz',
          q: 'You want the neuron to IGNORE how busy the day is. What should you set?',
          opts: [
            'busyness weight = 0',
            'busyness input = 0',
            'bias = 0',
          ],
          a: 0,
          why: 'A weight of 0 means "this input contributes nothing, whatever its value" — the neuron becomes blind to it. Setting the INPUT to 0 only handles today; the weight controls how the neuron treats every day. Learning is exactly this: discovering which inputs deserve which weights.' },
        { t: 'quiz',
          q: 'A neuron detecting spam gives the input "email mentions your actual first name" a weight of −2.3. What does the negative weight mean?',
          opts: [
            'The neuron is broken — weights must be positive',
            'That input pushes the output DOWN: mentioning your real name is evidence against spam',
            'The input is 2.3 times too small',
          ],
          a: 1,
          why: 'Negative weights encode "evidence against." Personalized emails are less likely to be spam, so this input should lower the spam score. Half the power of neurons comes from negative weights.' },
        { t: 'text', title: 'Where do the weights come from?', md: `
          <p>You just set weights by hand for a 2-input neuron. Now imagine a neuron looking at a photo: one input per pixel — <em>hundreds of thousands</em> of weights. Hand-tuning is hopeless.</p>
          <p>But you already know the answer from the Foundations course: weights and biases are just the model's <strong>knobs</strong>. Gradient descent tunes them automatically to minimize loss.</p>
          <div class="callout">💡 A neuron is <code>output = activation(w₁x₁ + w₂x₂ + ... + b)</code> — it's your <code>w × size + b</code> line from Foundations, with more inputs and one twist added: the activation function. That twist turns out to matter enormously.</div>` },
      ],
    },
    {
      id: 'activations',
      title: 'Activation functions',
      minutes: 8,
      steps: [
        { t: 'text', title: 'The twist that makes it all work', md: `
          <p>After a neuron sums its weighted inputs, it passes the total through an <strong>activation function</strong>. The three classics:</p>
          <ul>
            <li><strong>Sigmoid</strong> — squashes anything into (0, 1). Great for "probability-like" outputs.</li>
            <li><strong>Tanh</strong> — squashes into (−1, 1).</li>
            <li><strong>ReLU</strong> — brutally simple: negatives become 0, positives pass through unchanged. The modern default.</li>
          </ul>
          <p>What they share: they all <em>bend</em>. None of them is a straight line. Hold that thought.</p>` },
        { t: 'widget', name: 'activation', title: 'Try it: feel the curves', md: `
          <p>Switch between the three functions and slide the input. Notice: sigmoid and tanh <em>saturate</em> (flatten out) at the extremes, while ReLU just keeps going — and is exactly zero for all negative inputs.</p>` },
        { t: 'quiz',
          q: 'Why does everything called "activation function" bend? What would happen if neurons used a straight line (no activation) instead?',
          opts: [
            'Training would be slower but everything else works',
            'Stacking any number of layers would collapse into one straight-line model — deep networks would be pointless',
            'The outputs would just be bigger numbers',
          ],
          a: 1,
          why: 'A straight line of a straight line is... still a straight line. Stack 100 linear layers and algebra collapses them into a single linear function — all that depth wasted. The bend (nonlinearity) is what lets layers build genuinely new, more complex functions out of previous layers. No bend, no deep learning.' },
        { t: 'quiz',
          q: 'You saw sigmoid flatten out at the extremes. Why is that flatness a problem during training?',
          opts: [
            'Flat means the gradient is nearly zero — gradient descent gets almost no signal about which way to move',
            'Flat regions use more memory',
            'It isn\'t a problem',
          ],
          a: 0,
          why: 'Gradient descent needs slope to know where downhill is. Where sigmoid saturates, the slope is ~0, so learning stalls — the infamous "vanishing gradient" problem that crippled early deep networks. ReLU\'s constant slope for positive inputs is a big reason modern networks train so well.' },
        { t: 'text', title: 'Why ReLU won', md: `
          <p><code>ReLU(x) = max(0, x)</code>. It looks too dumb to matter — yet it powers nearly every modern network. Why it won:</p>
          <ul>
            <li><strong>No vanishing gradient</strong> on the positive side — the slope is always 1.</li>
            <li><strong>Cheap</strong> — one comparison, vs. computing exponentials.</li>
            <li><strong>Sparsity</strong> — negatives become exactly 0, so many neurons stay silent, which turns out to help.</li>
          </ul>
          <p>A lesson that recurs across deep learning: <em>simple and scalable beats clever and delicate.</em></p>` },
      ],
    },
    {
      id: 'layers',
      title: 'From neurons to networks',
      minutes: 9,
      steps: [
        { t: 'text', title: 'Stack and connect', md: `
          <p>One neuron can only draw a single straight boundary — sunny/busy, spam/not. Feeble. The power move: use many neurons, in <strong>layers</strong>.</p>
          <ul>
            <li><strong>Input layer</strong> — the raw feature numbers.</li>
            <li><strong>Hidden layers</strong> — teams of neurons; each receives ALL outputs of the previous layer.</li>
            <li><strong>Output layer</strong> — produces the final answer.</li>
          </ul>
          <p>"Deep" learning literally means: many hidden layers.</p>` },
        { t: 'text', title: 'Each layer builds on the last', md: `
          <p>The magic is what hidden layers <em>choose</em> to detect. In a face-recognition network, nobody programs this, but training consistently discovers:</p>
          <ul>
            <li><strong>Layer 1</strong> neurons fire on tiny edges and color blobs</li>
            <li><strong>Layer 2</strong> combines edges into textures and simple shapes — an arc, a corner</li>
            <li><strong>Layer 3</strong> combines shapes into parts — an eye, a nose</li>
            <li><strong>Deeper layers</strong> combine parts into whole faces</li>
          </ul>
          <p>A hierarchy of concepts, assembled automatically from pixels. This is <em>the</em> core reason deep learning works: each layer gets to reuse the vocabulary invented by the layer below.</p>` },
        { t: 'quiz',
          q: 'Why do edge detectors emerge in layer 1 rather than face detectors?',
          opts: [
            'Layer 1 only sees raw pixels — edges are the most useful thing buildable directly from pixels; faces need intermediate concepts first',
            'Engineers program layer 1 to detect edges',
            'Random chance — sometimes layer 1 detects faces',
          ],
          a: 0,
          why: 'A face detector needs concepts like "eye" and "nose" as ingredients, which need "arc" and "edge" as ingredients. Layer 1 has only pixels to work with, so the simplest useful patterns — edges — is what training finds there. Complexity must be built floor by floor.' },
        { t: 'quiz',
          q: 'A network has layers of sizes 4 → 5 → 3. Every neuron connects to all neurons in the next layer. How many connection weights between the FIRST two layers?',
          opts: [
            '9',
            '20',
            '60',
          ],
          a: 1,
          why: '4 inputs × 5 neurons = 20 weights (plus 5 biases). Layer-to-layer weights multiply like this, which is why parameter counts explode: GPT-class models connect layers that are tens of thousands of neurons wide.' },
        { t: 'text', title: 'The universal machine', md: `
          <p>A famous result — the <strong>universal approximation theorem</strong> — says even one hidden layer (big enough, with nonlinear activations) can approximate essentially any function.</p>
          <p>So why go deep instead of wide? <strong>Efficiency.</strong> Deep networks reuse concepts: build "edge" once, use it in every shape; build "eye" once, use it in every face. A shallow network would have to relearn everything from scratch for every case — needing astronomically many neurons.</p>
          <div class="callout">💡 Depth = compositionality. The world is compositional (things are made of parts made of parts), and deep networks mirror that structure.</div>` },
      ],
    },
    {
      id: 'backprop',
      title: 'How networks learn',
      minutes: 11,
      steps: [
        { t: 'text', title: 'The blame assignment problem', md: `
          <p>Gradient descent needs to know: for EACH of a million weights, if I nudge it up, does the loss go down or up?</p>
          <p>For the line model that was easy. But in a deep network, a weight in layer 1 affects the loss only <em>through</em> everything after it — its output feeds layer 2, which feeds layer 3... How do you assign blame to a weight buried that deep?</p>
          <p>The answer is <strong>backpropagation</strong> — arguably the most important algorithm of the century.</p>` },
        { t: 'text', title: 'Blame flows backward', md: `
          <p>Backprop works like a company post-mortem after a failed launch:</p>
          <ul>
            <li>Start at the failure (the loss at the output).</li>
            <li>The output layer computes how much each of ITS inputs contributed to the miss, and passes blame backward.</li>
            <li>Each earlier layer takes the blame arriving from ahead, figures out its own weights' share, and passes the remainder further back.</li>
          </ul>
          <p>One forward pass (predict) + one backward pass (assign blame) gives the exact gradient for <em>every</em> weight — with roughly the same amount of computation as the prediction itself. That efficiency is the miracle; without it, training big networks would be impossible.</p>
          <p>(Under the hood it's the chain rule from calculus, applied systematically. PyTorch does this for you automatically — it's the "auto" in <em>autograd</em>.)</p>` },
        { t: 'quiz',
          q: 'Why is it called BACK-propagation?',
          opts: [
            'The network moves backward in time',
            'Error/blame signals flow from the output layer backward toward the input layer',
            'It undoes bad predictions',
          ],
          a: 1,
          why: 'Prediction flows forward (input → output); blame flows backward (loss → output layer → ... → layer 1). Each layer needs the blame from the layer AFTER it to compute its own, so the sweep must run back-to-front.' },
        { t: 'widget', name: 'xornet', title: 'Watch a real network learn — live', md: `
          <p>This is not an animation. Below is a real neural network (2 inputs → 4 hidden neurons → 1 output) running in your browser, learning <strong>XOR</strong>: output 1 when exactly one input is 1. XOR is famous — a single neuron provably <em>cannot</em> solve it, but a hidden layer can.</p>
          <p>Press <strong>Train</strong> and watch backprop + gradient descent drive the loss down and the four predictions snap toward their targets.</p>` },
        { t: 'quiz',
          q: 'Hit Reset and train again a few times. The loss curve and speed differ slightly each run. Why?',
          opts: [
            'The browser is unreliable',
            'Weights start at random values, so each run begins at a different spot in the loss landscape and takes a different path downhill',
            'XOR changes each time',
          ],
          a: 1,
          why: 'Training always starts from random weights — a random spot on the loss landscape. Different start → different downhill path → different journey (and occasionally a run that gets temporarily stuck on a plateau!). This randomness is normal and expected in all of deep learning.' },
        { t: 'text', title: 'You now understand deep learning', md: `
          <p>Seriously — the full loop, no hand-waving:</p>
          <ol>
            <li><strong>Forward pass:</strong> data flows through layers of neurons (weights, biases, activations) to a prediction.</li>
            <li><strong>Loss:</strong> score the wrongness.</li>
            <li><strong>Backward pass:</strong> backprop assigns blame to every weight.</li>
            <li><strong>Update:</strong> gradient descent nudges each weight against its blame.</li>
            <li><strong>Repeat.</strong></li>
          </ol>
          <p>GPT-4 training = this loop. Your XOR net = this loop. Same algorithm, different scale.</p>` },
      ],
    },
    {
      id: 'deep-learning-wild',
      title: 'Deep learning in the wild',
      minutes: 8,
      steps: [
        { t: 'text', title: 'Architectures: shaping the network to the data', md: `
          <p>Plain stacked layers treat every input number identically. But real data has <em>structure</em>, and exploiting it is what architecture design is about:</p>
          <ul>
            <li><strong>CNNs (convolutional networks)</strong> — for images. A small pattern-detector (say, 3×3 pixels) slides across the whole image, reusing the same weights everywhere. A cat in the corner and a cat in the center get detected by the same weights.</li>
            <li><strong>RNNs (recurrent networks)</strong> — for sequences. Process one item at a time while carrying a memory forward. Dominated language tasks... until 2017.</li>
            <li><strong>Transformers</strong> — the architecture that replaced RNNs and powers every modern LLM. That's the whole next course.</li>
          </ul>` },
        { t: 'quiz',
          q: 'A CNN\'s sliding detector uses the SAME weights at every image position. Why is that so effective?',
          opts: [
            'It makes the math prettier',
            'A useful pattern (an edge, an eye) is useful anywhere in the image — sharing weights means learning it once instead of separately for every position, with vastly fewer parameters',
            'It lets the network see colors',
          ],
          a: 1,
          why: 'This is "weight sharing": bake the knowledge that patterns are position-independent right into the architecture. Fewer parameters, less overfitting, and patterns learned in one corner transfer everywhere. Matching architecture to data structure is a superpower.' },
        { t: 'text', title: 'Why GPUs?', md: `
          <p>Nearly everything a network does — a layer transforming its inputs, over a whole batch of examples — is giant <strong>matrix multiplication</strong>: huge grids of multiply-and-add, each independent of the others.</p>
          <p>A CPU has a handful of powerful cores. A GPU has <em>thousands</em> of simple ones — built to compute every pixel of a game frame simultaneously. Independent multiply-adds are exactly that shape of work.</p>
          <p>The 2012 moment when this clicked (a GPU-trained network called <strong>AlexNet</strong> crushing the ImageNet photo-recognition contest) is the big bang of the modern AI era.</p>` },
        { t: 'quiz',
          q: 'Deep learning\'s core ideas (backprop: 1986!) are old. Why did the revolution only start around 2012?',
          opts: [
            'The math was only recently proven correct',
            'The missing ingredients were compute (GPUs) and data (the internet) — ideas were waiting for hardware and datasets to catch up',
            'Governments banned it until 2012',
          ],
          a: 1,
          why: 'Neural nets stagnated for decades because they were starved: too little data to learn from, too little compute to train at scale. GPUs + internet-scale datasets fed the same old algorithms, and they took off. Scale, not new theory, ignited the boom — a pattern that has repeated with LLMs.' },
        { t: 'text', title: '🎓 Course complete!', md: `
          <p>You've built the complete picture:</p>
          <ul>
            <li>Neurons: weighted sums + a nonlinear bend</li>
            <li>Layers: hierarchies of learned concepts</li>
            <li>Backprop: efficient blame assignment for millions of weights</li>
            <li>Architectures & GPUs: fitting networks to data, at scale</li>
          </ul>
          <p>Next: <strong>How LLMs Work</strong> — tokens, embeddings, attention, and what's really happening when ChatGPT answers you.</p>` },
      ],
    },
  ],
});

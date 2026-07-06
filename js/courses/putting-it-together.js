// Course: Putting It All Together (advanced synthesis capstone)
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'putting-it-together',
  title: 'Putting It All Together',
  tagline: 'The systems-level view: scaling laws, the full pipeline, and the frontier',
  icon: '🧩',
  accent: 'var(--series-10)',
  description: 'The hardest course here, and the payoff for the rest. It assumes everything — loss, gradient descent, attention, embeddings, RLHF — and fuses it into how frontier AI is actually built: the real training objective, the scaling laws that predict capability, the compute and memory that bound it, and the open problems at the edge. Some real math. Take the other courses first.',
  lessons: [
    {
      id: 'the-objective',
      title: 'What the loss really is',
      minutes: 12,
      steps: [
        { t: 'text', title: 'Naming the number training minimizes', md: `
          <p>You know training minimizes a "loss." For a language model, that loss has an exact name and formula: <strong>cross-entropy</strong>, the average negative log-probability the model assigned to the tokens that actually occurred.</p>
          <pre><code>L = &minus;(1/N) &Sigma; log p(x&#7522; | x&#8321; ... x&#7522;&#8331;&#8321;)</code></pre>
          <p>Read it plainly: for each of N tokens, look at the probability the model gave to the <em>correct</em> next token, take its log, negate it, average. If the model is certain and right, p &asymp; 1, log p &asymp; 0, loss &asymp; 0. If it confidently assigns a low probability to what actually came next, log p is a large negative number, so the loss is large. The model is punished precisely for being confidently wrong.</p>` },
        { t: 'quiz',
          q: 'The cross-entropy loss for one token is &minus;log p(correct token). Why does confidently assigning low probability to the right token hurt so much more than being merely uncertain?',
          opts: [
            'It doesn\'t — the penalty is the same regardless of the probability',
            'Because &minus;log p grows without bound as p &rarr; 0: p = 0.5 costs ~0.69, but p = 0.001 costs ~6.9 — the log makes confident mistakes enormously expensive',
            'Because the loss is squared, like mean squared error',
          ],
          a: 1,
          why: 'The logarithm is the whole point. &minus;log(0.5) &asymp; 0.69, &minus;log(0.01) &asymp; 4.6, &minus;log(0.001) &asymp; 6.9 — the penalty explodes as your probability on the truth approaches zero. This is what pressures the model toward calibrated confidence: being sure and wrong is catastrophic for the loss.' },
        { t: 'text', title: 'Perplexity: the loss in human units', md: `
          <p>Cross-entropy is in nats (or bits), which is hard to feel. So people exponentiate it into <strong>perplexity</strong>:</p>
          <pre><code>perplexity = e<sup>L</sup>   (or 2<sup>L</sup> if L is in bits)</code></pre>
          <p>Perplexity is the model\'s effective "number of equally-likely choices" at each step. A perplexity of 1 means perfect certainty (it always knew the next token). A perplexity of 100 means the model is as confused as if it were guessing uniformly among 100 options. Early GPT-2 sat around perplexity 20&ndash;35 on benchmark text; strong modern models are far lower. It is the same loss you have known since Foundations — just made legible.</p>
          <div class="callout">💡 Every capability an LLM has — grammar, facts, reasoning, code — is a side effect of driving this one number down across trillions of tokens. There is no separate "reasoning objective." Compress text well enough and reasoning falls out.</div>` },
        { t: 'quiz',
          q: 'A model reports a per-token perplexity of about 8 on some text. What does that mean intuitively?',
          opts: [
            'It gets 8% of tokens right',
            'On average it is as uncertain as if choosing uniformly among ~8 possibilities for each next token — lower perplexity means sharper, more confident prediction',
            'It took 8 steps to produce each token',
          ],
          a: 1,
          why: 'Perplexity = effective branching factor. ~8 means "about as hard as an 8-way fair guess per token." Since perplexity = e^(cross-entropy), pushing the loss down directly shrinks perplexity — the single scalar that summarizes how well the model models the text.' },
      ],
    },
    {
      id: 'scaling-laws',
      title: 'Scaling laws',
      minutes: 13,
      steps: [
        { t: 'text', title: 'Loss is a predictable function of scale', md: `
          <p>Here is one of the most consequential empirical discoveries in AI. Plot a model\'s loss against the scale you train it at — parameters <code>N</code>, data <code>D</code>, or compute <code>C</code> — on log-log axes, and you get a <strong>straight line</strong> over many orders of magnitude. The loss follows a <strong>power law</strong>:</p>
          <pre><code>L(C) &asymp; L&#8734; + (C&#8320; / C)<sup>&alpha;</sup></code></pre>
          <p>where <code>L&#8734;</code> is an irreducible floor (the true entropy of language you can never beat) and the exponent <code>&alpha;</code> is small — around 0.05. Small exponent, but it holds across a <em>trillion-fold</em> range of compute. This is why labs can spend hundreds of millions of dollars on a training run with confidence: they fit the curve on small models and <strong>extrapolate</strong> the loss of the giant one before building it.</p>` },
        { t: 'quiz',
          q: 'Why are scaling laws so strategically important to the labs building frontier models?',
          opts: [
            'They prove larger models are conscious',
            'They let you predict a huge model\'s loss from small, cheap experiments — turning a $100M training run from a gamble into a forecast',
            'They guarantee the loss will reach exactly zero',
          ],
          a: 1,
          why: 'Predictability is the payoff. Because the loss-vs-compute relationship is a stable power law, you fit it on affordable runs and extrapolate. That de-risks enormous investments — and it is a big reason the field bet on scale so aggressively. (Note the floor L&#8734;: the curve flattens toward an irreducible entropy, never zero.)' },
        { t: 'text', title: 'Chinchilla: how to spend a compute budget', md: `
          <p>Given a fixed compute budget, should you build a <em>bigger</em> model or train on <em>more data</em>? DeepMind\'s 2022 "Chinchilla" result answered it: for compute-optimal training, parameters and training tokens should scale <strong>together, in roughly equal proportion</strong> — about <code>20</code> training tokens per parameter.</p>
          <p>This overturned earlier practice. GPT-3 (175B params) was, by this rule, badly <em>under-trained</em> — too big for its data. Chinchilla (70B params) used the same compute but far more data, and beat it. The lesson reshaped the field: for years after, "smaller model, way more tokens" became the winning recipe.</p>
          <pre><code>compute-optimal:  D &asymp; 20 &middot; N       (tokens &asymp; 20 &times; parameters)</code></pre>` },
        { t: 'quiz',
          q: 'Chinchilla showed GPT-3 was "under-trained." In scaling-law terms, what does that mean?',
          opts: [
            'It had too few parameters for its data',
            'It had too many parameters for the amount of data it saw — the same compute would have yielded a lower loss on a smaller model trained on more tokens',
            'It was trained for too many epochs',
          ],
          a: 1,
          why: 'Under-trained here means over-parameterized relative to data: the compute was spent on size instead of tokens. The compute-optimal frontier (~20 tokens/param) said a smaller model fed more data reaches a lower loss for the same cost — exactly what Chinchilla demonstrated against GPT-3.' },
        { t: 'text', title: 'The 6ND rule', md: `
          <p>One more number ties scale to cost. The compute to train a dense Transformer is captured by a famous approximation:</p>
          <pre><code>training FLOPs &asymp; 6 &middot; N &middot; D</code></pre>
          <p>N parameters, D training tokens. The 6 comes from roughly 2 FLOPs per parameter for the forward pass and 4 for the backward pass, per token. So compute scales with the <em>product</em> of model size and data — double both and you quadruple the bill. Combine this with Chinchilla (<code>D &asymp; 20N</code>) and you can estimate, on a napkin, the FLOPs behind any frontier model — and therefore its rough dollar and energy cost.</p>` },
        { t: 'quiz',
          q: 'Using FLOPs &asymp; 6ND, if you double the parameter count AND double the training tokens, training compute goes up by what factor?',
          opts: [
            '2&times;',
            '4&times; — because compute scales with the product N&middot;D, and 2 &times; 2 = 4',
            'It stays the same',
          ],
          a: 1,
          why: 'FLOPs scale with the product, so doubling each multiplies cost by 2 &times; 2 = 4. This multiplicative blow-up — and the Chinchilla coupling of N and D — is why each new frontier tier costs so dramatically more than the last, and why compute, not ideas, is often the binding constraint.' },
      ],
    },
    {
      id: 'emergence',
      title: 'Emergence & the capability gap',
      minutes: 10,
      steps: [
        { t: 'text', title: 'Smooth loss, jumpy skills', md: `
          <p>Scaling laws say the loss falls <em>smoothly</em>. Yet specific abilities — multi-step arithmetic, following complex instructions, in-context learning — often appear <strong>suddenly</strong>: near-zero at small scale, then rapidly useful past some threshold. These are called <strong>emergent abilities</strong>, and they create the strange gap between a smoothly-improving loss and lurching, unpredictable capabilities.</p>
          <p>Why the mismatch? A capability like "add two 3-digit numbers" is often measured by a harsh metric: exact-match, all-or-nothing. The model can be steadily getting each digit more probable (smooth loss improvement) while scoring <em>zero</em> on exact-match until <em>every</em> digit crosses the line at once — at which point the score snaps from 0 to high. The underlying skill grew gradually; the <em>metric</em> made it look like a jump.</p>` },
        { t: 'quiz',
          q: 'A model\'s loss improves smoothly with scale, but its accuracy on 3-digit addition stays at 0% then suddenly jumps to 80%. What is a leading explanation?',
          opts: [
            'The model gained consciousness at that scale',
            'The underlying per-digit competence improved gradually, but an all-or-nothing exact-match metric only registers success once every digit is right at once — making smooth progress look discontinuous',
            'Scaling laws stopped applying',
          ],
          a: 1,
          why: 'Much apparent "emergence" is partly a measurement artifact: strict metrics (exact match) hide gradual gains until they cross a threshold together. The smooth-loss/jumpy-skill gap is real and important for forecasting — but it does not mean the physics changed, and choosing a smoother metric often reveals continuous improvement underneath.' },
        { t: 'text', title: 'Why this makes frontier AI hard to predict', md: `
          <p>Here is the uncomfortable synthesis. Scaling laws let you predict the <em>loss</em> of the next model with remarkable accuracy. They do <em>not</em> reliably predict which <em>capabilities</em> that lower loss will unlock. You can forecast the number; you cannot fully forecast what the model will be able to do.</p>
          <p>That gap is central to both the excitement and the risk around scaling. It is why labs run extensive evaluations after training rather than relying on theory, and why the AI Safety course\'s concerns are sharpened by scale: a system whose capabilities arrive partly by surprise is intrinsically harder to make safe in advance.</p>` },
        { t: 'quiz',
          q: 'What can scaling laws predict well, and what can they not?',
          opts: [
            'They predict both loss and exact capabilities perfectly',
            'They predict the loss of a larger model reliably, but not precisely which downstream capabilities that loss will unlock — creating a genuine forecasting gap',
            'They predict capabilities but not loss',
          ],
          a: 1,
          why: 'Loss: highly predictable. Capabilities: not fully. That asymmetry is the crux — you can budget a training run with confidence yet still be surprised by what the finished model can do. It ties the technical story (this course) straight back to the alignment and evaluation problems (AI Safety).' },
      ],
    },
    {
      id: 'the-pipeline',
      title: 'The full alignment pipeline',
      minutes: 13,
      steps: [
        { t: 'text', title: 'Three objectives, three stages', md: `
          <p>You met pretrain &rarr; fine-tune &rarr; RLHF as a story. Now see it as three <em>different optimization objectives</em> stacked on the same weights:</p>
          <ol>
            <li><strong>Pretraining</strong> — minimize cross-entropy (next-token prediction) over a web-scale corpus. This is where knowledge and raw capability come from. 99%+ of the compute lives here.</li>
            <li><strong>Supervised fine-tuning (SFT)</strong> — same cross-entropy loss, but on a small, curated set of high-quality <em>instruction &rarr; response</em> demonstrations. This teaches the assistant format, not new knowledge.</li>
            <li><strong>Preference optimization (RLHF)</strong> — a different objective entirely, driven by human preference rather than imitation. The subject of the next steps.</li>
          </ol>
          <p>Same network throughout; what changes is the loss you point at it.</p>` },
        { t: 'quiz',
          q: 'Roughly where does the vast majority of an LLM\'s total training compute go?',
          opts: [
            'RLHF — human feedback is the expensive part',
            'Pretraining — trillions of tokens of next-token prediction dwarf the small, curated SFT and preference stages',
            'It is split evenly across the three stages',
          ],
          a: 1,
          why: 'Pretraining is the giant: trillions of tokens, months of GPUs. SFT and RLHF are comparatively tiny — thousands to millions of curated examples that reshape behavior, not rebuild knowledge. Capability is mostly bought in pretraining; alignment is a thin, crucial layer on top.' },
        { t: 'text', title: 'The RLHF objective, written out', md: `
          <p>RLHF replaces "imitate this answer" with "produce answers humans prefer." Concretely: humans rank pairs of responses, a <strong>reward model</strong> <code>r(x, y)</code> is trained to predict those preferences, and then the language model (the policy <code>&pi;</code>) is optimized to maximize reward — with a leash:</p>
          <pre><code>maximize  E[ r(x, y) ] &minus; &beta; &middot; KL( &pi; &#8214; &pi;<sub>ref</sub> )</code></pre>
          <p>The first term pushes toward high-reward answers. The second — a <strong>KL-divergence penalty</strong> — punishes drifting too far from the original fine-tuned model <code>&pi;<sub>ref</sub></code>. Without that leash, the policy would chase the reward model into bizarre, degenerate text that scores high but is gibberish — a textbook case of the reward hacking you met in AI Safety. The coefficient <code>&beta;</code> sets how tight the leash is.</p>` },
        { t: 'quiz',
          q: 'In the RLHF objective, what is the job of the KL-divergence penalty term?',
          opts: [
            'To make training faster',
            'To keep the optimized policy close to the original fine-tuned model, preventing it from over-optimizing the reward model into degenerate, high-scoring gibberish',
            'To increase the reward as much as possible',
          ],
          a: 1,
          why: 'The KL term is a leash against reward hacking. The reward model is an imperfect proxy for human preference; chase it too hard and you exploit its flaws. Penalizing divergence from &pi;<sub>ref</sub> keeps outputs in the space of sensible language while still nudging toward preferred answers — proxy-optimization done carefully.' },
        { t: 'text', title: 'Why the leash is the whole game', md: `
          <p>Step back and notice the pattern that has run through every course. The reward model is a <em>proxy</em> for "what humans actually want." Optimizing a proxy without restraint produces Goodhart\'s law in action: the measure gets maxed, the goal gets missed. The <code>&beta; &middot; KL</code> leash is an explicit, mathematical acknowledgment that we do not trust our own objective — so we deliberately optimize it only partway.</p>
          <p>That is the alignment problem, made concrete and shipped in production. Newer methods (like DPO) reformulate the math to skip the separate reward model, but the core tension — optimize human preference without over-optimizing an imperfect proxy — is exactly the same.</p>` },
        { t: 'quiz',
          q: 'How does the RLHF objective concretely embody the alignment problem from the AI Safety course?',
          opts: [
            'It doesn\'t — RLHF fully solves alignment',
            'The reward model is an imperfect proxy for human values, and the KL leash is an explicit admission that we must optimize that proxy only partway to avoid gaming it',
            'It removes humans from the loop entirely',
          ],
          a: 1,
          why: 'RLHF is the alignment problem in equation form: a proxy objective (reward model) that we deliberately refuse to fully maximize (the KL penalty), precisely because we know the proxy diverges from true intent. The whole design is a hedge against optimizing the wrong thing too well.' },
      ],
    },
    {
      id: 'compute-memory',
      title: 'The compute & memory reality',
      minutes: 12,
      steps: [
        { t: 'text', title: 'Why attention gets expensive fast', md: `
          <p>Attention lets every token look at every other token — its superpower and its cost. With a sequence of <code>n</code> tokens, that is <code>n &times; n</code> pairwise comparisons:</p>
          <pre><code>attention cost &prop; n<sup>2</sup></code></pre>
          <p>Double the context length and you roughly <em>quadruple</em> the attention compute and memory. This quadratic wall is why long context windows were historically so hard and expensive, and why a whole research industry exists to approximate attention more cheaply (FlashAttention, sparse and linear attention, and so on). When a provider charges more for long-context requests, this <code>n<sup>2</sup></code> is a big part of why.</p>` },
        { t: 'quiz',
          q: 'Standard self-attention scales as n&sup2; in the sequence length n. Going from 2,000 to 8,000 tokens of context multiplies attention cost by roughly what?',
          opts: [
            '4&times; (linear in the 4&times; length increase)',
            '16&times; — because 4&times; longer, squared, is 4&sup2; = 16',
            'No change',
          ],
          a: 1,
          why: '4&times; the length, squared, is 16&times; the attention compute and memory. That quadratic scaling is the fundamental reason long context is costly and why so much engineering targets making attention sub-quadratic. It is a direct, quantitative consequence of "every token attends to every token."' },
        { t: 'text', title: 'Training cost vs inference cost', md: `
          <p>A crucial distinction the 6ND rule hides: training is a one-time megaproject, but <strong>inference</strong> — running the model to serve users — is forever. A model used by hundreds of millions of people can, over its lifetime, consume far more total compute serving answers than it did to train.</p>
          <p>Inference has its own bottleneck: the <strong>KV cache</strong>. To generate each new token, a model reuses the keys and values of all previous tokens (so it does not recompute them). That cache grows linearly with the sequence length and must live in fast GPU memory. For long conversations and many simultaneous users, KV-cache memory — not raw math — is often what limits how much a single GPU can serve.</p>` },
        { t: 'quiz',
          q: 'During generation, why does a long conversation strain GPU memory even between the bursts of computation?',
          opts: [
            'The model reloads its weights for every token',
            'The KV cache — stored keys/values for every prior token — grows with sequence length and must stay in fast GPU memory, so long contexts and many users consume large amounts of it',
            'Longer text needs more disk space on the server',
          ],
          a: 1,
          why: 'The KV cache is the hidden memory cost of inference. It lets the model avoid recomputing past tokens, but it scales with context length &times; concurrent users and lives in scarce GPU RAM. That is frequently the true limit on serving capacity — a systems constraint invisible from the model\'s accuracy alone.' },
        { t: 'text', title: 'Why one GPU is never enough', md: `
          <p>Frontier models do not fit on a single GPU — not the weights, not the activations, not the optimizer state. So training and serving are spread across thousands of chips using several kinds of <strong>parallelism</strong>: splitting the data across GPUs, splitting individual layers across GPUs (tensor parallelism), and splitting the stack of layers across GPUs (pipeline parallelism). Orchestrating this — keeping thousands of chips fed and synchronized over a fast interconnect — is as much of the achievement as the model design itself.</p>
          <div class="callout">💡 The synthesis: a modern model\'s capability is bounded not only by ideas but by three physical resources — compute (FLOPs), memory (for weights and the KV cache), and interconnect bandwidth. Scaling laws set the target; hardware decides what is reachable.</div>` },
        { t: 'quiz',
          q: 'Why must frontier models be split across many GPUs rather than run on one big one?',
          opts: [
            'For legal redundancy reasons',
            'A single GPU cannot hold the weights, activations, and optimizer state, so the model is partitioned across chips via data, tensor, and pipeline parallelism',
            'Because one GPU would be too fast',
          ],
          a: 1,
          why: 'It is a capacity problem: the model and its training state exceed any single device\'s memory and throughput. Parallelism partitions the work across thousands of GPUs, and coordinating them over a fast interconnect is a core engineering feat — hardware and systems are inseparable from the model.' },
      ],
    },
    {
      id: 'composing-systems',
      title: 'Composing real systems',
      minutes: 11,
      steps: [
        { t: 'text', title: 'A product is many models in a trench coat', md: `
          <p>A real AI product is rarely one model. It is a <em>system</em> that orchestrates several of the types from the survey course, each doing what it is best at. A customer-support assistant, for example, might chain:</p>
          <ol>
            <li><strong>Embedding model</strong> &rarr; turn the user\'s question and the knowledge base into vectors (retrieval).</li>
            <li><strong>Vector search</strong> &rarr; pull the most relevant documents (RAG).</li>
            <li><strong>LLM</strong> &rarr; answer, grounded in those documents.</li>
            <li><strong>Tools/agents</strong> &rarr; call an API to check an order status if needed.</li>
            <li><strong>A smaller classifier</strong> &rarr; detect and refuse abusive or out-of-scope requests (a guardrail).</li>
          </ol>
          <p>Every course you took maps onto one link in this chain. The engineering skill is choosing the right model type for each job and wiring them together.</p>` },
        { t: 'quiz',
          q: 'Why build a support bot from an embedding model + retrieval + an LLM + a classifier, instead of just one big LLM?',
          opts: [
            'To make the system needlessly complicated',
            'Each component is the right tool for its job — retrieval grounds answers in current facts (cutting hallucination), a small classifier cheaply guards inputs — yielding a system that is more accurate, cheaper, and more controllable than one model alone',
            'Because LLMs cannot generate text on their own',
          ],
          a: 1,
          why: 'Specialization wins. RAG grounds the LLM in real, up-to-date documents (addressing the frozen-knowledge and hallucination problems); cheap models handle bulk retrieval and guardrails. The result is more accurate, cheaper per query, and easier to control than forcing one giant model to do everything.' },
        { t: 'text', title: 'The three-way trade-off', md: `
          <p>Every design decision in such a system is a negotiation between three quantities pulling against each other:</p>
          <ul>
            <li><strong>Quality</strong> — how good the answers are (bigger models, more retrieval, more reasoning steps).</li>
            <li><strong>Latency</strong> — how fast it responds (users abandon slow apps; each extra model call and each reasoning token adds delay).</li>
            <li><strong>Cost</strong> — dollars per request (bigger models and longer contexts cost more, per the <code>n<sup>2</sup></code> and per-token economics you just saw).</li>
          </ul>
          <p>You cannot maximize all three. A common resolution is <strong>cascading</strong> or <strong>routing</strong>: send easy queries to a small, fast, cheap model and escalate only the hard ones to the expensive frontier model — buying most of the quality at a fraction of the average cost and latency.</p>` },
        { t: 'quiz',
          q: 'A team routes simple queries to a small cheap model and only escalates hard ones to a large model. Which trade-off are they managing?',
          opts: [
            'They have eliminated all trade-offs',
            'Quality vs latency vs cost — cascading captures most of the quality while cutting average cost and latency, since most queries never hit the expensive model',
            'Only accuracy, nothing else',
          ],
          a: 1,
          why: 'Routing/cascading is the classic move against the quality&ndash;latency&ndash;cost triangle. Because most real traffic is easy, handling it with a cheap fast model and reserving the frontier model for genuinely hard cases preserves most of the quality at a fraction of the average cost and delay. Systems thinking, not just model thinking.' },
      ],
    },
    {
      id: 'the-frontier',
      title: 'The frontier & open problems',
      minutes: 11,
      steps: [
        { t: 'text', title: 'Where the smooth curves might bend', md: `
          <p>Scaling has carried the field a long way, but every input to the <code>6ND</code> engine faces a ceiling:</p>
          <ul>
            <li><strong>Data.</strong> Chinchilla wants ~20 tokens per parameter, and frontier models are approaching the supply of high-quality human text on the internet. This "data wall" is driving intense work on synthetic data, multimodal data, and squeezing more from each token.</li>
            <li><strong>Compute &amp; energy.</strong> Each tier costs multiplicatively more (the 6ND product). At some point the dollars, chips, and gigawatts become the binding constraint, not the algorithm.</li>
            <li><strong>Diminishing returns.</strong> The small exponent <code>&alpha;</code> in the power law cuts both ways: past a point, each 10&times; of compute buys a smaller and smaller loss reduction.</li>
          </ul>
          <p>Whether raw scaling keeps paying off, or new ideas (better architectures, reasoning at inference time, agents) take over, is the central open question of the field right now.</p>` },
        { t: 'quiz',
          q: 'The "data wall" is a limit on continued scaling. Why does it follow directly from the Chinchilla result?',
          opts: [
            'Chinchilla says data doesn\'t matter',
            'Compute-optimal training needs tokens to scale with parameters (~20:1), so ever-larger models demand ever-more high-quality text — and the supply of that text is finite',
            'It means models have memorized the whole internet verbatim',
          ],
          a: 1,
          why: 'Chinchilla couples data to parameters: bigger compute-optimal models need proportionally more tokens. Since high-quality human text is a finite resource, that coupling turns "just scale up" into "find more data," motivating synthetic and multimodal data. The scaling law that enabled the boom also defines one of its ceilings.' },
        { t: 'text', title: 'The problems scale does not solve', md: `
          <p>Some challenges are not dented by more compute — they are, if anything, sharpened by it:</p>
          <ul>
            <li><strong>Hallucination</strong> — a lower loss reduces but never eliminates confident fabrication, because plausibility is the objective and truth only correlates with it.</li>
            <li><strong>Alignment</strong> — a more capable optimizer finds more ways to game an imperfect objective; the <code>&beta; &middot; KL</code> leash is a patch, not a solution.</li>
            <li><strong>Interpretability</strong> — we still cannot fully read why a model does what it does, and the models are getting larger, not simpler.</li>
            <li><strong>Evaluation</strong> — as capabilities emerge unpredictably, even measuring what a model can (and cannot safely) do is an unsolved, moving target.</li>
          </ul>
          <p>These are exactly the threads from the AI Safety course — now visible as consequences of the very mechanisms this course made precise.</p>` },
        { t: 'quiz',
          q: 'Why won\'t simply scaling models up make hallucination go away entirely?',
          opts: [
            'Bigger models stop generating text',
            'The training objective rewards plausible continuations, and plausibility only correlates with truth — so lower loss reduces but cannot fully remove confident fabrication, especially on rare specifics',
            'Hallucination is a hardware bug that better GPUs fix',
          ],
          a: 1,
          why: 'It is baked into the objective. Cross-entropy optimizes for plausible next tokens, not verified truth; where the two diverge (obscure facts), the model still must emit something plausible. Scale narrows the gap but cannot close it — which is why grounding (RAG), tools, and calibration matter, not just size.' },
        { t: 'text', title: '🎓 The whole picture, in focus', md: `
          <p>You have reached the top of the mountain and can now see the entire range at once:</p>
          <ul>
            <li><strong>The objective</strong> — one scalar, cross-entropy, whose minimization produces every capability</li>
            <li><strong>Scaling laws</strong> — loss is a predictable power law in compute; Chinchilla and 6ND turn that into a budget</li>
            <li><strong>Emergence</strong> — predictable loss, unpredictable capabilities: the forecasting gap</li>
            <li><strong>The pipeline</strong> — pretrain, SFT, and a KL-leashed preference objective that is the alignment problem in math</li>
            <li><strong>Compute &amp; memory</strong> — n<sup>2</sup> attention, the KV cache, and parallelism across thousands of GPUs</li>
            <li><strong>Systems</strong> — real products compose model types under a quality&ndash;latency&ndash;cost trade-off</li>
            <li><strong>The frontier</strong> — data, compute, and problems scale alone will not solve</li>
          </ul>
          <p>Every earlier course was a piece; this was the assembly. From here, the <strong>Python &amp; PyTorch</strong> track turns all of this understanding into code you write and run. You are ready. 🚀</p>` },
      ],
    },
  ],
});

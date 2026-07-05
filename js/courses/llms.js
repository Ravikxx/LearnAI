// Course 3: How LLMs Work
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'llms',
  title: 'How LLMs Work',
  tagline: 'Inside ChatGPT: tokens, attention, and next-word prediction',
  icon: '💬',
  accent: 'var(--series-2)',
  description: 'Large Language Models feel like magic. They\'re not — they\'re next-token predictors built from everything you\'ve learned so far, plus one brilliant idea called attention. By the end, you\'ll know what actually happens when you hit send.',
  lessons: [
    {
      id: 'tokens',
      title: 'Tokens: how models read',
      minutes: 9,
      steps: [
        { t: 'text', title: 'Models don\'t see words', md: `
          <p>A neural network eats numbers, not text. So the first step of every LLM is chopping text into <strong>tokens</strong> — chunks from a fixed vocabulary (typically 50,000–200,000 entries), each with an ID number.</p>
          <p>Tokens are usually <em>pieces</em> of words. Common words get their own token; rare words get split: <code>unbelievable</code> might become <code>un</code> + <code>believ</code> + <code>able</code>.</p>
          <p>Why not whole words? You'd need infinite vocabulary (every typo, name, and new slang word ever). Why not single letters? Sequences would get enormously long. Sub-word pieces are the sweet spot: any text can be encoded, common things stay compact.</p>` },
        { t: 'widget', name: 'tokenizer', title: 'Try it: tokenize some text', md: `
          <p>Type anything and watch it get chopped (this is a simplified toy tokenizer — real ones like GPT's work on learned statistics, but the idea is the same). Try a common word, then a made-up word like <code>flurbification</code>, then some numbers.</p>` },
        { t: 'quiz',
          q: 'Why does a rare made-up word split into many tokens while "the" stays whole?',
          opts: [
            'The tokenizer is guessing the word\'s meaning',
            'Tokenizers give frequent text sequences their own tokens; rare text must be assembled from smaller common pieces',
            'Long words always split, short words never do',
          ],
          a: 1,
          why: 'Tokenizers are built by finding the most frequent character sequences in a huge text corpus (an algorithm called Byte Pair Encoding). "the" is everywhere → earns its own token. "flurbification" appears nowhere → gets assembled from common fragments. Frequency, not length, decides.' },
        { t: 'quiz',
          q: 'LLMs are notoriously bad at questions like "how many R\'s are in strawberry?" Tokens explain why:',
          opts: [
            'The model sees token IDs like [straw][berry] — it never sees individual letters at all',
            'LLMs can\'t count anything',
            'The letter R is missing from the vocabulary',
          ],
          a: 0,
          why: 'The model receives something like token #3504 + token #8180 — the R\'s aren\'t IN its input, so counting them requires it to have memorized the spelling of its own tokens. Many "dumb" LLM failures (spelling, rhyming, arithmetic on long numbers) are really tokenization artifacts.' },
        { t: 'text', title: 'Tokens are the currency of AI', md: `
          <p>Once you know about tokens, LLM-world pricing and limits make sense:</p>
          <ul>
            <li><strong>API pricing</strong> is per token (roughly: 1 token ≈ ¾ of an English word).</li>
            <li><strong>Context windows</strong> ("this model handles 200K tokens") measure how many tokens the model can consider at once — its working memory.</li>
            <li><strong>Generation speed</strong> is quoted in tokens per second, because models produce text one token at a time.</li>
          </ul>` },
      ],
    },
    {
      id: 'embeddings',
      title: 'Embeddings: meaning as geometry',
      minutes: 9,
      steps: [
        { t: 'text', title: 'From IDs to meaning', md: `
          <p>Token #8180 is just an ID — it says nothing about meaning. Step two: each token ID is mapped to an <strong>embedding</strong> — a long list of numbers (thousands of them) acting as coordinates in a "meaning space."</p>
          <p>The rule of this space: <strong>similar meaning = nearby points.</strong> "cat" and "kitten" sit close together; "cat" and "carburetor" are far apart.</p>
          <p>Nobody designs these coordinates. They're learned parameters — knobs! — tuned by gradient descent. Words that appear in similar contexts get pushed toward each other during training.</p>` },
        { t: 'widget', name: 'embeddings', title: 'Try it: explore a meaning map', md: `
          <p>A tiny 2-D meaning space (real ones have thousands of dimensions). <strong>Click any word</strong> to see its nearest neighbors light up. Notice how the clusters formed — nobody labeled these groups.</p>` },
        { t: 'quiz',
          q: 'The famous embedding party trick: king − man + woman ≈ queen. What does this reveal?',
          opts: [
            'Embeddings store a dictionary of analogies',
            'Directions in the space carry meaning — the same "male→female" direction connects king→queen, uncle→aunt, actor→actress',
            'It\'s a coincidence',
          ],
          a: 1,
          why: 'Relationships become directions: gender, tense, country→capital each correspond to a consistent arrow in the space. Arithmetic on meaning becomes possible because meaning has become geometry. This is one of the most beautiful discoveries in AI.' },
        { t: 'quiz',
          q: 'The word "bank" means a riverbank AND a money bank. What\'s the problem with giving it ONE fixed embedding?',
          opts: [
            'No problem — one point per word is plenty',
            'One point must awkwardly average both meanings — the embedding can\'t know which "bank" this sentence means',
            'Words with two meanings get two tokens',
          ],
          a: 1,
          why: 'A fixed embedding smears both senses into one point. What you WANT is for "bank" near "river" to shift toward water-meaning, and near "loan" toward money-meaning — embeddings updated by context. That is precisely what attention does, and it\'s the next lesson.' },
      ],
    },
    {
      id: 'attention',
      title: 'Attention: the big idea',
      minutes: 10,
      steps: [
        { t: 'text', title: 'Words need to talk to each other', md: `
          <p>Consider: <em>"The cat sat on the mat because <strong>it</strong> was tired."</em></p>
          <p>What does "it" refer to? You instantly know: the cat (mats don't get tired). To understand "it," you consulted <em>other words in the sentence</em>.</p>
          <p><strong>Attention</strong> is the mechanism that lets tokens do this. Each token gets to look at every other token, decide how <em>relevant</em> each one is, and pull in information from the relevant ones — updating its own embedding with context.</p>
          <p>After attention, "it" isn't a generic pronoun-point anymore; its embedding has absorbed cat-ness.</p>` },
        { t: 'widget', name: 'attention', title: 'Try it: see what "it" looks at', md: `
          <p><strong>Click any word</strong> to see where its attention goes (bar height = attention weight, from a toy model of this sentence). Definitely click <code>it</code> — then compare with <code>tired</code> and <code>sat</code>.</p>` },
        { t: 'quiz',
          q: 'Now change the sentence to "...because it was COMFY." Where should "it" attend most?',
          opts: [
            'Still the cat — "it" always means the animal',
            'The mat — mats are comfy, cats aren\'t described as comfy here; attention must be computed fresh from context',
            'The word "because"',
          ],
          a: 1,
          why: 'One word swap flips the referent — "tired" points to cat, "comfy" points to mat. This is why attention weights are COMPUTED per input (from the embeddings themselves), not stored as fixed connections. Meaning emerges dynamically from context.' },
        { t: 'text', title: 'How relevance is computed', md: `
          <p>The mechanics, minus the matrix algebra — each token produces three vectors (all via learned weights):</p>
          <ul>
            <li>a <strong>query</strong> — "what am I looking for?" ("it" asks: <em>who's a singular thing that could be tired?</em>)</li>
            <li>a <strong>key</strong> — "what do I offer?" ("cat" advertises: <em>singular animal here!</em>)</li>
            <li>a <strong>value</strong> — the actual information to hand over if selected.</li>
          </ul>
          <p>Each token's query is compared against every token's key; strong matches get high attention weights; the token then blends the corresponding <em>values</em> into its own representation, weighted by attention.</p>
          <p>And this happens with many <strong>attention heads</strong> in parallel — one head might track pronouns, another grammar, another topic — in every layer of the network.</p>` },
        { t: 'text', title: 'The Transformer', md: `
          <p>Stack it all: tokens → embeddings → then repeat dozens of times: <em>[attention layer → small neural network]</em> → predict. That stack is the <strong>Transformer</strong>, from the 2017 paper "Attention Is All You Need" — the architecture behind GPT, Claude, Gemini, and Llama.</p>
          <p>Why it beat RNNs, which read one word at a time:</p>
          <ul>
            <li><strong>Every token attends to every other directly</strong> — no long-distance information decay: word #5,000 can look straight at word #1.</li>
            <li><strong>All tokens process in parallel</strong> — perfect for GPUs, so training scales to internet-sized data.</li>
          </ul>
          <div class="callout">💡 GPT = <strong>G</strong>enerative <strong>P</strong>re-trained <strong>T</strong>ransformer. You now know what the T means — and soon, the G and P.</div>` },
        { t: 'quiz',
          q: 'An RNN reads sequentially: by word 500, information from word 1 has been squeezed through 499 memory updates. How does attention fix this?',
          opts: [
            'It reads the text multiple times',
            'Token 500 attends DIRECTLY to token 1 in one hop — no relay chain, no decay',
            'It uses a bigger memory',
          ],
          a: 1,
          why: 'Attention is a direct line between any two tokens, however far apart. No game of telephone. That single property — plus parallelism on GPUs — is why Transformers conquered language (and then images, audio, protein folding...).' },
      ],
    },
    {
      id: 'next-token',
      title: 'Predicting the next token',
      minutes: 10,
      steps: [
        { t: 'text', title: 'The only trick LLMs know', md: `
          <p>Everything an LLM does — essays, code, jokes, therapy-speak — is one operation, repeated:</p>
          <p style="text-align:center"><strong>Given all tokens so far, predict a probability for EVERY token in the vocabulary being next.</strong></p>
          <p>"The cat sat on the ___" → the model outputs ~100,000 probabilities: <code>mat 62%, floor 11%, couch 8%, ... carburetor 0.0001%</code>.</p>
          <p>Then one token is picked, appended, and the whole thing runs again for the next token. That loop, at ~dozens of tokens per second, is ChatGPT typing.</p>` },
        { t: 'widget', name: 'temperature', title: 'Try it: sampling and temperature', md: `
          <p>Here's a next-token probability distribution. The <strong>temperature</strong> slider reshapes it before sampling: low = sharpen toward the favorite, high = flatten toward uniform. Hit <strong>Sample</strong> a bunch at different temperatures and watch what gets picked.</p>` },
        { t: 'quiz',
          q: 'You want an LLM to answer factual questions in a customer-support bot. Which temperature?',
          opts: [
            'High (1.5+) — creativity is always good',
            'Low (near 0) — stick to the highest-probability, most reliable answers',
            'Temperature doesn\'t affect answers',
          ],
          a: 1,
          why: 'Low temperature = nearly always pick the top choice = consistent, conservative output — right for facts and support. High temperature gives diverse, surprising picks — great for brainstorming and fiction, risky for facts. It\'s the main creativity dial developers actually turn.' },
        { t: 'quiz',
          q: 'Why does ChatGPT give different answers when you regenerate the same question?',
          opts: [
            'It\'s learning between your attempts',
            'Sampling is random: at temperature > 0 it picks from the distribution, so each run can take a different path — and early differences compound',
            'The servers are inconsistent',
          ],
          a: 1,
          why: 'Each token is a weighted dice roll. Once one roll differs, the context differs, so ALL subsequent predictions shift — tiny early divergences snowball into completely different answers. (At temperature 0 it picks the top token every time and becomes nearly deterministic.)' },
        { t: 'text', title: 'Where "hallucination" comes from', md: `
          <p>Now the most infamous LLM failure explains itself.</p>
          <p>The model produces <em>plausible</em> next tokens — that's the entire objective it was trained on. "The capital of France is" → "Paris" is both plausible AND true. But "The 2019 Henderson v. Blake ruling established" → the model continues with plausible-sounding legal language <em>whether or not the case exists</em>.</p>
          <p>Fluent text is what it was trained to produce. Truth correlates with plausibility — often, not always. A hallucination isn't a glitch; it's the training objective working exactly as designed on a question where plausible ≠ true.</p>` },
        { t: 'quiz',
          q: 'When is an LLM MOST likely to hallucinate?',
          opts: [
            'On common knowledge repeated millions of times in training data',
            'On obscure specifics (niche citations, small-town details, exact statistics) where plausible-sounding continuations vastly outnumber true ones',
            'Hallucination is random and unpredictable',
          ],
          a: 1,
          why: 'For well-represented facts, the truthful continuation dominates the probability mass. For obscure ones, the model has little signal — but still MUST output plausible tokens, so it fills the gap with statistically-shaped fiction. Rule of thumb: the more specific and rare the claim, the more you should verify.' },
      ],
    },
    {
      id: 'gpt-to-chatbot',
      title: 'From next-token machine to chatbot',
      minutes: 10,
      steps: [
        { t: 'text', title: 'Pretraining: reading the internet', md: `
          <p><strong>Stage 1: Pretraining.</strong> Take a Transformer with billions of random weights. Feed it trillions of tokens of text. At every position, the task is the same: predict the next token; wrong predictions raise the loss; backprop and gradient descent adjust the weights. For months, on thousands of GPUs.</p>
          <p>To get good at this game, the model is forced to absorb grammar, facts, styles, code, and a surprising amount of reasoning — because all of that helps predict what comes next.</p>
          <p>The result (a "base model") is a masterful autocompleter — but NOT an assistant. Ask it "What's the capital of France?" and it might continue: <em>"What's the capital of Germany? What's the capital of Italy?"</em> — because quiz lists look like that on the internet.</p>` },
        { t: 'quiz',
          q: 'Why does the base model continue your question with more questions instead of answering?',
          opts: [
            'It doesn\'t know the answer',
            'It\'s doing its job perfectly: predicting likely next text. On the internet, question lists are often followed by more questions — nothing trained it to be helpful',
            'It\'s broken and needs retraining from scratch',
          ],
          a: 1,
          why: 'The base model almost certainly "knows" Paris (that knowledge helps prediction elsewhere). But its objective is continuation, not conversation. Being an assistant is a different behavior — and it has to be trained in separately.' },
        { t: 'text', title: 'Fine-tuning and RLHF: learning to be helpful', md: `
          <p><strong>Stage 2: Instruction fine-tuning.</strong> Continue training, but now on curated examples of conversations: question → helpful answer. The model learns the <em>format and persona</em> of an assistant.</p>
          <p><strong>Stage 3: RLHF</strong> (Reinforcement Learning from Human Feedback). Humans compare pairs of model answers — "this one's better." A separate <em>reward model</em> learns to predict those human preferences, then the LLM is tuned to produce answers the reward model scores highly.</p>
          <p>This pipeline — pretrain → fine-tune → RLHF — is what turned autocomplete into ChatGPT, arguably the key unlock that made LLMs usable by everyone.</p>` },
        { t: 'quiz',
          q: 'RLHF optimizes for answers humans PREFER. What subtle failure mode does this create?',
          opts: [
            'Answers get shorter',
            'Models can learn to be agreeable and confident-sounding rather than correct — pleasing the rater isn\'t identical to being right',
            'Models refuse to answer anything',
          ],
          a: 1,
          why: 'Raters are human: confident, polished, agreeable answers win comparisons even when subtly wrong. This is why LLMs can be sycophantic ("Great question! You\'re absolutely right...") and rarely say "I don\'t know." The objective is preference, and preference only approximates truth.' },
        { t: 'text', title: 'What happens when you hit send', md: `
          <p>The full pipeline, start to finish — every piece of which you now understand:</p>
          <ol>
            <li>Your message (plus the conversation so far, plus a hidden system prompt) is <strong>tokenized</strong></li>
            <li>Tokens become <strong>embeddings</strong></li>
            <li>Dozens of Transformer layers run <strong>attention</strong> — every token consulting every other</li>
            <li>The model outputs a <strong>probability distribution</strong> over the next token</li>
            <li>A token is <strong>sampled</strong> (temperature!), appended, and steps 3–5 loop</li>
            <li>Tokens stream back to your screen as they're picked — that's why the reply "types"</li>
          </ol>` },
        { t: 'quiz',
          q: 'Mid-conversation, ChatGPT seems to "remember" what you said 10 messages ago. How?',
          opts: [
            'Its weights update as you chat — it\'s learning you',
            'The ENTIRE conversation is re-fed through the model every single turn — "memory" is just the context window',
            'It stores your facts in a database automatically',
          ],
          a: 1,
          why: 'Weights are frozen during chat — no learning happens. Every turn, the whole transcript is processed again from scratch. That\'s also why very long chats degrade or forget the beginning: once the transcript exceeds the context window, the oldest tokens fall off the edge.' },
        { t: 'text', title: '🎓 You made it!', md: `
          <p>Look at what you can now explain that most people can't:</p>
          <ul>
            <li>Why LLMs can't spell "strawberry" (tokens)</li>
            <li>Why king − man + woman = queen (embeddings)</li>
            <li>How "it" finds its cat (attention)</li>
            <li>Why regenerate gives different answers (sampling)</li>
            <li>Why hallucinations happen (plausibility ≠ truth)</li>
            <li>Why ChatGPT is polite (RLHF)</li>
          </ul>
          <p>Next up: <strong>Getting the Most from LLMs</strong> — now that you know how they work, learn to actually drive one: prompting, retrieval, and agents. 🚀</p>` },
      ],
    },
  ],
});

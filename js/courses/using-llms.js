// Course: Getting the Most from LLMs
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'using-llms',
  title: 'Getting the Most from LLMs',
  tagline: 'Prompting, context, retrieval, and agents — the practical skills',
  icon: '🧰',
  accent: 'var(--series-3)',
  description: 'You know how LLMs work under the hood. This course is the flip side: how to actually drive one well. Prompting that works, why examples help, how to give a model knowledge it wasn\'t trained on, and how chatbots turn into agents that take actions.',
  lessons: [
    {
      id: 'prompting',
      title: 'Prompting that actually works',
      minutes: 9,
      steps: [
        { t: 'text', title: 'A prompt is a starting context, not a command', md: `
          <p>Remember what an LLM does: given the text so far, predict a plausible continuation. Your prompt <em>is</em> that "text so far." You're not issuing an order to an obedient robot — you're setting up a context and asking, "what text most plausibly comes next?"</p>
          <p>That reframing explains almost every prompting tip. A vague prompt has many plausible continuations, so you get a generic, hedge-everything answer. A specific, richly-set-up prompt narrows the plausible continuations toward the one you actually want.</p>
          <div class="callout">💡 Bad: "Write about dogs." Better: "Write a 3-sentence, upbeat product blurb for a chew toy for large-breed puppies, aimed at first-time dog owners."</div>` },
        { t: 'quiz',
          q: 'Why does adding "you are an experienced pediatric nurse" often improve a health-explainer answer?',
          opts: [
            'It gives the model new medical knowledge it didn\'t have',
            'It steers the continuation toward text that sounds like an expert wrote it — pulling on the style and care already in its training data',
            'It unlocks a hidden expert mode in the model',
          ],
          a: 1,
          why: 'The role doesn\'t add knowledge — the model already read plenty of expert writing. It shifts WHICH region of that knowledge the continuation is drawn from. "Text a careful pediatric nurse would write" is a more useful target than "generic text about a symptom."' },
        { t: 'text', title: 'The four levers', md: `
          <p>Most good prompts pull some combination of four levers:</p>
          <ul>
            <li><strong>Role / persona</strong> — "You are a patient math tutor." Sets tone and expertise.</li>
            <li><strong>Task, stated precisely</strong> — what to do, with any constraints (length, audience, what to avoid).</li>
            <li><strong>Context</strong> — the specific material to work from: the article to summarize, the code that's failing, the data.</li>
            <li><strong>Format</strong> — "Answer as a bulleted list," "Return JSON with keys title and summary," "Show your steps."</li>
          </ul>
          <p>You don't always need all four, but when an answer disappoints, the fix is usually a missing lever — most often <em>context</em> or <em>format</em>.</p>` },
        { t: 'quiz',
          q: 'You ask for "a summary" and get a wall of prose when you wanted 3 bullets. Which lever did you forget?',
          opts: [
            'Role',
            'Format — you never specified the shape of the output',
            'Nothing; the model just made a mistake',
          ],
          a: 1,
          why: 'The model can\'t read your mind about output shape, so it picks the most common plausible form — flowing prose. Stating the format ("exactly 3 bullets, max 12 words each") removes the guesswork. Format is the cheapest, highest-return lever.' },
        { t: 'text', title: 'Show, don\'t just tell', md: `
          <p>The single most reliable upgrade to a prompt: <strong>give an example of what you want.</strong> Instead of describing the output in the abstract, demonstrate it once.</p>
          <p>Turning "extract the sentiment" into "Here's an example — <code>Input: 'Loved it!' → Output: positive</code> — now do this one:" pins down format, labels, and edge-case handling all at once, far more precisely than a paragraph of instructions could.</p>
          <p>This is so effective it has a name — <strong>few-shot prompting</strong> — and it's the whole next lesson.</p>` },
        { t: 'quiz',
          q: 'Someone complains "the model keeps ignoring my instructions." What\'s usually the more effective fix?',
          opts: [
            'Repeat the instruction in ALL CAPS and add "IMPORTANT!!!"',
            'Show a concrete example of a correct input→output pair, so the desired behavior is demonstrated rather than described',
            'Switch to a different model immediately',
          ],
          a: 1,
          why: 'Emphasis markers help a little, but a demonstration is far stronger — it collapses ambiguity by showing the exact target. Reach for an example before you reach for CAPS. (And if one example helps, a few usually help more.)' },
      ],
    },
    {
      id: 'few-shot-cot',
      title: 'Examples & chain-of-thought',
      minutes: 9,
      steps: [
        { t: 'text', title: 'Zero-shot vs few-shot', md: `
          <p><strong>Zero-shot</strong> = you just describe the task. <strong>Few-shot</strong> = you include a handful of worked examples before the real question.</p>
          <p>Why does showing 2–5 examples help so much? Because the model learns the pattern <em>in-context</em> — no retraining, no weight changes. The examples become part of the "text so far," and the model continues the pattern you've established. This is called <strong>in-context learning</strong>, and it was one of the surprising emergent abilities of large models.</p>` },
        { t: 'quiz',
          q: 'Few-shot examples change the model\'s answer without changing its parameters. How is that possible?',
          opts: [
            'The examples secretly fine-tune the weights on the fly',
            'The examples are just more input tokens — the model continues the demonstrated pattern using attention over that context, weights untouched',
            'The model memorizes the examples for next time',
          ],
          a: 1,
          why: 'Nothing about the model changes. The examples sit in the context window, and attention lets the model pattern-match against them when producing the next tokens. Close the chat and the "learning" is gone — it lived entirely in the context.' },
        { t: 'text', title: 'Let it think out loud', md: `
          <p>Ask a model "What\'s 17 × 24?" and demand only the final number, and it often flubs it. Ask it to <strong>work step by step</strong>, and accuracy jumps.</p>
          <p>This is <strong>chain-of-thought (CoT) prompting</strong>. Why it works ties straight back to the architecture: the model does a fixed amount of computation per token. Forcing an immediate answer gives it one shot. Letting it generate intermediate steps gives it <em>more tokens to compute across</em> — each step conditions the next, like showing your work on paper.</p>
          <div class="callout">💡 The magic phrase "Let\'s think step by step" measurably raised benchmark scores in a famous 2022 paper — just by inviting the model to reason before answering.</div>` },
        { t: 'quiz',
          q: 'Why does "think step by step" help a model with a hard arithmetic or logic problem?',
          opts: [
            'It makes the model try harder because it feels encouraged',
            'Intermediate tokens give the model more computation to work through — each step builds on the last, instead of forcing the answer in a single leap',
            'It switches the model to a built-in calculator',
          ],
          a: 1,
          why: 'A model spends the same compute per token, so a one-token answer to a multi-step problem is a gamble. Writing the steps out spreads the reasoning across many tokens, each attending to the ones before — genuinely more "thinking room," not a motivational trick.' },
        { t: 'quiz',
          q: 'When is chain-of-thought LEAST useful (and just wasted tokens)?',
          opts: [
            'On multi-step math word problems',
            'On simple lookups like "What\'s the capital of Japan?" where there\'s no reasoning to unfold',
            'On logic puzzles',
          ],
          a: 1,
          why: 'CoT pays off when there are genuine intermediate steps. For a direct fact recall, there\'s nothing to reason through — the steps are just latency and cost. Match the technique to the task; don\'t cargo-cult "step by step" onto everything.' },
      ],
    },
    {
      id: 'rag',
      title: 'Giving a model knowledge: RAG',
      minutes: 10,
      steps: [
        { t: 'text', title: 'The frozen-knowledge problem', md: `
          <p>An LLM\'s knowledge is frozen at its training cutoff and blurry on specifics — it can\'t know your company\'s internal docs, today\'s news, or the contents of a PDF you just made. And when it doesn\'t know, it doesn\'t stop; it produces plausible-sounding tokens anyway. Hallucination.</p>
          <p>The dominant fix is beautifully simple: <strong>don\'t ask the model to recall — give it the answer to read.</strong> Fetch the relevant documents and paste them into the context alongside the question. This is <strong>Retrieval-Augmented Generation (RAG)</strong>.</p>` },
        { t: 'quiz',
          q: 'How does putting a source document in the prompt reduce hallucination?',
          opts: [
            'It permanently teaches the model the new facts',
            'The model can now attend to the actual text and ground its answer in it, instead of reconstructing a plausible guess from fuzzy memory',
            'It disables the model\'s ability to make things up',
          ],
          a: 1,
          why: 'Nothing is taught — weights don\'t change. But the true information is now IN the context, so the most plausible continuation is one that draws on it. You\'ve turned a memory test into an open-book test, and open-book is far more reliable.' },
        { t: 'text', title: 'How retrieval finds the right text', md: `
          <p>You can\'t stuff a 10,000-page manual into the context window. So RAG retrieves only the <em>relevant</em> chunks. The trick is embeddings — the same "meaning as geometry" idea from the LLM course.</p>
          <ol>
            <li>Split your documents into chunks; compute an <strong>embedding</strong> (a meaning-vector) for each; store them in a <strong>vector database</strong>.</li>
            <li>When a question arrives, embed the question too.</li>
            <li>Find the chunks whose embeddings are <em>nearest</em> to the question\'s — those are the most semantically relevant.</li>
            <li>Paste those chunks into the prompt, and let the model answer from them.</li>
          </ol>
          <div class="callout">💡 Retrieval matches on <em>meaning</em>, not keywords — a question about "canceling my plan" can pull up a doc titled "Ending your subscription," because their embeddings sit close together.</div>` },
        { t: 'quiz',
          q: 'RAG retrieves by embedding similarity rather than exact keyword match. Why is that an advantage?',
          opts: [
            'It\'s faster than keyword search in every case',
            'It matches on meaning, so a question and a relevant doc can be retrieved even when they share no exact words',
            'It guarantees the retrieved chunk is always correct',
          ],
          a: 1,
          why: 'Semantic matching handles paraphrase and synonyms — "car won\'t start" ↔ "engine fails to turn over." (It guarantees nothing about correctness, and hybrid keyword+semantic search is common in practice — but meaning-based recall is the core win.)' },
        { t: 'quiz',
          q: 'A RAG system confidently answers using a retrieved chunk that\'s actually outdated. What\'s the lesson?',
          opts: [
            'RAG is useless',
            'RAG is only as good as what it retrieves — garbage or stale sources in, wrong answer out; the model faithfully grounds on whatever you hand it',
            'The model should have ignored the document',
          ],
          a: 1,
          why: 'RAG shifts the hard problem from "does the model remember?" to "did we retrieve the right, current source?" That\'s usually a better problem to have — but it makes your data quality and retrieval quality the new bottleneck, not the model.' },
      ],
    },
    {
      id: 'agents',
      title: 'From chatbot to agent',
      minutes: 10,
      steps: [
        { t: 'text', title: 'Giving the model hands', md: `
          <p>A plain LLM can only emit text. It can\'t check today\'s weather, run code, or book a meeting. <strong>Tool use</strong> (aka function calling) changes that: you tell the model what tools exist, and instead of answering directly, it can emit a structured request like <code>get_weather(city="Oslo")</code>.</p>
          <p>Your program sees that request, actually runs the function, and feeds the result back into the context. The model then continues with real data in hand. The model never runs anything itself — it decides <em>what</em> to call; your code does the calling.</p>` },
        { t: 'quiz',
          q: 'When an LLM "uses a tool," what does the model itself actually produce?',
          opts: [
            'It directly executes the code or API call',
            'It outputs a structured request naming the tool and arguments; your surrounding program executes it and returns the result',
            'It emails the tool\'s developer',
          ],
          a: 1,
          why: 'The model only ever outputs tokens — here, tokens describing which tool to call and with what arguments. A harness around the model does the real execution and hands the result back. This split is exactly why tool use has to be built carefully: the model proposes, your code disposes.' },
        { t: 'text', title: 'The agent loop', md: `
          <p>Chain tool use in a loop and you get an <strong>agent</strong>: a model that pursues a goal over multiple steps.</p>
          <ol>
            <li><strong>Think</strong> — the model reasons about what to do next.</li>
            <li><strong>Act</strong> — it calls a tool (search, run code, read a file).</li>
            <li><strong>Observe</strong> — the tool\'s result is added to the context.</li>
            <li><strong>Repeat</strong> — until the goal is met, then answer.</li>
          </ol>
          <p>This think–act–observe cycle (often called <strong>ReAct</strong>) is how a coding assistant can read files, run tests, see failures, and fix them — looping until things pass. It\'s chain-of-thought plus the ability to actually <em>do</em> things and see what happens.</p>` },
        { t: 'quiz',
          q: 'What makes an agent more capable than a single LLM call, even with the same underlying model?',
          opts: [
            'The agent uses a smarter model',
            'It can take actions, observe real results, and adjust over multiple steps — grounding each decision in feedback instead of guessing everything up front',
            'It has a bigger context window by default',
          ],
          a: 1,
          why: 'Same model, more structure. By interleaving action and observation, the agent replaces one big guess with a feedback loop — try, see, correct. That\'s why agents can handle open-ended, multi-step tasks a one-shot answer can\'t.' },
        { t: 'widget', name: 'temperature', title: 'A knob you now control: temperature', md: `
          <p>One practical dial worth revisiting. When you call an LLM through an API, you set its <strong>temperature</strong>. Low = focused and repeatable (good for extraction, tool-calling, factual answers); high = varied and exploratory (good for brainstorming, creative drafts). Play with it below, then read the takeaway.</p>` },
        { t: 'quiz',
          q: 'You\'re building an agent that calls tools and must return clean, parseable JSON. What temperature makes sense?',
          opts: [
            'High — you want creative JSON',
            'Low (near 0) — you want reliable, consistent, well-formed output every time',
            'It doesn\'t matter for tool use',
          ],
          a: 1,
          why: 'For structured, correctness-critical output — JSON, tool calls, extraction — low temperature keeps the model on the safe, high-probability path and avoids surprising deviations that break your parser. Save the high temperatures for when you actually want variety.' },
        { t: 'text', title: '🎓 You can drive the machine now', md: `
          <p>You\'ve gone from understanding LLMs to <em>operating</em> them:</p>
          <ul>
            <li><strong>Prompting</strong> — set up context with role, task, context, and format</li>
            <li><strong>Few-shot & CoT</strong> — show examples; let it reason step by step</li>
            <li><strong>RAG</strong> — turn a memory test into an open-book test</li>
            <li><strong>Agents</strong> — give the model tools and a think–act–observe loop</li>
          </ul>
          <p>Next up: <strong>Generative AI &amp; Diffusion</strong> — how the same deep-learning ideas produce images, not just text.</p>` },
      ],
    },
  ],
});

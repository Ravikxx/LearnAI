// Course: AI Agents & Tool Use
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'agents',
  title: 'AI Agents & Tool Use',
  tagline: 'How a chatbot becomes something that plans and acts',
  icon: '🤖',
  accent: 'var(--series-11)',
  description: 'In "Getting the Most from LLMs" you met tool use and the agent loop in miniature. This course is the full picture: how a text-only model gets hands, how it plans multi-step tasks, how it remembers, and the very real ways agents go wrong. It builds directly on the LLM courses.',
  lessons: [
    {
      id: 'giving-hands',
      title: 'From answering to acting',
      minutes: 9,
      steps: [
        { t: 'text', title: 'The model proposes; your code disposes', md: `
          <p>A raw LLM can only emit text. It can\'t check the weather, query a database, or send an email. <strong>Tool use</strong> (function calling) fixes this — but in a way people constantly misunderstand.</p>
          <p>You describe the available tools to the model. When it wants one, it does <em>not</em> run anything. It outputs a structured request — just tokens — like <code>get_weather(city="Oslo")</code>. Your surrounding program reads that, actually executes the function, and feeds the result back into the context. The model then continues with real data in hand.</p>
          <div class="callout">💡 The division of labor is the whole safety story of agents: <strong>the model decides what to call; your code decides what actually runs.</strong> The model never touches your systems directly.</div>` },
        { t: 'quiz',
          q: 'When an LLM "calls a tool," what does the model itself actually produce?',
          opts: [
            'It directly executes the API call or code',
            'It outputs a structured request naming the tool and arguments; your program executes it and returns the result',
            'It permanently learns the tool\'s output',
          ],
          a: 1,
          why: 'The model only ever emits tokens — here, tokens describing which tool and which arguments. A harness around the model does the real execution. This propose-vs-execute split is exactly why you can sandbox, validate, and refuse an agent\'s requested actions before they happen.' },
        { t: 'text', title: 'Structured output is the glue', md: `
          <p>For your code to act on the model\'s request, the request has to be <em>parseable</em> — usually JSON matching a schema you defined. "Return a JSON object with keys <code>tool</code> and <code>arguments</code>." Modern models are specifically trained to emit reliable structured output for exactly this reason.</p>
          <p>Recall the temperature dial from the LLM course: for tool calls you want <strong>low temperature</strong>, so the model reliably produces clean, valid, parseable requests rather than creative variations that break your parser.</p>` },
        { t: 'quiz',
          q: 'Why do agent builders usually run the model at low temperature when it\'s deciding tool calls?',
          opts: [
            'To make the agent more creative and surprising',
            'To get reliable, consistent, well-formed structured output (valid JSON) that their code can parse without breaking',
            'Temperature has no effect on tool use',
          ],
          a: 1,
          why: 'Tool calls are machine-read, not human-read. A creative deviation that reads fine to a person can break a JSON parser and crash the loop. Low temperature keeps the model on the high-probability, correctly-formatted path — reliability over variety.' },
      ],
    },
    {
      id: 'the-loop',
      title: 'The agent loop (ReAct)',
      minutes: 10,
      steps: [
        { t: 'text', title: 'Think, act, observe, repeat', md: `
          <p>A single tool call is useful. Chaining tool calls in a loop is what makes an <strong>agent</strong> — a model pursuing a goal over many steps. The dominant pattern is called <strong>ReAct</strong> (Reason + Act):</p>
          <ol>
            <li><strong>Think</strong> — the model reasons about what to do next (chain-of-thought, from the LLM-usage course).</li>
            <li><strong>Act</strong> — it proposes a tool call.</li>
            <li><strong>Observe</strong> — your code runs the tool and adds the result to the context.</li>
            <li><strong>Repeat</strong> — the model reasons over the new information, until the goal is met, then answers.</li>
          </ol>
          <p>This is how a coding assistant reads files, runs tests, sees the failures, and fixes them — looping until the tests pass. It\'s chain-of-thought with the power to actually <em>do</em> things and see what happens.</p>` },
        { t: 'quiz',
          q: 'What makes an agent more capable than a single LLM call, even with the identical underlying model?',
          opts: [
            'The agent secretly uses a smarter model',
            'It interleaves acting and observing over multiple steps — grounding each decision in real results instead of guessing everything up front',
            'It has a permanently larger context window',
          ],
          a: 1,
          why: 'Same model, more structure. By alternating action and observation, the agent replaces one big blind guess with a feedback loop — try, see the actual result, correct. That loop is what lets it handle open-ended, multi-step tasks a one-shot answer can\'t.' },
        { t: 'text', title: 'Why observation is the magic ingredient', md: `
          <p>Notice what the <em>observe</em> step buys you: it repeatedly injects <strong>ground truth</strong> into the context. Without tools, an LLM asked "does this code work?" can only guess plausibly. An agent <em>runs</em> the code and reads the actual error — no guessing. Each observation replaces speculation with fact.</p>
          <p>This is also why agents partially sidestep hallucination on tasks with a checkable result: the environment corrects the model. The model can propose something wrong, but the observation reveals it was wrong, and the next reasoning step can recover.</p>` },
        { t: 'quiz',
          q: 'How does the "observe" step help with hallucination on a task like debugging code?',
          opts: [
            'It disables the model\'s ability to be wrong',
            'It feeds the real result (e.g. the actual test failure) back into the context, so a wrong guess is exposed by ground truth and the agent can correct on the next step',
            'It makes the model run faster',
          ],
          a: 1,
          why: 'Observation injects reality. The agent can still propose something incorrect, but running the tool surfaces the truth (the real error, the real query result), which the next reasoning step attends to and corrects from. The environment becomes a fact-checker — impossible for a single, tool-less answer.' },
      ],
    },
    {
      id: 'memory-planning',
      title: 'Memory & planning',
      minutes: 10,
      steps: [
        { t: 'text', title: 'Two kinds of memory', md: `
          <p>A long-running agent needs to remember things — but the context window is finite (recall the capstone\'s n² cost). So agents use two tiers:</p>
          <ul>
            <li><strong>Short-term memory</strong> — the working context: the conversation and recent observations. Fast to access, but limited and expensive as it grows.</li>
            <li><strong>Long-term memory</strong> — an external store the agent can write to and search later, typically a <em>vector database</em> (the embeddings + retrieval machinery from the RAG lesson). Facts, past results, and learned preferences live here and get pulled back in when relevant.</li>
          </ul>
          <p>So "agent memory" is usually just RAG pointed at the agent\'s own history — retrieve the relevant past, drop it into the context when needed.</p>` },
        { t: 'quiz',
          q: 'An agent "remembers" a fact from 500 steps ago that\'s no longer in its context window. How, mechanically?',
          opts: [
            'Its weights updated to store the fact',
            'The fact was written to an external store (e.g. a vector DB) and retrieved back into the context when relevant — long-term memory is retrieval, not weight change',
            'The context window is actually infinite',
          ],
          a: 1,
          why: 'Weights are frozen at inference. Long-term memory is external: the agent saves information to a store and later retrieves it (semantic search over embeddings) back into the working context. It\'s the same RAG idea, applied to the agent\'s own accumulated experience.' },
        { t: 'text', title: 'Planning: breaking a big task into small ones', md: `
          <p>Complex goals ("research these five competitors and write a comparison") are too big for one step. Agents handle this with <strong>task decomposition</strong>: the model breaks the goal into subgoals, tackles them one at a time, and assembles the results. Some designs add a <strong>reflection</strong> step — the agent critiques its own progress and revises the plan.</p>
          <p>This works because you already have the pieces: chain-of-thought to reason about a plan, tools to execute each sub-step, and memory to hold results across steps. Planning is those capabilities aimed at structure.</p>` },
        { t: 'quiz',
          q: 'What is "task decomposition" in an agent?',
          opts: [
            'Deleting parts of the task the agent can\'t do',
            'Breaking a large goal into smaller subgoals the agent can tackle one at a time, then combining the results',
            'Running the whole task in a single model call',
          ],
          a: 1,
          why: 'Decomposition turns one intractable step into a sequence of manageable ones — plan, solve each subgoal (often with tools), assemble. It leans on reasoning, tool use, and memory together, which is why agents can attempt tasks far larger than a single prompt could handle.' },
      ],
    },
    {
      id: 'where-agents-break',
      title: 'Where agents break',
      minutes: 10,
      steps: [
        { t: 'text', title: 'Errors compound', md: `
          <p>Agents inherit a brutal math problem. If each step is 95% reliable, a 20-step task succeeds only about <code>0.95²⁰ ≈ 36%</code> of the time — because errors <em>multiply</em>. One wrong observation or hallucinated tool call can send the whole chain off course, and later steps build on the mistake.</p>
          <p>This is the central challenge of agents: individual steps are good, but reliability decays fast over long chains. It\'s why production agents lean heavily on checkpoints, validation, retries, and keeping chains as short as possible.</p>` },
        { t: 'quiz',
          q: 'Why do long agent chains become unreliable even when each individual step is usually correct?',
          opts: [
            'The model gets tired',
            'Per-step error rates multiply over many steps, so the probability of completing a long chain without any mistake drops sharply',
            'Long chains use a weaker model',
          ],
          a: 1,
          why: 'Reliability compounds multiplicatively: 0.95 per step sounds great until you raise it to the 20th power (~36%). A single derailing error propagates into every later step. This compounding is the core reason robust agents minimize steps and add validation between them.' },
        { t: 'text', title: 'The failure modes to know', md: `
          <p>Beyond compounding, the recurring ways agents go wrong:</p>
          <ul>
            <li><strong>Hallucinated tool calls</strong> — inventing a tool or arguments that don\'t exist. (Your code should validate every call against the real schema and refuse invalid ones.)</li>
            <li><strong>Loops</strong> — getting stuck repeating the same failing action. (Cap the steps; detect repetition.)</li>
            <li><strong>Cost &amp; latency</strong> — every step is a full model call, so agents are slow and expensive; a runaway agent can burn real money.</li>
            <li><strong>Unsafe actions</strong> — an agent with the power to delete files, send emails, or spend money can cause real harm from a single bad decision.</li>
          </ul>
          <div class="callout">⚠️ Because an agent can take real-world actions, the propose-vs-execute split matters most for irreversible ones. High-stakes actions (payments, deletions, sends) should require validation or explicit human approval — never blind auto-execution.</div>` },
        { t: 'quiz',
          q: 'An agent can send emails and spend money. What\'s the responsible design choice for those specific actions?',
          opts: [
            'Let it auto-execute everything for maximum autonomy',
            'Gate irreversible or high-stakes actions behind validation or human approval, since the model can propose a wrong action confidently',
            'Remove the model\'s ability to reason',
          ],
          a: 1,
          why: 'The model proposes; your code disposes — and for irreversible actions your code should not rubber-stamp. Human-in-the-loop or strict validation on high-stakes calls contains the damage from a single confident mistake. Autonomy is fine for reversible steps; gate the ones you can\'t undo.' },
        { t: 'text', title: '🎓 You can build an agent now', md: `
          <p>You understand what turns a chatbot into an actor:</p>
          <ul>
            <li><strong>Tool use</strong> — the model proposes structured calls; your code executes them</li>
            <li><strong>The ReAct loop</strong> — think, act, observe, repeat, grounding each step in real results</li>
            <li><strong>Memory &amp; planning</strong> — external stores for long-term recall; decomposition for big goals</li>
            <li><strong>Failure modes</strong> — compounding errors, loops, cost, and the need to gate unsafe actions</li>
          </ul>
          <p>Next up: <strong>Generative AI &amp; Diffusion</strong> — from models that act to models that create images.</p>` },
      ],
    },
  ],
});

// Course: The Many Kinds of AI (a survey megacourse, by modality)
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'types-of-ai',
  title: 'The Many Kinds of AI',
  tagline: 'A map of the whole zoo: text, image, audio, video, embeddings, and game-players',
  icon: '🗺️',
  accent: 'var(--series-9)',
  description: 'Text, image, video, embeddings, game-playing agents — the model menus on sites like OpenRouter list a dozen "types." This tour explains what each type actually is, what goes in and comes out, and the single idea that unites all of them. No prerequisites; it\'s the map before the deep dives.',
  lessons: [
    {
      id: 'everything-is-numbers',
      title: 'Everything is numbers',
      minutes: 9,
      steps: [
        { t: 'text', title: 'One machine wearing many hats', md: `
          <p>Text generators, face detectors, image painters, chess engines — wildly different inventions on the surface. Under the hood, almost every one is the same basic machine: a <strong>neural network</strong>, a big math function that takes in a list of numbers and puts out a list of numbers.</p>
          <p>That\'s it. A neural network never actually handles a word, a pixel, or a chess move — it handles numbers that <em>stand for</em> those things.</p>
          <div class="callout">💡 So what makes an "image model" different from a "text model"? Not the math inside — mostly the same. What differs is (1) what the numbers <em>represent</em>, and (2) what data it was trained on. That\'s the whole idea behind "types" of AI.</div>` },
        { t: 'text', title: 'Meaning lives at the edges', md: `
          <p>If the network only sees numbers, where does <em>meaning</em> come from? From two translators bolted onto the ends:</p>
          <ul>
            <li>An <strong>encoder</strong> turns real-world stuff into numbers going in — text into token IDs, an image into pixel brightness values, sound into air-pressure samples.</li>
            <li>A <strong>decoder</strong> turns output numbers back into real-world stuff — a number into a chosen word, a grid of numbers into a displayed image, an output into "move the paddle up."</li>
          </ul>
          <p>The network in the middle never learns that "cat" is an animal — it just learns which output-numbers to produce for which input-numbers. <strong>We</strong> assign the meaning, on the outside.</p>` },
        { t: 'widget', name: 'classify', title: 'Try it: encoder job or decoder job?', buckets: ['Encoder (real world → numbers)', 'Decoder (numbers → real world)'], items: [
          ['Turning text into token IDs', 0],
          ['Turning a number into a chosen word', 1],
          ['Turning an image into pixel brightness values', 0],
          ['Turning a grid of output numbers into a displayed image', 1],
          ['Turning sound into air-pressure samples', 0],
          ["Turning an output number into 'move the paddle up'", 1],
        ], md: `<p>Every model has these two translators bolted onto its ends. Sort each job by which side it belongs on.</p>` },
        { t: 'quiz',
          q: 'In one sentence: what actually distinguishes an "image model" from a "text model"?',
          opts: [
            'Image models use completely different mathematics than text models',
            'Mostly what the numbers represent and what data it trained on — the core machinery is largely the same',
            'Image models are conscious of pictures; text models are conscious of words',
          ],
          a: 1,
          why: 'The surprising truth of modern AI: the same building blocks (often the same Transformer architecture) power radically different "types." Swap the encoder/decoder and the training data, and a text machine becomes an image machine. The differences are at the edges, not the core.' },
        { t: 'quiz',
          q: 'You worry: "How can a model output a number if it doesn\'t know what a number means?" What\'s the resolution?',
          opts: [
            'It secretly does understand numbers the way humans do',
            'Numbers are the ONLY thing it ever outputs — meaning is never required; we decide on the outside that output-number 3 means "cat" or "move left"',
            'It can\'t; models can\'t really output numbers',
          ],
          a: 1,
          why: 'This is the key unlock for the whole course. A network doesn\'t output "a word" or "a move" — it outputs raw numbers (activations). Understanding what they mean is never part of its job; the surrounding system interprets them. Hold onto this — it fully explains game-playing agents in a later lesson.' },
      ],
    },
    {
      id: 'text-models',
      title: 'Text models',
      minutes: 8,
      steps: [
        { t: 'text', title: 'Words in, words out', md: `
          <p>The type you know best. A <strong>text model</strong> (a Large Language Model, or LLM) takes text and produces text: chat, code, summaries, translation, answers.</p>
          <p>Your text is encoded into <strong>tokens</strong> (word-pieces with ID numbers), the network processes those numbers, and it outputs a probability for every possible next token. The decoder picks one, appends it, and the loop runs again — that\'s the text streaming onto your screen.</p>` },
        { t: 'widget', name: 'tokenizer', title: 'Try it: how text becomes numbers', md: `
          <p>This is the encoder from lesson 1, made concrete. Type anything and watch it get chopped into tokens — the numbers a text model actually reads. Common words stay whole; rare ones shatter into pieces.</p>` },
        { t: 'quiz',
          q: 'A text model generating a 500-word essay is really doing what, repeatedly?',
          opts: [
            'Writing whole sentences at once from a stored template',
            'Predicting one next token at a time, appending it, and re-running — hundreds of times',
            'Looking up the essay in its training data and copying it',
          ],
          a: 1,
          why: 'One token at a time is the entire mechanism. No templates, no lookup — each token is a fresh prediction conditioned on everything so far. (The "How LLMs Work" course takes this apart in detail if you want the deep version.)' },
        { t: 'text', title: 'Where text models shine and struggle', md: `
          <p>Because they model language statistically, text models are brilliant at anything language-shaped — drafting, explaining, coding, rephrasing — and shaky where fluent-sounding isn\'t the same as correct: exact arithmetic, obscure facts, counting letters in a word.</p>
          <p>A text model\'s world is <em>tokens</em> — it has never seen a pixel or heard a sound. For those, you need a different type, or a multimodal model that bolts on extra encoders (we\'ll reach that at the end).</p>` },
        { t: 'quiz',
          q: 'Text models are excellent at rephrasing a paragraph but shakier at exact arithmetic. Why?',
          opts: [
            'Arithmetic uses a different programming language internally',
            'The model is optimized to predict plausible-sounding tokens, not to compute — fluent phrasing and exact correctness are not the same target',
            'Text models have never been shown any numbers',
          ],
          a: 1,
          why: 'Predicting the next token well correlates strongly with fluent, sensible language, but only loosely with getting an exact computation right. That gap between "sounds right" and "is right" is why calculators and code execution often beat raw next-token prediction on precise math.' },
      ],
    },
    {
      id: 'embedding-models',
      title: 'Embedding models',
      minutes: 10,
      steps: [
        { t: 'text', title: 'The type that outputs a vector, not words', md: `
          <p>Here\'s the one that puzzled you on OpenRouter. An <strong>embedding model</strong> takes text (or an image, or audio) and outputs a single fixed list of numbers — a <strong>vector</strong>, maybe 768 or 1,536 numbers long. It does <em>not</em> output words; the vector is a numeric fingerprint of the input\'s <em>meaning</em>.</p>
          <p>The rule that makes it useful: <strong>similar meanings get similar vectors.</strong> "How do I cancel my subscription?" and "I want to end my plan" land at nearly the same coordinates, despite sharing almost no words. "Photosynthesis" lands far away.</p>
          <div class="callout">💡 A chat model answers your text. An embedding model measures your text — turning it into coordinates you can compare, sort, and search. Different job, different output type.</div>` },
        { t: 'widget', name: 'embeddings', title: 'Try it: meaning as coordinates', md: `
          <p>An embedding model turns each input into a point like these. Click a word to see its nearest neighbors — the ones an embedding model would judge closest in meaning. Similar things sit close together; that proximity is the entire product.</p>` },
        { t: 'quiz',
          q: 'What does an embedding model produce when you feed it a sentence?',
          opts: [
            'A written reply to the sentence',
            'A fixed-length list of numbers (a vector) representing the sentence\'s meaning',
            'A corrected, grammatically-fixed version of the sentence',
          ],
          a: 1,
          why: 'That\'s the defining trait and why it\'s its own "type": the output is a meaning-vector, not language. You never read an embedding — you compare it to other embeddings. It\'s a measuring instrument, not a writer.' },
        { t: 'text', title: 'What are meaning-vectors good for?', md: `
          <p>Turning meaning into comparable coordinates quietly powers a huge amount of software:</p>
          <ul>
            <li><strong>Semantic search</strong> — embed your query and every document; return the nearest ones. Search by meaning, not keywords.</li>
            <li><strong>RAG</strong> — the retrieval step that feeds a chatbot relevant docs runs on embeddings.</li>
            <li><strong>Recommendations</strong> — "similar to what you liked" = nearby vectors.</li>
            <li><strong>Clustering &amp; deduplication</strong> — group by proximity; spot near-duplicates.</li>
            <li><strong>Classification</strong> — a cheap classifier on top of embeddings sorts tickets, flags spam, tags topics.</li>
          </ul>
          <p>They\'re a separate product because they\'re smaller, faster, and cheaper — you\'d call one millions of times to index a library, where a full chat model would be overkill.</p>` },
        { t: 'quiz',
          q: 'Why offer an embedding model as its own product instead of just using a chat model?',
          opts: [
            'Embedding models are strictly more powerful than chat models',
            'They\'re specialized: small, fast, and cheap at the one job of producing meaning-vectors — ideal when you must process huge volumes to enable search and comparison',
            'There\'s no real difference; it\'s just marketing',
          ],
          a: 1,
          why: 'Right tool, right job. Indexing a million documents means a million calls — you want the lean instrument built for exactly that, not an expensive conversational model. The output type (a vector) and the workload (bulk comparison) both justify a separate category.' },
      ],
    },
    {
      id: 'image-models',
      title: 'Image models',
      minutes: 9,
      steps: [
        { t: 'text', title: 'Two very different image jobs', md: `
          <p>"Image AI" splits into two opposite directions:</p>
          <ul>
            <li><strong>Image understanding</strong> — pixels in, an <em>answer</em> out. Is there a tumor? What breed is this dog? Where are the pedestrians? The picture is the input; a label or caption is the output.</li>
            <li><strong>Image generation</strong> — text in, <em>pixels</em> out. "A red fox in snow, oil painting." Here the picture is what the model produces.</li>
          </ul>
          <p>Same modality, mirror-image data flow. Menus label understanding models "vision" and generators "image generation."</p>` },
        { t: 'quiz',
          q: 'A self-driving car\'s system that spots pedestrians in camera frames is which kind of image model?',
          opts: [
            'Image generation — it creates images of pedestrians',
            'Image understanding — pixels go in, and a decision/label (pedestrian here) comes out',
            'It\'s an embedding model',
          ],
          a: 1,
          why: 'The input is the image and the output is an interpretation — understanding, not generation. Generation goes the other way: a description in, a brand-new image out. Same pixels-as-numbers idea, opposite direction.' },
        { t: 'text', title: 'How each side works, briefly', md: `
          <p><strong>Understanding</strong> leans on <em>convolutional networks</em> (or vision Transformers): small filters slide across the pixel grid, detecting edges, then textures, then shapes, then objects. (The "Computer Vision with PyTorch" course builds one.)</p>
          <p><strong>Generation</strong> today mostly uses <em>diffusion</em>: start from random noise and repeatedly denoise it, steered by your text prompt, until an image emerges. (The "Generative AI &amp; Diffusion" course goes deep.)</p>
          <p>Either way, an image is a 3-D block of numbers — height × width × 3 color channels — and the model reads or writes those numbers.</p>` },
        { t: 'widget', name: 'diffusion', title: 'Try it: watch the generation direction, live', md: `
          <p>This is the "text in, pixels out" direction from above. Start from noise, press <strong>Generate</strong>, and watch an image emerge step by step — the mirror image of what an understanding model does. (Want the mechanics of <em>why</em> this works? The Generative AI course goes deep.)</p>` },
        { t: 'quiz',
          q: 'In what sense is a color photo already "numbers" before any AI touches it?',
          opts: [
            'It isn\'t — an image has to be described in words first',
            'Every pixel is stored as brightness values for red, green, and blue — so the image is literally a grid of numbers',
            'Only black-and-white images are numeric',
          ],
          a: 1,
          why: 'A digital image is a grid of pixels, each pixel three numbers (R, G, B). No conversion needed — it\'s born numeric, which is exactly why neural nets can consume or produce it directly. Meaning ("this is a fox") is the part the model learns.' },
      ],
    },
    {
      id: 'audio-models',
      title: 'Audio & speech models',
      minutes: 9,
      steps: [
        { t: 'text', title: 'Sound is a number too', md: `
          <p>A microphone measures air pressure thousands of times a second; each measurement is a number. A sound clip is just a long list of numbers (a waveform) — same story as pixels and tokens. That gives audio its own family of models:</p>
          <ul>
            <li><strong>Speech-to-text (transcription)</strong> — audio in, text out. Whisper, phone dictation, auto-captions.</li>
            <li><strong>Text-to-speech (TTS)</strong> — text in, audio out. Voice assistants, audiobook narration, screen readers.</li>
            <li><strong>Audio/music generation</strong> — a prompt in, new sound out. AI-generated songs, sound effects, voices.</li>
          </ul>` },
        { t: 'quiz',
          q: 'Auto-generated captions on a video are produced by which type of audio model?',
          opts: [
            'Text-to-speech',
            'Speech-to-text — it takes the audio and outputs the words being spoken',
            'Music generation',
          ],
          a: 1,
          why: 'Captions turn spoken audio into written text, so it\'s speech-to-text (transcription). Text-to-speech is the reverse — reading text aloud. Notice the pattern across the course: every "type" is defined by which modality is the input and which is the output.' },
        { t: 'widget', name: 'classify', title: 'Try it: which audio model is this?', buckets: ['Speech → text', 'Text → speech', 'Prompt → new sound'], items: [
          ['Auto-captioning a video', 0],
          ['Transcribing a podcast episode', 0],
          ["A voice assistant reading its reply aloud", 1],
          ['Audiobook narration', 1],
          ['A screen reader for visually impaired users', 1],
          ['Generating background music for a video from a text description', 2],
          ['Creating a sound effect that was never recorded', 2],
        ], md: `<p>Sort each example by which direction the audio is flowing.</p>` },
        { t: 'text', title: 'The same engine, again', md: `
          <p>Audio doesn\'t need anything exotic. Whisper, for instance, is a <em>Transformer</em> — the same architecture behind ChatGPT — with an encoder that reads sound instead of tokens: the audio is chopped into chunks, turned into numbers, and the model predicts text tokens from them.</p>
          <p>The quiet theme of modern AI: one flexible architecture, re-pointed at a new modality by changing its front door (the encoder) and its training data.</p>` },
        { t: 'quiz',
          q: 'Whisper is described as "a Transformer with a different encoder." What does that illustrate?',
          opts: [
            'Audio needed an entirely new kind of AI invented from scratch',
            'The same core architecture generalizes across modalities — swap the encoder and training data, and a text-shaped machine reads sound instead',
            'Transformers only work on text and Whisper is a rare exception',
          ],
          a: 1,
          why: 'This is the through-line of the whole course: one adaptable architecture, re-pointed at a new modality by changing what feeds it numbers and what data it learns from. Audio, like text, image, and video, rides the same underlying machine.' },
      ],
    },
    {
      id: 'video-models',
      title: 'Video models',
      minutes: 9,
      steps: [
        { t: 'text', title: 'Images, but with a clock', md: `
          <p>Video is just images in sequence — 24 or 30 frames per second, each frame a grid of numbers. So <strong>video models</strong> inherit the image split:</p>
          <ul>
            <li><strong>Video understanding</strong> — frames in, an answer out: what action is happening, is this content unsafe, summarize this clip, find the moment someone scores.</li>
            <li><strong>Video generation</strong> — text (or a start image) in, a moving clip out: tools like Sora and Runway.</li>
          </ul>
          <p>The new ingredient is <strong>time</strong>: the model can\'t treat each frame independently — it must understand motion and stay consistent across frames.</p>` },
        { t: 'quiz',
          q: 'What extra challenge does video add compared to a single image?',
          opts: [
            'Nothing — a video is treated as one big photo',
            'The time dimension: the model must handle motion and stay consistent across many frames, which also means far more data and compute',
            'Videos aren\'t made of numbers',
          ],
          a: 1,
          why: 'A one-second clip is dozens of images that must agree with each other — a generated character can\'t change shirt color between frames, and a face must move naturally. That temporal consistency, plus the sheer volume of pixels-over-time, is why video is the most compute-hungry modality here.' },
        { t: 'widget', name: 'classify', title: 'Try it: understanding or generation?', buckets: ['Video understanding (frames → answer)', 'Video generation (text/image → clip)'], items: [
          ['Detecting the moment a goal is scored in a match', 0],
          ['Flagging unsafe content in a clip', 0],
          ['Summarizing a long video into a paragraph', 0],
          ['Classifying the action happening in a clip', 0],
          ['Generating a moving clip from a text prompt', 1],
          ['Animating a still photo into a short video', 1],
          ['Creating a new scene no camera ever filmed', 1],
        ], md: `<p>Same split as image models, one dimension harder. Sort each example.</p>` },
        { t: 'text', title: 'Why video generation feels newer', md: `
          <p>Convincing text-to-video arrived years after text-to-image for concrete reasons: far more numbers to produce (every frame is a full image), a hard demand for temporal coherence (no flickering, no objects morphing), and much scarcer high-quality training data. It\'s the same diffusion-style ideas as images, scaled up and taught to respect time — genuinely harder, not just bigger.</p>` },
        { t: 'quiz',
          q: 'Roughly why did believable AI video lag behind AI images?',
          opts: [
            'Video uses a totally unrelated, later-invented kind of AI',
            'Video is many images that must stay coherent over time — vastly more output and a harder consistency requirement, needing more compute and data',
            'Nobody wanted AI video until recently',
          ],
          a: 1,
          why: 'It builds on the same generative ideas as images but multiplies the difficulty: more pixels (every frame), the extra constraint of smooth, consistent motion, and less training data. Harder problem, later payoff — but the underlying machinery is a cousin of image generation.' },
      ],
    },
    {
      id: 'game-agents',
      title: 'Agents that play games',
      minutes: 12,
      steps: [
        { t: 'text', title: 'A model that knows no words', md: `
          <p>Now the type you were most curious about — and the most different. A game-playing agent (chess, Go, Atari) has never read a book. It doesn\'t know English, or any language. Yet it beats world champions. How?</p>
          <p>It learns by <strong>reinforcement learning (RL)</strong>: not from labeled answers, but from <em>trial, error, and reward</em>. It plays, gets a score signal (won/lost, points up/down), and gradually adjusts to earn more reward. Nobody tells it the right move — it discovers moves that tend to win.</p>` },
        { t: 'text', title: 'What actually goes in and out', md: `
          <p>Keep the edges idea from lesson 1. For a game agent:</p>
          <ul>
            <li><strong>Input (observation)</strong> — the game state as numbers: a board grid, or raw screen pixels.</li>
            <li><strong>The network</strong> — maps that observation to an output. This mapping is the <strong>policy</strong>.</li>
            <li><strong>Output (action)</strong> — one number per possible move (say four, for up/down/left/right). The environment picks the move whose output is largest.</li>
          </ul>
          <p>The agent "chooses a move" by outputting numbers and letting the game read off the biggest one — the same numbers-in-numbers-out machine, pointed at a game.</p>` },
        { t: 'quiz',
          q: 'Your core question: how can this agent "output a move" if it doesn\'t know what a number or a move even is?',
          opts: [
            'It must secretly understand the game like a human does',
            'It only ever outputs numbers (one per possible action); the game environment interprets the largest as "the move." The agent needs no concept of "number" or "move" at all',
            'It looks up the best move in a table of rules',
          ],
          a: 1,
          why: 'This is lesson 1 paying off. The network doesn\'t know it\'s playing a game or that its outputs are "moves" — it emits raw numbers, and the environment is wired so that output-slot 2 means "move left." Meaning is entirely external. "Not knowing what a number is" was never a problem, because knowing was never required.' },
        { t: 'text', title: 'Learning with no teacher: self-play', md: `
          <p>Where do good moves come from with no answer key? For games like Go, the trick is <strong>self-play</strong>: the agent plays millions of games <em>against itself</em>. Wins nudge the moves that led to them upward; losses nudge them down. It bootstraps from random flailing to superhuman skill — and because it isn\'t copying human games, it invents strategies no human taught it (AlphaGo\'s famous "move 37" stunned professionals).</p>
          <p>The reward is the entire teacher. Design it well and the agent finds clever ways to earn it; design it carelessly and it finds clever ways to <em>cheat</em> it — the reward-hacking problem from the AI Safety course.</p>` },
        { t: 'widget', name: 'rlagent', title: 'Try it: watch an agent learn from reward', md: `
          <p>This agent knows nothing — no map, no language, no idea what "left" means. Press <strong>Train</strong> and watch it learn purely from reward (★ = +1, ✕ = −1): the grid turns green where it discovers value, and arrows show the policy it forms. Then hit <strong>Run agent</strong> to watch it walk the path it taught itself.</p>` },
        { t: 'quiz',
          q: 'In reinforcement learning, what plays the role that labeled answers play in ordinary supervised learning?',
          opts: [
            'A human labels every correct move in advance',
            'A reward signal — the agent tries things and learns from the score/outcome, without being told the right action',
            'Nothing; RL agents don\'t learn',
          ],
          a: 1,
          why: 'RL swaps "here\'s the correct answer" for "here\'s how well that went." The agent explores, receives reward, and shifts toward whatever earned more — the same downhill-optimization idea, but the signal is outcome-based, which is why it can master games no human can label move-by-move.' },
        { t: 'quiz',
          q: 'Why can a self-play agent discover strategies no human ever showed it?',
          opts: [
            'It memorized every human game ever played',
            'It learns purely from what wins, not from imitating people — so it explores the whole space of moves and can find winning ideas outside human habit',
            'It\'s given the strategies by its programmers',
          ],
          a: 1,
          why: 'Because its only guide is reward, not imitation, self-play isn\'t anchored to how humans play. Free to explore, it lands on unconventional but effective strategies — a big reason RL agents can leap past human-level in well-defined games, and a hint of both the power and the unpredictability of learning from reward alone.' },
      ],
    },
    {
      id: 'multimodal',
      title: 'Multimodal & the big picture',
      minutes: 10,
      steps: [
        { t: 'text', title: 'One model, many senses', md: `
          <p>The newest flagship models refuse to stay in one lane. A <strong>multimodal model</strong> (GPT-4o, Gemini, Claude) takes text, images, and audio together and responds across modalities — look at a photo and discuss it, hear a question and speak an answer, read a chart and explain it.</p>
          <p>The trick: give the model several encoders — one per modality — that all translate into the <em>same</em> internal number-space. Once everything is numbers in a shared space, one Transformer processes them together, indifferent to where each came from.</p>` },
        { t: 'quiz',
          q: 'How does a single model handle both images and text at once?',
          opts: [
            'It runs two totally separate AIs that never interact',
            'Different encoders convert each modality into a shared internal number-space, then one network processes them together',
            'It converts the image into a written description first, then forgets the image',
          ],
          a: 1,
          why: 'Unify at the number level: text-encoder and image-encoder both output vectors in one common space, so the core model reasons over them jointly. This is the payoff of "everything is numbers" — once modalities share a numeric language, mixing them is natural.' },
        { t: 'widget', name: 'order', title: 'Try it: order how a multimodal prompt gets processed', items: [
          "The text encoder converts the prompt's words into vectors",
          "The image encoder converts the photo's pixels into vectors in that same space",
          'The text and image vectors are combined into one sequence',
          'The shared Transformer processes the combined sequence jointly',
          'A decoder turns the output vectors back into words (or speech, or an image)',
        ], md: `<p>Ask GPT-4o about a photo, and this is what actually happens under the hood. Click the steps into order.</p>` },
        { t: 'text', title: 'The whole zoo, and where it\'s heading', md: `
          <p>You now have the map. The "types" you\'ll see listed are mostly defined by <em>which modality goes in and which comes out</em>:</p>
          <ul>
            <li><strong>Text</strong> — text ⇄ text</li>
            <li><strong>Embedding</strong> — anything → a meaning-vector</li>
            <li><strong>Image</strong> — pixels → answer (vision), or text → pixels (generation)</li>
            <li><strong>Audio</strong> — speech ⇄ text, or prompt → sound</li>
            <li><strong>Video</strong> — frames → answer, or text → clip</li>
            <li><strong>Game/RL agent</strong> — observation → action, taught by reward</li>
            <li><strong>Multimodal</strong> — several at once, in a shared space</li>
          </ul>
          <p>A few more you may meet: <strong>robotics/action models</strong> (camera + goal → motor commands), <strong>time-series/forecasting</strong> models (past numbers → future numbers), and <strong>recommendation</strong> models (your behavior → what you\'ll like). Same recipe every time.</p>` },
        { t: 'quiz',
          q: 'What\'s the single biggest takeaway tying all these "types" together?',
          opts: [
            'Each type is a fundamentally different, unrelated invention',
            'They\'re variations on one idea — numbers in, numbers out — differing mainly by what the numbers represent and how the model is trained',
            'Only text models are real AI; the rest are tricks',
          ],
          a: 1,
          why: 'That\'s the thesis of the whole tour. Under the labels sits one adaptable machine, re-pointed at different modalities by swapping encoders, decoders, and training data. See that, and the intimidating menu of "types" becomes a family portrait.' },
        { t: 'text', title: '🎓 You have the map', md: `
          <p>You can now decode any AI model menu and explain, in plain terms:</p>
          <ul>
            <li>What text, image, audio, video, and embedding models each take in and put out</li>
            <li>Why an embedding model outputs a vector instead of words — and what that\'s for</li>
            <li>How a game-playing agent acts without knowing any language (it just outputs numbers; meaning is external)</li>
            <li>Why multimodal models are the natural next step once everything is numbers</li>
          </ul>
          <p>Want to go deeper on any one type? <strong>AI Foundations</strong> starts the full journey, and there are dedicated courses on neural networks, LLMs, generative AI, and PyTorch waiting for you. 🚀</p>` },
      ],
    },
  ],
});

// Course: Generative AI & Diffusion
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'genai',
  title: 'Generative AI & Diffusion',
  tagline: 'How machines paint: from noise to DALL·E and Midjourney',
  icon: '🎨',
  accent: 'var(--series-7)',
  description: 'LLMs generate text one token at a time. Image generators build a picture out of pure noise. Same deep-learning foundations, a strikingly different trick. This course demystifies GANs, diffusion, and how a sentence becomes a photorealistic image.',
  lessons: [
    {
      id: 'generative',
      title: 'What "generative" means',
      minutes: 8,
      steps: [
        { t: 'text', title: 'Telling apart vs dreaming up', md: `
          <p>Most models you\'ve met are <strong>discriminative</strong>: given an input, output a label. Cat or dog? Spam or not? They draw boundaries between things.</p>
          <p><strong>Generative</strong> models do something harder: learn what the data <em>looks like</em> well enough to produce brand-new examples. Not "is this a cat?" but "here is a cat that has never existed."</p>
          <div class="callout">💡 To do that, a model must capture the underlying <em>distribution</em> of the data — the statistical shape of all plausible cat-photos — then sample new points from it. An LLM does this for text (sample a plausible next token); image generators do it for pixels.</div>` },
        { t: 'quiz',
          q: 'Which task is generative rather than discriminative?',
          opts: [
            'Deciding whether an email is spam',
            'Producing a new, original photo of a face that belongs to no real person',
            'Predicting tomorrow\'s temperature from today\'s weather',
          ],
          a: 1,
          why: 'Creating a novel face means sampling a new example from the learned distribution of "what faces look like" — generation. Spam-detection and temperature-prediction map an input to an answer — discrimination. Generative models synthesize; discriminative models sort.' },
        { t: 'widget', name: 'classify', title: 'Generative or discriminative?', buckets: ['Discriminative', 'Generative'], items: [
          ['Spam or not spam classifier', 0],
          ['GAN generating a new face', 1],
          ['Predicting tomorrow\'s temperature', 0],
          ['Diffusion model painting an image from noise', 1],
          ['Cat vs. dog image classifier', 0],
          ['LLM sampling the next token of a story', 1],
        ] },
        { t: 'text', title: 'The core challenge', md: `
          <p>A 512×512 color image is over 750,000 numbers. The overwhelming majority of combinations are meaningless static — real images occupy a vanishingly thin sliver of that space, the "manifold" of plausible pictures.</p>
          <p>A generative model\'s job is to learn where that sliver is, so it can land points <em>on</em> it rather than off it. Two big families crack this: <strong>GANs</strong> and <strong>diffusion models</strong> — diffusion is what powers today\'s leading tools.</p>` },
        { t: 'quiz',
          q: 'Why is generating a realistic image fundamentally hard?',
          opts: [
            'Images are too large to store',
            'Almost every possible combination of pixels is meaningless noise; real images live on a tiny, intricate sliver of that huge space that the model must learn to hit',
            'Computers can\'t display new images',
          ],
          a: 1,
          why: 'The space of pixel-combinations is astronomically large and almost entirely garbage. The model has to learn the thin, complex region where believable images live — and land its samples there every time. That "hit the manifold" problem is the whole game.' },
      ],
    },
    {
      id: 'gans',
      title: 'GANs: forger vs detective',
      minutes: 9,
      steps: [
        { t: 'text', title: 'An arms race between two networks', md: `
          <p>The <strong>Generative Adversarial Network (GAN)</strong>, from 2014, framed generation as a duel between two networks trained against each other:</p>
          <ul>
            <li>The <strong>Generator</strong> — a forger. Takes random noise, tries to turn it into a convincing fake image.</li>
            <li>The <strong>Discriminator</strong> — a detective. Shown a mix of real images and fakes, must call each one real or fake.</li>
          </ul>
          <p>Every time the detective gets better at spotting fakes, the forger is pushed to improve; every improvement in the forger forces the detective to sharpen. An arms race.</p>` },
        { t: 'quiz',
          q: 'What is the generator\'s training signal in a GAN?',
          opts: [
            'How closely its image matches a specific target photo',
            'Whether it can fool the discriminator into labeling its fakes as real',
            'A human rating each image by hand',
          ],
          a: 1,
          why: 'There\'s no single "correct" image to copy — the generator wins by fooling the detective. Its loss goes down when the discriminator is deceived. That adversarial signal, not a pixel-by-pixel target, is what drives it toward realism.' },
        { t: 'text', title: 'Why the duel is unstable', md: `
          <p>When it works, GANs produce razor-sharp images — the "This Person Does Not Exist" faces were GANs. But the duel is famously temperamental:</p>
          <ul>
            <li>If the detective gets too good too fast, the forger gets no useful signal and stalls.</li>
            <li><strong>Mode collapse</strong>: the forger discovers one image that reliably fools the detective and just keeps producing variations of it — winning the game while ignoring the diversity of real data.</li>
          </ul>
          <p>Balancing the two networks is an art — a big reason the field largely shifted to diffusion, which trades the duel for a steadier process (next lesson).</p>` },
        { t: 'widget', name: 'match', title: 'Match the GAN term to its role', pairs: [
          ['Generator', 'Takes random noise, tries to create a convincing fake'],
          ['Discriminator', 'Judges whether an image is real or fake'],
          ['Mode collapse', 'Generator repeats one output, ignoring diversity'],
          ['Adversarial training', 'Two networks improve by competing against each other'],
        ] },
        { t: 'quiz',
          q: 'A GAN\'s generator starts outputting nearly the same face over and over, regardless of the input noise. This is...',
          opts: [
            'Overfitting to the test set',
            'Mode collapse — it found one output that fools the discriminator and abandoned the diversity of the real data',
            'The discriminator winning permanently',
          ],
          a: 1,
          why: 'Mode collapse: the generator exploits a narrow win instead of modeling the full variety of real images. It\'s technically fooling the detective, but it\'s failed the real goal of covering the whole distribution — a classic GAN failure and a key motivation for diffusion.' },
      ],
    },
    {
      id: 'diffusion',
      title: 'Diffusion: sculpting from noise',
      minutes: 10,
      steps: [
        { t: 'text', title: 'The central idea: learn to un-blur', md: `
          <p>Diffusion models come from a counterintuitive idea. Take a training image and <strong>gradually add random noise</strong>, step by step, until it\'s pure static — an easy process that needs no learning.</p>
          <p>Now train a network to run it <em>backwards</em>: given a noisy image, predict the noise that was added, subtract a bit of it, get a slightly cleaner image. Repeat, and you walk from static back to a clean picture.</p>
          <div class="callout">💡 The payoff: hand the trained network <strong>pure random noise it has never seen</strong> and have it "denoise" toward a brand-new image. It\'s not recovering an original — it\'s hallucinating a plausible one, one small step at a time.</div>` },
        { t: 'quiz',
          q: 'What does a diffusion model\'s neural network actually learn to do?',
          opts: [
            'Compress images into small files',
            'Look at a noisy image and predict the noise in it, so a bit can be removed — repeated, this turns noise into a clean image',
            'Classify images as real or fake',
          ],
          a: 1,
          why: 'The network is a denoiser: predict-the-noise, subtract a step, repeat. Training on "add noise, learn to reverse it" is stable and has a clear target at every step (the noise you actually added) — unlike a GAN\'s shifting adversarial goal.' },
        { t: 'widget', name: 'diffusion', title: 'Try it: generate an image from noise', md: `
          <p>Start from pure random noise, then press <strong>Generate</strong> and watch a picture emerge one denoising step at a time. Switch the prompt (heart, triangle, ring) to see the <em>same</em> process steered toward different images — that steering is exactly how text-to-image works.</p>` },
        { t: 'text', title: 'Why this beats the GAN duel', md: `
          <p>Diffusion swaps one hard leap for many easy steps. Instead of a generator conjuring a full image in one shot (and a rival trying to catch it), the model makes dozens of small, well-defined denoising steps, each with a concrete target: the noise added at that step.</p>
          <ul>
            <li><strong>Stable training</strong> — a clear loss at every step, no fragile two-network balance.</li>
            <li><strong>High quality &amp; diversity</strong> — no mode collapse; different starting noise reliably yields different images.</li>
            <li><strong>Controllable</strong> — you can steer the denoising at each step (which is how text prompts get in — next lesson).</li>
          </ul>
          <div class="callout">💡 The trade-off: many steps means diffusion is slower to generate than a one-shot GAN. Much research goes into cutting the step count without losing quality.</div>` },
        { t: 'quiz',
          q: 'Why is diffusion training more stable than GAN training?',
          opts: [
            'Diffusion uses a bigger network',
            'Each denoising step has a concrete, known target (the noise that was added), instead of a moving target set by an adversary',
            'Diffusion doesn\'t use gradient descent',
          ],
          a: 1,
          why: 'The "add noise then reverse it" setup means the correct answer at every step is known during training. That fixed target makes the loss well-behaved — no delicate balancing act between two competing networks that a GAN requires.' },
        { t: 'quiz',
          q: 'Generate two images from a diffusion model with different starting noise. What do you get?',
          opts: [
            'The same image both times',
            'Two different images — the starting noise seeds where the denoising journey ends up, so it\'s the source of variety',
            'Noise both times; it never converges',
          ],
          a: 1,
          why: 'The initial random noise is the seed. Different seeds send the denoising process down different paths to different final images — which is exactly why diffusion covers the data\'s diversity and doesn\'t collapse to one output. (Fix the seed and you can reproduce an image.)' },
      ],
    },
    {
      id: 'text-to-image',
      title: 'From words to pictures',
      minutes: 10,
      steps: [
        { t: 'text', title: 'Steering the noise with a prompt', md: `
          <p>Plain diffusion makes <em>some</em> plausible image. To make the image <em>you asked for</em>, the denoiser needs to see your text: the prompt is encoded into an embedding (by a text encoder like CLIP) and fed into the network at <strong>every denoising step</strong>.</p>
          <p>Each step becomes "make this less noisy <em>in the direction of the words 'a red fox in snow.'</em>" The text nudges every step, so the image assembles itself to match the description. This is <strong>conditioning</strong>.</p>` },
        { t: 'quiz',
          q: 'How does the text prompt influence a text-to-image diffusion model?',
          opts: [
            'It picks a matching image from a database',
            'Its embedding is fed into the denoiser at each step, steering every denoising nudge toward matching the words',
            'It\'s only used to name the output file',
          ],
          a: 1,
          why: 'The prompt conditions the whole reverse process. Encoded as an embedding and injected at each step, it biases every denoising nudge toward the described image. The picture is generated fresh from noise — never retrieved from a library.' },
        { t: 'text', title: 'Two tricks that make it practical', md: `
          <p><strong>Latent diffusion.</strong> Denoising at full 512×512 resolution is expensive. Modern systems (like Stable Diffusion) compress the image into a smaller <em>latent</em> space, diffuse there, then decode back to full pixels — same idea, a fraction of the compute.</p>
          <p><strong>Guidance scale.</strong> A dial for "how hard should the prompt push?" Low = more creative, loosely related to your words; high = sticks tightly to the prompt but can look oversaturated or stiff. The image world\'s cousin of the temperature knob you met with LLMs.</p>` },
        { t: 'widget', name: 'flashcards', title: 'Flip for the definition', cards: [
          ['Conditioning', 'Feeding the text embedding into the denoiser at every step to steer the output'],
          ['Latent diffusion', 'Running the diffusion process in a compressed representation, then decoding to full resolution'],
          ['Guidance scale', 'A dial controlling how strongly the output follows the prompt vs. looks natural'],
          ['CLIP (text encoder)', 'Converts your prompt into an embedding the model can condition on'],
        ] },
        { t: 'quiz',
          q: 'Why do systems like Stable Diffusion run the diffusion process in a compressed "latent" space instead of on raw pixels?',
          opts: [
            'Latent space produces legally distinct images',
            'It\'s far cheaper to compute — you diffuse over a small compressed representation, then decode back to full resolution, making it runnable on ordinary hardware',
            'Raw pixels can\'t be denoised',
          ],
          a: 1,
          why: 'Full-resolution denoising over hundreds of thousands of pixels for many steps is costly. Compressing to a small latent, diffusing there, then decoding slashes the compute — the key efficiency trick that put image generation in everyone\'s hands.' },
        { t: 'quiz',
          q: 'You crank the guidance scale very high and images start looking harsh and over-baked. What\'s the trade-off you\'re hitting?',
          opts: [
            'Higher guidance always looks better; something else is wrong',
            'Strong prompt adherence vs natural-looking results — pushing too hard for the prompt sacrifices realism and variety',
            'Guidance scale only changes the resolution',
          ],
          a: 1,
          why: 'Guidance trades faithfulness for naturalness. Too low and the image drifts from your words; too high and it over-commits, going harsh and stiff. Like temperature, there\'s a sweet spot — and it\'s another example of the same generation-control tension across all of GenAI.' },
        { t: 'text', title: '🎓 You can explain the magic', md: `
          <p>Image generation is no longer a black box to you:</p>
          <ul>
            <li><strong>Generative vs discriminative</strong> — synthesizing new samples vs sorting inputs</li>
            <li><strong>GANs</strong> — forger vs detective, sharp but unstable</li>
            <li><strong>Diffusion</strong> — learn to un-noise; turn static into images, one steady step at a time</li>
            <li><strong>Text-to-image</strong> — condition every step on the prompt; compress to a latent for speed</li>
          </ul>
          <p>Next: <strong>Reinforcement Learning</strong> — from models that create to agents that learn by trial, error, and reward.</p>` },
      ],
    },
  ],
});

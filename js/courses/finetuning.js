// Course: Fine-tuning Your Own Model (finale)
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'finetuning',
  title: 'Fine-tuning Your Own Model',
  tagline: 'Make a model your own — the capstone of the whole journey',
  icon: '🛠️',
  accent: 'var(--series-14)',
  description: 'The final course, and it ties everything together. You know how models work, how to use them, and how to build them in PyTorch. Now: how to take a powerful pretrained model and adapt it to your task — when it\'s worth it, how LoRA makes it cheap, and how to not fool yourself about whether it worked. Assumes the PyTorch track.',
  lessons: [
    {
      id: 'when-to-finetune',
      title: 'When to fine-tune (and when not to)',
      minutes: 10,
      steps: [
        { t: 'text', title: 'Three ways to change a model\'s behavior', md: `
          <p>Before touching a training loop, know your options. To make a model do what you want, you have three tools, in increasing order of effort:</p>
          <ul>
            <li><strong>Prompting</strong> — just ask better, with examples (few-shot). No training. Try this first, always.</li>
            <li><strong>RAG</strong> — retrieve relevant documents into the context. Adds <em>knowledge</em> the model lacks.</li>
            <li><strong>Fine-tuning</strong> — actually continue training the model\'s weights on your data. Changes <em>behavior</em>.</li>
          </ul>
          <p>The single most common mistake is reaching for fine-tuning first. It\'s the most expensive, most brittle option — often prompting or RAG solves the problem for a fraction of the effort.</p>` },
        { t: 'quiz',
          q: 'What should you almost always try before fine-tuning?',
          opts: [
            'Nothing — fine-tuning should be the first move',
            'Better prompting (with examples) and, if the issue is missing knowledge, RAG — both are cheaper and less brittle',
            'Training a brand-new model from scratch',
          ],
          a: 1,
          why: 'Fine-tuning is the heavyweight option: costly, slower to iterate, and easy to get wrong. Prompting and RAG solve a large share of problems with far less effort and no training run. Reach for weights-changing only after the lighter tools genuinely fall short.' },
        { t: 'text', title: 'The rule that saves you: behavior vs knowledge', md: `
          <p>Here is the distinction that decides everything — and that people constantly get backwards:</p>
          <div class="callout">💡 <strong>Fine-tuning changes behavior and style. RAG adds knowledge.</strong> Want the model to always answer in your brand voice, output a specific JSON format, or adopt a skill/tone? Fine-tune. Want it to know your company\'s latest docs or today\'s facts? RAG.</div>
          <p>Fine-tuning is a <em>poor</em> way to inject facts: the model may memorize them unreliably, you\'d have to retrain every time a fact changes, and it can hallucinate around them anyway. RAG keeps facts in an external store you can update instantly. Match the tool to the need and you avoid the most expensive class of mistakes in applied AI.</p>` },
        { t: 'quiz',
          q: 'You want a model to reliably answer using your company\'s constantly-updated internal documentation. Fine-tune or RAG?',
          opts: [
            'Fine-tune — bake the docs into the weights',
            'RAG — it\'s a knowledge need, and an external store can be updated instantly without retraining, unlike weights',
            'Neither can handle documents',
          ],
          a: 1,
          why: 'This is a knowledge problem, and knowledge that changes. RAG retrieves the current docs at query time and updates the moment you change a file. Fine-tuning would memorize a snapshot unreliably and need a fresh training run on every doc change. Behavior → fine-tune; knowledge → RAG.' },
      ],
    },
    {
      id: 'how-finetuning-works',
      title: 'How fine-tuning works',
      minutes: 11,
      steps: [
        { t: 'text', title: 'It\'s just more training', md: `
          <p>Fine-tuning is not a new algorithm — it\'s the training loop from the PyTorch course, started from a pretrained model instead of random weights. Same forward pass, same cross-entropy loss, same backprop, same optimizer:</p>
          <pre><code>for batch in your_data:          # your task's examples
    opt.zero_grad()
    out = model(batch.inputs)
    loss = loss_fn(out, batch.targets)   # cross-entropy, as always
    loss.backward()
    opt.step()</code></pre>
          <p>The model already knows language, facts, and reasoning from pretraining. You\'re just nudging it toward your specific task with a comparatively tiny amount of data — hundreds to thousands of examples, not trillions of tokens.</p>` },
        { t: 'quiz',
          q: 'What\'s fundamentally different about the fine-tuning training loop versus training from scratch?',
          opts: [
            'It uses a completely different loss and optimizer',
            'Almost nothing about the loop — the key difference is starting from a pretrained model\'s weights, so a little task data goes a long way',
            'Fine-tuning doesn\'t use gradients',
          ],
          a: 1,
          why: 'Same forward/loss/backward/step loop you already know. The power comes from the starting point: pretrained weights already encode language and reasoning, so you only need to nudge them toward your task — which is why fine-tuning needs a tiny fraction of the data pretraining did.' },
        { t: 'text', title: 'The danger: catastrophic forgetting', md: `
          <p>Push too hard and you break what you paid for. <strong>Catastrophic forgetting</strong> is when fine-tuning on your narrow data overwrites the broad capabilities from pretraining — the model gets great at your task but loses general fluency, reasoning, or safety behavior.</p>
          <p>The defenses are the overfitting toolkit from Foundations, plus one key setting:</p>
          <ul>
            <li><strong>A small learning rate</strong> — nudge the weights gently; big steps blow away pretrained knowledge.</li>
            <li><strong>Few epochs</strong> — don\'t hammer the same small dataset over and over.</li>
            <li><strong>Quality over quantity</strong> — a few hundred clean, consistent examples beat thousands of noisy ones. Bad data teaches bad behavior, faithfully.</li>
          </ul>` },
        { t: 'quiz',
          q: 'A model fine-tuned on a narrow task suddenly gets worse at general reasoning it used to handle. What happened?',
          opts: [
            'The task data made it smarter everywhere',
            'Catastrophic forgetting — aggressive fine-tuning overwrote broad pretrained capabilities with the narrow new task',
            'The model ran out of memory',
          ],
          a: 1,
          why: 'Fine-tuning too hard on narrow data can erase the general abilities pretraining installed — the model overfits to your task and forgets the rest. A small learning rate, few epochs, and clean data keep the nudge gentle enough to add your behavior without wiping out what made the model useful.' },
      ],
    },
    {
      id: 'lora-peft',
      title: 'LoRA & efficient fine-tuning',
      minutes: 12,
      steps: [
        { t: 'text', title: 'The cost problem with full fine-tuning', md: `
          <p>Fully fine-tuning a modern model means updating <em>all</em> its billions of weights — and storing a full copy of the optimizer state for each. That needs enormous GPU memory (recall the capstone\'s memory discussion) and produces a giant new model file per task. For most people, full fine-tuning of a large model is simply out of reach.</p>
          <p>The fix that changed everything is <strong>parameter-efficient fine-tuning (PEFT)</strong>, and its star technique: <strong>LoRA</strong> (Low-Rank Adaptation).</p>` },
        { t: 'text', title: 'LoRA: freeze the giant, train a tiny add-on', md: `
          <p>LoRA\'s insight: you don\'t need to move all the weights. Instead:</p>
          <ul>
            <li><strong>Freeze the entire pretrained model</strong> — its billions of weights never change.</li>
            <li>Inject tiny <strong>low-rank adapter</strong> matrices alongside certain layers, and train <em>only those</em>. They\'re a small fraction — often well under 1% — of the total parameters.</li>
          </ul>
          <pre><code>from peft import LoraConfig, get_peft_model

cfg = LoraConfig(r=8, target_modules=["q_proj", "v_proj"])
model = get_peft_model(base_model, cfg)   # base stays frozen
model.print_trainable_parameters()
# trainable: 4.2M / 6.7B  (0.06%)</code></pre>
          <p>Because you only train and store the little adapters, memory drops dramatically and each fine-tune produces a few-megabyte adapter file instead of a multi-gigabyte model. You can keep dozens of task adapters and snap them onto the same frozen base.</p>` },
        { t: 'quiz',
          q: 'In LoRA fine-tuning, what happens to the original pretrained weights?',
          opts: [
            'They are all updated, like normal fine-tuning',
            'They stay frozen — LoRA trains small low-rank adapter matrices added alongside them, a tiny fraction of the parameters',
            'They are deleted and replaced',
          ],
          a: 1,
          why: 'Freezing the base is the whole trick. LoRA leaves the billions of pretrained weights untouched and trains only small injected adapters (often <1% of params). That slashes memory and produces tiny, swappable adapter files — while the frozen base preserves all the original capability, also reducing catastrophic forgetting.' },
        { t: 'quiz',
          q: 'Why can you keep many different LoRA adapters for one base model but not many fully fine-tuned copies?',
          opts: [
            'Full fine-tunes are smaller than adapters',
            'Each LoRA adapter is only a few megabytes (just the small trained matrices), while each full fine-tune is a complete multi-gigabyte copy of the whole model',
            'You can only ever have one model total',
          ],
          a: 1,
          why: 'A full fine-tune duplicates every weight, so N tasks means N giant model files. LoRA stores only the tiny adapters, so you keep one frozen base plus many lightweight adapters and swap them per task. That efficiency is why PEFT made custom fine-tuning accessible to everyone.' },
      ],
    },
    {
      id: 'data-eval-workflow',
      title: 'Data, evaluation & the finish line',
      minutes: 11,
      steps: [
        { t: 'text', title: 'Your dataset is the product', md: `
          <p>With LoRA making the compute cheap, the hard part becomes the <strong>data</strong>. For instruction fine-tuning, your dataset is a set of example <em>input → desired output</em> pairs that demonstrate the behavior you want:</p>
          <pre><code>{"prompt": "Summarize this ticket: ...", "response": "..."}
{"prompt": "Summarize this ticket: ...", "response": "..."}</code></pre>
          <p>The model learns the pattern in your examples — so their quality, consistency, and coverage <em>are</em> the fine-tune. Consistent formatting, correct outputs, and a spread of the cases you actually care about matter far more than raw volume. Garbage examples produce a model that faithfully reproduces garbage.</p>` },
        { t: 'quiz',
          q: 'For instruction fine-tuning, what matters most about your training examples?',
          opts: [
            'Only the sheer number of examples',
            'Their quality and consistency — clean, correct, well-formatted examples covering the cases you care about; the model imitates exactly what you show it',
            'That they are as varied and random as possible',
          ],
          a: 1,
          why: 'Fine-tuning is imitation: the model copies the behavior in your examples. Inconsistent or wrong examples teach inconsistent or wrong behavior. A few hundred clean, representative pairs beat thousands of sloppy ones — curating the dataset is the real work, and the real lever on quality.' },
        { t: 'text', title: 'Don\'t fool yourself: evaluate honestly', md: `
          <p>Every lesson of Foundations comes due here. Hold out a <strong>validation set</strong> your fine-tune never trains on, and judge success there — not on the training examples, where a memorizing model looks perfect and generalizes terribly. Watch for the train/validation gap that signals overfitting.</p>
          <p>And evaluate on what you actually care about: does it beat a good prompt on the <em>base</em> model? (Sometimes it doesn\'t — always check.) The whole workflow is a loop: curate data → LoRA fine-tune → evaluate on held-out cases → find failures → improve the data → repeat. Fine-tuning isn\'t a one-shot button; it\'s iteration, and the data is what you iterate on.</p>` },
        { t: 'quiz',
          q: 'Why must you evaluate a fine-tuned model on held-out examples it never trained on?',
          opts: [
            'To make training faster',
            'Because a model can score perfectly on its training examples by memorizing them while generalizing poorly — only held-out data reveals real performance (the overfitting lesson from Foundations)',
            'Held-out data isn\'t actually necessary',
          ],
          a: 1,
          why: 'Training-set performance is a mirage — a model can memorize and look flawless there while failing on anything new. A held-out validation set is the honest test of generalization, and the train/val gap flags overfitting. It\'s the same discipline from Foundations, now protecting your fine-tune.' },
        { t: 'text', title: '🎓 The whole journey, complete', md: `
          <p>This is the end of the road — and look how far you\'ve come. You started at "what does it even mean for a machine to learn?" You can now, genuinely:</p>
          <ul>
            <li>Explain how every major kind of AI works — text, image, audio, video, embeddings, and agents that learn from reward</li>
            <li>Trace the machinery: loss, gradient descent, backprop, attention, and the scaling laws that govern it all</li>
            <li>Use models expertly — prompting, RAG, agents — and know their limits and risks</li>
            <li>Build and train neural networks in PyTorch, from an XOR net to a CNN</li>
            <li>Adapt a pretrained model to your own task with LoRA — and evaluate it honestly</li>
          </ul>
          <p>You don\'t just use AI anymore — you understand it, from the idea of learning all the way to fine-tuning your own model. There\'s nothing left to unlock here. Go build something only you would think to build. 🚀</p>` },
      ],
    },
  ],
});

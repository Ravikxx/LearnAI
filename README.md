# 🧠 LearnAI

Interactive, Brilliant-style lessons on how AI actually works — free, no build step, runs entirely in the browser.

**Live site:** https://ravikxx.github.io/LearnAI/

## Courses

0. **The Many Kinds of AI** — a no-prerequisites survey of every model type: text, image, audio, video, embeddings, and game-playing agents, and the one idea (numbers in, numbers out) that unites them
1. **AI Foundations** — what "learning" means: features & labels, loss, gradient descent, overfitting
2. **Neural Networks** — neurons, activations, layers, backprop, and a real XOR network you train live
3. **How LLMs Work** — tokens, embeddings, attention, next-token prediction, RLHF
4. **Getting the Most from LLMs** — prompting, few-shot & chain-of-thought, RAG, and agents
5. **AI Agents & Tool Use** — tool calling, the ReAct loop, memory, planning, and how agents break
6. **Generative AI & Diffusion** — generative vs discriminative, GANs, diffusion, and text-to-image
7. **Reinforcement Learning** — reward, value & Q-learning, deep RL, self-play, and reward hacking
8. **Recommender Systems** — collaborative filtering, matrix factorization, ranking, and filter bubbles
9. **AI Safety & Alignment** — the alignment problem, reward hacking, bias, interpretability, dual use
10. **Putting It All Together** — advanced synthesis capstone: cross-entropy & perplexity, scaling laws (Chinchilla, 6ND), emergence, the RLHF objective, attention's n² cost & the KV cache, and the frontier
11. **Python & PyTorch** — tensors, autograd, the training loop, and a real MNIST classifier
12. **Computer Vision with PyTorch** — convolutions, CNNs, and transfer learning
13. **Fine-tuning Your Own Model** — prompt vs RAG vs fine-tune, catastrophic forgetting, LoRA/PEFT, and honest evaluation

## Features

- Hands-on widgets: drive a perceptron, roll down a loss curve, train a real neural net in-browser, tokenize text, explore attention & temperature sampling
- Quizzes with explanations on every lesson, one step per page with animated navigation
- Optional AI tutor on every step (bring your own free Groq or Mistral API key — stored in localStorage, no backend)
- XP + progress tracking (saved in localStorage — no accounts, no server)
- Automatic dark mode

## Development

No build step. Just serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Adding lessons

Lessons live in `js/courses/*.js` as plain data: each course has `lessons`, each lesson has `steps` of type `text`, `quiz`, or `widget`. Widgets are registered in `js/widgets.js` under `window.WIDGETS`.

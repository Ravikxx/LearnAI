# 🧠 LearnAI

Interactive, Brilliant-style lessons on how AI actually works — free, no build step, runs entirely in the browser.

**Live site:** https://ravikxx.github.io/LearnAI/

## Courses

1. **AI Foundations** — what "learning" means: features & labels, loss, gradient descent, overfitting
2. **Neural Networks** — neurons, activations, layers, backprop, and a real XOR network you train live
3. **How LLMs Work** — tokens, embeddings, attention, next-token prediction, RLHF
4. **Python & PyTorch** — tensors, autograd, the training loop, and a real MNIST classifier

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

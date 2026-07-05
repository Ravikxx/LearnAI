// Course 4: Python & PyTorch
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'pytorch',
  title: 'Python & PyTorch',
  tagline: 'Stop reading about models — start building them',
  icon: '🔥',
  accent: 'var(--series-8)',
  description: 'PyTorch is the tool researchers and engineers actually use to build neural networks. This course assumes basic Python and everything from the earlier courses — you\'ll see how tensors, autograd, and the training loop turn the theory you learned into working code.',
  lessons: [
    {
      id: 'tensors',
      title: 'Meet tensors',
      minutes: 10,
      steps: [
        { t: 'text', title: 'The one data structure that matters', md: `
          <p>Everything in PyTorch is a <strong>tensor</strong>: a grid of numbers with any number of dimensions. A single number is a 0-D tensor, a list is 1-D, a table is 2-D, a color image is 3-D (height × width × channels), a batch of images is 4-D.</p>
          <pre><code>import torch

x = torch.tensor([[1., 2., 3.],
                  [4., 5., 6.]])

print(x.shape)   # torch.Size([2, 3])
print(x.dtype)   # torch.float32</code></pre>
          <p>The <strong>shape</strong> tells you the size along each dimension — here 2 rows, 3 columns. You will spend a shocking amount of your PyTorch life reasoning about shapes.</p>` },
        { t: 'quiz',
          q: 'A dataset holds 640 grayscale images, each 28×28 pixels, as one tensor. What\'s its shape?',
          opts: [
            '(28, 28)',
            '(640, 28, 28)',
            '(640, 784)',
          ],
          a: 1,
          why: 'One dimension per axis of variation: 640 images, each 28 rows and 28 columns → (640, 28, 28). (Shape (640, 784) would be the same data with each image flattened into a single row — you\'ll do exactly that later, before feeding a plain linear layer.)' },
        { t: 'text', title: 'Making tensors', md: `
          <p>The constructors you'll use constantly:</p>
          <pre><code>torch.zeros(2, 3)      # 2×3 of zeros
torch.ones(5)          # [1., 1., 1., 1., 1.]
torch.randn(3, 4)      # 3×4 of random normal values
torch.arange(6)        # [0, 1, 2, 3, 4, 5]</code></pre>
          <p><code>randn</code> matters more than it looks: <em>random normal values are how every network's weights start life</em> — remember, training begins from a random spot on the loss landscape.</p>` },
        { t: 'text', title: 'Reshaping', md: `
          <p>Same numbers, different grid. <code>reshape</code> reorganizes a tensor as long as the total element count matches:</p>
          <pre><code>x = torch.arange(12)     # shape (12,)
a = x.reshape(3, 4)      # shape (3, 4)
b = x.reshape(2, 6)      # shape (2, 6)
c = x.reshape(4, -1)     # -1 means "figure it out" → (4, 3)</code></pre>
          <p>Indexing and slicing work like Python lists, but per dimension: <code>a[0]</code> is the first row, <code>a[:, 1]</code> is the second column, <code>a[0, 1]</code> is one element.</p>` },
        { t: 'quiz',
          q: 'x has shape (3, 4). Which reshape FAILS?',
          opts: [
            'x.reshape(12)',
            'x.reshape(6, 2)',
            'x.reshape(5, 2)',
          ],
          a: 2,
          why: '3×4 = 12 elements. Both (12,) and (6, 2) hold 12 elements — fine. But 5×2 = 10 ≠ 12, so PyTorch raises an error. Reshape never creates or destroys data; it only re-grids it.' },
        { t: 'text', title: 'Why not just use Python lists?', md: `
          <p>Three reasons tensors exist:</p>
          <ul>
            <li><strong>Speed</strong> — <code>x * 2</code> on a million-element tensor runs as one vectorized C/CUDA operation, hundreds of times faster than a Python loop.</li>
            <li><strong>GPU support</strong> — <code>x.to('cuda')</code> moves the tensor to the GPU; every subsequent op runs on thousands of cores. (Remember why GPUs won: matrix math is embarrassingly parallel.)</li>
            <li><strong>Autograd</strong> — tensors can remember how they were computed, so PyTorch can run backprop through them automatically. That's the next lesson's star.</li>
          </ul>` },
        { t: 'quiz',
          q: 'Your training script computes everything correctly but takes forever. You discover the code processes pixels with nested Python for-loops. The fix?',
          opts: [
            'Buy a faster CPU',
            'Replace the loops with tensor operations that act on the whole array at once',
            'Rewrite it in JavaScript',
          ],
          a: 1,
          why: 'This is "vectorization" — the single biggest PyTorch habit. One tensor op on a million elements beats a million Python iterations because the loop happens inside optimized C/CUDA, not the Python interpreter. If you\'re writing a for-loop over elements, there\'s almost always a tensor op that replaces it.' },
      ],
    },
    {
      id: 'tensor-math',
      title: 'Tensor math & broadcasting',
      minutes: 10,
      steps: [
        { t: 'text', title: 'Two kinds of multiplication', md: `
          <p>The distinction that trips up every beginner:</p>
          <pre><code>a = torch.tensor([[1., 2.],
                  [3., 4.]])
b = torch.tensor([[10., 20.],
                  [30., 40.]])

a * b     # ELEMENTWISE: [[10, 40], [90, 160]]
a @ b     # MATRIX MULTIPLY: [[70, 100], [150, 220]]</code></pre>
          <p><code>*</code> pairs up matching positions. <code>@</code> is real matrix multiplication — rows dotted with columns. A neural network layer is <code>x @ W + b</code>: matrix multiply, exactly the "weighted sum" every neuron computes, done for all neurons and all examples at once.</p>` },
        { t: 'quiz',
          q: 'For a @ b to work, a has shape (32, 10). Which shape must b have?',
          opts: [
            '(32, 10)',
            '(10, anything)',
            '(anything, 32)',
          ],
          a: 1,
          why: 'Matrix multiply needs inner dimensions to match: (32, 10) @ (10, k) → (32, k). Think of it as 32 examples with 10 features each, flowing through a layer with k neurons — the layer\'s weight matrix is (10, k). Shape errors on @ will be your most common PyTorch crash; now you can read them.' },
        { t: 'text', title: 'Broadcasting', md: `
          <p>What if shapes don't match? PyTorch <strong>broadcasts</strong>: dimensions of size 1 (or missing) are automatically stretched to fit.</p>
          <pre><code>x = torch.randn(32, 10)   # 32 examples, 10 features
b = torch.randn(10)       # one bias per feature

y = x + b                 # b is stretched across all 32 rows</code></pre>
          <p>That's why <code>x @ W + b</code> works even though <code>x @ W</code> is a matrix and <code>b</code> is a vector — the bias broadcasts across the batch. No copying happens under the hood; it's free.</p>` },
        { t: 'quiz',
          q: 'a has shape (3, 1) and b has shape (1, 4). What is (a + b).shape?',
          opts: [
            'Error — shapes don\'t match',
            '(3, 4)',
            '(4, 3)',
          ],
          a: 1,
          why: 'Each size-1 dimension stretches to match the other tensor: a\'s column repeats 4 times, b\'s row repeats 3 times → (3, 4). This "outer" pattern is a classic trick — e.g. comparing every item in one list against every item in another, no loops.' },
        { t: 'text', title: 'Reductions and dim', md: `
          <p>Summaries collapse dimensions — and <code>dim</code> says which one to collapse:</p>
          <pre><code>x = torch.tensor([[1., 2., 3.],
                  [4., 5., 6.]])   # shape (2, 3)

x.sum()          # 21.0 — everything
x.sum(dim=0)     # [5., 7., 9.]   — collapse rows → shape (3,)
x.sum(dim=1)     # [6., 15.]      — collapse cols → shape (2,)
x.argmax(dim=1)  # [2, 2] — index of the max in each row</code></pre>
          <p><code>argmax(dim=1)</code> is how you turn a classifier's 10 output scores into "the predicted digit is 7."</p>` },
        { t: 'quiz',
          q: 'Mental model check: x.sum(dim=0) on shape (2, 3) gives shape (3,). Why?',
          opts: [
            'dim=0 keeps dimension 0',
            'The dim you name is the one that gets collapsed away — sum DOWN the rows, leaving one value per column',
            'sum always returns a 1-D tensor',
          ],
          a: 1,
          why: '"dim=0" means "reduce along dimension 0" — the 2 rows collapse into 1, leaving the 3 columns. Naming the dimension that DISAPPEARS feels backwards at first; this quiz exists because everyone gets it wrong once.' },
        { t: 'text', title: 'Devices', md: `
          <p>Tensors live somewhere — CPU by default, GPU on request:</p>
          <pre><code>device = 'cuda' if torch.cuda.is_available() else 'cpu'

x = x.to(device)
model = model.to(device)</code></pre>
          <p>Rules: ops require all tensors on the <em>same</em> device (mixing raises an error), and this two-line pattern at the top of a script is universal. No GPU on your machine? Google Colab gives you a free one in the browser.</p>` },
      ],
    },
    {
      id: 'autograd',
      title: 'Autograd: calculus, automated',
      minutes: 10,
      steps: [
        { t: 'text', title: 'The feature PyTorch is famous for', md: `
          <p>Remember backprop — the algorithm that assigns blame to every weight? You will never implement it. PyTorch watches every operation and builds the blame-trail for you.</p>
          <pre><code>x = torch.tensor(3.0, requires_grad=True)

y = x**2 + 2*x      # y = 15.0, and PyTorch remembers HOW

y.backward()         # run backprop
print(x.grad)        # tensor(8.) — the gradient dy/dx = 2x + 2 = 8</code></pre>
          <p><code>requires_grad=True</code> means "track this tensor." <code>.backward()</code> walks the recorded operations in reverse and fills <code>.grad</code> on every tracked tensor. That's the entire backward pass from the Neural Networks course, in one method call.</p>` },
        { t: 'quiz',
          q: 'x = torch.tensor(4.0, requires_grad=True); y = x**2; y.backward(). What is x.grad?',
          opts: [
            '16.0',
            '8.0',
            '4.0',
          ],
          a: 1,
          why: 'The gradient of x² is 2x, so at x=4 it\'s 8. Meaning: nudge x up by a tiny amount and y rises 8× as fast. Gradient descent would now step x DOWNHILL: x = x − lr × 8.' },
        { t: 'text', title: 'Two gotchas everyone hits', md: `
          <p><strong>Gotcha 1: gradients accumulate.</strong> Call <code>.backward()</code> twice and the second gradient <em>adds to</em> the first instead of replacing it. That's why every training loop calls <code>optimizer.zero_grad()</code> before each backward pass.</p>
          <p><strong>Gotcha 2: tracking costs memory.</strong> When you're just <em>using</em> a trained model (no learning), wrap the code so PyTorch skips the bookkeeping:</p>
          <pre><code>with torch.no_grad():
    predictions = model(test_data)   # faster, less memory</code></pre>` },
        { t: 'quiz',
          q: 'A student forgets zero_grad() in their training loop. What happens?',
          opts: [
            'PyTorch raises an error',
            'Nothing — it\'s optional',
            'Gradients from every previous batch pile up, so each step moves in a stale, ever-growing direction — training goes haywire',
          ],
          a: 2,
          why: 'No error, just silently wrong behavior — the worst kind of bug. Step 1\'s blame is still in .grad when step 2 adds its own, so the update direction is polluted by history. The loop mantra is always: zero_grad → backward → step.' },
        { t: 'text', title: 'Why this design is powerful', md: `
          <p>Because autograd records operations <em>as they run</em>, you can put anything in your model — loops, if-statements, arbitrary Python — and gradients still flow through whatever actually executed. This "define-by-run" flexibility is a big reason researchers adopted PyTorch over its more rigid early rivals.</p>
          <p>Connect the dots: autograd computes the gradients (lesson: backprop), an optimizer uses them to update weights (lesson: gradient descent), a loss provides the target (lesson: loss). You've now met all the machinery — next lesson assembles it into a real network.</p>` },
      ],
    },
    {
      id: 'first-network',
      title: 'Your first neural network',
      minutes: 12,
      steps: [
        { t: 'text', title: 'Layers come prebuilt', md: `
          <p><code>torch.nn</code> is a box of network parts. <code>nn.Linear(in, out)</code> is a full layer of neurons — weights, biases, the <code>x @ W + b</code>, all managed for you:</p>
          <pre><code>import torch.nn as nn

model = nn.Sequential(
    nn.Linear(2, 4),   # 2 inputs → 4 hidden neurons
    nn.ReLU(),         # the nonlinear bend
    nn.Linear(4, 1),   # 4 hidden → 1 output
)

output = model(torch.tensor([[1., 0.]]))</code></pre>
          <p>Recognize it? This is <em>exactly</em> the 2 → 4 → 1 network from the XOR widget you trained in the Neural Networks course.</p>` },
        { t: 'quiz',
          q: 'How many learnable parameters does nn.Linear(2, 4) contain?',
          opts: [
            '8',
            '12',
            '6',
          ],
          a: 1,
          why: 'Weights: 2 inputs × 4 neurons = 8. Biases: one per neuron = 4. Total 12. (You computed layer parameter counts back in the Neural Networks course — same math, now with a library doing the bookkeeping.)' },
        { t: 'text', title: 'Loss functions and optimizers', md: `
          <p>Two more prebuilt pieces and the set is complete:</p>
          <pre><code>loss_fn = nn.MSELoss()               # regression: mean squared error
loss_fn = nn.CrossEntropyLoss()      # classification: pick-a-category

optimizer = torch.optim.SGD(model.parameters(), lr=0.1)   # plain gradient descent
optimizer = torch.optim.Adam(model.parameters(), lr=0.001) # the smart default</code></pre>
          <p><code>model.parameters()</code> hands the optimizer every weight and bias in the model — the knobs it's allowed to turn. <strong>Adam</strong> is gradient descent with adaptive per-knob step sizes; when in doubt, use it.</p>` },
        { t: 'quiz',
          q: 'You\'re classifying images into 10 digit classes. Which loss function?',
          opts: [
            'nn.MSELoss — error is error',
            'nn.CrossEntropyLoss — built for category prediction',
            'No loss needed for classification',
          ],
          a: 1,
          why: 'CrossEntropyLoss is designed for "which category?" problems: it converts the model\'s 10 raw scores into probabilities and punishes low probability on the true class. MSE technically runs but trains far worse — matching the loss to the task matters.' },
        { t: 'text', title: 'The training loop — the five lines that run the AI world', md: `
          <p>Every PyTorch project has this loop at its heart. Every line is a concept you already own:</p>
          <pre><code>for epoch in range(1000):
    pred = model(X)              # forward pass
    loss = loss_fn(pred, y)      # how wrong?

    optimizer.zero_grad()        # clear old blame
    loss.backward()              # backprop: assign blame
    optimizer.step()             # nudge every knob downhill</code></pre>
          <p>Forward, loss, zero, backward, step. GPT training is this loop with more zeros on the end.</p>` },
        { t: 'quiz',
          q: 'A beginner writes: loss.backward() → optimizer.zero_grad() → optimizer.step(). What goes wrong?',
          opts: [
            'Nothing — order is flexible',
            'zero_grad() right after backward() erases the fresh gradients, so step() updates with zeros — the model never learns',
            'It crashes with an error',
          ],
          a: 1,
          why: 'backward() fills .grad, zero_grad() immediately wipes it, step() then applies a zero update. No error, loss never moves — a classic silent bug. Keep the order: zero → backward → step.' },
        { t: 'text', title: 'Full circle: XOR in PyTorch', md: `
          <p>The complete, runnable version of the widget you watched learn XOR — now in your hands:</p>
          <pre><code>import torch
import torch.nn as nn

X = torch.tensor([[0.,0.],[0.,1.],[1.,0.],[1.,1.]])
y = torch.tensor([[0.],[1.],[1.],[0.]])

model = nn.Sequential(
    nn.Linear(2, 4), nn.Sigmoid(),
    nn.Linear(4, 1), nn.Sigmoid(),
)
loss_fn = nn.MSELoss()
opt = torch.optim.Adam(model.parameters(), lr=0.05)

for epoch in range(2000):
    loss = loss_fn(model(X), y)
    opt.zero_grad()
    loss.backward()
    opt.step()

print(model(X).round())   # tensor([[0.],[1.],[1.],[0.]])</code></pre>
          <p>Paste it into Google Colab and run it. Watching your own code learn something a single neuron provably cannot — that's the moment this stops being theory.</p>` },
      ],
    },
    {
      id: 'real-model',
      title: 'Training a real model: handwritten digits',
      minutes: 12,
      steps: [
        { t: 'text', title: 'MNIST: the "hello world" of deep learning', md: `
          <p>70,000 images of handwritten digits (28×28 grayscale), each labeled 0–9. Every deep learning person has trained on it; today you join them.</p>
          <pre><code>from torchvision import datasets, transforms
from torch.utils.data import DataLoader

train_ds = datasets.MNIST('data', train=True,  download=True,
                          transform=transforms.ToTensor())
test_ds  = datasets.MNIST('data', train=False,
                          transform=transforms.ToTensor())

train_dl = DataLoader(train_ds, batch_size=64, shuffle=True)
test_dl  = DataLoader(test_ds,  batch_size=64)</code></pre>
          <p>Note the built-in train/test split — the honest-evaluation discipline from the Foundations course, baked into the library.</p>` },
        { t: 'quiz',
          q: 'Why train on batches of 64 images instead of all 60,000 at once?',
          opts: [
            'All 60,000 may not fit in memory — and many small noisy steps actually reach good solutions faster than few perfect ones',
            'PyTorch has a 64-image limit',
            'Small batches prevent all overfitting',
          ],
          a: 0,
          why: 'Memory is the obvious reason, but the deeper one: a gradient from 64 random images is a noisy estimate of the true downhill direction — and taking 900 cheap noisy steps per epoch beats one expensive perfect step. The noise even helps escape bad spots on the loss landscape. This is "stochastic" gradient descent — the S in SGD.' },
        { t: 'text', title: 'The model', md: `
          <pre><code>model = nn.Sequential(
    nn.Flatten(),          # (64, 1, 28, 28) → (64, 784)
    nn.Linear(784, 128),
    nn.ReLU(),
    nn.Linear(128, 10),    # 10 scores, one per digit
)
loss_fn = nn.CrossEntropyLoss()
opt = torch.optim.Adam(model.parameters(), lr=0.001)</code></pre>
          <p>Flatten unrolls each image into 784 numbers (shape reasoning from lesson 1). Two layers with a ReLU between them (the bend that makes depth work). Ten outputs — the model's confidence score for each digit.</p>` },
        { t: 'quiz',
          q: 'The model ends with 10 raw scores per image. How do you get the actual predicted digit?',
          opts: [
            'scores.argmax(dim=1) — the index of the highest score',
            'scores.sum(dim=1)',
            'Round each score to 0 or 1',
          ],
          a: 0,
          why: 'Highest score wins: argmax along the class dimension returns the winning index, which IS the digit. (dim=1 because dim=0 is the batch — the reduction rule from lesson 2 pays off.)' },
        { t: 'text', title: 'Train and evaluate', md: `
          <pre><code>for epoch in range(3):
    for images, labels in train_dl:          # 938 batches/epoch
        loss = loss_fn(model(images), labels)
        opt.zero_grad()
        loss.backward()
        opt.step()

    correct = 0
    with torch.no_grad():                    # eval: no tracking
        for images, labels in test_dl:
            pred = model(images).argmax(dim=1)
            correct += (pred == labels).sum().item()
    print(f"epoch {epoch}: test accuracy {correct/10000:.1%}")</code></pre>
          <p>Same five-line loop, now fed by a DataLoader, with an honest test-set evaluation after each epoch. Typical result after 3 epochs: <strong>~97% accuracy</strong> — a program that reads handwriting, built from parts you fully understand.</p>` },
        { t: 'quiz',
          q: 'Your model shows 99.8% accuracy on training data but 91% on the test set. Diagnosis?',
          opts: [
            'Great model — ship the 99.8%',
            'Overfitting — it\'s memorizing training examples; the 91% is the real performance',
            'The test set is broken',
          ],
          a: 1,
          why: 'The training/test gap is the overfitting signature from Foundations, now met in the wild. The honest number is always the test number. Remedies you already know: more data, simpler model, regularization, early stopping.' },
        { t: 'text', title: 'You\'re a practitioner now — where to go', md: `
          <p>You can read and write the code that trains neural networks. Next moves:</p>
          <ul>
            <li><strong>Run it for real</strong> — <a href="https://colab.research.google.com" target="_blank" rel="noopener">Google Colab</a> gives you free GPUs in the browser; paste the XOR and MNIST code and experiment. Break things. Change layer sizes, learning rates, activations, and watch what happens.</li>
            <li><strong>Level up the model</strong> — the next course, <strong>Computer Vision with PyTorch</strong>, swaps these linear layers for <code>nn.Conv2d</code> to build real CNNs (and push MNIST past 99%).</li>
            <li><strong>Official tutorials</strong> — <a href="https://pytorch.org/tutorials/" target="_blank" rel="noopener">pytorch.org/tutorials</a> continues exactly where this leaves off.</li>
          </ul>
          <p>Every concept in this course sat on top of the earlier ones: tensors carry the data, autograd runs backprop, optimizers run gradient descent, the loop minimizes loss, and the test set keeps you honest. That stack — from "what is learning?" to working code — is yours now.</p>` },
      ],
    },
  ],
});

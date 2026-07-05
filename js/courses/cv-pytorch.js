// Course: Computer Vision with PyTorch
window.COURSES = window.COURSES || [];

COURSES.push({
  id: 'cv-pytorch',
  title: 'Computer Vision with PyTorch',
  tagline: 'Convolutions, CNNs, and teaching a network to see',
  icon: '🖼️',
  accent: 'var(--series-4)',
  description: 'The MNIST classifier you built used a plain dense network. That breaks down fast on real images. This course introduces the convolution — the idea that made deep learning conquer vision — and builds a real CNN in PyTorch, then shows how transfer learning lets you stand on giants\' shoulders.',
  lessons: [
    {
      id: 'why-conv',
      title: 'Why dense nets fail on images',
      minutes: 9,
      steps: [
        { t: 'text', title: 'The parameter explosion', md: `
          <p>Your MNIST net flattened each 28×28 image into 784 numbers and fed them to a dense layer. That works at tiny scale. Now try a modest 224×224 color photo: that\'s 224 × 224 × 3 = <strong>150,528</strong> input numbers.</p>
          <p>Connect those to a first hidden layer of just 1,000 neurons and you need over <strong>150 million weights</strong> in the first layer alone. Slow, memory-hungry, and desperate to overfit. Dense layers simply don\'t scale to real images.</p>` },
        { t: 'quiz',
          q: 'Why does flattening a large image into a dense layer blow up so badly?',
          opts: [
            'Images can\'t be flattened',
            'Every input pixel connects to every neuron, so the weight count is pixels × neurons — which explodes for high-resolution images',
            'Dense layers can\'t use color',
          ],
          a: 1,
          why: 'A dense (fully-connected) layer wires every input to every neuron. With hundreds of thousands of pixels, even a modest hidden layer needs hundreds of millions of weights. It\'s wasteful and overfits — the motivation for a smarter, image-aware layer.' },
        { t: 'text', title: 'Flattening throws away structure', md: `
          <p>There\'s a deeper problem than size. Flattening destroys <strong>spatial structure</strong>. In the flattened vector, two pixels that are neighbors in the image can land far apart, and the dense layer has no idea they were ever adjacent.</p>
          <p>But images are all about locality: an edge, a corner, an eye — these are <em>local</em> patterns, and a cat is a cat whether it\'s in the top-left or bottom-right of the frame. A good vision model should exploit both facts:</p>
          <ul>
            <li><strong>Locality</strong> — meaningful features come from nearby pixels.</li>
            <li><strong>Translation invariance</strong> — a feature\'s identity doesn\'t depend on where it appears.</li>
          </ul>
          <p>The convolution is engineered to do exactly this.</p>` },
        { t: 'quiz',
          q: 'You want a model to recognize a cat whether it\'s in the corner or the center of the photo. Which property captures that need?',
          opts: [
            'Parameter explosion',
            'Translation invariance — the same feature should be detectable regardless of its position in the image',
            'Overfitting',
          ],
          a: 1,
          why: 'Translation invariance means "a cat-feature is a cat-feature anywhere in the frame." A dense net would have to relearn the pattern separately for every position; convolutions get this property essentially for free by reusing the same detector across the whole image.' },
      ],
    },
    {
      id: 'convolutions',
      title: 'The convolution',
      minutes: 10,
      steps: [
        { t: 'text', title: 'A tiny window that slides', md: `
          <p>A <strong>convolution</strong> uses a small grid of weights — a <strong>filter</strong> (or kernel), often just 3×3 — and slides it across the image. At each position it multiplies the filter against the patch of pixels underneath, sums the result into one number, and moves on. Sweep the whole image and you get a new grid called a <strong>feature map</strong>.</p>
          <p>Two ideas make this powerful and cheap:</p>
          <ul>
            <li><strong>Local</strong> — each output looks at only a small neighborhood, matching how image features actually work.</li>
            <li><strong>Weight sharing</strong> — the <em>same</em> 3×3 filter is reused at every position. So a 3×3 filter is just 9 weights, no matter how big the image — and it automatically detects its pattern anywhere (there\'s your translation invariance).</li>
          </ul>` },
        { t: 'quiz',
          q: 'A single 3×3 convolutional filter has how many weights, on a one-channel image — and why does that stay fixed as the image grows?',
          opts: [
            '9, because the same small filter is reused (shared) at every position instead of having separate weights per pixel',
            'One weight per pixel in the image',
            'It depends on the image resolution',
          ],
          a: 0,
          why: 'Weight sharing is the whole trick: one 3×3 filter is 9 weights, slid across the entire image. A megapixel photo uses the same 9. That\'s why convolutions are so parameter-efficient compared to dense layers — and why the same feature is found anywhere it appears.' },
        { t: 'text', title: 'Filters detect features', md: `
          <p>What does a filter actually <em>do</em>? Each one is a little pattern-detector. A filter tuned to a vertical edge lights up its feature map wherever a vertical edge appears; another fires on a patch of a certain color, or a corner.</p>
          <p>Crucially, nobody hand-designs these filters — they\'re <strong>learned</strong>, just like any other weights, by gradient descent. Training discovers whatever detectors reduce the loss.</p>
          <p>A conv layer applies <em>many</em> filters at once (say 32), producing 32 feature maps — 32 different views of "what patterns are where."</p>` },
        { t: 'text', title: 'Stacking builds a hierarchy', md: `
          <p>Here\'s the beautiful part. Stack convolution layers, and each one operates on the feature maps of the last. This builds a <strong>hierarchy of features</strong>:</p>
          <ul>
            <li>Early layers detect simple things: edges, colors, gradients.</li>
            <li>Middle layers combine those into textures, patterns, simple shapes.</li>
            <li>Deep layers combine <em>those</em> into object parts — an eye, a wheel, a face.</li>
          </ul>
          <p>Between conv layers, a <strong>pooling</strong> step (e.g. max-pooling) shrinks the feature maps by keeping the strongest response in each little region — reducing resolution, cutting compute, and adding a bit more position-tolerance. This edges-to-objects hierarchy, learned automatically, is the essence of a <strong>Convolutional Neural Network (CNN)</strong>.</p>` },
        { t: 'quiz',
          q: 'In a deep CNN, how do the features typically change from the first layers to the last?',
          opts: [
            'They stay the same throughout',
            'Simple → complex: early layers catch edges and colors, deeper layers combine those into textures, parts, and whole objects',
            'Deep layers detect edges, early layers detect objects',
          ],
          a: 1,
          why: 'Each layer builds on the last, so the hierarchy runs simple-to-complex: edges → textures → object parts → objects. This learned progression — never hand-programmed — is why CNNs generalize so well, and it loosely echoes how biological visual systems are organized.' },
      ],
    },
    {
      id: 'build-cnn',
      title: 'Build a CNN in PyTorch',
      minutes: 11,
      steps: [
        { t: 'text', title: 'The building blocks', md: `
          <p>PyTorch gives you the pieces directly. The key layer is <code>nn.Conv2d</code>:</p>
          <pre><code>import torch.nn as nn

# in_channels, out_channels, kernel_size
conv = nn.Conv2d(3, 32, kernel_size=3, padding=1)</code></pre>
          <p><code>in_channels=3</code> for an RGB image; <code>out_channels=32</code> means 32 filters → 32 feature maps out; <code>padding=1</code> adds a one-pixel border so a 3×3 conv keeps the height and width unchanged. Alongside it you\'ll use <code>nn.MaxPool2d(2)</code> to halve resolution and <code>nn.ReLU()</code> for nonlinearity — the same activation from the neural-nets course.</p>` },
        { t: 'quiz',
          q: 'In nn.Conv2d(3, 32, kernel_size=3), what does the 32 mean?',
          opts: [
            'The image is 32 pixels wide',
            'The layer uses 32 filters, producing 32 output feature maps',
            'There are 32 layers',
          ],
          a: 1,
          why: 'The second argument is out_channels: how many filters the layer learns, and therefore how many feature maps it outputs. Each filter is a separate learned detector, so 32 means 32 different pattern-views of the input.' },
        { t: 'text', title: 'Assembling the network', md: `
          <p>A classic small CNN: a couple of conv+pool blocks to extract features, then flatten and finish with dense layers to classify.</p>
          <pre><code>class SmallCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1), nn.ReLU(),
            nn.MaxPool2d(2),                       # 32×32 -> 16×16
            nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(),
            nn.MaxPool2d(2),                       # 16×16 -> 8×8
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 8 * 8, 128), nn.ReLU(),
            nn.Linear(128, 10),                    # 10 classes
        )

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)</code></pre>
          <p>Note the flow: convolutions do the <em>seeing</em>, then a dense head does the <em>deciding</em>. The <code>64 * 8 * 8</code> is exactly the shape coming out of the feature extractor — reasoning about shapes, as promised.</p>` },
        { t: 'quiz',
          q: 'For a 32×32 input, why is the Linear layer\'s input size 64 * 8 * 8?',
          opts: [
            'It\'s an arbitrary number that happens to work',
            'Two 2× max-pools shrink 32→16→8, and the last conv outputs 64 channels, so the flattened feature volume is 64 channels × 8 × 8',
            'Because there are 10 classes',
          ],
          a: 1,
          why: 'Track the shape: start 32×32; each MaxPool2d(2) halves it (32→16→8); the final conv produced 64 channels. Flattening 64×8×8 gives 4,096 features into the dense head. Miscount this and PyTorch throws a shape-mismatch error — the #1 CNN debugging ritual.' },
        { t: 'text', title: 'Training is the same loop', md: `
          <p>The reassuring part: training a CNN uses the <em>exact same loop</em> you already know. Nothing about convolutions changes the recipe:</p>
          <pre><code>model = SmallCNN()
loss_fn = nn.CrossEntropyLoss()
opt = torch.optim.Adam(model.parameters(), lr=1e-3)

for images, labels in train_loader:
    opt.zero_grad()
    preds = model(images)          # forward
    loss = loss_fn(preds, labels)  # score
    loss.backward()                # gradients (autograd)
    opt.step()                     # update weights</code></pre>
          <p>Predict → score → backprop → step. The convolutional layers just have their own learnable weights (the filters), and autograd computes their gradients automatically like everything else.</p>` },
        { t: 'quiz',
          q: 'What\'s different about the training loop for a CNN versus the dense MNIST net you built earlier?',
          opts: [
            'You need a special convolution optimizer',
            'Essentially nothing — same forward/loss/backward/step loop; the conv filters are just more learnable parameters autograd handles',
            'CNNs don\'t use backpropagation',
          ],
          a: 1,
          why: 'That\'s the elegance of the framework: define any architecture out of nn layers and the training loop is identical. Filters are learnable parameters like any weight, so autograd + your optimizer handle them with zero special treatment.' },
      ],
    },
    {
      id: 'transfer-learning',
      title: 'Transfer learning',
      minutes: 10,
      steps: [
        { t: 'text', title: 'Don\'t start from scratch', md: `
          <p>Training a strong vision model from random weights needs millions of labeled images and serious compute. You rarely have either. <strong>Transfer learning</strong> is the shortcut that makes CNNs practical for everyone.</p>
          <p>The idea: take a model already trained on a giant dataset (like ImageNet, 1.2 million images across 1,000 categories), and reuse it. Its early and middle layers have already learned excellent, general-purpose features — edges, textures, shapes — that are useful for <em>almost any</em> vision task, not just the one it was trained on.</p>` },
        { t: 'quiz',
          q: 'Why can a model trained on ImageNet help with a completely different task, like classifying medical images?',
          opts: [
            'ImageNet contains medical images',
            'Its learned low- and mid-level features (edges, textures, shapes) are general and transfer to most vision tasks, giving a strong starting point',
            'All images are secretly identical',
          ],
          a: 1,
          why: 'The generic visual features a CNN learns early — edge and texture detectors — aren\'t specific to cats or cars; they\'re useful building blocks for nearly any image task. Reusing them means you\'re not relearning "how to see" from zero, just adapting to your specific labels.' },
        { t: 'text', title: 'Freeze, replace, fine-tune', md: `
          <p>In practice, transfer learning looks like this:</p>
          <ol>
            <li>Load a <strong>pretrained</strong> model.</li>
            <li><strong>Freeze</strong> most of its layers (stop their weights from updating — keep the learned features).</li>
            <li><strong>Replace the final classification head</strong> with a fresh one sized for your classes.</li>
            <li>Train — mostly just the new head — on your (often small) dataset.</li>
          </ol>
          <pre><code>from torchvision import models

model = models.resnet18(weights='DEFAULT')
for p in model.parameters():
    p.requires_grad = False           # freeze the body

model.fc = nn.Linear(model.fc.in_features, 3)  # new head: 3 classes</code></pre>
          <p>Setting <code>requires_grad = False</code> tells autograd to skip those weights — so only your new <code>fc</code> head learns. You can get strong results with a few hundred images and minutes of training.</p>` },
        { t: 'quiz',
          q: 'Why do we set requires_grad = False on the pretrained layers before training?',
          opts: [
            'To delete those layers',
            'To freeze them — autograd won\'t compute gradients for them, so their useful learned features are preserved while only the new head trains',
            'To make training slower on purpose',
          ],
          a: 1,
          why: 'requires_grad = False freezes a parameter: no gradient, no update. That protects the valuable pretrained features and focuses learning on the small new head — faster training, far less data needed, and much less overfitting risk.' },
        { t: 'quiz',
          q: 'You have only 300 labeled images for your task. Best approach?',
          opts: [
            'Train a large CNN from random weights',
            'Use transfer learning — start from a pretrained model and adapt it, since 300 images is far too few to learn good features from scratch',
            'Give up; deep learning is impossible here',
          ],
          a: 1,
          why: '300 images can\'t teach a network to see from zero — it would overfit instantly. But it\'s plenty to fine-tune a head on top of features a pretrained model already learned from millions of images. Transfer learning is exactly the tool for small-data vision problems.' },
        { t: 'text', title: '🎓 You taught a network to see', md: `
          <p>You\'ve leveled up from dense nets to real computer vision:</p>
          <ul>
            <li><strong>Why dense fails</strong> — parameter explosion and lost spatial structure</li>
            <li><strong>Convolutions</strong> — small shared filters that detect features anywhere</li>
            <li><strong>CNNs</strong> — stacked convs build an edges→objects hierarchy, all learned</li>
            <li><strong>Building one</strong> — <code>nn.Conv2d</code>, pooling, and the same old training loop</li>
            <li><strong>Transfer learning</strong> — stand on a pretrained model to win with little data</li>
          </ul>
          <p>You now hold a full arc: from what "learning" means, through neural nets, LLMs, using and generating with them, their safety, and building vision models in PyTorch. Go make something. 🚀</p>` },
      ],
    },
  ],
});

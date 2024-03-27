window.setupAnimation = function(p, containerId) {
  let canvasWidth = 310;
  let canvasHeight = 232.5;
  let bgColor = '#FFF';
  let textColor = '#000';
  let newBgColor = '#000';
  let newTextColor = '#FFF';
  let maxWaveSize;
  let changing = false;
  let waveCenterX, waveCenterY;
  let startFrame;

  p.setup = function() {
    let canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent(containerId);
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont('Poppins');
    p.textSize(20);
    maxWaveSize = p.dist(0, 0, p.width, p.height);
  };

  p.draw = function() {
    if (changing) {
      p.background(bgColor);
      p.fill(newBgColor);
      p.noStroke();

      let progress = (p.frameCount - startFrame) / 60;
      progress = easeInOutCubic(progress);
      let currentWaveSize = progress * maxWaveSize;

      p.ellipse(waveCenterX, waveCenterY, currentWaveSize * 2, currentWaveSize * 2);

      p.fill(textColor);
      p.text('Click Me', p.width / 2, p.height / 2);

      if (currentWaveSize >= maxWaveSize) {
        changing = false;
        [bgColor, newBgColor, textColor, newTextColor] = [newBgColor, bgColor, newTextColor, textColor];
      }
    } else {
      p.background(bgColor);
      p.fill(textColor);
      p.text('Click Me', p.width / 2, p.height / 2);
    }
  };

  p.mouseClicked = function() {
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
      changing = true;
      waveCenterX = p.mouseX;
      waveCenterY = p.mouseY;
      startFrame = p.frameCount;
    }
  };

  p.touchStarted = function() {
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
      changing = true;
      waveCenterX = p.mouseX;
      waveCenterY = p.mouseY;
      startFrame = p.frameCount;
      return false;
    }
  };

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - p.pow(-2 * t + 2, 3) / 2;
  }
};

window.setupAnimation = function (p, containerId) {
  let angle = p.HALF_PI;
  let speed = 0.05;
  const totalFrames = 120;
  const numCircles = 5;
  const angleGap = 0.2;
  const opacities = [255, 255 * 0.85, 255 * 0.70, 255 * 0.55, 255 * 0.40];

  p.setup = function () {
    let canvas = p.createCanvas(310, 232.5);
    canvas.parent(containerId);
  };

  p.draw = function () {
    p.background('#FFF4EC');

    for (let i = 0; i < numCircles; i++) {
      let currentAngle = angle - i * angleGap;
      let easedAngle = easeInOut((currentAngle - p.HALF_PI) % p.TWO_PI / p.TWO_PI) * p.TWO_PI + p.HALF_PI;

      let x = p.width / 2 + p.cos(easedAngle) * 70;
      let y = p.height / 2 + p.sin(easedAngle) * 70;
      p.noStroke();
      let c = p.color('#1B99D6');
      c.setAlpha(opacities[i]);
      p.fill(c);
      p.ellipse(x, y, 30, 30);
    }

    angle += speed;
  };

  function easeInOut(t) {
    return -0.5 * (p.cos(p.PI * t) - 1);
  }
};

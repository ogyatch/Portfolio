window.setupAnimation = function(p, containerId) {

  let angle = 0;
  let gfx;

  p.setup = function() {
      let canvas = p.createCanvas(310, 232.5, p.WEBGL);
      canvas.parent(containerId);
      gfx = p.createGraphics(310, 232.5);
      gfx.textAlign(p.CENTER, p.CENTER);
      gfx.textFont('Poppins');
      gfx.textSize(32);
      p.noStroke();
  };

  p.draw = function() {
      p.background('#FFF');
      gfx.clear();
      gfx.fill('#000');
      gfx.noStroke();
      gfx.text('INTERACTION', gfx.width / 2, gfx.height / 2);

      p.translate(0, 0, 0);
      p.rotateY(angle);

      p.texture(gfx);
      p.plane(310, 232.5);

      angle += 0.01;  };
};

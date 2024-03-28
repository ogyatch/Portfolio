window.setupAnimation = function(p, containerId) {
  const numLines = 6;
  const lineSpacing = 24;
  const vibrationWidth = 120; // 振動幅を広げる（左右60px）
  const vibrationHeight = 60; // 振動の高さ
  const vibrationDuration = 6000; // 振動の継続時間（ミリ秒）
  let lines = [];

  class Line {
    constructor(y) {
      this.y = y;
      this.vibrationStart = 0;
      this.vibrationEnd = 0;
      this.vibrationCenter = 0;
      this.direction = 0;
    }

    startVibration(x, direction) {
      this.vibrationStart = p.millis();
      this.vibrationEnd = this.vibrationStart + vibrationDuration;
      this.vibrationCenter = x;
      this.direction = direction;
    }

    getCurrentVibration(x) {
      if (p.millis() > this.vibrationEnd) {
        return 0;
      }
      let distance = Math.abs(x - this.vibrationCenter);
      let progress = (p.millis() - this.vibrationStart) / vibrationDuration;
      let gaussianFactor = Math.exp(-Math.pow(distance / (vibrationWidth / 2), 2));
      let amplitude = vibrationHeight * (1 - progress) * Math.sin(progress * Math.PI * 3) * gaussianFactor * this.direction; // 1.5往復するように調整
      return amplitude;
    }

    draw() {
      for (let x = 0; x < p.width; x++) {
        let y = this.y + this.getCurrentVibration(x);
        p.point(x, y);
      }
    }
  }

  p.setup = function() {
    let canvas = p.createCanvas(310, 232.5);
    canvas.parent(containerId);
    p.frameRate(30);

    let totalHeight = (numLines - 1) * lineSpacing;
    let startY = (p.height - totalHeight) / 2;
    for (let i = 0; i < numLines; i++) {
      lines.push(new Line(startY + i * lineSpacing));
    }
  };

  p.draw = function() {
    p.background('#FFF');
    p.strokeWeight(1);
    p.stroke('#000');

    for (let i = 0; i < lines.length; i++) {
      lines[i].draw();
    }
  };

  p.mouseMoved = function() {
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (p.mouseY > line.y - 5 && p.mouseY < line.y + 5) {
        let direction = p.pmouseY < p.mouseY ? 1 : -1; // マウスの移動方向に応じて振動の方向を設定
        line.startVibration(p.mouseX, direction);
      }
    }
  };
};

window.setupAnimation = function (p, containerId) {
  const numLines = 6;
  const lineSpacing = 24;
  const vibrationWidth = 120;
  const vibrationHeight = 60;
  const vibrationDuration = 6000;
  let lines = [];

  class Line {
    constructor(y) {
      this.y = y; // 水平線のY座標
      this.vibrationStart = 0; // 振動開始時間
      this.vibrationEnd = 0; // 振動終了時間
      this.vibrationCenter = 0; // 振動中心のX座標
      this.direction = 0; // 振動の方向
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
      let amplitude = vibrationHeight * (1 - progress) * Math.sin(progress * Math.PI * 3) * gaussianFactor * this.direction;
      return amplitude;
    }

    draw() {
      for (let x = 0; x < p.width; x++) {
        let y = this.y + this.getCurrentVibration(x);
        p.point(x, y);
      }
    }
  }

  p.setup = function () {
    let canvas = p.createCanvas(310, 232.5);
    canvas.parent(containerId);
    p.frameRate(30);

    let totalHeight = (numLines - 1) * lineSpacing;
    let startY = (p.height - totalHeight) / 2;
    for (let i = 0; i < numLines; i++) {
      lines.push(new Line(startY + i * lineSpacing));
    }
  };

  p.draw = function () {
    p.background('#FFF');
    p.strokeWeight(1);
    p.stroke('#000');

    for (let i = 0; i < lines.length; i++) {
      lines[i].draw();
    }
  };

  function handleMovement(x, y) {
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (y > line.y - 5 && y < line.y + 5) {
        let direction = p.pmouseY < p.mouseY ? 1 : -1;
        line.startVibration(x, direction);
      }
    }
  }

  p.mouseMoved = function () {
    handleMovement(p.mouseX, p.mouseY);
  };

  // タッチがアニメーションのキャンバス領域内かどうかを判定する関数
  function isInAnimationArea(x, y) {
    // キャンバスの座標とサイズに基づいて判定
    // 例: if (x > canvasX && x < canvasX + canvasWidth && y > canvasY && y < canvasY + canvasHeight)
    // canvasX, canvasY, canvasWidth, canvasHeightを適切に設定
    return x > 0 && x < 310 && y > 0 && y < 232.5; // ここはサンプルです。実際の座標に合わせて調整してください。
  }

  p.touchMoved = function () {
    let touch = p.touches[p.touches.length - 1];
    handleMovement(touch.x, touch.y);

    if (isInAnimationArea(touch.x, touch.y)) {
      return false;
    }
  };
};

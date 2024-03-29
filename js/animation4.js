window.setupAnimation = function(p, containerId) {
  let circles = [];
  const numCircles = 300;
  const circleSize = 10;
  const repelDistance = 50;
  const returnSpeed = 0.05;

  p.setup = function() {
    let canvas = p.createCanvas(310, 232.5);
    canvas.parent(containerId);
    p.noStroke();

    // 300個の黒い丸を初期化
    for (let i = 0; i < numCircles; i++) {
      circles.push({
        x: p.random(circleSize, p.width - circleSize),
        y: p.random(circleSize, p.height - circleSize),
        initialX: 0,
        initialY: 0,
        vx: 0,
        vy: 0
      });
    }

    // 初期位置を記録
    for (let circle of circles) {
      circle.initialX = circle.x;
      circle.initialY = circle.y;
    }
  };

  p.draw = function() {
    p.background('#FFF');

    // 黒い丸を描画
    p.fill('#000');
    for (let circle of circles) {
      p.ellipse(circle.x, circle.y, circleSize, circleSize);
    }

    // マウスカーソル付近の丸を反発させる
    for (let circle of circles) {
      let dx = circle.x - p.mouseX;
      let dy = circle.y - p.mouseY;
      let distance = p.sqrt(dx * dx + dy * dy);

      if (distance < repelDistance) {
        let angle = p.atan2(dy, dx);
        let force = (repelDistance - distance) / repelDistance;
        circle.vx += p.cos(angle) * force;
        circle.vy += p.sin(angle) * force;
      }

      // 速度を更新
      circle.x += circle.vx;
      circle.y += circle.vy;

      // 速度を徐々に減衰させる
      circle.vx *= 0.95;
      circle.vy *= 0.95;

      // 初期位置に向かって移動する
      circle.x += (circle.initialX - circle.x) * returnSpeed;
      circle.y += (circle.initialY - circle.y) * returnSpeed;
    }
  };

  // タッチがアニメーションのキャンバス領域内かどうかを判定する関数
  function isInAnimationArea(x, y) {
    return x > 0 && x < 310 && y > 0 && y < 232.5; // ここはサンプル座標。実際の座標に合わせて調整してください。
  }

  p.touchMoved = function() {
    let touch = p.touches[p.touches.length - 1];

    if (isInAnimationArea(touch.x, touch.y)) {
      // キャンバス領域内でのタッチ操作
      // （ここにタッチに関連する処理を記述する）

      return false; // キャンバス領域内ではデフォルトのタッチ動作を阻止
    }
    // キャンバス領域外では通常のブラウザのタッチ動作を許可
  };
};

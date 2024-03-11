window.setupAnimation = function (p, containerId) {
  let angle = p.HALF_PI; // 初期角度を90度（ラジアン）に設定
  let speed = 0.05; // 角度の増加速度を設定
  const totalFrames = 120; // イージングのための合計フレーム数
  const numCircles = 5; // 周回する円の数
  const angleGap = 0.2; // 各円の角度の間隔
  const opacities = [255, 255 * 0.85, 255 * 0.70, 255 * 0.55, 255 * 0.40]; // 各円の不透明度

  p.setup = function () {
    let canvas = p.createCanvas(310, 232.5); // キャンバスのサイズを設定
    canvas.parent(containerId);
  };

  p.draw = function () {
    p.background('#FFF4EC'); // 背景色を設定

    for (let i = 0; i < numCircles; i++) {
      let currentAngle = angle - i * angleGap;
      let easedAngle = easeInOut((currentAngle - p.HALF_PI) % p.TWO_PI / p.TWO_PI) * p.TWO_PI + p.HALF_PI;

      let x = p.width / 2 + p.cos(easedAngle) * 80; // X座標
      let y = p.height / 2 + p.sin(easedAngle) * 80; // Y座標
      p.noStroke();
      // 色 '#1B99D6' をRGBA形式に変換し、透明度を適用
      let c = p.color('#1B99D6');
      c.setAlpha(opacities[i]);
      p.fill(c);
      p.ellipse(x, y, 30, 30); // 円を描画
    }

    angle += speed; // 角度を増加させる
  };

  function easeInOut(t) {
    return -0.5 * (p.cos(p.PI * t) - 1); // イージング関数
  }
};


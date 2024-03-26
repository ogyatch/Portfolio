window.setupAnimation = function(p, containerId) {
  if (containerId !== 'animation3') return; // animation3用のスクリプトのみ実行

  let angle = 0; // 回転角度を管理する変数
  let gfx;       // 2Dグラフィックス用変数

  p.setup = function() {
      let canvas = p.createCanvas(310, 232.5, p.WEBGL);
      canvas.parent(containerId); // 正しいコンテナIDに挿入
      gfx = p.createGraphics(310, 232.5); // 2Dグラフィックスの設定
      gfx.textAlign(p.CENTER, p.CENTER);
      gfx.textFont('Poppins');
      gfx.textSize(32); // フォントサイズを32に設定
      p.noStroke();     // 3Dオブジェクトの枠線を無効にする
  };

  p.draw = function() {
      p.background('#FFF');
      gfx.clear();            // グラフィックスバッファを透明にクリア
      gfx.fill('#000');       // テキストの色を黒に設定
      gfx.noStroke();         // グラフィックスバッファの枠線を無効にする
      gfx.text('INTERACTION', gfx.width / 2, gfx.height / 2); // グラフィックス上にテキストを中央に描画

      p.translate(0, 0, 0);   // テキストをキャンバスの中心に配置
      p.rotateY(angle);       // Y軸を中心に回転

      p.texture(gfx);         // 3Dオブジェクトに2Dグラフィックスをテクスチャとして適用
      p.plane(310, 232.5);    // 平面にテクスチャを表示

      angle += 0.01;          // 角度を少しずつ増加
  };
};

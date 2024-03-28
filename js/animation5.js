window.setupAnimation = function(p, containerId) {
  const numLines = 6;
  const lineSpacing = 24;

  p.setup = function() {
    let canvas = p.createCanvas(310, 232.5);
    canvas.parent(containerId);
  };

  p.draw = function() {
    p.background('#FFF');
    p.strokeWeight(1);
    p.stroke('#000');

    // 6本の黒い水平線を等間隔で配置し、全体をキャンバスの上下中央に配置
    let totalHeight = (numLines - 1) * lineSpacing;
    let startY = (p.height - totalHeight) / 2;

    for (let i = 0; i < numLines; i++) {
      let y = startY + i * lineSpacing;
      p.line(0, y, p.width, y);
    }
  };
};
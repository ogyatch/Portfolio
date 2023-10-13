// マイクへのアクセス許可を取得
document.getElementById('start').addEventListener('click', function() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
  });
  
  function handleSuccess(stream) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
  
    // ノードを接続
    source.connect(analyser);
    analyser.connect(audioContext.destination);
  
    // Canvasの設定
    const canvas = document.getElementById("canvas");
    const canvasContext = canvas.getContext("2d");
  
    // FFTの設定
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
  
    // レンダリング関数
    function render() {
      requestAnimationFrame(render);
  
      // データを取得
      analyser.getByteFrequencyData(dataArray);
  
      // Canvasをクリア
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  
      // データを描画
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        canvasContext.fillStyle = 'rgb(50,50,200)';
        canvasContext.fillRect(i * 3, canvas.height - barHeight, 2, barHeight);
      }
    }
  
    render();
  }
  
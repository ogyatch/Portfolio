let recognition;
let audioContext;
let stream;
let allWords = [];

// マイクへのアクセス許可を取得
document.getElementById('start').addEventListener('click', function () {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.continuous = true;

    // 音声認識が結果を生成したとき
    recognition.addEventListener('result', function(event) {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim();
          const newWords = transcript.split(' ');
          allWords.push(...newWords);
          
          // 単語の出現回数を数える
          const wordCounts = {};
          for (const word of allWords) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          }
    
          // 2回以上出現した単語にマーカー（黄色の背景）を付ける
          const highlightedTranscript = allWords.map(word => {
            return wordCounts[word] >= 2 ? `<span class="highlight">${word}</span>` : word;
          }).join(' ');
    
          document.getElementById('transcript').innerHTML = highlightedTranscript;
        }
      }
    });

    recognition.start();
  } else {
    console.error('このブラウザはWeb Speech APIをサポートしていません。');
  }

  if (!stream) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(handleSuccess)
      .catch(handleError);
  } else {
    handleSuccess(stream);
  }
});

// マイクの機能をオフにする
document.getElementById('stop').addEventListener('click', function () {
  if (recognition) {
    recognition.stop();
  }

  if (audioContext) {
    audioContext.close().then(() => {
      audioContext = null;
    });
  }

  if (stream) {
    let tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    stream = null;
  }
});

// エラーハンドリング
function handleError(error) {
  console.error('エラーが発生しました: ', error);
  if (recognition) {
    recognition.stop();
  }
}

// 音声ストリームを処理する関数
function handleSuccess(s) {
  stream = s;
  audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  // Canvasの設定
  const canvas = document.getElementById("canvas");
  const canvasContext = canvas.getContext("2d");

  // FFTの設定
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function render() {
    requestAnimationFrame(render);
    analyser.getByteFrequencyData(dataArray);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];
      canvasContext.fillStyle = 'rgb(50,50,200)';
      canvasContext.fillRect(i * 3, canvas.height - barHeight, 2, barHeight);
    }
  }
  render();
}

// グラデーションの向き（degree）の初期値
let degree = 0;

// グラデーションの向きを変える関数
function updateBackground() {
  // グラデーションの向きを1度ずつ増加させる
  degree = (degree + 1) % 360;

  // 新しいグラデーションスタイルを計算
  const newGradient = `linear-gradient(${degree}deg, #12c2e9, #c471ed, #f64f59)`;

  // 背景スタイルを更新
  document.body.style.background = newGradient;
}

// 100ミリ秒ごとにグラデーションを更新
setInterval(updateBackground, 100);
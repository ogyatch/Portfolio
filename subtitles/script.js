let recognition;
let audioContext;
let stream;
let allWords = [];
let wordCounts = {};
let tokenizer;

let finalTranscript = ''; // グローバルスコープで定義

// Kuromojiの初期化
kuromoji.builder({ dicPath: 'dict' }).build((err, newTokenizer) => {
  if (err) {
    console.error('Kuromojiの初期化に失敗:', err);
    return;
  }
  tokenizer = newTokenizer;

  // マイクへのアクセス許可を取得
  document.getElementById('start').addEventListener('click', function () {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      recognition = new webkitSpeechRecognition() || new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.interimResults = true;
      recognition.continuous = true;

    recognition.addEventListener('result', function (event) {

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim();
          const tokens = tokenizer.tokenize(transcript);

          // 名詞だけを抽出
          const nouns = tokens.filter(token => token.pos === '名詞').map(token => token.surface_form);
          allWords.push(...nouns);  // allWordsに新しく認識された名詞を追加

          for (const word of nouns) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          }

          // 頻出する名詞にマーカー（黄色の背景）を付ける
          const highlightedTranscript = nouns.map(word => {
            return wordCounts[word] >= 2 ? `<span class="highlight">${word}</span>` : word;
          }).join(' ');

          finalTranscript += ' ' + highlightedTranscript; // 既存のテキストに新しいテキストを追加
        }
      }

      document.getElementById('transcript').innerHTML = finalTranscript.trim();  // 更新
      // displayFrequentWords(wordCounts);  // この関数が何をするのか不明なので、そのままにしています
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
});

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

function handleError(error) {
  console.error('エラーが発生しました: ', error);
  if (recognition) {
    recognition.stop();
  }
}

function handleSuccess(s) {
  stream = s;
  audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  const canvas = document.getElementById("canvas");
  const canvasContext = canvas.getContext("2d");

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

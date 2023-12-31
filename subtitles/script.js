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

      const exclusionList = ['あの', 'その', 'これ', 'うん', 'こちら', 'どれ'];  // 除外したい単語のリスト

      recognition.addEventListener('result', function (event) {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript.trim();
            const tokens = tokenizer.tokenize(transcript);

            // 名詞だけを抽出して頻度をカウント
            const nouns = tokens.filter(token => token.pos === '名詞').map(token => token.surface_form);
            allWords.push(...nouns);

            for (const word of nouns) {
              wordCounts[word] = (wordCounts[word] || 0) + 1;
            }

            // 名詞が2回以上出現した場合、かつ、除外リストにない場合にハイライト
            const highlightedTranscript = tokens.map(token => {
              if (token.pos === '名詞' && wordCounts[token.surface_form] >= 2 && !exclusionList.includes(token.surface_form)) {
                return `<span class="highlight">${token.surface_form}</span>`;
              } else {
                return token.surface_form;
              }
            }).join(' ');

            // HTMLに発話内容を表示
            document.getElementById('transcript').innerHTML += highlightedTranscript + '<br>';
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

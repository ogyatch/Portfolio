let recognition;
let audioContext;
let stream;
let allWords = [];
let wordCounts = {};  // グローバルスコープで宣言

// 頻出する単語を右端に表示する関数
function displayFrequentWords() {
  const sortedWords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);
  const frequentWordsHtml = sortedWords.map(word => `<div>${word} (${wordCounts[word]})</div>`).join('');
  document.getElementById('frequentWords').innerHTML = frequentWordsHtml;
}

document.getElementById('start').addEventListener('click', function () {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.addEventListener('result', function (event) {
      let currentWords = [];  // この認識セッションでの単語を格納する

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim();
          const newWords = transcript.split(' ');
          currentWords.push(...newWords);
        }
      }

      // 既存の単語リストに新しい単語を追加
      allWords.push(...currentWords);

      // 単語の出現回数を数える
      for (const word of currentWords) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }

      const highlightedTranscript = allWords.map(word => {
        return wordCounts[word] >= 2 ? `<span class="highlight">${word}</span>` : word;
      }).join(' ');

      document.getElementById('transcript').innerHTML = highlightedTranscript;
      displayFrequentWords();
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

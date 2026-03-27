class VoiceControlPlugin {
  constructor(options = {}) {
    this.options = {
      onListeningStart: options.onListeningStart || (() => {}),
      onRecordingStart: options.onRecordingStart || (() => {}),
      onRecordingEnd: options.onRecordingEnd || (() => {}),
      onPlaybackStart: options.onPlaybackStart || (() => {}),
      onPlaybackEnd: options.onPlaybackEnd || (() => {}),
      onPlaybackStopped: options.onPlaybackStopped || (() => {}),
      silenceTimeout: options.silenceTimeout || 3000,
      threshold: options.threshold || 30,
      maxRecordTime: options.maxRecordTime || 100000,
      stopCommands: options.stopCommands || ["стоп", "хватит"],
      ...options,
    };

    this.stream = null;
    this.audioContext = null;
    this.analyser = null;
    this.isListening = false;
    this.shouldStopSoundLoop = false;
    this.isRecording = false;
    this.lastSoundTime = 0;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.recordingTimeoutId = null;
    this.playbackAudio = null;
    this.isPlaying = false;

    this.speechRecognition = null;
  }

  async start(retryCount = 3, retryDelay = 1000) {
    let lastError = null;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        console.log(`Попытка ${attempt} из ${retryCount} получить доступ к микрофону...`);

        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        console.log('AudioContext в состоянии', this.audioContext.state)

        if (this.audioContext.state === 'suspended') {

          await this.audioContext.resume();
          console.log('AudioContext в состоянии', this.audioContext.state)
        }

        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;

        const source = this.audioContext.createMediaStreamSource(this.stream);
        source.connect(this.analyser);

        this.isListening = true;
        this.shouldStopSoundLoop = false;
        this.lastSoundTime = Date.now();
        this.options.onListeningStart();
        this.checkSoundLoop();

        console.log('Доступ к микрофону получен успешно');
        return;
      } catch (err) {
        lastError = err;
        console.error(`Попытка ${attempt} не удалась:`, err);

        if (attempt < retryCount) {
          console.log(`Повторная попытка через ${retryDelay}мс...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    console.error('Не удалось получить доступ к микрофону после всех попыток:', lastError);
    throw lastError;
  }

  checkSoundLoop = () => {
    if (!this.isListening || this.isPlaying || this.shouldStopSoundLoop) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    const avg = Math.round(dataArray.reduce((a, b) => a + b, 0) / dataArray.length);
    const isAboveThreshold = avg > this.options.threshold;

    if (isAboveThreshold) {
      this.lastSoundTime = Date.now();
      if (!this.isRecording) {
        this.startRecording();
      }
    } else if (this.isRecording) {
      const silenceDuration = Date.now() - this.lastSoundTime;
      if (silenceDuration >= this.options.silenceTimeout) {
        this.stopRecording();
      }
    }

    requestAnimationFrame(this.checkSoundLoop);
  };

  startRecording() {
    if (this.isRecording) return;

    this.isRecording = true;
    this.audioChunks = [];
    this.lastSoundTime = Date.now();
    this.options.onRecordingStart();

    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.audioChunks, { type: 'audio/webm; codecs=opus' });
      this.isRecording = false;
      this.mediaRecorder = null;
      this.audioChunks = [];

      if (this.recordingTimeoutId) {
        clearTimeout(this.recordingTimeoutId);
        this.recordingTimeoutId = null;
      }

      if (blob.size > 1000) {
        this.options.onRecordingEnd(blob);
      } else {
        console.log('Запись слишком короткая, игнорируем');
      }
    };

    this.mediaRecorder.start();
    this.recordingTimeoutId = setTimeout(() => {
      if (this.mediaRecorder?.state === 'recording') {
        this.stopRecording();
      }
    }, this.options.maxRecordTime);
  }

  stopRecording() {
    if (!this.isRecording || !this.mediaRecorder) return;

    if (this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }

    if (this.recordingTimeoutId) {
      clearTimeout(this.recordingTimeoutId);
      this.recordingTimeoutId = null;
    }
  }

  async playAudio(blob) {
    if (this.isPlaying) this.stopPlayback();

    console.log('AudioContext в состоянии', this.audioContext.state)

    if (this.audioContext.state === 'suspended') {

      await this.audioContext.resume();
      console.log('AudioContext в состоянии', this.audioContext.state)
    }

    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      this.isPlaying = true;
      this.options.onPlaybackStart();
      this.startSpeechRecognition();

      return new Promise((resolve, reject) => {
        source.onended = () => {
          this.isPlaying = false;
          this.handlePlaybackEnd(false);
          resolve();
        };
        source.onerror = (e) => {
          this.isPlaying = false;
          this.handlePlaybackEnd(false);
          reject(e);
        };
        source.start();
      });

    } catch (err) {
      console.error('Не удалось воспроизвести аудио:', err);
      this.handlePlaybackEnd(false);
      throw err;
    }
  }

  startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API не поддерживается');
      return;
    }

    if (this.speechRecognition) {
      try {
        this.speechRecognition.stop();
      } catch (e) {}
    }

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.lang = 'ru-RU';
    this.speechRecognition.continuous = true;
    this.speechRecognition.interimResults = true;

    this.speechRecognition.onresult = (event) => {
      if (!this.isPlaying) return;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript.toLowerCase().trim();

        if (text) {
          console.log(`Распознано (${result.isFinal ? 'финал' : 'промежуточно'}): "${text}"`);

          if (this.checkStopCommand(text)) {
            return;
          }
        }
      }
    };

    this.speechRecognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') {
        return;
      }
      console.error('Ошибка распознавания речи:', event.error);
    };

    this.speechRecognition.onend = () => {
      if (this.isPlaying) {
        try {
          this.speechRecognition.start();
        } catch (e) {}
      }
    };

    try {
      this.speechRecognition.start();
    } catch (e) {
      console.error('Не удалось запустить распознавание речи:', e);
    }
  }

  checkStopCommand(text) {
    if (!text || !this.isPlaying) return;

    const hasStopCommand = this.options.stopCommands.some(cmd =>
        text.includes(cmd.toLowerCase())
    );

    if (hasStopCommand) {
      console.log(`Обнаружена команда остановки: "${text}"`);
      this.stopPlayback();
    }
  }

  stopPlayback() {
    if (!this.isPlaying) return;

    if (this.playbackAudio && !this.playbackAudio.paused) {
      this.playbackAudio.pause();
      this.playbackAudio.currentTime = 0;
    }

    this.handlePlaybackEnd(true);
  }

  handlePlaybackEnd(stoppedByCommand) {
    this.isPlaying = false;

    if (this.playbackAudio) {
      URL.revokeObjectURL(this.playbackAudio.src);
      this.playbackAudio = null;
    }

    if (this.speechRecognition) {
      try {
        this.speechRecognition.stop();
      } catch (e) {}
      this.speechRecognition = null;
    }

    if (stoppedByCommand) {
      this.options.onPlaybackStopped();
    } else {
      this.options.onPlaybackEnd();
    }

    this.isListening = true;
    this.checkSoundLoop();
  }

  stopListening() {
    this.isListening = false;
    this.stopRecording();
    this.shouldStopSoundLoop = true;

    if (this.speechRecognition) {
      try {
        this.speechRecognition.stop();
      } catch (e) {}
      this.speechRecognition = null;
    }
  }

  destroy() {
    this.isListening = false;
    this.stopRecording();
    this.stopPlayback();

    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
    }

    if (this.audioContext) {
      this.audioContext.close();
    }

    if (this.playbackAudio) {
      URL.revokeObjectURL(this.playbackAudio.src);
    }

    if (this.speechRecognition) {
      try {
        this.speechRecognition.stop();
      } catch (e) {}
      this.speechRecognition = null;
    }

    if (this.recordingTimeoutId) {
      clearTimeout(this.recordingTimeoutId);
    }
  }
}

window.VoiceControlPlugin = VoiceControlPlugin;
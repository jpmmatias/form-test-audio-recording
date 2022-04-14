class VoiceRecorder {
	constructor(playerId, recorderId, startId, stopId) {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			console.log('Get user media');
		} else {
			console.log('Get user media não suportado');
		}

		this.mediaRecorder;
		this.stream;
		this.chuncks = [];
		this.isRecording = false;
		this.recorderRef = document.querySelector(recorderId);
		this.playerRef = document.querySelector(playerId);
		this.startRef = document.querySelector(startId);
		this.stopRef = document.querySelector(stopId);

		this.startRef.addEventListener('click', this.startRecording.bind(this));
		this.stopRef.addEventListener('click', this.stopRecording.bind(this));

		this.stopRef.onClick = this.constraints = {
			audio: true,
			video: false,
		};
	}

	handleSucces(stream) {
		this.stream = stream;
		this.stream.oninactive = () => {
			console.log('stream ended');
		};

		this.recorderRef.srcObject = this.stream;
		this.mediaRecorder = new MediaRecorder(this.stream);
		this.mediaRecorder.ondataavailable =
			this.onMediaRecorderDataAvailable.bind(this);
		this.mediaRecorder.onstop = this.onMediaRecorderStop.bind(this);

		this.recorderRef.play();
		this.mediaRecorder.start();
	}

	onMediaRecorderDataAvailable(e) {
		this.chuncks.push(e.data);
	}

	onMediaRecorderStop(e) {
		const blob = new Blob(this.chuncks, { type: 'audio/ogg; codesc=opus' });
		const audioURL = window.URL.createObjectURL(blob);
		this.playerRef.src = audioURL;
		this.chuncks = [];
		this.stream = getAudioTracks().forEach((track) => {
			track.stop;
		});
		this.stream = null;
	}

	startRecording() {
		if (this.isRecording) return;
		this.isRecording = true;
		this.startRef.innerHTML = 'Gravando..';
		this.playerRef.src = '';
		navigator.mediaDevices
			.getUserMedia(this.constraints)
			.then(this.handleSucces.bind(this))
			.catch(this.handleSucces.bind(this));
		this.playerRef.classList.add('d-none');
	}
	stopRecording() {
		if (!this.isRecording) {
			return;
		}

		this.isRecording = false;
		this.startRef.innerHTML = 'Gravar resposta novamente';
		this.recorderRef.pause();
		this.mediaRecorder.stop();
		this.playerRef.classList.remove('d-none');
	}
}

new VoiceRecorder('#player1', '#recorder1', '#start1', '#stop1');
new VoiceRecorder('#player2', '#recorder2', '#start2', '#stop2');
new VoiceRecorder('#player3', '#recorder3', '#start3', '#stop3');
new VoiceRecorder('#player4', '#recorder4', '#start4', '#stop4');

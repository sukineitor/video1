const videoIds = [
    'gs8qfL9PNac',
    'dQw4w9WgXcQ',
    'jNQXAC9IVRw',
    'kJQP7kiw5Fk',
    'JGwWNGJdvx8'
];

let player;
let progressBarInterval;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: 'gs8qfL9PNac',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    const playPauseBtn = document.getElementById("playPauseBtn");
    const muteBtn = document.getElementById("muteBtn");
    const progressBar = document.getElementById("progressBar");
    const volumeBar = document.getElementById("volumeBar");
    const qualitySelect = document.getElementById("qualitySelect");
    const randomVideoBtn = document.getElementById("randomVideoBtn");

    playPauseBtn.addEventListener("click", togglePlayPause);
    muteBtn.addEventListener("click", toggleMute);
    progressBar.addEventListener("input", seekTo);
    volumeBar.addEventListener("input", setVolume);
    qualitySelect.addEventListener("change", setQuality);
    randomVideoBtn.addEventListener("click", playRandomVideo);

    updateProgressBar();
    updateVolumeIcon();
}

function onPlayerStateChange(event) {
    const playPauseBtn = document.getElementById("playPauseBtn");
    if (event.data == YT.PlayerState.PLAYING) {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else if (event.data == YT.PlayerState.PAUSED) {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function togglePlayPause() {
    if (player.getPlayerState() == YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function toggleMute() {
    if (player.isMuted()) {
        player.unMute();
    } else {
        player.mute();
    }
    updateVolumeIcon();
}

function seekTo() {
    const progressBar = document.getElementById("progressBar");
    const seekToTime = player.getDuration() * (progressBar.value / 100);
    player.seekTo(seekToTime, true);
}

function setVolume() {
    const volumeBar = document.getElementById("volumeBar");
    player.setVolume(volumeBar.value);
    updateVolumeIcon();
}

function setQuality() {
    const qualitySelect = document.getElementById("qualitySelect");
    player.setPlaybackQuality(qualitySelect.value);
}

function updateProgressBar() {
    const progressBar = document.getElementById("progressBar");
    progressBarInterval = setInterval(() => {
        if (player && player.getCurrentTime && player.getDuration) {
            const progress = (player.getCurrentTime() / player.getDuration()) * 100;
            progressBar.value = progress;
        }
    }, 1000);
}

function updateVolumeIcon() {
    const volumeIcon = document.getElementById("volumeIcon");
    const volume = player.getVolume();
    if (volume === 0 || player.isMuted()) {
        volumeIcon.className = "fas fa-volume-mute";
    } else if (volume < 50) {
        volumeIcon.className = "fas fa-volume-down";
    } else {
        volumeIcon.className = "fas fa-volume-up";
    }
}

function playRandomVideo() {
    const randomIndex = Math.floor(Math.random() * videoIds.length);
    player.loadVideoById(videoIds[randomIndex]);
}


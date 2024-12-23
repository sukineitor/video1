let player;
let progressBarInterval;

// Single video configuration
const videoConfig = {
    videoId: 'gs8qfL9PNac', // Updated video ID
};

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: videoConfig.videoId,
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'rel': 0,
            'modestbranding': 1,
            'enablejsapi': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    setupEventListeners();
    updateProgressBar();
    updateVolumeIcon();
}

function setupEventListeners() {
    document.getElementById("playPauseBtn").addEventListener("click", togglePlayPause);
    document.getElementById("muteBtn").addEventListener("click", toggleMute);
    document.getElementById("progressBar").addEventListener("input", seekTo);
    document.getElementById("volumeBar").addEventListener("input", setVolume);
    document.getElementById("qualitySelect").addEventListener("change", setQuality);

    // Add keyboard controls
    document.addEventListener("keydown", handleKeyPress);
}

function handleKeyPress(event) {
    switch(event.code) {
        case "Space":
            event.preventDefault();
            togglePlayPause();
            break;
        case "ArrowLeft":
            event.preventDefault();
            seekRelative(-5);
            break;
        case "ArrowRight":
            event.preventDefault();
            seekRelative(5);
            break;
        case "ArrowUp":
            event.preventDefault();
            adjustVolume(5);
            break;
        case "ArrowDown":
            event.preventDefault();
            adjustVolume(-5);
            break;
    }
}

function seekRelative(seconds) {
    const currentTime = player.getCurrentTime();
    player.seekTo(currentTime + seconds, true);
}

function adjustVolume(amount) {
    const volumeBar = document.getElementById("volumeBar");
    const newVolume = Math.max(0, Math.min(100, parseInt(volumeBar.value) + amount));
    volumeBar.value = newVolume;
    setVolume();
}

function onPlayerStateChange(event) {
    updatePlayPauseButton(event.data);
    updateTimeDisplay();
}

function updatePlayPauseButton(playerState) {
    const playPauseBtn = document.getElementById("playPauseBtn");
    const icon = playerState == YT.PlayerState.PLAYING ? 
        '<i class="fas fa-pause"></i>' : 
        '<i class="fas fa-play"></i>';
    playPauseBtn.innerHTML = icon;
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

function updateVolumeIcon() {
    const volumeIcon = document.getElementById("volumeIcon");
    const volume = player.getVolume();
    let iconClass = "fas fa-volume-up";
    
    if (player.isMuted() || volume === 0) {
        iconClass = "fas fa-volume-mute";
    } else if (volume < 50) {
        iconClass = "fas fa-volume-down";
    }
    
    volumeIcon.className = iconClass;
}

function setQuality() {
    const qualitySelect = document.getElementById("qualitySelect");
    player.setPlaybackQuality(qualitySelect.value);
}

function updateProgressBar() {
    clearInterval(progressBarInterval);
    progressBarInterval = setInterval(() => {
        if (player && player.getCurrentTime && player.getDuration) {
            const progress = (player.getCurrentTime() / player.getDuration()) * 100;
            document.getElementById("progressBar").value = progress;
            updateTimeDisplay();
        }
    }, 1000);
}

function updateTimeDisplay() {
    const timeDisplay = document.getElementById("timeDisplay");
    const currentTime = formatTime(player.getCurrentTime());
    const duration = formatTime(player.getDuration());
    timeDisplay.textContent = `${currentTime} / ${duration}`;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    clearInterval(progressBarInterval);
});


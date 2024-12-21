document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("miVideo");
    const playPauseBtn = document.getElementById("playPauseBtn");

    playPauseBtn.addEventListener("click", () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const musicList = document.getElementById("music-list");
  const themeToggle = document.getElementById("theme-toggle");

  // Set default theme to dark
  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "dark");
  }

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    document.body.classList.remove("dark");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Fetch the JSON file with the list of audio files
  fetch("./files.json")
    .then((response) => response.json())
    .then((data) => {
      const audioFiles = data.audioFiles.map((url) =>
        url
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/")
      );

      audioFiles.forEach((fileUrl) => {
        const fileNameWithExtension = decodeURIComponent(
          fileUrl.split("/").pop()
        );
        const displayFileName = fileNameWithExtension.replace(".mp3", ""); // For display, remove ".mp3"
        const downloadFileName = fileNameWithExtension.replace("clips_", ""); // For download, remove "clips_"

        // Rest of your code
        const musicItem = document.createElement("div");
        musicItem.className = "music-item";

        const songTitle = document.createElement("span");
        songTitle.className = "song-title";
        songTitle.textContent = displayFileName; // Use display file name
        songTitle.style.color = "var(--text-color)";

        const audioContainer = document.createElement("div");
        audioContainer.className = "audio-container";

        const audio = document.createElement("audio");
        audio.className = "audio";
        audio.src = fileUrl;
        audio.controls = true; // Enable audio controls for better testing
        audio.addEventListener("timeupdate", () =>
          updateProgress(audio, progressValue, currentTimeDisplay)
        );
        audio.addEventListener("ended", () => resetPlayButton(playPauseButton));
        audio.addEventListener("loadedmetadata", () =>
          updateDuration(audio, durationDisplay, progressBar, songTitle)
        );

        const progressBar = document.createElement("div");
        progressBar.className = "progress";
        progressBar.addEventListener("mousedown", (e) =>
          initDrag(e, audio, progressBar)
        );
        progressBar.addEventListener("click", (e) =>
          seekAudio(e, audio, progressBar)
        );

        const progressValue = document.createElement("div");
        progressValue.className = "progress-value";

        const playPauseButton = document.createElement("button");
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        playPauseButton.className = "play-pause-btn";
        playPauseButton.addEventListener("click", () =>
          togglePlayPause(audio, playPauseButton)
        );
        playPauseButton.style.minWidth = "32px"; // Set a fixed width to prevent shifting

        const currentTimeDisplay = document.createElement("span");
        currentTimeDisplay.className = "time";
        currentTimeDisplay.textContent = "0:00";

        const durationDisplay = document.createElement("span");
        durationDisplay.className = "time";
        durationDisplay.textContent = " / 0:00"; // Default duration display

        progressBar.appendChild(progressValue);
        audioContainer.appendChild(playPauseButton);
        audioContainer.appendChild(progressBar);
        audioContainer.appendChild(currentTimeDisplay);
        audioContainer.appendChild(durationDisplay);

        const downloadBtn = document.createElement("a");
        downloadBtn.className = "download-btn";
        downloadBtn.href = fileUrl;
        downloadBtn.download = downloadFileName; // Set the cleaned download file name
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.style.marginLeft = "10px";

        // Handle click event to dynamically change the download attribute and download the file
        downloadBtn.addEventListener("click", async (event) => {
          event.preventDefault(); // Prevent default download action
          const response = await fetch(fileUrl);
          if (!response.ok) {
            console.error("Failed to fetch the file.");
            return;
          }
          const blob = await response.blob();
          const dataUrl = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = downloadFileName; // Set the cleaned file name
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(dataUrl); // Clean up the object URL
        });

        musicItem.appendChild(songTitle);
        musicItem.appendChild(audioContainer);
        musicItem.appendChild(downloadBtn);
        musicList.appendChild(musicItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching audio files:", error);
    });

  function updateProgress(audio, progressValue, currentTimeDisplay) {
    const percentage = (audio.currentTime / audio.duration) * 100;
    progressValue.style.width = `${percentage}%`;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  function resetPlayButton(playPauseButton) {
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
  }

  function togglePlayPause(audio, playPauseButton) {
    if (audio.paused) {
      audio.play();
      playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      audio.pause();
      playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    }
  }

  function seekAudio(event, audio, progressBar) {
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const width = rect.width;
    const duration = audio.duration;

    audio.currentTime = (offsetX / width) * duration;
    updateProgress(
      audio,
      progressBar.querySelector(".progress-value"),
      progressBar.querySelector(".time")
    );
  }

  let isDragging = false;

  function initDrag(event, audio, progressBar) {
    isDragging = true;
    const onDrag = (e) => seekAudio(e, audio, progressBar);
    const stopDrag = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    };
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  }

  function updateDuration(audio, durationDisplay, progressBar, songTitle) {
    const duration = formatTime(audio.duration);
    durationDisplay.textContent = ` / ${duration}`;

    // Adjust progress bar width based on the title length
    const titleLength = songTitle.textContent.length;
    const maxTitleLength = 30; // Arbitrary length, adjust as needed
    const maxWidth = 100; // Maximum width percentage for progress bar
    const adjustedWidth = Math.max(
      maxWidth - (titleLength / maxTitleLength) * maxWidth,
      30
    ); // Minimum 30% width
    progressBar.style.width = `${adjustedWidth}%`;
  }

  // Theme toggle functionality
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      localStorage.setItem("theme", "light");
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });
});

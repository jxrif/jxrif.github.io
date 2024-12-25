let shownMemes = new Set();

const redditCategories = {
  memes: "r/memes/.json",
  animal_memes: "r/AnimalMemes/.json",
  cartoon_memes: "r/CartoonMemes/.json",
  facebook_memes: "r/FacebookMemes/.json",
  dad_jokes: "r/dadjokes/.json",
  funny: "r/funny/.json",
  wholesome_memes: "r/wholesomememes/.json",
  // Add more categories as needed
};

async function fetchMeme(category) {
  const url = `https://www.reddit.com/${redditCategories[category]}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data.children;
}

async function generateMeme() {
  try {
    // Disable the button for 1500ms
    const generateButton = document.querySelector(".generate-btn");
    generateButton.disabled = true;
    setTimeout(() => {
      generateButton.disabled = false;
    }, 1500);

    const category = document.getElementById("dropdown-menu").value;
    const posts = await fetchMeme(category);
    let randomPost;
    let attempts = 0;

    // Find a random post that hasn't been shown yet and has a valid image
    while (attempts < posts.length) {
      randomPost = posts[Math.floor(Math.random() * posts.length)].data;

      if (
        !shownMemes.has(randomPost.id) &&
        randomPost.url.match(/\.(jpeg|jpg|gif|png)$/)
      ) {
        break;
      }
      attempts++;
    }

    // If all memes have been shown, reset the set
    if (shownMemes.size >= posts.length) {
      shownMemes.clear();
    }

    shownMemes.add(randomPost.id);

    document.getElementById("meme-title").innerText = randomPost.title;
    document.getElementById("meme-img").src = randomPost.url;
    document.getElementById("upvotes").innerText = randomPost.ups;
  } catch (error) {
    console.error("Error generating meme:", error);
  }
}

function createEmojiRain() {
  const emojiCount = 50; // Adjust the number of emojis
  for (let i = 0; i < emojiCount; i++) {
    const emoji = document.createElement("div");
    emoji.classList.add("emoji");
    emoji.style.left = `${Math.random() * 100}vw`;
    emoji.style.animationDelay = `${Math.random() * 5}s`;
    document.documentElement.appendChild(emoji);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.innerHTML = document.body.classList.contains("dark")
      ? '<i class="fas fa-moon"></i>'
      : '<i class="fas fa-sun"></i>';
  });

  createEmojiRain(); // Start the emoji rain effect
});

// Load a meme on page load
window.onload = generateMeme;

document
  .getElementById("dropdown-menu")
  .addEventListener("change", generateMeme);

# Snipclip Audio Player

Snipclip Audio Player is a web-based audio player that allows you to play and manage your audio files directly from your GitHub repository. The player supports theme toggling, progress tracking, and file downloads.

## Features
- **Dynamic File Fetching**: Automatically fetches audio files from a specified JSON file and converts GitHub links to raw file links.
- **Theme Toggle**: Switch between dark and light themes.
- **Audio Controls**: Play, pause, seek, and track progress of audio files.
- **Custom Downloads**: Download audio files with customized filenames.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/jxrif/jxrif.github.io.git
    ```
2. Navigate to the project directory:
    ```bash
    cd jxrif.github.io
    ```

3. Open `index.html` in your preferred web browser.

## Usage
1. Place your audio files in the `clips` directory.
2. Update the `files.json` file with the links to your audio files in the following format:
    ```json
    {
      "audioFiles": [
        "https://github.com/jxrif/jxrif.github.io/blob/main/clips/your-audio-file.mp3"
      ]
    }
    ```

3. Open the web player and enjoy your audio files.

## Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue to improve the Snipclip Audio Player.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Credits
Coded by [jxrif](https://instagram.com/jxrif).

## Contact
For any inquiries, you can reach out to me on [Instagram](https://instagram.com/jxrif).


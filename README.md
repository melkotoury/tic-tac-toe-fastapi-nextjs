# Tic Tac Toe Game

A modern, interactive Tic Tac Toe game built with vanilla HTML, CSS, and JavaScript. Play against an AI opponent with three difficulty levels and enjoy smooth animations and visual effects.

## 🎮 Features

- **Player Choice**: Choose to play as X or O
- **AI Opponent**: Three difficulty levels (Easy, Normal, Hard)
- **Smart AI**: Uses minimax algorithm for hard difficulty
- **Score Tracking**: Persistent scoreboard during game session
- **Visual Effects**:
    - Winning line animations
    - Confetti celebration on wins
    - Smooth hover effects
    - Responsive design
- **Turn Indicators**: Clear display of current player's turn

## 🎯 Difficulty Levels

- **Easy**: AI makes random moves 80% of the time
- **Normal**: AI makes strategic moves 70% of the time
- **Hard**: AI uses minimax algorithm for optimal play

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/melkotoury/tic-tac-toe.git
   ```

2. Navigate to the project directory:
   ```bash
   cd tic-tac-toe
   ```

3. Open `index.html` in your web browser:

   On macOS
   ```bash
   open index.html
   ```
   On Windows
   ```bash
   start index.html
   ```
   On Linux
   ```bash
   xdg-open index.html
   ```


Or simply double-click the `index.html` file in your file explorer.

## 🎲 How to Play

1. **Choose Your Symbol**: Click X or O to select your preferred symbol
2. **Select Difficulty**: Choose Easy, Normal, or Hard difficulty
3. **Make Your Move**: Click on any empty cell to place your symbol
4. **Win Condition**: Get three of your symbols in a row (horizontally, vertically, or diagonally)
5. **Reset**: Click "Reset Game" to start a new round

## 📁 Project Structure

```
tic-tac-toe/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript game logic
├── README.md           # Project documentation
└── .gitignore          # Git ignore file
```


## 🎨 Customization

### Colors
You can easily customize the color scheme by modifying the CSS variables in `styles.css`:
- Game board colors
- Button styles
- Winning animations
- Confetti colors

### Difficulty Tuning
Adjust AI behavior in `script.js`:
- Modify probability values in `getEasyMove()` and `getNormalMove()`
- Customize the minimax algorithm depth for performance

## 🌐 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Responsive Design

The game automatically adapts to different screen sizes:
- **Desktop**: Full-sized 600x600px game board
- **Mobile**: Compact 300x300px game board
- **Tablet**: Optimized layout for touch interaction

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues

- None currently reported

## 📝 Future Enhancements

- [ ] Local storage for persistent high scores
- [ ] Multiplayer mode (two human players)
- [ ] Sound effects
- [ ] Different board sizes (4x4, 5x5)
- [ ] Themes and color customization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎊 Acknowledgments

- Built with vanilla JavaScript for maximum compatibility
- Inspired by classic Tic Tac Toe gameplay
- Uses CSS animations for smooth user experience

## 📧 Contact

Your Name - [melkotoury@gmail.com](mailto:melkotoury@gmail.com)

Project Link: [https://github.com/melkotoury/tic-tac-toe](https://github.com/melkotoury/tic-tac-toe)

---

**Enjoy playing!** 🎮



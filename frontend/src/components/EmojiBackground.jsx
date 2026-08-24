// Scattered food-emoji background — purely decorative, aria-hidden
// Positions are seeded so they're consistent across re-renders (no random on mount)

const EMOJIS = [
  '🛒','🥛','🍎','🥦','🍞','🥩','🥤','🍿','🌽','🧊',
  '🥕','🧄','🍋','🧅','🍌','🍅','🧀','🫙','🥑','🫐',
  '🍇','🥚','🧈','🍊','🥜','🫛','🍓','🥝','🫒','🧆',
];

// Simple deterministic seeded-random (no Math.random — consistent every render)
function seed(n) {
  const x = Math.sin(n + 1) * 43758.5453123;
  return x - Math.floor(x);
}

const ITEMS = Array.from({ length: 36 }, (_, i) => ({
  emoji:  EMOJIS[i % EMOJIS.length],
  top:    seed(i * 3)    * 95,       // % top
  left:   seed(i * 7)    * 95,       // % left
  rotate: seed(i * 11)   * 50 - 25,  // deg −25…+25
  scale:  0.7 + seed(i * 17) * 0.6,  // 0.7x – 1.3x
}));

export default function EmojiBackground() {
  return (
    <div className="emoji-bg" aria-hidden="true" role="presentation">
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="emoji-bg-item"
          style={{
            top:       `${item.top}%`,
            left:      `${item.left}%`,
            transform: `rotate(${item.rotate}deg) scale(${item.scale})`,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}

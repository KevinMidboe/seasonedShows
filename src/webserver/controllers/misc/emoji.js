const emojiBlock = {
  start: 127744,
  end: 128512
};

const randomEmoji = () => {
  const seed = Math.floor(Math.random() * (emojiBlock.end - emojiBlock.start));
  const code = emojiBlock.start + seed;
  const hex = `0x${code.toString(16)}`;
  return String.fromCodePoint(hex);
};

/**
 * Controller: Returns a random emoji ✨
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function emojiController(req, res) {
  res.send({
    success: true,
    emoji: randomEmoji(),
    message: "Happy emoji-ing! 🌝"
  });
}

module.exports = emojiController;

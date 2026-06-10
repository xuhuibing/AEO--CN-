module.exports = {
  content: ['./index.html', './src/aeo-system.html'],
  safelist: [
    { pattern: /^(bg|text|border)-(amber|blue|emerald|purple|red|slate|violet|green|orange|pink|indigo|teal|cyan)-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^(bg|text|border)-(white|black|transparent)$/ },
    { pattern: /^(hover:)?(bg|text|border)-(slate|gray)-(50|100|200|300|400|500|600|700|800)$/ },
  ]
};

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ["prismjs", { "languages": ["javascript", "css", "json", "py", "c", "nginx", "php"], "plugins": ["line-numbers"], "theme": "okaidia", "css": true }]
  ]
}

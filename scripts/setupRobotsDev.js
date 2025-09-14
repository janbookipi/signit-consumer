const fs = require('fs')
const path = require('path')

const robotsContent = `User-agent: *
Disallow: /`

const publicPath = path.join(__dirname, 'public', 'robots.txt')
const publicDirPath = path.join(__dirname, 'public')
if (!fs.existsSync(publicDirPath)) {
  fs.mkdirSync(publicDirPath)
}
fs.writeFileSync(publicPath, robotsContent, 'utf8')
console.log(`robots.txt created at ${publicPath}`)

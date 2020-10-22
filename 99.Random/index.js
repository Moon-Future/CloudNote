/**
 * 随机提问
 * ../3.面试题集锦/99.TODO.md
 */

const fs = require('fs')
const path = require('path')
const file = '../3.面试题集锦/99.TODO.md'
const NUM = 10

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

let fileContent = fs.readFileSync(path.resolve(__dirname, file), 'utf-8')
let fileArr = []
fileContent.split('\n\r').forEach((ele) => {
  ele.trim()
  ele !== '' ? fileArr.push(ele) : false
})

let result = []
for (let i = 0; i < NUM; i++) {
  let index = getRandom(0, fileArr.length - 1)
  let item = fileArr.splice(index, 1)
  result.push(`${i + 1}. ${item[0].trim()}`)
}

result.forEach((ele) => {
  console.log(ele.trim())
})

/*
 * @Author: Libra
 * @Date: 2024-07-24 14:20:01
 * @LastEditors: Libra
 * @Description: 
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 确保目标文件夹存在
const folderPath = './mp3';
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// 读取 test.txt 文件内容
function readWordsFromFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8').split('\n').map(word => word.trim()).filter(word => word.length > 0);
}

// 下载文件并显示进度
function downloadFile(word, type) {
  return new Promise((resolve, reject) => {
    // 要下载的文件 URL
    const fileUrl = `http://dict.youdao.com/dictvoice?type=${type}&audio=${word}`;
  
    // 解析 URL 以获取文件名
    const fileName = `${folderPath}/${word}_${type ? 'en' : 'us'}.mp3`;
  
    // 创建文件写入流
    const file = fs.createWriteStream(fileName);
  
    // 发送 HTTP GET 请求
    http.get(fileUrl, (response) => {
      // 检查响应状态码
      if (response.statusCode !== 200) {
        console.error(`请求失败，状态码：${response.statusCode}`);
        reject(`请求失败，状态码：${response.statusCode}`);
        return;
      }

      // 获取文件大小
      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;

      // 将响应数据写入文件并计算下载进度
      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const progress = ((downloadedSize / totalSize) * 100).toFixed(2);
        process.stdout.write(`\r${fileName} 下载进度: ${progress}%`);
      });

      response.pipe(file);

      // 监听文件写入结束事件
      file.on('finish', () => {
        file.close();
        console.log(`\n${fileName} 文件下载完成`);
        resolve();
      });
    }).on('error', (err) => {
      // 处理请求错误
      fs.unlink(fileName, () => {}); // 删除部分下载的文件
      console.error(`请求错误：${err.message}`);
      reject(err);
    });
  });
}

// 下载单词数组中的音频文件
async function downloadWords(words) {
  const downloadPromises = [];
  
  words.forEach(word => {
    downloadPromises.push(downloadFile(word, 1)); // 英式发音
    downloadPromises.push(downloadFile(word, 0)); // 美式发音
  });

  try {
    await Promise.all(downloadPromises);
    console.log('所有文件下载完成');
  } catch (err) {
    console.error('下载过程中出现错误', err);
  }
}

// 主函数，读取文件并下载音频
async function main() {
  const words = readWordsFromFile('./test.txt'); // 读取 test.txt 中的单词
  await downloadWords(words); // 下载音频文件
}

main();

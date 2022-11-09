// 使用预加载脚本来增强渲染器
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
  // 能暴露的不仅仅是函数，我们还可以暴露变量
})

// All the Node.js APIs are available in the preload process.
// 它拥有与Chrome扩展一样的沙盒
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }
  // 访问 Node.js process.versions 对象，并运行一个基本的 replaceText 辅助函数将版本号插入到 HTML 文档中
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

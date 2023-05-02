// 获取DOM元素
const newFolderBtn = document.getElementById('new-folder');
const folderList = document.getElementById('folder-list');
const newUrlBtn = document.getElementById('new-url');
const urlList = document.getElementById('url-list');

// 创建文件夹
newFolderBtn.addEventListener('click', () => {
  const folderName = prompt('请输入文件夹名称', '新文件夹');
  if (!folderName) return;
  const folder = document.createElement('li');
  folder.innerText = folderName;
  folderList.appendChild(folder);
});

// 添加网址
newUrlBtn.addEventListener('click', () => {
  const folderName = prompt('请选择文件夹', '');
  if (!folderName) return;
  const url = prompt('请输入网址', '');
  if (!url) return;
  const item = document.createElement('li');
  const link = document.createElement('a');
  const btnGroup = document.createElement('div');
  const editBtn = document.createElement('button');
  const removeBtn = document.createElement('button');
  item.classList.add('url-item');
  link.href = url;
  link.innerText = url;
  editBtn.innerText = '修改';
  editBtn.addEventListener('click', () => {
    const newUrl = prompt('请输入新的网址', url);
    if (!newUrl) return;
    link.href = newUrl;
    link.innerText = newUrl;
  });
  removeBtn.innerText = '删除';
  removeBtn.addEventListener('click', () => {
    item.remove();
  });
  btnGroup.classList.add('btn-group');
  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(removeBtn);
  item.appendChild(link);
  item.appendChild(btnGroup);
  urlList.appendChild(item);
});

// hover效果
const urlItems = document.querySelectorAll('.url-item');
urlItems.forEach((item) => {
  const btnGroup = item.querySelector('.btn-group');
  item.addEventListener('mouseenter', () => {
    btnGroup.style.display = 'flex';
  });
  item.addEventListener('mouseleave', () => {
    btnGroup.style.display = 'none';
  });
});

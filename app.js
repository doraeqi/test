// 获取目录树容器的元素
const websitesTreeEl = document.getElementById("websites-tree");

// 获取添加目录或网址的表单的元素
const addItemFormEl = document.getElementById("add-item-form");

// 初始化储存目录树的数组
let websitesTree = [
  {name: '首页', path: "/", children: []}
];

// 从本地存储中加载储存的目录树
if (localStorage.getItem("websitesTree")) {
	websitesTree = JSON.parse(localStorage.getItem("websitesTree"));
}

// 渲染目录树
function renderWebsitesTree(list, ulEl) {
	// 首先清空目录树容器
	ulEl.innerHTML = "";
	
	// 循环遍历目录树，并为每个目录节点和网址节点创建一个列表项添加到目录树中
	list.forEach((node) => {
    const liEl = document.createElement("li");
    
    if (node.url) {
      const aEl = document.createElement("a");
		  aEl.href = node.url;
		  aEl.title = node.url;
      aEl.textContent = node.name;
		  liEl.appendChild(aEl);
    } else {
      const spanEl = document.createElement("span");
      spanEl.textContent = node.name;
      liEl.appendChild(spanEl);
      const ulEl = document.createElement("ul");
      liEl.appendChild(ulEl);
      renderWebsitesTree(node.children, ulEl);
    }
    
		ulEl.appendChild(liEl);
	});
}

// 查找目录树中指定路径的节点
function findNodeByPath(path, list) {
  for (let node of list) {
    if (node.path === path) {
      return node;
    } else if (node.children) {
      const result = findNodeByPath(path, node.children);
      if (result) {
        return result;
      }
    }
  }
}

// 向目录树中添加新的目录节点
function addDirNodeToTree(name, path, list) {
  const node = {
    name: name,
    path: path,
    children: []
  };
  list.push(node);
  localStorage.setItem("websitesTree", JSON.stringify(websitesTree));
  return node;
}

// 向目录树中添加新的网址节点
function addWebsiteNodeToTree(name, url, path, list) {
  const node = {
    name: name,
    url: url,
    path: path
  };
  list.push(node);
  localStorage.setItem("websitesTree", JSON.stringify(websitesTree));
  return node;
}

// 删除目录树中指定路径的节点
function removeNodeFromTree(path, list) {
  for (let i=0;i<list.length;i++) {
    if (list[i].path === path) {
      list.splice(i, 1);
      localStorage.setItem("websitesTree", JSON.stringify(websitesTree));
      return true;
    } else if (list[i].children) {
      const result = removeNodeFromTree(path, list[i].children);
      if (result) {
        return true;
      }
    }
  }
  return false;
}

// 监听添加目录或网址的表单的提交事件
addItemFormEl.addEventListener("submit", (e) => {
	e.preventDefault();
	
	// 获取表单输入的名称、网址、目录路径和网址路径
	const itemName = e.target.querySelector("#dir-name").value || e.target.querySelector("#website-name").value;
  const websiteUrl = e.target.querySelector("#website-url").value;
  const dirPath = e.target.querySelector("#dir-path").value;
	const websitePath = e.target.querySelector("#website-path").value;
	
  if (dirPath === "/") {
    if (itemName !== "") {
      // 添加新目录节点到根节点下
      const newNode = addDirNodeToTree(itemName, dirPath, websitesTree[0].children);
      // 在目录树中插入新目录节点
      const liEl = document.createElement("li");
      const spanEl = document.createElement("span");
      spanEl.textContent = newNode.name;
      liEl.appendChild(spanEl);
      const ulEl = document.createElement("ul");
      liEl.appendChild(ulEl);
      websitesTreeEl.querySelector("ul").appendChild(liEl);
    }
  } else {
    // 查找指定路径的目录节点
    const dirNode = findNodeByPath(dirPath, websitesTree);
  
    if (dirNode) {
      if (websiteUrl === "") {
        if (itemName !== "") {
          // 添加新目录节点到指定目录节点下
          const newNode = addDirNodeToTree(itemName, dirPath + itemName + "/", dirNode.children);
          // 在目录树中插入新目录节点
          const liEl = document.createElement("li");
          const spanEl = document.createElement("span");
          spanEl.textContent = newNode.name;
          liEl.appendChild(spanEl);
          const ulEl = document.createElement("ul");
          liEl.appendChild(ulEl);
          websitesTreeEl.querySelector(`[data-path="${dirNode.path}"]`).querySelector("ul").appendChild(liEl);
        }
      } else {
        // 添加新网址节点到指定目录节点下
        addWebsiteNodeToTree(itemName, websiteUrl, dirPath + itemName + "/", dirNode.children);
        // 在目录树中插入新网址节点
        const liEl = document.createElement("li");
        const aEl = document.createElement("a");
        aEl.href = websiteUrl;
        aEl.title = websiteUrl;
        aEl.textContent = itemName;
        liEl.appendChild(aEl);
        websitesTreeEl.querySelector(`[data-path="${dirNode.path}"]`).querySelector("ul").appendChild(liEl);
      }
    }
  }
	
	// 清空添加目录或网址的表单
	e.target.reset();
});

// 监听目录树中的节点点击事件，用于切换目录和删除节点
websitesTreeEl.addEventListener("click", (e) => {
  e.preventDefault();
  
  const target = e.target;
  
  if (target.tagName.toLowerCase() === "a") {
    const path = target.getAttribute("href").replace(/^\//, "");
    const node = findNodeByPath(path, websitesTree);
    if (node) {
      renderWebsitesTree(node.children, target.parentNode.querySelector("ul"));
    }
  } else if (target.tagName.toLowerCase() === "span") {
    const path = target.getAttribute("data-path");
    const result = removeNodeFromTree(path, websitesTree);
    if (result) {
      target.parentNode.remove();
    }
  }
});

// 当页面加载时，渲染目录树
renderWebsitesTree(websitesTree[0].children, websitesTreeEl.querySelector("ul"));

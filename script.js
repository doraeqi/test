
// 获取网址列表的元素
const websitesListEl = document.getElementById("websites-list");

// 获取网址表单的元素
const addWebsiteFormEl = document.getElementById("add-website-form");

// 初始化储存网址的数组
let websites = [];

// 从本地存储中加载储存的网址
if (localStorage.getItem("websites")) {
	websites = JSON.parse(localStorage.getItem("websites"));
}

// 渲染网址列表
function renderWebsitesList() {
	// 首先清空网址列表
	websitesListEl.innerHTML = "";
	
	// 循环遍历储存的网址，并为每个网址创建一个列表项添加到网址列表中
	websites.forEach((website) => {
		const liEl = document.createElement("li");
		const aEl = document.createElement("a");
		aEl.href = website.url;
		aEl.textContent = website.name;
		liEl.appendChild(aEl);
		websitesListEl.appendChild(liEl);
	});
}

// 监听网址表单的提交事件
addWebsiteFormEl.addEventListener("submit", (e) => {
	e.preventDefault();
	
	// 获取表单输入的网址和名称
	const websiteUrl = e.target.querySelector("#website-url").value;
	const websiteName = e.target.querySelector("#website-name").value;
	
	// 创建新网站对象
	const newWebsite = {
		url: websiteUrl,
		name: websiteName
	};
	
	// 将新网站对象添加到储存网址的数组中，并保存到本地存储中
	websites.push(newWebsite);
	localStorage.setItem("websites", JSON.stringify(websites));
	
	// 渲染更新后的网址列表
	renderWebsitesList();
	
	// 清空网址表单
	e.target.reset();
});

// 当页面加载时，渲染网址列表
renderWebsitesList();

let change = document.getElementById('change');
let text = document.getElementById('new-item-title');
let newItem = document.getElementById('new-item');
let itemList = document.getElementById('item-list');
let default_list = [];
chrome.storage.sync.get({ list: [] }, function (items) {
  if (items.list && items.list.length > 0) {
    list = items.list;
    default_list = list;
    for (let index = 0; index < list.length; index++) {
      let li = document.createElement('li');
      let value = list[index];
      li.innerHTML = value + '<a href=' + value + '>删除</a>';
      itemList.appendChild(li);
    }
  }
});
newItem.onclick = (params) => {
  let li = document.createElement('li');
  let value = text.value;
  li.innerHTML = value + '<a href=' + value + '>删除</a>';
  itemList.appendChild(li);
  chrome.storage.sync.set({ list: [...default_list, value] }, function () {
    default_list = [...default_list, value];
  });
  text.value = '';
};
itemList.onclick = async function (e) {
  e = e || window.event; //这一行及下一行是为兼容IE8及以下版本
  var target = e.target || e.srcElement;
  if (target.tagName.toLowerCase() === 'li') {
    chrome.tabs.query(
      { active: true, lastFocusedWindow: true },
      function (tabs) {
        var url = tabs[0].url;
        url = '/' + url.split('/').slice(3).join('/');
        var value = e.target.innerHTML.split('<a')[0];
        chrome.tabs.update(tabs[0].id, { url: value + url });
      }
    );
  }
  if (target.tagName.toLowerCase() === 'a') {
    let index = default_list.findIndex((item) => item === e.target.href);
    var lis = document.querySelectorAll('li');
    itemList.removeChild(lis[index]);
    default_list.splice(index, 1);
    chrome.storage.sync.set({ list: default_list });
  }
};

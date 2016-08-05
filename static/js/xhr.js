console.log('in file xhr.js');

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {
   // Action to be performed when the document is read;
  }
  console.log('readyState: ' + xhr.readyState);
  console.log('status: ' + xhr.status);
};

xhr.open("GET", "get", true);
xhr.send();

/**
 * 0 －（未初始化）还没有调用send()方法
 * 1 －（载入）已调用send()方法，正在发送请求
 * 2 －（载入完成）send()方法执行完成，已经接收到全部响应内容
 * 3 －（交互）正在解析响应内容
 * 4 －（完成）响应内容解析完成，可以在客户端调用了
 */
/* app for feedback
 */

$(document).ready(function() {
  console.log("Starting feedback App...");
//  startApp();
  init();
  $("#feedbacksubmit").on('click', function(){
    submit();
  });

});

function startApp(){
  try {
    var server = require('feedbackserver');
    var dbus = require('dbus');
    server.startServer();
  }catch (e){
    console.log("Error happened when require node_modules:" + e.stack);
    console.log("Error: Can not load nodewebkit modules, so we can not use the WDC api.");
  }
}

function init(){
  $("input[type='radio']#fb_class1").prop('checked', true);
}
function submit(){
  var title =  $("input[type='radio']:checked").val();
  var content = $("#content").val();
  var name = $("#name").val();
  var email = $("#email").val();
  var phone = $("#phone").val();
  if(!name){
    name = "anonymous";
  }
  if(!email){
    email = "blank";
  }
  if(!phone){
    phone = 0;
  }
  if(!content.length){
    $("#erroContent").css("display", "block");
  }else{
    // console.log("values(" + title + ", " + content + ", " + name + ", " + email + ", " + phone + ")");
    var info = new Object();
    info.title = title;
    info.content = content;
    info.name = name;
    info.email = email;
    info.phone = phone;
    db_insert(submitcb, info);
  }
}
function submitcb(msg){
  // switch(type){
    // case "success":
      $("#successField").css("display", "block");
      $("#fbct").css("display", "none");
  //   break;
  //   case "error":
  //   break;
  // }
}
function goToSubmit(){
  $("#successField").css("display", "none");
  $("#fbct").css("display", "block");
}

function db_insert(cb, infoObj){
  postRequest("db.insert", Array.prototype.slice.call(arguments));
}
function postRequest(api, args) {
  var host = location.origin;
  var cb = args.shift();
  var obj2post = {};
  obj2post.api = api;
  obj2post.args = args;
  $.ajax({
    url : host + "/callapi",
    type : "post",
    contentType : "application/json;charset=utf-8",
    dataType : "json",
    data : JSON.stringify(obj2post),
    success : function(r) {
      setTimeout(cb.apply(null, r), 0);
      //window.alert("success: " + JSON.stringify(r));
    },
    error : function(mXMLHttpRequest, mTextStatus, mErrorThrown) {
      window.alert("error: " + JSON.stringify(mXMLHttpRequest) + "\n"
        + "textStatus: " + mTextStatus + "\n"
        + "errorThrown: " + mErrorThrown);
      console.log(JSON.stringify(mXMLHttpRequest));
    }
  });
  /*
  {
  "readyState":4,
  "responseText":"{\"title\":\"feedback\",\"content\":\"this is the content of feedback.\"}",
  "responseJSON":{"title":"feedback","content":"this is the content of feedback."},
  "status":404,
  "statusText":"Not Found"
  }
  */
};
/**
  0 － （未初始化）还没有调用send()方法
  1 － （载入）已调用send()方法，正在发送请求
  2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
  3 － （交互）正在解析响应内容
  4 － （完成）响应内容解析完成，可以在客户端调用了
*/

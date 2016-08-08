console.log('in file xhr.js');

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  console.log('readyState: ' + xhr.readyState);
  console.log('status: ' + xhr.status);
  if (xhr.readyState == 4 && xhr.status == 200) {
    console.log(this.responseText);
  }
};

xhr.open("GET", "xhr", true);
xhr.send();


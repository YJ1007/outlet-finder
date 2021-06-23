const GetRequest = (url, cb) => {
  var xhttp = new XMLHttpRequest();
  xhttp.withCredentials = true;
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4)
     cb(this);
  };
  xhttp.open("GET", url, true);
  xhttp.send();
  return xhttp;
}

const PostRequest = (url, params, cb) => {
  var xhttp = new XMLHttpRequest();
  xhttp.withCredentials = true;
  var data = JSON.stringify(params);
  xhttp.open("POST", url, true);
  xhttp.onreadystatechange = function(){
    if(this.readyState === 4) cb(this);
  }
  xhttp.send(data);
  return xhttp;
}

module.exports = {
  GetRequest: GetRequest,
  PostRequest: PostRequest,
}

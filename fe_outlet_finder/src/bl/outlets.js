import { net } from "../utils";
import { localhost } from "../hosts";

export const getNearbyOutlets = (data, cb) => {
  let url = localhost + "/outlets/findoutletbycoord";

  net.PostRequest(url, { coords: data }, (resp) => {
    var res = getParsedResponse(resp, "getNearbyOutlets");
    if(res) {
      if(resp.status == 200) {
        var ret = res.responseData[0];
        cb(null, ret);
      }
      else cb(res.responseData);
    }
    else cb("error");
  });
}

const getParsedResponse = (resp, parseInfo = "") => {
  var res;
  if(resp && resp.response) {
    try {
      res = JSON.parse(resp.response);
    }
    catch (e) {
      console.log( parseInfo + " json parse error", e);
    }
  }
  return res;
}

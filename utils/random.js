var user_id_chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var access_token_chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var debug = false;

function generate(src_chars, n) {
    var src_chars = src_chars || access_token_chars;
    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * (src_chars.length - 1));
        res += src_chars[id];
    }
    return res;
}

function getUserId() {
    var src_chars = user_id_chars;
    var user_id = generate(src_chars, 8) + '-'
        + generate(src_chars, 4) + '-'
        + generate(src_chars, 4) + '-'
        + generate(src_chars, 4) + '-'
        + generate(src_chars, 12);
    return user_id;
}

function getAccessToken() {
    var src_chars = access_token_chars;
    return generate(src_chars, 80);
}

function getAppId() {
    var src_chars = user_id_chars;
    var appId =  generate(src_chars, 8) + '-'
        + generate(src_chars, 4) + '-'
        + generate(src_chars, 4) + '-'
        + generate(src_chars, 4) + '-'
        + generate(src_chars, 12);
    return appId;
}

if (debug) {
    console.log(`userId: ${getUserId()}`);
    console.log(`accessToken: ${getAccessToken()}`);
}

module.exports = {
    getUserId: getUserId,
    getAccessToken: getAccessToken,
    getAppId: getAppId
}

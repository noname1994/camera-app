var ACCESS_TOKEN = 'access_token';
var AVATAR_URL = 'avatar_url';
var COOKIE_TTL = 24 * 30; // 1 month

function createCookie(name, value, hours) {
    var expires;
    if (hours) {
        var date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    console.log(document.cookie);
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function removeCookie() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var equals = cookies[i].indexOf("=");
        var name = equals > -1 ? cookies[i].substr(0, equals) : cookies[i];
        eraseCookie(name.trim());
    }
}

function getAuthHeader() {
    var token = readCookie(ACCESS_TOKEN);
    var header = {
        Authorization: 'Token ' + token,   //If your header name has spaces or any other char not appropriate
    }
    return header;
}

function getToken() {
    var token = readCookie(ACCESS_TOKEN);
    return token;
}
function setToken(token) {
    createCookie(ACCESS_TOKEN, token, COOKIE_TTL);
}

function isSignedIn() {
    if (readCookie(ACCESS_TOKEN)) {
        return true;
    } else {
        return false;
    }
}

$(document).ready(function () {
    var index = window.location.pathname.indexOf("/admin/index.html");
    if (index == -1 && !isSignedIn()) {
        $(location).attr('href', '/admin/index.html');
    }
});
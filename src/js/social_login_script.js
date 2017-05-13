/**
 * Created by sp on 25/01/16.
 */

//Predefiend Constants and Lib

var social_login_Domain = 'https://devapi.roder.in/';
var fb_login_url =  social_login_Domain+'v1/login/fb/';
var google_login_url =  social_login_Domain+'v1/login/google/';

var OAUTHURL    =   'https://accounts.google.com/o/oauth2/auth?';
var VALIDURL    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
var SCOPE       =   'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
var CLIENTID    =   '201076544121-r30l7p6bfq327njg3vpaqiiq1l264jru.apps.googleusercontent.com';
var REDIRECT    =   'http://localhost/website_trillbit/login.html';
var LOGOUT      =   'https://accounts.google.com/Logout';
var TYPE        =   'token';
var _url        =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
var acToken;
var tokenType;
var expiresIn;
var user;
var loggedIn    =   false;

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function gup(url, name) {

    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\#&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    if( results == null )
        return "";
    else
        return results[1];
}



//Google Login

function login_google() {
    var win         =   window.open(_url, "windowname1", 'width=800, height=600');
    var pollTimer   =   window.setInterval(function() {
        try {
            if (win.document.URL.indexOf(REDIRECT) != -1) {
                window.clearInterval(pollTimer);
                var url =   win.document.URL;
                acToken =   gup(url, 'access_token');
                win.close();
                getInfo(acToken);
            }
        } catch(e) {
        }
    }, 500);
}

function getInfo(acTokens) {

    $.ajax({
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acTokens,
        data: null,
        success: function(resp) {
            user    =   resp;
            var data = {
                "auth":acTokens,
                "google_id":resp['id']
            };
            console.log(data);
            socialSignup(data);

        },
        dataType: "jsonp"
    });
}

//End of Google Login

//Facebook Login Script

function login_fb() {
    FB.init({
        appId      : '299697360435606',
        cookie     : false,  // enable cookies to allow the server to access
        version    : 'v2.5' // use version 2.2
    });
    FB.login(function(response) {
        if (response.authResponse) {
            var fb_var = {
                "login_type": "facebook",
                "user_id":response.authResponse['userID'],
                "auth":response.authResponse['accessToken']
            };
            socialSignup(fb_var);
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    },{scope: 'email,user_likes'});

}
//End Of Facebook Login
function socialSignup(data){
    console.log("Login Via Facebook test going on");
    $.ajax({
        url: 'http://localhost:8083/v1/login/',
        data: data,
        type: 'POST',
        success: function(resp) {

            console.log(resp);

        },
        async:false
    });
}
// comments to get rid of c9's pissy ace helper
/* global $,io,btoa */
// security code
document.head.removeChild(document.getElementById("remove"));
var socket = io("/",{query:"auth=" + encodeURIComponent(btoa("74a8ba25526f380b68a86a6796062073831979879e29c1a2dc196ad92ade560c"))});
// include other scripts, since this is the entry point
var main = require('./main.js');
// global code
var kin = {
    LEFT : 37,        // <--
    RIGHT : 39,       // -->
    UP : 38,          // ^ 
    DOWN : 40         // v
}
// engine
var engine = {
    player : {
        activeKeys : [],
        tap_keys : [kin.LEFT,kin.RIGHT,kin.UP,kin.DOWN],
        testKeys : function(event){
            if (engine.player.tap_keys.indexOf(event.keyCode) >= 0) {
                engine.player.activeKeys[event.keyCode] = true;
            }
        },
        clearKeys : function(event){
            if (engine.player.tap_keys.indexOf(event.keyCode) >= 0) {
                engine.player.activeKeys[event.keyCode] = false;
            }
        },
        check_keys : function(){
        }
    },
    init : function(){
        document.body.addEventListener("keydown",engine.player.testKeys);
        document.body.addEventListener("keyup",engine.player.clearKeys);
    },
    mainloop : function(){
        engine.player.check_keys();
        // loop
        window.requestAnimationFrame(engine.mainloop);
    }
};
// execute onload
$(document).ready(function(){
    engine.init();
    engine.mainloop();
});
/*
window.setInterval(function(){
    var n = document.createElement("pre");
    n.textContent = engine.player.activeKeys.toString();
    document.getElementById("devlogs").appendChild(n);
    $('#devlogs').scrollTop($('#devlogs').prop("scrollHeight"));
},200);
*/
// webpack code
module.exports = {};
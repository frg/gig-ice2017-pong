var Pong = window.Pong = require('Pong.js'),
    $ = require('jquery')
    _ = require('lodash');

var PongHelpers = require('./pong-helpers.js'),
    UI = require('./ui.js');

window.onload = function() {
    console.info('[window] window.onload triggered');
    console.info('[window] inner - width:', window.innerWidth, 'height:', window.innerHeight);
    console.info('[window] outer - width:', window.outerWidth, 'height:', window.outerHeight);

    // For some reason the update function is getting called too 
    // many times causing lag due to event loop overcrowding.
    // You can replicate this by by calling [pong instance].loop.play() multiple times.
    // If you use [pong instance].showStats() it will highlight the issue.
    // Thus as a quick fix I'm throttling the update function
    var _oldUpdate = Pong.prototype.update;
    Pong.prototype.update = _.throttle(_oldUpdate, 10, { 'trailing': false });

    var pongElement = document.getElementById('pong'),
        _pong = window._pong = new Pong(pongElement, {
            screens: {
                enable: false
            }
        });

    console.info('[pong] renderer - width:', _pong.renderer.width, 'height:', _pong.renderer.width);
    console.info('[pong] renderer - type:', _pong.renderer.type);

    UI.setup(_pong, PongHelpers);

    _pong._defaultPlayerSpeed = function() {
        return (window.innerWidth * window.innerHeight) / 4000;
    };
    _pong._defaultPlayerHeight = function() {
        return 0.15 * window.innerHeight;
    };
    _pong._defaultPlayerWidth = function() {
        return 0.016 * window.innerWidth;
    };
    _pong._defaultBallSpeed = function() {
        return (window.innerWidth * window.innerHeight) / 80000;
    };
    _pong._playerSpeedHandicap = 2;

    // pong.showStats(); // show fps counter
    window.onresize = PongHelpers.setupResizeLogicFunc(_pong);

    _pong.on('point', function(player) {
        if (_pong.currentGameMode === 'SINGLE_PLAYER' && _pong.players.a === player) {
            // if single player and player a made a point, do score logic
            var hs = localStorage.getItem('SINGLE_PLAYER_HIGHSCORE');
            if (hs === null || (hs !== null && player.score > hs)) {
                localStorage.setItem('SINGLE_PLAYER_HIGHSCORE', player.score);
                $('.header-highscore-score').text(player.score);
            }
        }
    });

    PongHelpers.setupIgcTheme(_pong);
};
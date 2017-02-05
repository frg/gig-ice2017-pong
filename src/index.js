var Pong = window.Pong = require('Pong.js'),
    $ = require('jquery');

var PongHelpers = require('./pong-helpers.js'),
    UI = require('./ui.js');

window.onload = function() {
    var pongElement = document.getElementById('pong'),
        _pong = window._pong = new Pong(pongElement, {
            screens: {
                enable: false
            }
        });

    UI.setup(_pong, PongHelpers);

    _pong._defaultPlayerSpeed = function() {
        return (window.innerWidth * window.innerHeight) / 4000;
    };
    _pong._defaultPlayerHeight = function() {
        return 0.15 * window.innerHeight;
    };
    _pong._defaultBallSpeed = function() {
        return (window.innerWidth * window.innerHeight) / 80000;
    };
    _pong._playerSpeedHandicap = 3;

    // pong.showStats(); // show fps counter
    window.onresize = PongHelpers.setupResizeLogicFunc(_pong);

    _pong.on('point', function(player) {
        if (_pong.currentGameMode === 'SINGLE_PLAYER' && _pong.players.a === player) {
            var hs = localStorage.getItem('SINGLE_PLAYER_HIGHSCORE');
            if (hs === null || (hs !== null && player.score > hs)) {
                localStorage.setItem('SINGLE_PLAYER_HIGHSCORE', player.score);
                $('.header-highscore-score').text(player.score);
            }
        }
    });

    PongHelpers.setupIgcTheme(_pong);
};
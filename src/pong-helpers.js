module.exports = {
    setupIgcTheme: function(_pong) {
        _pong.setScoreDisplayColor('#2f3448');
        _pong.setLinesColor('#51566a');
        _pong.setTextStyle({
            fill: '#ffffff'
        });

        _pong.setBallColor('#ffffff');
        _pong.setBackgroundColor('#3f445a');
        _pong.setBackgroundImage({
            src: '/assets/i-g-c-logo.svg',
            aspectRatio: '1:2',
            stretch: 'height'
        });

        _pong.players.a.setColor('#63dcfd');
        _pong.players.a.scoreDisplay.setTextStyle({
            fill: '#63dcfd',
            fontStyle: 'bold',
            fontSize: '80px'
        });

        _pong.players.b.setColor('#66e07c');
        _pong.players.b.scoreDisplay.setTextStyle({
            fill: '#66e07c',
            fontStyle: 'bold',
            fontSize: '80px'
        });

        return this;
    },

    setupResizeLogicFunc: function(_pong) {
        var func = function() {
            console.info('Pong: resized!');
            var pongElement = document.getElementById('pong');
            _pong._windowRatio = window.innerWidth * window.innerHeight;

            pongElement.style.height = window.innerHeight + 'px';

            _pong.players.a.width = 0.016 * window.innerWidth;
            _pong.players.a.height = 0.15 * window.innerHeight;
            _pong.players.a.radius = _pong.players.a.width / 2;
            _pong.players.a.refresh();
            _pong.players.b.width = 0.016 * window.innerWidth;
            _pong.players.b.height = 0.15 * window.innerHeight;
            _pong.players.b.radius = _pong.players.b.width / 2;
            _pong.players.b.refresh();

            _pong.setBallSpeed(_pong._windowRatio / 80000);

            _pong._defaultPlayerSpeed = _pong.players.a.speed = _pong.players.b.speed = _pong._windowRatio / 2400;

            if (_pong.currentGameMode === 'SINGLE_PLAYER') {
                _pong.players.b.speed = _pong._defaultPlayerSpeed / _pong._playerSpeedHandicap;
            }

            _pong.resize();

            return this;
        };

        func(); // call for initial resize
        return func;
    },

    startSinglePlayer: function(_pong) {
        _pong.currentGameMode = 'SINGLE_PLAYER';
        window._pong.reset();

        _pong.players.a.resetControls();
        _pong.players.b.resetControls();

        // player a controls
        _pong.players.a.addControls({
            'up': 'up',
            'down': 'down',
        });
        _pong.players.a.touch.enable();
        _pong.players.a.height = 0.15 * window.innerHeight;

        _pong.players.b.touch.disable();
        _pong.players.b.speed = _pong._defaultPlayerSpeed / _pong._playerSpeedHandicap;
        _pong.players.b.height = 0.15 * window.innerHeight;

        _pong.on('update', _pong._AI_LOGIC_ONUPDATE = function(_pong) {
            // player b / ai logic
            if (_pong.balls.length > 0) {
                // prediction of next position is used to prevent choppy movement which is caused by the 
                // player passing the ball y position and on the next frame going back
                var ballY = _pong.balls[0].y;
                if (_pong.players.b.y < ballY && _pong.players.b.predictPosition(1).y < ballY) {
                    _pong.players.b.move(1);
                } else if (_pong.players.b.y > ballY && _pong.players.b.predictPosition(-1).y > ballY) {
                    _pong.players.b.move(-1);
                }
            }
        });

        _pong.on('point', function(player) {
            _pong.setBallSpeed(_pong._windowRatio / 80000);
            _pong.players.a.setHeight(0.15 * window.innerHeight);
        });

        _pong.on('hit', function(_pong) {
            if (_pong.hits % 2 === 0) {
                _pong.setBallSpeed(_pong.balls[0].speed * 1.1);
                _pong.players.a.setHeight(_pong.players.a.height * 0.8);
            }
        });

        _pong.reset();
        _pong.won = false;
        _pong.loop.play();
        _pong.start();
    },

    startTwoPlayer: function(_pong) {
        _pong.currentGameMode = 'TWO_PLAYER';
        window._pong.reset();

        _pong.players.a.resetControls();
        _pong.players.b.resetControls();

        // player a controls
        _pong.players.a.addControls({
            'up': 'w',
            'down': 's',
        });
        _pong.players.a.touch.enable();
        _pong.players.a.height = 0.15 * window.innerHeight;

        _pong.players.b.addControls({
            'up': 'up',
            'down': 'down',
        });
        _pong.players.b.touch.enable();
        _pong.players.b.speed = _pong._defaultPlayerSpeed;
        _pong.players.b.height = 0.15 * window.innerHeight;

        if (_pong._AI_LOGIC_ONUPDATE !== undefined) {
            // remove on update ai logic
            _pong.off('update', _pong._AI_LOGIC_ONUPDATE);
        }

        _pong.reset();
        _pong.won = false;
        _pong.loop.play();
        _pong.start();
    }
};
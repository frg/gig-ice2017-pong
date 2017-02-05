function resetGame(_pong) {
    _pong.reset();

    _pong.off('update', __ONUPDATE_AI_LOGIC);
    _pong.off('point', __ONPOINT_RESETONHIT_HANDICAP);
    _pong.off('hit', __ONHIT_HANDICAP);

    _pong.players.a.resetControls();
    _pong.players.b.resetControls();

    _pong.players.a.touch.enable();
    _pong.players.b.touch.enable();

    _pong.players.a.setHeight(_pong._defaultPlayerHeight())
    _pong.players.b.setHeight(_pong._defaultPlayerHeight());

    _pong.players.a.speed = _pong.players.b.speed = _pong._defaultPlayerSpeed();

    _pong.reset();
    _pong.won = false;
    _pong.loop.play();
    _pong.start();
}

var __ONPOINT_RESETONHIT_HANDICAP = function(player) {
        this.setBallSpeed(this._defaultBallSpeed());
        this.players.a.setHeight(this._defaultPlayerHeight());

        if (player === this.players.b) {
            // reset when player b wins a point
            startSinglePlayer(this);
        }
    },
    __ONHIT_HANDICAP = function() {
        if (this.hits % 2 === 0) {
            this.setBallSpeed(this.balls[0].speed * 1.1);
            this.players.a.setHeight(this.players.a.height * 0.8);
        }
    },
    __ONUPDATE_AI_LOGIC = function(player) {
        // player b / ai logic
        if (this.balls.length > 0) {
            // prediction of next position is used to prevent choppy movement which is caused by the 
            // player passing the ball y position and on the next frame going back
            var ballY = this.balls[0].y;
            if (this.players.b.y < ballY && this.players.b.predictPosition(1).y < ballY) {
                this.players.b.move(1);
            } else if (this.players.b.y > ballY && this.players.b.predictPosition(-1).y > ballY) {
                this.players.b.move(-1);
            }
        }
    };

function startSinglePlayer(_pong) {
    _pong.currentGameMode = 'SINGLE_PLAYER';
    resetGame(_pong);

    // player a controls
    _pong.players.a.addControls({
        'up': 'up',
        'down': 'down',
    });

    _pong.players.b.touch.disable();
    _pong.players.b.speed = _pong._defaultPlayerSpeed() / _pong._playerSpeedHandicap;

    _pong.on('update', __ONUPDATE_AI_LOGIC);
    _pong.on('point', __ONPOINT_RESETONHIT_HANDICAP);
    _pong.on('hit', __ONHIT_HANDICAP);
}

function startTwoPlayer(_pong) {
    _pong.currentGameMode = 'TWO_PLAYER';
    resetGame(_pong);

    _pong.players.a.addControls({
        'up': 'w',
        'down': 's',
    });
    _pong.players.b.addControls({
        'up': 'up',
        'down': 'down',
    });
}

module.exports = {
    resetGame: resetGame,

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
    },

    setupResizeLogicFunc: function(_pong) {
        var func = function() {
            console.info('[pong]: resized!');
            console.info('[window] inner - width:', window.innerWidth, 'height:', window.innerHeight);
            console.info('[window] outer - width:', window.outerWidth, 'height:', window.outerHeight);
            console.info('[pong] renderer - width:', _pong.renderer.width, 'height:', _pong.renderer.width);

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

            _pong.setBallSpeed(_pong._defaultBallSpeed());

            if (_pong.currentGameMode === 'SINGLE_PLAYER') {
                _pong.players.b.speed = _pong._defaultPlayerSpeed() / _pong._playerSpeedHandicap;
            }

            _pong.resize();

            return this;
        };

        func(); // call for initial resize
        return func;
    },

    startSinglePlayer: startSinglePlayer,

    startTwoPlayer: startTwoPlayer
};
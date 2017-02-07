var $ = require('jquery'),
    screenfull = require('screenfull');

module.exports = {
    setup: function(_pong, PongHelpers) {
        $(document).ready(function() {
            var hs = localStorage.getItem('SINGLE_PLAYER_HIGHSCORE'),
                $menu = $('#menu'),
                $fullScrnBtn = $('.fullscrn-btn');

            $('.header-highscore-score').text(hs !== null ? hs : 0);

            $('.header-logo').click(function() {
                toggleMenu();
            });

            $('#close-menu-btn').click(function() {
                // since the close button is always visible when the modal is visible 
                // this will always go through the modal hiding procedure
                toggleMenu();
            });

            $(this).keyup(function(e) {
                if (e.keyCode === 27) { // esc
                    toggleMenu();
                }
            });

            $('#singlep-menu-btn').click(function() {
                $menu.addClass('hidden');
                // start game in single player
                PongHelpers.startSinglePlayer(_pong);
                $('.header-highscore').css('visibility', 'visible');
            });

            $('#twop-menu-btn').click(function() {
                $menu.addClass('hidden');
                // start game in 2 player
                PongHelpers.startTwoPlayer(_pong);
                $('.header-highscore').css('visibility', 'hidden');
            });

            function toggleMenu() {
                if ($menu.hasClass('hidden')) {
                    // if menu is closed, open
                    $menu.removeClass('hidden');

                    var $closeBtn = $('button.close-btn');
                    if (_pong.started === true) {
                        _pong.pause()
                        $closeBtn.show();
                    } else {
                        $closeBtn.hide();
                    }
                } else if (_pong.started === true) {
                    // if menu is open
                    _pong.resume()
                    $menu.addClass('hidden');
                    $('button.close-btn').show();
                }
            }

            if (screenfull.enabled) {
                if (screenfull.isFullscreen == false) {
                    // set initial state
                    $fullScrnBtn.removeClass('hidden');
                }

                $fullScrnBtn.click(function(event) {
                    event.preventDefault();
                    screenfull.request();
                });

                document.addEventListener(screenfull.raw.fullscreenchange, function() {
                    console.log('Am I fullscreen? ' + (screenfull.isFullscreen ? 'Yes' : 'No'));
                    if (screenfull.isFullscreen == false) {
                        $fullScrnBtn.removeClass('hidden');
                    } else {
                        $fullScrnBtn.addClass('hidden');
                        // adjust game to new resoltion because resize event is not triggerd on fullscreen
                        setTimeout(function() {
                            // fullscreen mode takes a few ms to take affect
                            _pong.resize();
                        }, 1500)
                    }
                });
            }

            // go through showing procedure
            toggleMenu();
        });
    }
};
/*!
 * tinyLightbox original animation extension
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Depends:
 *  jquery.js
 *  jquery.tiny-lightbox.js
 *
 *
 *  Copyright (c) 2008 Oleg Slobodskoi
 */
(function($) {

$.fn.tinyLightbox.original = function(inst) {
    var o = inst.options;

    this.start = function(callback) {
        inst.$overlay.animate({opacity: 'show'}, o.speed, o.easing, function() {
            inst.$box.css({
                visibility: 'visible',
                left: inst.boxData.left,
                top: inst.boxData.top
            });
            callback();
        });
    };

    this.animate = function(callback) {
        inst.$box.animate({height: inst.boxData.height}, o.speed, o.easing, function() {
            $(this).animate(
                {
                    width: inst.boxData.width,
                    left: inst.boxData.left
                },
                o.speed,
                o.easing,
                function() {
                    // show image
                    inst.$image.css('background-image','url('+inst.url+')')
                    .fadeIn(o.speed, function() {
                        inst.$bar.css({
                            top: inst.boxData.top+inst.boxData.height+inst.boxData.borderWidth*2,
                            left: inst.boxData.left,
                            width: inst.boxData.width
                        }).slideDown(o.speed, callback);
                    });
                }
           );
        });
    };

    this.prepare = function(callback) {
        inst.$bar.slideUp(o.speed, function() {
            inst.$image.fadeOut(o.speed, callback);
        });
    };

    this.limit = function(callback)    {
        (function shake (times, distance, dir, timesNow) {
            timesNow++;
            dir = dir=='+' ? '-' : '+';
            inst.$bar.hide();
            inst.$box.animate({left: dir+'='+distance}, 150, function() {
                timesNow < times ? shake(times, distance, dir, timesNow) : inst.$bar.show() && callback();
            });
        })(4, 40, '+', 0);
    };

    this.close = function(callback) {
        this.prepare(function() {
            inst.$box.fadeOut(o.speed, function() {
                inst.$overlay.fadeOut(o.speed, callback);
            });
        });
    };
};


}(jQuery));

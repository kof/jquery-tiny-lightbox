/*
 * tinyLightbox parallel animation extension 2.5 - Plugin for jQuery
 * 
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Depends:
 *  jquery.js
 *    jquery.tinyLightbox.js
 * 
 *
 *  Copyright (c) 2008 Oleg Slobodskoi (ajaxsoft.de)
 */
;(function($) {

$.fn.tinyLightbox.parallel = function( inst ) {
    
    var self = this,
        timeout;
    
    this.start = function( callback ) {
        inst.boxData.top = getTop();
        inst.$overlay.animate({opacity: 'show' }, inst.s.speed, inst.s.easing, function(){
            inst.$box.css({
                visibility: 'visible',
                left: inst.boxData.left,
                top: inst.boxData.top
            });
            callback();
            $(window).bind('scroll resize', move);
        });            
    };

    this.animate = function( callback ) {
        inst.$box.animate({
            height: inst.boxData.height,
            width: inst.boxData.width, 
            left: inst.boxData.left,
            top: getTop()                
        }, inst.s.speed, inst.s.easing, function (){
            // show image
            inst.$image.css('background-image','url('+inst.path+')')    
            .fadeIn(inst.s.speed, function(){
                showBar(callback);
            });            
        });

    };

    this.prepare = function( callback ) {
        inst.$bar.slideUp(inst.s.speed, function(){
            inst.$image.fadeOut(inst.s.speed, callback);
        });
    };

    this.limit = function( callback )    {
        (function shake (times, distance, dir, timesNow) {
            timesNow++;
            dir = dir=='+' ? '-' : '+';
            inst.$bar.hide();
            inst.$box.animate({left: dir+'='+distance}, 150, function(){
                timesNow < times ? shake(times, distance, dir, timesNow) : inst.$bar.show() && callback();
            });
        })(4, 40, '+', 0);
    };
                
    this.close = function( callback ) {
        this.prepare(function(){
            inst.$box.fadeOut(inst.s.speed, function(){
                inst.$overlay.fadeOut(inst.s.speed, callback);
                $(window).unbind('scroll resize', move);
            });    
        });
    };
    
    
    function getTop() {
        return inst.docData.scrollTop + ($(window).height() - inst.boxData.height)/2;    
    };
    
    function move() {
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            inst.$image.css('opacity',0);
            inst.$bar.slideUp(100);
            var top = getTop();
            inst.$box.animate({
                height: top + inst.boxData.height - inst.boxData.top,
                width: inst.boxData.width, 
                left: inst.boxData.left
            }, inst.s.speed, inst.s.easing, function (){
                $(this).animate({top: top, height: inst.boxData.height}, inst.s.speed, inst.s.easing, function(){
                    inst.$image.css('opacity',1);
                    showBar();            
                });
            });                
        },300);
    };
    
    function showBar(callback) {
        inst.$bar.css({
            top: getTop()+inst.boxData.height+inst.boxData.borderWidth*2,
            left: inst.boxData.left,
            width: inst.boxData.width
        }).slideDown(inst.s.speed, callback);
    };
    
    
};


})( jQuery );
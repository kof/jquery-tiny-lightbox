/*
 * tinyLightbox 2.5 - Plugin for jQuery
 * 
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Depends:
 *   - jquery.js
 *   - jquery.tinyLightbox.original.js or other animation extensions
 *   - optional jquery.bgiframe.js
 *
 *  Copyright (c) 2008 Oleg Slobodskoi (ajaxsoft.de)
 */
;(function($) {

$.fn.tinyLightbox = function ( options ) {
    return this.each(function() {
        !$.data(this, 'tinyLightbox') && $.data( this, 'tinyLightbox', new tinyLightbox(this, options)).init();
    });
};

/* defaults */
$.fn.tinyLightbox.defaults = {
    item: 'a', // selector inside of container
    slideshowSpeed: 5000, 
    slideshowAutostart: false,
    pathAttr: 'href', // zoom image path
    descrAttr: 'title', // description attribute                
    speed: 300, // animations speed
    labelImage: 'Image', //translation
    labelOf: 'of', //translation
    animation: 'original', //animation extension name
    keyNavigation: true, // keyboard navigation enabled/disabled
    cycle: false, // go to the first item after the last one
    minWidth: 250, // if the image is smaller than minWidth, minWidth will be used instead
    minHeight: 190, //the same like minWidth
    overlayOpacity: 0.7, 
    bgiframe: true,    // fix selectboxes for ie6,
    easing: 'swing' 
};


function tinyLightbox ( container, options ) {
    
    
    var template = '\
        <div id="tiny-lightbox" class="tiny-lightbox-animating tiny-lightbox-loading">\
            <div id="tiny-lightbox-overlay" data-action="close"></div>\
            <div id="tiny-lightbox-box" >\
                <div id="tiny-lightbox-image"></div>\
                <a id="tiny-lightbox-prev" data-action="showPrev" hidefocus="hidefocus" href="#">\
                    <span data-action="showPrev"></span>\
                </a>\
                <a id="tiny-lightbox-next" data-action="showNext" hidefocus="hidefocus" href="#">\
                    <span data-action="showNext"></span>\
                </a>\
            </div>\
            <div id="tiny-lightbox-bar">\
                <div id="tiny-lightbox-description"></div>\
                <span id="tiny-lightbox-stats"></span>\
                <a id="tiny-lightbox-close" title="Close" alt="Close" data-action="close" href="#"></a>\
                <a id="tiny-lightbox-slideshow" title="Slideshow" alt="Slideshow" data-action="slideshow" href="#"/>\
            </div>\
        </div>\
    ';
    
    var self = this,
        $container = $(container),
        $tl,
        $elems,
        $stats,
        $descr,
        $prevNext,
        animations,
        activeIndex,
        running,
        cycle
    ;
    
    var s = this.s = $.extend({}, $.fn.tinyLightbox.defaults, options);
    
    
    this.init  = function()
    {
        cycle = s.cycle;
        animations = new $.fn.tinyLightbox[s.animation](self);
        $elems = $(s.item+'['+s.pathAttr+']', $container);

        $container.bind('click', function( e ) {
            var $elem = $(e.target).closest(s.item);
            
            activeIndex = $elems.index($elem[0]);
            
            // it is not a preview
            if ( activeIndex == -1 ) return;

            // prevent double lightbox if user clicks via keyboard
            if ( self.$tl ) return false;
        
            self.$tl = $(template).appendTo(document.body);
            
            // overlay
            self.$overlay = $('#tiny-lightbox-overlay').css('opacity', s.overlayOpacity);
            resizeOverlay();
        
            // image container
            self.$box = $('#tiny-lightbox-box');
            self.$image = $('#tiny-lightbox-image');
            self.path = $elem.attr(s.pathAttr);
            
            self.boxData = {
                width: self.$box.width(),
                height: self.$box.height(),
                top: parseInt(self.$box.css('top')) + self.docData.scrollTop,
                borderWidth: (self.$box.outerWidth()-self.$box.innerWidth())/2 || 0
            };
            setLeft();
            
            

            // toolbar
            self.$bar = $('#tiny-lightbox-bar');
            $descr = $('#tiny-lightbox-description');
            $stats = $('#tiny-lightbox-stats');
            updateBar();
            
            // bind click handler
            self.$tl.bind('click',function(e) {
                var act = $(e.target).attr('data-action');
                if ( !act ) return;
                self[ act ]();
                return false;
            });

            // bind hover event
            $prevNext = $('#tiny-lightbox-next, #tiny-lightbox-prev').bind('mouseout mouseover',function(){
                $('span', this).toggleClass('tiny-lightbox-hover');
            });

            // bind window resize event for overlay
            $(window).bind('resize scroll',resizeOverlay);

            s.keyNavigation && $(document).bind('keydown',keyNavigation);        
            s.bgiframe && $.fn.bgiframe && self.$tl.bgiframe();

            // start animations
            animations.start( function(){
                preload(self.path, function(){
                    animations.animate(function(){
                        resizeOverlay();
                        self.$tl.removeClass('tiny-lightbox-animating');
                        if ( s.slideshowAutostart ) {
                            running = setTimeout(slideshow, s.slideshowSpeed);
                            self.$bar.addClass('tiny-lightbox-slideshow-running');
                        };
                    });    
                });
            });
                            
            return false;            
        
        });
    };
    
    this.showNext = function() {
        change(activeIndex+1);    
    };
    
    this.showPrev = function() {
        change(activeIndex-1);    
    };
    
    this.slideshow = function( sw )    {
        if ( running && !sw ) {
            clearTimeout(running);
            cycle = s.cycle;
            self.$bar.removeClass('tiny-lightbox-slideshow-running');
            running = false;
        } else {
            cycle = true;
            self.$bar.addClass('tiny-lightbox-slideshow-running');
            change(activeIndex+1, function(){
                running = setTimeout(function(){
                    self.slideshow( true );
                }, s.slideshowSpeed);
            });    
        };
    };
    
    this.close = function()    {
        clearTimeout(running);
        $prevNext.unbind('mouseover mouseout');
        $(window).unbind('resize scroll', resizeOverlay);
        s.keyNavigation && $(document).unbind('keydown', keyNavigation);
        animations.close(function(){
            self.$tl.unbind('click').remove();
            delete self.$tl;
        });
    };

    
    function resizeOverlay() {
        self.docData = {
            width: $(window).width(),
            height: $(document).height(),
            scrollTop: $(window).scrollTop(),
            scrollLeft: $(window).scrollLeft()
        };
        self.$tl.add(self.$overlay).css({height: self.docData.height, width: self.docData.width});
    };
    
    function keyNavigation( e )    {
        /* 39 -> 37 <- 27 esc */
        e.keyCode == 39 ? self.showNext() : e.keyCode==37 ? self.showPrev() : e.keyCode==27 && self.close();    
    };
    
    function preload( url, callback ) {
        self.$tl.addClass('tiny-lightbox-loading');
        var img = new Image();
        img.onload = function () { 
            self.$tl.removeClass('tiny-lightbox-loading');
            $.extend(self.boxData, {
                width: img.width>s.minWidth ? img.width : s.minWidth,
                height: img.height>s.minHeight ? img.height : s.minHeight
            });
            setLeft();
            callback();
        };
        img.src = self.path = url;
    };

    function setLeft() {
        self.boxData.left = (self.docData.width - (self.boxData.width + self.boxData.borderWidth*2) )/2;    
    };
    
    function updateBar() {
        $stats.text(s.labelImage+' '+(activeIndex+1)+' '+s.labelOf+' '+$elems.length);
        var descr = $elems.eq(activeIndex).attr(s.descrAttr);
        $descr.html(descr)[ descr ? 'show' : 'hide' ]();
    };
    
    function change( id, callback )    {
        if ( self.$tl.hasClass('tiny-lightbox-animating') ) return;
        
        if ( id > $elems.length-1 || id < 0 ) {
            if ( cycle )
                change(id < 0 ? $elems.length-1 : 0, callback);
            else {
                self.$tl.addClass('tiny-lightbox-animating');
                animations.limit(function(){
                    self.$tl.removeClass('tiny-lightbox-animating');
                });
            };
            return;
        };
        activeIndex = id;

        self.$tl.addClass('tiny-lightbox-animating');
        animations.prepare(function(){
            preload($elems.eq(activeIndex).attr(s.pathAttr), function(){
                updateBar();
                animations.animate(function(){
                    self.$tl.removeClass('tiny-lightbox-animating');
                    resizeOverlay();
                    $(callback);
                });
            });
        });
    };        


};

})( jQuery );
## tinyLightbox is a small lightbox clone based on jquery. The main Idea was to enable different animations but having one core.
So this is more lightboxes framework.

## Usage

	$('#selector').tinyLightbox();


	$('#selector').tinyLightbox(options);
	
## Default options can be overwritten by options param.

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

## Markup and needed files

See the demo for details


## License

Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.    
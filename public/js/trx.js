/*
* iziToast | v1.4.0
* http://izitoast.marcelodolce.com
* by Marcelo Dolce.
*/
!function(t,e){"function"==typeof define&&define.amd?define([],e(t)):"object"==typeof exports?module.exports=e(t):t.iziToast=e(t)}("undefined"!=typeof global?global:window||this.window||this.global,function(t){"use strict";var e={},n="iziToast",o=(document.querySelector("body"),!!/Mobi/.test(navigator.userAgent)),i=/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor),s="undefined"!=typeof InstallTrigger,a="ontouchstart"in document.documentElement,r=["bottomRight","bottomLeft","bottomCenter","topRight","topLeft","topCenter","center"],l={info:{color:"blue",icon:"ico-info"},success:{color:"green",icon:"ico-success"},warning:{color:"orange",icon:"ico-warning"},error:{color:"red",icon:"ico-error"},question:{color:"yellow",icon:"ico-question"}},d=568,c={};e.children={};var u={id:null,"class":"",title:"",titleColor:"",titleSize:"",titleLineHeight:"",message:"",messageColor:"",messageSize:"",messageLineHeight:"",backgroundColor:"",theme:"light",color:"",icon:"",iconText:"",iconColor:"",iconUrl:null,image:"",imageWidth:50,maxWidth:null,zindex:null,layout:1,balloon:!1,close:!0,closeOnEscape:!1,closeOnClick:!1,displayMode:0,position:"bottomRight",target:"",targetFirst:!0,timeout:5e3,rtl:!1,animateInside:!0,drag:!0,pauseOnHover:!0,resetOnHover:!1,progressBar:!0,progressBarColor:"",progressBarEasing:"linear",overlay:!1,overlayClose:!1,overlayColor:"rgba(0, 0, 0, 0.6)",transitionIn:"fadeInUp",transitionOut:"fadeOut",transitionInMobile:"fadeInUp",transitionOutMobile:"fadeOutDown",buttons:{},inputs:{},onOpening:function(){},onOpened:function(){},onClosing:function(){},onClosed:function(){}};if("remove"in Element.prototype||(Element.prototype.remove=function(){this.parentNode&&this.parentNode.removeChild(this)}),"function"!=typeof window.CustomEvent){var p=function(t,e){e=e||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),n};p.prototype=window.Event.prototype,window.CustomEvent=p}var m=function(t,e,n){if("[object Object]"===Object.prototype.toString.call(t))for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.call(n,t[o],o,t);else if(t)for(var i=0,s=t.length;s>i;i++)e.call(n,t[i],i,t)},g=function(t,e){var n={};return m(t,function(e,o){n[o]=t[o]}),m(e,function(t,o){n[o]=e[o]}),n},f=function(t){var e=document.createDocumentFragment(),n=document.createElement("div");for(n.innerHTML=t;n.firstChild;)e.appendChild(n.firstChild);return e},v=function(t){var e=btoa(encodeURIComponent(t));return e.replace(/=/g,"")},y=function(t){return"#"==t.substring(0,1)||"rgb"==t.substring(0,3)||"hsl"==t.substring(0,3)},h=function(t){try{return btoa(atob(t))==t}catch(e){return!1}},b=function(){return{move:function(t,e,o,a){var r,l=.3,d=180;0!==a&&(t.classList.add(n+"-dragged"),t.style.transform="translateX("+a+"px)",a>0?(r=(d-a)/d,l>r&&e.hide(g(o,{transitionOut:"fadeOutRight",transitionOutMobile:"fadeOutRight"}),t,"drag")):(r=(d+a)/d,l>r&&e.hide(g(o,{transitionOut:"fadeOutLeft",transitionOutMobile:"fadeOutLeft"}),t,"drag")),t.style.opacity=r,l>r&&((i||s)&&(t.style.left=a+"px"),t.parentNode.style.opacity=l,this.stopMoving(t,null)))},startMoving:function(t,e,n,o){o=o||window.event;var i=a?o.touches[0].clientX:o.clientX,s=t.style.transform.replace("px)","");s=s.replace("translateX(","");var r=i-s;n.transitionIn&&t.classList.remove(n.transitionIn),n.transitionInMobile&&t.classList.remove(n.transitionInMobile),t.style.transition="",a?document.ontouchmove=function(o){o.preventDefault(),o=o||window.event;var i=o.touches[0].clientX,s=i-r;b.move(t,e,n,s)}:document.onmousemove=function(o){o.preventDefault(),o=o||window.event;var i=o.clientX,s=i-r;b.move(t,e,n,s)}},stopMoving:function(t,e){a?document.ontouchmove=function(){}:document.onmousemove=function(){},t.style.opacity="",t.style.transform="",t.classList.contains(n+"-dragged")&&(t.classList.remove(n+"-dragged"),t.style.transition="transform 0.4s ease, opacity 0.4s ease",setTimeout(function(){t.style.transition=""},400))}}}();return e.setSetting=function(t,n,o){e.children[t][n]=o},e.getSetting=function(t,n){return e.children[t][n]},e.destroy=function(){m(document.querySelectorAll("."+n+"-overlay"),function(t,e){t.remove()}),m(document.querySelectorAll("."+n+"-wrapper"),function(t,e){t.remove()}),m(document.querySelectorAll("."+n),function(t,e){t.remove()}),this.children={},document.removeEventListener(n+"-opened",{},!1),document.removeEventListener(n+"-opening",{},!1),document.removeEventListener(n+"-closing",{},!1),document.removeEventListener(n+"-closed",{},!1),document.removeEventListener("keyup",{},!1),c={}},e.settings=function(t){e.destroy(),c=t,u=g(u,t||{})},m(l,function(t,n){e[n]=function(e){var n=g(c,e||{});n=g(t,n||{}),this.show(n)}}),e.progress=function(t,e,o){var i=this,s=e.getAttribute("data-iziToast-ref"),a=g(this.children[s],t||{}),r=e.querySelector("."+n+"-progressbar div");return{start:function(){"undefined"==typeof a.time.REMAINING&&(e.classList.remove(n+"-reseted"),null!==r&&(r.style.transition="width "+a.timeout+"ms "+a.progressBarEasing,r.style.width="0%"),a.time.START=(new Date).getTime(),a.time.END=a.time.START+a.timeout,a.time.TIMER=setTimeout(function(){clearTimeout(a.time.TIMER),e.classList.contains(n+"-closing")||(i.hide(a,e,"timeout"),"function"==typeof o&&o.apply(i))},a.timeout),i.setSetting(s,"time",a.time))},pause:function(){if("undefined"!=typeof a.time.START&&!e.classList.contains(n+"-paused")&&!e.classList.contains(n+"-reseted")){if(e.classList.add(n+"-paused"),a.time.REMAINING=a.time.END-(new Date).getTime(),clearTimeout(a.time.TIMER),i.setSetting(s,"time",a.time),null!==r){var t=window.getComputedStyle(r),l=t.getPropertyValue("width");r.style.transition="none",r.style.width=l}"function"==typeof o&&setTimeout(function(){o.apply(i)},10)}},resume:function(){"undefined"!=typeof a.time.REMAINING?(e.classList.remove(n+"-paused"),null!==r&&(r.style.transition="width "+a.time.REMAINING+"ms "+a.progressBarEasing,r.style.width="0%"),a.time.END=(new Date).getTime()+a.time.REMAINING,a.time.TIMER=setTimeout(function(){clearTimeout(a.time.TIMER),e.classList.contains(n+"-closing")||(i.hide(a,e,"timeout"),"function"==typeof o&&o.apply(i))},a.time.REMAINING),i.setSetting(s,"time",a.time)):this.start()},reset:function(){clearTimeout(a.time.TIMER),delete a.time.REMAINING,i.setSetting(s,"time",a.time),e.classList.add(n+"-reseted"),e.classList.remove(n+"-paused"),null!==r&&(r.style.transition="none",r.style.width="100%"),"function"==typeof o&&setTimeout(function(){o.apply(i)},10)}}},e.hide=function(t,e,i){"object"!=typeof e&&(e=document.querySelector(e));var s=this,a=g(this.children[e.getAttribute("data-iziToast-ref")],t||{});a.closedBy=i||null,delete a.time.REMAINING,e.classList.add(n+"-closing"),function(){var t=document.querySelector("."+n+"-overlay");if(null!==t){var e=t.getAttribute("data-iziToast-ref");e=e.split(",");var o=e.indexOf(String(a.ref));-1!==o&&e.splice(o,1),t.setAttribute("data-iziToast-ref",e.join()),0===e.length&&(t.classList.remove("fadeIn"),t.classList.add("fadeOut"),setTimeout(function(){t.remove()},700))}}(),a.transitionIn&&e.classList.remove(a.transitionIn),a.transitionInMobile&&e.classList.remove(a.transitionInMobile),o||window.innerWidth<=d?a.transitionOutMobile&&e.classList.add(a.transitionOutMobile):a.transitionOut&&e.classList.add(a.transitionOut);var r=e.parentNode.offsetHeight;e.parentNode.style.height=r+"px",e.style.pointerEvents="none",(!o||window.innerWidth>d)&&(e.parentNode.style.transitionDelay="0.2s");try{var l=new CustomEvent(n+"-closing",{detail:a,bubbles:!0,cancelable:!0});document.dispatchEvent(l)}catch(c){console.warn(c)}setTimeout(function(){e.parentNode.style.height="0px",e.parentNode.style.overflow="",setTimeout(function(){delete s.children[a.ref],e.parentNode.remove();try{var t=new CustomEvent(n+"-closed",{detail:a,bubbles:!0,cancelable:!0});document.dispatchEvent(t)}catch(o){console.warn(o)}"undefined"!=typeof a.onClosed&&a.onClosed.apply(null,[a,e,i])},1e3)},200),"undefined"!=typeof a.onClosing&&a.onClosing.apply(null,[a,e,i])},e.show=function(t){var i=this,s=g(c,t||{});if(s=g(u,s),s.time={},null===s.id&&(s.id=v(s.title+s.message+s.color)),1===s.displayMode||"once"==s.displayMode)try{if(document.querySelectorAll("."+n+"#"+s.id).length>0)return!1}catch(l){console.warn("["+n+"] Could not find an element with this selector: #"+s.id+". Try to set an valid id.")}if(2===s.displayMode||"replace"==s.displayMode)try{m(document.querySelectorAll("."+n+"#"+s.id),function(t,e){i.hide(s,t,"replaced")})}catch(l){console.warn("["+n+"] Could not find an element with this selector: #"+s.id+". Try to set an valid id.")}s.ref=(new Date).getTime()+Math.floor(1e7*Math.random()+1),e.children[s.ref]=s;var p={body:document.querySelector("body"),overlay:document.createElement("div"),toast:document.createElement("div"),toastBody:document.createElement("div"),toastTexts:document.createElement("div"),toastCapsule:document.createElement("div"),cover:document.createElement("div"),buttons:document.createElement("div"),inputs:document.createElement("div"),icon:s.iconUrl?document.createElement("img"):document.createElement("i"),wrapper:null};p.toast.setAttribute("data-iziToast-ref",s.ref),p.toast.appendChild(p.toastBody),p.toastCapsule.appendChild(p.toast),function(){if(p.toast.classList.add(n),p.toast.classList.add(n+"-opening"),p.toastCapsule.classList.add(n+"-capsule"),p.toastBody.classList.add(n+"-body"),p.toastTexts.classList.add(n+"-texts"),o||window.innerWidth<=d?s.transitionInMobile&&p.toast.classList.add(s.transitionInMobile):s.transitionIn&&p.toast.classList.add(s.transitionIn),s["class"]){var t=s["class"].split(" ");m(t,function(t,e){p.toast.classList.add(t)})}s.id&&(p.toast.id=s.id),s.rtl&&(p.toast.classList.add(n+"-rtl"),p.toast.setAttribute("dir","rtl")),s.layout>1&&p.toast.classList.add(n+"-layout"+s.layout),s.balloon&&p.toast.classList.add(n+"-balloon"),s.maxWidth&&(isNaN(s.maxWidth)?p.toast.style.maxWidth=s.maxWidth:p.toast.style.maxWidth=s.maxWidth+"px"),""===s.theme&&"light"===s.theme||p.toast.classList.add(n+"-theme-"+s.theme),s.color&&(y(s.color)?p.toast.style.background=s.color:p.toast.classList.add(n+"-color-"+s.color)),s.backgroundColor&&(p.toast.style.background=s.backgroundColor,s.balloon&&(p.toast.style.borderColor=s.backgroundColor))}(),function(){s.image&&(p.cover.classList.add(n+"-cover"),p.cover.style.width=s.imageWidth+"px",h(s.image.replace(/ /g,""))?p.cover.style.backgroundImage="url(data:image/png;base64,"+s.image.replace(/ /g,"")+")":p.cover.style.backgroundImage="url("+s.image+")",s.rtl?p.toastBody.style.marginRight=s.imageWidth+10+"px":p.toastBody.style.marginLeft=s.imageWidth+10+"px",p.toast.appendChild(p.cover))}(),function(){s.close?(p.buttonClose=document.createElement("button"),p.buttonClose.type="button",p.buttonClose.classList.add(n+"-close"),p.buttonClose.addEventListener("click",function(t){t.target;i.hide(s,p.toast,"button")}),p.toast.appendChild(p.buttonClose)):s.rtl?p.toast.style.paddingLeft="18px":p.toast.style.paddingRight="18px"}(),function(){s.progressBar&&(p.progressBar=document.createElement("div"),p.progressBarDiv=document.createElement("div"),p.progressBar.classList.add(n+"-progressbar"),p.progressBarDiv.style.background=s.progressBarColor,p.progressBar.appendChild(p.progressBarDiv),p.toast.appendChild(p.progressBar)),s.timeout&&(s.pauseOnHover&&!s.resetOnHover&&(p.toast.addEventListener("mouseenter",function(t){i.progress(s,p.toast).pause()}),p.toast.addEventListener("mouseleave",function(t){i.progress(s,p.toast).resume()})),s.resetOnHover&&(p.toast.addEventListener("mouseenter",function(t){i.progress(s,p.toast).reset()}),p.toast.addEventListener("mouseleave",function(t){i.progress(s,p.toast).start()})))}(),function(){s.iconUrl?(p.icon.setAttribute("class",n+"-icon"),p.icon.setAttribute("src",s.iconUrl)):s.icon&&(p.icon.setAttribute("class",n+"-icon "+s.icon),s.iconText&&p.icon.appendChild(document.createTextNode(s.iconText)),s.iconColor&&(p.icon.style.color=s.iconColor)),(s.icon||s.iconUrl)&&(s.rtl?p.toastBody.style.paddingRight="33px":p.toastBody.style.paddingLeft="33px",p.toastBody.appendChild(p.icon))}(),function(){s.title.length>0&&(p.strong=document.createElement("strong"),p.strong.classList.add(n+"-title"),p.strong.appendChild(f(s.title)),p.toastTexts.appendChild(p.strong),s.titleColor&&(p.strong.style.color=s.titleColor),s.titleSize&&(isNaN(s.titleSize)?p.strong.style.fontSize=s.titleSize:p.strong.style.fontSize=s.titleSize+"px"),s.titleLineHeight&&(isNaN(s.titleSize)?p.strong.style.lineHeight=s.titleLineHeight:p.strong.style.lineHeight=s.titleLineHeight+"px")),s.message.length>0&&(p.p=document.createElement("p"),p.p.classList.add(n+"-message"),p.p.appendChild(f(s.message)),p.toastTexts.appendChild(p.p),s.messageColor&&(p.p.style.color=s.messageColor),s.messageSize&&(isNaN(s.titleSize)?p.p.style.fontSize=s.messageSize:p.p.style.fontSize=s.messageSize+"px"),s.messageLineHeight&&(isNaN(s.titleSize)?p.p.style.lineHeight=s.messageLineHeight:p.p.style.lineHeight=s.messageLineHeight+"px")),s.title.length>0&&s.message.length>0&&(s.rtl?p.strong.style.marginLeft="10px":2===s.layout||s.rtl||(p.strong.style.marginRight="10px"))}(),p.toastBody.appendChild(p.toastTexts);var L;!function(){s.inputs.length>0&&(p.inputs.classList.add(n+"-inputs"),m(s.inputs,function(t,e){p.inputs.appendChild(f(t[0])),L=p.inputs.childNodes,L[e].classList.add(n+"-inputs-child"),t[3]&&setTimeout(function(){L[e].focus()},300),L[e].addEventListener(t[1],function(e){var n=t[2];return n(i,p.toast,this,e)})}),p.toastBody.appendChild(p.inputs))}(),function(){s.buttons.length>0&&(p.buttons.classList.add(n+"-buttons"),m(s.buttons,function(t,e){p.buttons.appendChild(f(t[0]));var o=p.buttons.childNodes;o[e].classList.add(n+"-buttons-child"),t[2]&&setTimeout(function(){o[e].focus()},300),o[e].addEventListener("click",function(e){e.preventDefault();var n=t[1];return n(i,p.toast,this,e,L)})})),p.toastBody.appendChild(p.buttons)}(),s.message.length>0&&(s.inputs.length>0||s.buttons.length>0)&&(p.p.style.marginBottom="0"),(s.inputs.length>0||s.buttons.length>0)&&(s.rtl?p.toastTexts.style.marginLeft="10px":p.toastTexts.style.marginRight="10px",s.inputs.length>0&&s.buttons.length>0&&(s.rtl?p.inputs.style.marginLeft="8px":p.inputs.style.marginRight="8px")),function(){p.toastCapsule.style.visibility="hidden",setTimeout(function(){var t=p.toast.offsetHeight,e=p.toast.currentStyle||window.getComputedStyle(p.toast),n=e.marginTop;n=n.split("px"),n=parseInt(n[0]);var o=e.marginBottom;o=o.split("px"),o=parseInt(o[0]),p.toastCapsule.style.visibility="",p.toastCapsule.style.height=t+o+n+"px",setTimeout(function(){p.toastCapsule.style.height="auto",s.target&&(p.toastCapsule.style.overflow="visible")},500),s.timeout&&i.progress(s,p.toast).start()},100)}(),function(){var t=s.position;if(s.target)p.wrapper=document.querySelector(s.target),p.wrapper.classList.add(n+"-target"),s.targetFirst?p.wrapper.insertBefore(p.toastCapsule,p.wrapper.firstChild):p.wrapper.appendChild(p.toastCapsule);else{if(-1==r.indexOf(s.position))return void console.warn("["+n+"] Incorrect position.\nIt can be › "+r);t=o||window.innerWidth<=d?"bottomLeft"==s.position||"bottomRight"==s.position||"bottomCenter"==s.position?n+"-wrapper-bottomCenter":"topLeft"==s.position||"topRight"==s.position||"topCenter"==s.position?n+"-wrapper-topCenter":n+"-wrapper-center":n+"-wrapper-"+t,p.wrapper=document.querySelector("."+n+"-wrapper."+t),p.wrapper||(p.wrapper=document.createElement("div"),p.wrapper.classList.add(n+"-wrapper"),p.wrapper.classList.add(t),document.body.appendChild(p.wrapper)),"topLeft"==s.position||"topCenter"==s.position||"topRight"==s.position?p.wrapper.insertBefore(p.toastCapsule,p.wrapper.firstChild):p.wrapper.appendChild(p.toastCapsule)}isNaN(s.zindex)?console.warn("["+n+"] Invalid zIndex."):p.wrapper.style.zIndex=s.zindex}(),function(){s.overlay&&(null!==document.querySelector("."+n+"-overlay.fadeIn")?(p.overlay=document.querySelector("."+n+"-overlay"),p.overlay.setAttribute("data-iziToast-ref",p.overlay.getAttribute("data-iziToast-ref")+","+s.ref),isNaN(s.zindex)||null===s.zindex||(p.overlay.style.zIndex=s.zindex-1)):(p.overlay.classList.add(n+"-overlay"),p.overlay.classList.add("fadeIn"),p.overlay.style.background=s.overlayColor,p.overlay.setAttribute("data-iziToast-ref",s.ref),isNaN(s.zindex)||null===s.zindex||(p.overlay.style.zIndex=s.zindex-1),document.querySelector("body").appendChild(p.overlay)),s.overlayClose?(p.overlay.removeEventListener("click",{}),p.overlay.addEventListener("click",function(t){i.hide(s,p.toast,"overlay")})):p.overlay.removeEventListener("click",{}))}(),function(){if(s.animateInside){p.toast.classList.add(n+"-animateInside");var t=[200,100,300];"bounceInLeft"!=s.transitionIn&&"bounceInRight"!=s.transitionIn||(t=[400,200,400]),s.title.length>0&&setTimeout(function(){p.strong.classList.add("slideIn")},t[0]),s.message.length>0&&setTimeout(function(){p.p.classList.add("slideIn")},t[1]),(s.icon||s.iconUrl)&&setTimeout(function(){p.icon.classList.add("revealIn")},t[2]);var e=150;s.buttons.length>0&&p.buttons&&setTimeout(function(){m(p.buttons.childNodes,function(t,n){setTimeout(function(){t.classList.add("revealIn")},e),e+=150})},s.inputs.length>0?150:0),s.inputs.length>0&&p.inputs&&(e=150,m(p.inputs.childNodes,function(t,n){setTimeout(function(){t.classList.add("revealIn")},e),e+=150}))}}(),s.onOpening.apply(null,[s,p.toast]);try{var C=new CustomEvent(n+"-opening",{detail:s,bubbles:!0,cancelable:!0});document.dispatchEvent(C)}catch(w){console.warn(w)}setTimeout(function(){p.toast.classList.remove(n+"-opening"),p.toast.classList.add(n+"-opened");try{var t=new CustomEvent(n+"-opened",{detail:s,bubbles:!0,cancelable:!0});document.dispatchEvent(t)}catch(e){console.warn(e)}s.onOpened.apply(null,[s,p.toast])},1e3),s.drag&&(a?(p.toast.addEventListener("touchstart",function(t){b.startMoving(this,i,s,t)},!1),p.toast.addEventListener("touchend",function(t){b.stopMoving(this,t)},!1)):(p.toast.addEventListener("mousedown",function(t){t.preventDefault(),b.startMoving(this,i,s,t)},!1),p.toast.addEventListener("mouseup",function(t){t.preventDefault(),b.stopMoving(this,t)},!1))),s.closeOnEscape&&document.addEventListener("keyup",function(t){t=t||window.event,27==t.keyCode&&i.hide(s,p.toast,"esc")}),s.closeOnClick&&p.toast.addEventListener("click",function(t){i.hide(s,p.toast,"toast")}),i.toast=p.toast},e});
/*
* iziModal | v1.6.0
* http://izimodal.marcelodolce.com
* by Marcelo Dolce.
*/
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        factory(jQuery);
    }
}(function ($) {

	var $window = $(window),
    	$document = $(document),
		PLUGIN_NAME = 'iziModal',
		STATES = {
		CLOSING: 'closing',
		CLOSED: 'closed',
		OPENING: 'opening',
		OPENED: 'opened',
		DESTROYED: 'destroyed'
	};

	function whichAnimationEvent(){
		var t,
			el = document.createElement('fakeelement'),
			animations = {
			'animation'      : 'animationend',
			'OAnimation'     : 'oAnimationEnd',
			'MozAnimation'   : 'animationend',
			'WebkitAnimation': 'webkitAnimationEnd'
		};
		for (t in animations){
			if (el.style[t] !== undefined){
				return animations[t];
			}
		}
	}

	function isIE(version) {
		if(version === 9){
			return navigator.appVersion.indexOf('MSIE 9.') !== -1;
		} else {
			userAgent = navigator.userAgent;
			return userAgent.indexOf('MSIE ') > -1 || userAgent.indexOf('Trident/') > -1;
		}
	}

	function clearValue(value){
		var separators = /%|px|em|cm|vh|vw/;
		return parseInt(String(value).split(separators)[0]);
	}

	function changeHashWithoutScrolling(hash) {
		var id = hash.replace(/^.*#/, ''),
			$elem = $(hash);
		$elem.attr('id', id+'-tmp');
		window.location.hash = hash;
		$elem.attr('id', id);
	}

	var animationEvent = whichAnimationEvent(),
		isMobile = (/Mobi/.test(navigator.userAgent)) ? true : false;

	window.$iziModal = {};
	window.$iziModal.autoOpen = 0;
	window.$iziModal.history = false;

	var iziModal = function (element, options) {
		this.init(element, options);
	};

	iziModal.prototype = {

		constructor: iziModal,

		init: function (element, options) {

			var that = this;
			this.$element = $(element);

			if(this.$element[0].id !== undefined && this.$element[0].id !== ''){
				this.id = this.$element[0].id;
			} else {
				this.id = PLUGIN_NAME+Math.floor((Math.random() * 10000000) + 1);
				this.$element.attr('id', this.id);
			}
			this.classes = ( this.$element.attr('class') !== undefined ) ? this.$element.attr('class') : '';
			this.content = this.$element.html();
			this.state = STATES.CLOSED;
			this.options = options;
			this.width = 0;
			this.timer = null;
			this.timerTimeout = null;
			this.progressBar = null;
            this.isPaused = false;
			this.isFullscreen = false;
            this.headerHeight = 0;
            this.modalHeight = 0;
            this.$overlay = $('<div class="'+PLUGIN_NAME+'-overlay" style="background-color:'+options.overlayColor+'"></div>');
			this.$navigate = $('<div class="'+PLUGIN_NAME+'-navigate"><div class="'+PLUGIN_NAME+'-navigate-caption">Use</div><button class="'+PLUGIN_NAME+'-navigate-prev"></button><button class="'+PLUGIN_NAME+'-navigate-next"></button></div>');
            this.group = {
            	name: this.$element.attr('data-'+PLUGIN_NAME+'-group'),
            	index: null,
            	ids: []
            };
			this.$element.attr('aria-hidden', 'true');
			this.$element.attr('aria-labelledby', this.id);
			this.$element.attr('role', 'dialog');

			if( !this.$element.hasClass('iziModal') ){
				this.$element.addClass('iziModal');
			}

            if(this.group.name === undefined && options.group !== ''){
            	this.group.name = options.group;
            	this.$element.attr('data-'+PLUGIN_NAME+'-group', options.group);
            }
            if(this.options.loop === true){
            	this.$element.attr('data-'+PLUGIN_NAME+'-loop', true);
            }

            $.each( this.options , function(index, val) {
				var attr = that.$element.attr('data-'+PLUGIN_NAME+'-'+index);
            	try {
		            if(typeof attr !== typeof undefined){

						if(attr === ''|| attr == 'true'){
							options[index] = true;
						} else if (attr == 'false') {
							options[index] = false;
						} else if (typeof val == 'function') {
							options[index] = new Function(attr);
						} else {
							options[index] = attr;
						}
		            }
            	} catch(exc){}
            });

            if(options.appendTo !== false){
				this.$element.appendTo(options.appendTo);
            }

            if (options.iframe === true) {
                this.$element.html('<div class="'+PLUGIN_NAME+'-wrap"><div class="'+PLUGIN_NAME+'-content"><iframe class="'+PLUGIN_NAME+'-iframe"></iframe>' + this.content + "</div></div>");

	            if (options.iframeHeight !== null) {
	                this.$element.find('.'+PLUGIN_NAME+'-iframe').css('height', options.iframeHeight);
	            }
            } else {
            	this.$element.html('<div class="'+PLUGIN_NAME+'-wrap"><div class="'+PLUGIN_NAME+'-content">' + this.content + '</div></div>');
            }

			if (this.options.background !== null) {
				this.$element.css('background', this.options.background);
			}

            this.$wrap = this.$element.find('.'+PLUGIN_NAME+'-wrap');

			if(options.zindex !== null && !isNaN(parseInt(options.zindex)) ){
			 	this.$element.css('z-index', options.zindex);
			 	this.$navigate.css('z-index', options.zindex-1);
			 	this.$overlay.css('z-index', options.zindex-2);
			}

			if(options.radius !== ''){
                this.$element.css('border-radius', options.radius);
            }

            if(options.padding !== ''){
                this.$element.find('.'+PLUGIN_NAME+'-content').css('padding', options.padding);
            }

            if(options.theme !== ''){
				if(options.theme === 'light'){
					this.$element.addClass(PLUGIN_NAME+'-light');
				} else {
					this.$element.addClass(options.theme);
				}
            }

			if(options.rtl === true) {
				this.$element.addClass(PLUGIN_NAME+'-rtl');
			}

			if(options.openFullscreen === true){
			    this.isFullscreen = true;
			    this.$element.addClass('isFullscreen');
			}

			this.createHeader();
			this.recalcWidth();
			this.recalcVerticalPos();

			if (that.options.afterRender && ( typeof(that.options.afterRender) === 'function' || typeof(that.options.afterRender) === 'object' ) ) {
		        that.options.afterRender(that);
		    }

		},

		createHeader: function(){

			this.$header = $('<div class="'+PLUGIN_NAME+'-header"><h2 class="'+PLUGIN_NAME+'-header-title">' + this.options.title + '</h2><p class="'+PLUGIN_NAME+'-header-subtitle">' + this.options.subtitle + '</p><div class="'+PLUGIN_NAME+'-header-buttons"></div></div>');

			if (this.options.closeButton === true) {
				this.$header.find('.'+PLUGIN_NAME+'-header-buttons').append('<a href="javascript:void(0)" class="'+PLUGIN_NAME+'-button '+PLUGIN_NAME+'-button-close" data-'+PLUGIN_NAME+'-close></a>');
			}

            if (this.options.fullscreen === true) {
            	this.$header.find('.'+PLUGIN_NAME+'-header-buttons').append('<a href="javascript:void(0)" class="'+PLUGIN_NAME+'-button '+PLUGIN_NAME+'-button-fullscreen" data-'+PLUGIN_NAME+'-fullscreen></a>');
            }

            //if (this.options.timeoutProgressbar === true && !isNaN(parseInt(this.options.timeout)) && this.options.timeout !== false && this.options.timeout !== 0) {
			if (this.options.timeoutProgressbar === true) {
				this.$header.prepend('<div class="'+PLUGIN_NAME+'-progressbar"><div style="background-color:'+this.options.timeoutProgressbarColor+'"></div></div>');
            }

            if (this.options.subtitle === '') {
        		this.$header.addClass(PLUGIN_NAME+'-noSubtitle');
            }

            if (this.options.title !== '') {

                if (this.options.headerColor !== null) {
                	if(this.options.borderBottom === true){
                    	this.$element.css('border-bottom', '3px solid ' + this.options.headerColor + '');
                	}
                    this.$header.css('background', this.options.headerColor);
                }
				if (this.options.icon !== null || this.options.iconText !== null){

                    this.$header.prepend('<i class="'+PLUGIN_NAME+'-header-icon"></i>');

	                if (this.options.icon !== null) {
	                    this.$header.find('.'+PLUGIN_NAME+'-header-icon').addClass(this.options.icon).css('color', this.options.iconColor);
					}
	                if (this.options.iconText !== null){
	                	this.$header.find('.'+PLUGIN_NAME+'-header-icon').html(this.options.iconText);
	                }
				}
                this.$element.css('overflow', 'hidden').prepend(this.$header);
            }
		},

		setGroup: function(groupName){

			var that = this,
				group = this.group.name || groupName;
				this.group.ids = [];

			if( groupName !== undefined && groupName !== this.group.name){
				group = groupName;
				this.group.name = group;
				this.$element.attr('data-'+PLUGIN_NAME+'-group', group);
			}
			if(group !== undefined && group !== ''){

            	var count = 0;
            	$.each( $('.'+PLUGIN_NAME+'[data-'+PLUGIN_NAME+'-group='+group+']') , function(index, val) {

					that.group.ids.push($(this)[0].id);

					if(that.id == $(this)[0].id){
						that.group.index = count;
					}
        			count++;
            	});
            }
		},

		toggle: function () {

			if(this.state == STATES.OPENED){
				this.close();
			}
			if(this.state == STATES.CLOSED){
				this.open();
			}
		},

		startProgress: function(param) {

			var that = this;

			this.isPaused = false;

			clearTimeout(this.timerTimeout);

			if (this.options.timeoutProgressbar === true) {

				this.progressBar = {
                    hideEta: null,
                    maxHideTime: null,
                    currentTime: new Date().getTime(),
                    el: this.$element.find('.'+PLUGIN_NAME+'-progressbar > div'),
                    updateProgress: function()
                    {
						if(!that.isPaused){

							that.progressBar.currentTime = that.progressBar.currentTime+10;

		                    var percentage = ((that.progressBar.hideEta - (that.progressBar.currentTime)) / that.progressBar.maxHideTime) * 100;
		                    that.progressBar.el.width(percentage + '%');
		                    if(percentage < 0){
		                    	that.close();
		                    }
						}
                    }
                };
				if (param > 0) {
                    this.progressBar.maxHideTime = parseFloat(param);
                    this.progressBar.hideEta = new Date().getTime() + this.progressBar.maxHideTime;
                    this.timerTimeout = setInterval(this.progressBar.updateProgress, 10);
                }

			} else {
				this.timerTimeout = setTimeout(function(){
					that.close();
				}, that.options.timeout);
			}
	
		}, 

		pauseProgress: function(){

			this.isPaused = true;
		},

		resumeProgress: function(){

			this.isPaused = false;
		},

		resetProgress: function(param){

        	clearTimeout(this.timerTimeout);
        	this.progressBar = {};
            this.$element.find('.'+PLUGIN_NAME+'-progressbar > div').width('100%');
		},

		open: function (param) {

			var that = this;

			try {
				if(param !== undefined && param.preventClose === false){
					$.each( $('.'+PLUGIN_NAME) , function(index, modal) {
						if( $(modal).data().iziModal !== undefined ){
							var state = $(modal).iziModal('getState');

							if(state == 'opened' || state == 'opening'){
								$(modal).iziModal('close');
							}
						}
					});				
				}
			} catch(e) {  /*console.warn(exc);*/  }

            (function urlHash(){
				if(that.options.history){

	            	var oldTitle = document.title;
		            document.title = oldTitle + " - " + that.options.title;
					changeHashWithoutScrolling('#'+that.id);
					document.title = oldTitle;
					//history.pushState({}, that.options.title, "#"+that.id);

					window.$iziModal.history = true;
				} else {
					window.$iziModal.history = false;
				}
            })();

			function opened(){

			    // console.info('[ '+PLUGIN_NAME+' | '+that.id+' ] Opened.');

				that.state = STATES.OPENED;
		    	that.$element.trigger(STATES.OPENED);

				if (that.options.onOpened && ( typeof(that.options.onOpened) === "function" || typeof(that.options.onOpened) === "object" ) ) {
			        that.options.onOpened(that);
			    }
			}

			function bindEvents(){

	            // Close when button pressed
	            that.$element.off('click', '[data-'+PLUGIN_NAME+'-close]').on('click', '[data-'+PLUGIN_NAME+'-close]', function (e) {
	                e.preventDefault();

	                var transition = $(e.currentTarget).attr('data-'+PLUGIN_NAME+'-transitionOut');

	                if(transition !== undefined){
	                	that.close({transition:transition});
	                } else {
	                	that.close();
	                }
	            });

	            // Expand when button pressed
	            that.$element.off('click', '[data-'+PLUGIN_NAME+'-fullscreen]').on('click', '[data-'+PLUGIN_NAME+'-fullscreen]', function (e) {
	                e.preventDefault();
	                if(that.isFullscreen === true){
						that.isFullscreen = false;
		                that.$element.removeClass('isFullscreen');
	                } else {
		                that.isFullscreen = true;
		                that.$element.addClass('isFullscreen');
	                }
					if (that.options.onFullscreen && typeof(that.options.onFullscreen) === "function") {
				        that.options.onFullscreen(that);
				    }
				    that.$element.trigger('fullscreen', that);
	            });

	            // Next modal
	            that.$navigate.off('click', '.'+PLUGIN_NAME+'-navigate-next').on('click', '.'+PLUGIN_NAME+'-navigate-next', function (e) {
	            	that.next(e);
	            });
	            that.$element.off('click', '[data-'+PLUGIN_NAME+'-next]').on('click', '[data-'+PLUGIN_NAME+'-next]', function (e) {
	            	that.next(e);
	            });

	            // Previous modal
	            that.$navigate.off('click', '.'+PLUGIN_NAME+'-navigate-prev').on('click', '.'+PLUGIN_NAME+'-navigate-prev', function (e) {
	            	that.prev(e);
	            });
				that.$element.off('click', '[data-'+PLUGIN_NAME+'-prev]').on('click', '[data-'+PLUGIN_NAME+'-prev]', function (e) {
	            	that.prev(e);
	            });
			}

		    if(this.state == STATES.CLOSED){

		    	bindEvents();

				this.setGroup();
				this.state = STATES.OPENING;
	            this.$element.trigger(STATES.OPENING);
				this.$element.attr('aria-hidden', 'false');

				// console.info('[ '+PLUGIN_NAME+' | '+this.id+' ] Opening...');

				if (this.options.timeoutProgressbar === true) {
					this.$element.find('.'+PLUGIN_NAME+'-progressbar > div').width('100%');
				}

				if(this.options.iframe === true){

					this.$element.find('.'+PLUGIN_NAME+'-content').addClass(PLUGIN_NAME+'-content-loader');

					this.$element.find('.'+PLUGIN_NAME+'-iframe').on('load', function(){
						$(this).parent().removeClass(PLUGIN_NAME+'-content-loader');
					});

					var href = null;
					try {
						href = $(param.currentTarget).attr('href') !== '' ? $(param.currentTarget).attr('href') : null;
					} catch(e) { /* console.warn(exc); */ }

					if( (this.options.iframeURL !== null) && (href === null || href === undefined)){
						href = this.options.iframeURL;
					}
					if(href === null || href === undefined){
						throw new Error('Failed to find iframe URL');
					}
				    this.$element.find('.'+PLUGIN_NAME+'-iframe').attr('src', href);
				}


				if (this.options.bodyOverflow || isMobile){
					$('html').addClass(PLUGIN_NAME+'-isOverflow');
					if(isMobile){
						$('body').css('overflow', 'hidden');
					}
				}

				if (this.options.onOpening && typeof(this.options.onOpening) === 'function') {
			        this.options.onOpening(this);
			    }
				(function open(){

			    	if(that.group.ids.length > 1 ){

			    		that.$navigate.appendTo('body');
			    		that.$navigate.addClass('fadeIn');

			    		if(that.options.navigateCaption === true){
			    			that.$navigate.find('.'+PLUGIN_NAME+'-navigate-caption').show();
			    		}

			    		var modalWidth = that.$element.outerWidth();
			    		if(that.options.navigateArrows !== false){
					    	if (that.options.navigateArrows === 'closeScreenEdge'){
				    			that.$navigate.find('.'+PLUGIN_NAME+'-navigate-prev').css('left', 0).show();
				    			that.$navigate.find('.'+PLUGIN_NAME+'-navigate-next').css('right', 0).show();
					    	} else {
						    	that.$navigate.find('.'+PLUGIN_NAME+'-navigate-prev').css('margin-left', -((modalWidth/2)+84)).show();
						    	that.$navigate.find('.'+PLUGIN_NAME+'-navigate-next').css('margin-right', -((modalWidth/2)+84)).show();
					    	}
			    		} else {
			    			that.$navigate.find('.'+PLUGIN_NAME+'-navigate-prev').hide();
			    			that.$navigate.find('.'+PLUGIN_NAME+'-navigate-next').hide();
			    		}

			    		var loop;
						if(that.group.index === 0){

							loop = $('.'+PLUGIN_NAME+'[data-'+PLUGIN_NAME+'-group="'+that.group.name+'"][data-'+PLUGIN_NAME+'-loop]').length;

							if(loop === 0 && that.options.loop === false)
								that.$navigate.find('.'+PLUGIN_NAME+'-navigate-prev').hide();
				    	}
				    	if(that.group.index+1 === that.group.ids.length){

				    		loop = $('.'+PLUGIN_NAME+'[data-'+PLUGIN_NAME+'-group="'+that.group.name+'"][data-'+PLUGIN_NAME+'-loop]').length;

							if(loop === 0 && that.options.loop === false)
								that.$navigate.find('.'+PLUGIN_NAME+'-navigate-next').hide();
				    	}
			    	}

					if(that.options.overlay === true) {

						if(that.options.appendToOverlay === false){
							that.$overlay.appendTo('body');
						} else {
							that.$overlay.appendTo( that.options.appendToOverlay );
						}
					}

					if (that.options.transitionInOverlay) {
						that.$overlay.addClass(that.options.transitionInOverlay);
					}

					var transitionIn = that.options.transitionIn;

					if( typeof param == 'object' ){
						
						if(param.transition !== undefined || param.transitionIn !== undefined){
							transitionIn = param.transition || param.transitionIn;
						}
						if(param.zindex !== undefined){
							that.setZindex(param.zindex);
						}
					}

					if (transitionIn !== '' && animationEvent !== undefined) {

						that.$element.addClass('transitionIn '+transitionIn).show();
						that.$wrap.one(animationEvent, function () {

						    that.$element.removeClass(transitionIn + ' transitionIn');
						    that.$overlay.removeClass(that.options.transitionInOverlay);
						    that.$navigate.removeClass('fadeIn');

							opened();
						});

					} else {

						that.$element.show();
						opened();
					}

					if(that.options.pauseOnHover === true && that.options.pauseOnHover === true && that.options.timeout !== false && !isNaN(parseInt(that.options.timeout)) && that.options.timeout !== false && that.options.timeout !== 0){

						that.$element.off('mouseenter').on('mouseenter', function(event) {
							event.preventDefault();
							that.isPaused = true;
						});
						that.$element.off('mouseleave').on('mouseleave', function(event) {
							event.preventDefault();
							that.isPaused = false;
						});
					}

				})();

				if (this.options.timeout !== false && !isNaN(parseInt(this.options.timeout)) && this.options.timeout !== false && this.options.timeout !== 0) {

					that.startProgress(this.options.timeout);
				}

	            // Close on overlay click
	            if (this.options.overlayClose && !this.$element.hasClass(this.options.transitionOut)) {
	            	this.$overlay.click(function () {
	                    that.close();
	            	});
	            }

				if (this.options.focusInput){
			    	this.$element.find(':input:not(button):enabled:visible:first').focus(); // Focus on the first field
				}

				(function updateTimer(){
			    	that.recalcLayout();
				    that.timer = setTimeout(updateTimer, 300);
				})();

	            // Close when the Escape key is pressed
	            $document.on('keydown.'+PLUGIN_NAME, function (e) {
	                if (that.options.closeOnEscape && e.keyCode === 27) {
	                    that.close();
	                }
	            });

		    }

		},

		close: function (param) {

			var that = this;

			function closed(){

                // console.info('[ '+PLUGIN_NAME+' | '+that.id+' ] Closed.');

                that.state = STATES.CLOSED;
                that.$element.trigger(STATES.CLOSED);

                if (that.options.iframe === true) {
                    that.$element.find('.'+PLUGIN_NAME+'-iframe').attr('src', '');
                }

				if (that.options.bodyOverflow || isMobile){
					$('html').removeClass(PLUGIN_NAME+'-isOverflow');
					if(isMobile){
						$('body').css('overflow','auto');
					}
				}

				if (that.options.onClosed && typeof(that.options.onClosed) === 'function') {
					that.options.onClosed(that);
				}

				if(that.options.restoreDefaultContent === true){
				    that.$element.find('.'+PLUGIN_NAME+'-content').html( that.content );
				}

				if( $('.'+PLUGIN_NAME+':visible').length === 0 ){
					$('html').removeClass(PLUGIN_NAME+'-isAttached');
				}
			}

            if(this.state == STATES.OPENED || this.state == STATES.OPENING){

            	$document.off('keydown.'+PLUGIN_NAME);

				this.state = STATES.CLOSING;
				this.$element.trigger(STATES.CLOSING);
				this.$element.attr('aria-hidden', 'true');

				// console.info('[ '+PLUGIN_NAME+' | '+this.id+' ] Closing...');

	            clearTimeout(this.timer);
	            clearTimeout(this.timerTimeout);

				if (that.options.onClosing && typeof(that.options.onClosing) === "function") {
			        that.options.onClosing(this);
			    }

				var transitionOut = this.options.transitionOut;

				if( typeof param == 'object' ){
					if(param.transition !== undefined || param.transitionOut !== undefined){
						transitionOut = param.transition || param.transitionOut;
					}
				}

				if( (transitionOut === false || transitionOut === '' ) || animationEvent === undefined){

	                this.$element.hide();
	                this.$overlay.remove();
                	this.$navigate.remove();
	                closed();

				} else {

	                this.$element.attr('class', [
						this.classes,
						PLUGIN_NAME,
						transitionOut,
						this.options.theme == 'light' ? PLUGIN_NAME+'-light' : this.options.theme,
						this.isFullscreen === true ? 'isFullscreen' : '',
						this.options.rtl ? PLUGIN_NAME+'-rtl' : ''
					].join(' '));

					this.$overlay.attr('class', PLUGIN_NAME + '-overlay ' + this.options.transitionOutOverlay);

					if(that.options.navigateArrows !== false && !isMobile){
						this.$navigate.attr('class', PLUGIN_NAME + '-navigate fadeOut');
					}

	                this.$element.one(animationEvent, function () {

	                    if( that.$element.hasClass(transitionOut) ){
	                        that.$element.removeClass(transitionOut + ' transitionOut').hide();
	                    }
                        that.$overlay.removeClass(that.options.transitionOutOverlay).remove();
						that.$navigate.removeClass('fadeOut').remove();
						closed();
	                });

				}

            }
		},

		next: function(e){

            var that = this;
            var transitionIn = 'fadeInRight';
            var transitionOut = 'fadeOutLeft';
			var modal = $('.'+PLUGIN_NAME+':visible');
            var modals = {};
				modals.out = this;

			if(e !== undefined && typeof e !== 'object'){
            	e.preventDefault();
            	modal = $(e.currentTarget);
            	transitionIn = modal.attr('data-'+PLUGIN_NAME+'-transitionIn');
            	transitionOut = modal.attr('data-'+PLUGIN_NAME+'-transitionOut');
			} else if(e !== undefined){
				if(e.transitionIn !== undefined){
					transitionIn = e.transitionIn;
				}
				if(e.transitionOut !== undefined){
					transitionOut = e.transitionOut;
				}
			}

        	this.close({transition:transitionOut});

			setTimeout(function(){

				var loop = $('.'+PLUGIN_NAME+'[data-'+PLUGIN_NAME+'-group="'+that.group.name+'"][data-'+PLUGIN_NAME+'-loop]').length;
				for (var i = that.group.index+1; i <= that.group.ids.length; i++) {

					try {
						modals.in = $("#"+that.group.ids[i]).data().iziModal;
					} catch(log) {
						// console.info('[ '+PLUGIN_NAME+' ] No next modal.');
					}
					if(typeof modals.in !== 'undefined'){

						$('#'+that.group.ids[i]).iziModal('open', { transition: transitionIn });
						break;

					} else {

						if(i == that.group.ids.length && loop > 0 || that.options.loop === true){

							for (var index = 0; index <= that.group.ids.length; index++) {

								modals.in = $('#'+that.group.ids[index]).data().iziModal;
								if(typeof modals.in !== 'undefined'){

                					$('#'+that.group.ids[index]).iziModal('open', { transition: transitionIn });
               
									break;
								}
							}
						}
					}
				}

			}, 200);

			$(document).trigger( PLUGIN_NAME + '-group-change', modals );
		},

		prev: function(e){
            var that = this;
            var transitionIn = 'fadeInLeft';
            var transitionOut = 'fadeOutRight';
			var modal = $('.'+PLUGIN_NAME+':visible');
            var modals = {};
				modals.out = this;

			if(e !== undefined && typeof e !== 'object'){
            	e.preventDefault();
            	modal = $(e.currentTarget);
            	transitionIn = modal.attr('data-'+PLUGIN_NAME+'-transitionIn');
            	transitionOut = modal.attr('data-'+PLUGIN_NAME+'-transitionOut');

			} else if(e !== undefined){

				if(e.transitionIn !== undefined){
					transitionIn = e.transitionIn;
				}
				if(e.transitionOut !== undefined){
					transitionOut = e.transitionOut;
				}
			}

			this.close({transition:transitionOut});

			setTimeout(function(){

				var loop = $('.'+PLUGIN_NAME+'[data-'+PLUGIN_NAME+'-group="'+that.group.name+'"][data-'+PLUGIN_NAME+'-loop]').length;

				for (var i = that.group.index; i >= 0; i--) {

					try {
						modals.in = $('#'+that.group.ids[i-1]).data().iziModal;
					} catch(log) {
						// console.info('[ '+PLUGIN_NAME+' ] No previous modal.');
					}
					if(typeof modals.in !== 'undefined'){

						$('#'+that.group.ids[i-1]).iziModal('open', { transition: transitionIn });
						break;

					} else {

						if(i === 0 && loop > 0 || that.options.loop === true){

							for (var index = that.group.ids.length-1; index >= 0; index--) {

								modals.in = $('#'+that.group.ids[index]).data().iziModal;
								if(typeof modals.in !== 'undefined'){

									$('#'+that.group.ids[index]).iziModal('open', { transition: transitionIn });

									break;
								}
							}
						}
					}
				}

			}, 200);

			$(document).trigger( PLUGIN_NAME + '-group-change', modals );
		},

		destroy: function() {
			var e = $.Event('destroy');

			this.$element.trigger(e);

            $document.off('keydown.'+PLUGIN_NAME);

			clearTimeout(this.timer);
			clearTimeout(this.timerTimeout);

			if (this.options.iframe === true) {
				this.$element.find('.'+PLUGIN_NAME+'-iframe').remove();
			}
			this.$element.html(this.$element.find('.'+PLUGIN_NAME+'-content').html());

			this.$element.off('click', '[data-'+PLUGIN_NAME+'-close]');
			this.$element.off('click', '[data-'+PLUGIN_NAME+'-fullscreen]');

			this.$element
				.off('.'+PLUGIN_NAME)
				.removeData(PLUGIN_NAME)
				.attr('style', '');

			this.$overlay.remove();
			this.$navigate.remove();
			this.$element.trigger(STATES.DESTROYED);
			this.$element = null;
		},

		getState: function(){

			return this.state;
		},

		getGroup: function(){

			return this.group;
		},

		setWidth: function(width){

			this.options.width = width;

			this.recalcWidth();

			var modalWidth = this.$element.outerWidth();
    		if(this.options.navigateArrows === true || this.options.navigateArrows == 'closeToModal'){
		    	this.$navigate.find('.'+PLUGIN_NAME+'-navigate-prev').css('margin-left', -((modalWidth/2)+84)).show();
		    	this.$navigate.find('.'+PLUGIN_NAME+'-navigate-next').css('margin-right', -((modalWidth/2)+84)).show();
    		}

		},

		setTop: function(top){

			this.options.top = top;

			this.recalcVerticalPos(false);
		},

		setBottom: function(bottom){

			this.options.bottom = bottom;

			this.recalcVerticalPos(false);

		},

		setHeader: function(status){

			if(status){
				this.$element.find('.'+PLUGIN_NAME+'-header').show();
			} else {
				this.headerHeight = 0;
				this.$element.find('.'+PLUGIN_NAME+'-header').hide();
			}
		},

		setTitle: function(title){

			this.options.title = title;

			if(this.headerHeight === 0){
				this.createHeader();
			}

			if( this.$header.find('.'+PLUGIN_NAME+'-header-title').length === 0 ){
				this.$header.append('<h2 class="'+PLUGIN_NAME+'-header-title"></h2>');
			}

			this.$header.find('.'+PLUGIN_NAME+'-header-title').html(title);
		},

		setSubtitle: function(subtitle){

			if(subtitle === ''){

				this.$header.find('.'+PLUGIN_NAME+'-header-subtitle').remove();
				this.$header.addClass(PLUGIN_NAME+'-noSubtitle');

			} else {

				if( this.$header.find('.'+PLUGIN_NAME+'-header-subtitle').length === 0 ){
					this.$header.append('<p class="'+PLUGIN_NAME+'-header-subtitle"></p>');
				}
				this.$header.removeClass(PLUGIN_NAME+'-noSubtitle');

			}

			this.$header.find('.'+PLUGIN_NAME+'-header-subtitle').html(subtitle);
			this.options.subtitle = subtitle;
		},

		setIcon: function(icon){

			if( this.$header.find('.'+PLUGIN_NAME+'-header-icon').length === 0 ){
				this.$header.prepend('<i class="'+PLUGIN_NAME+'-header-icon"></i>');
			}
			this.$header.find('.'+PLUGIN_NAME+'-header-icon').attr('class', PLUGIN_NAME+'-header-icon ' + icon);
			this.options.icon = icon;
		},

		setIconText: function(iconText){

			this.$header.find('.'+PLUGIN_NAME+'-header-icon').html(iconText);
			this.options.iconText = iconText;
		},

		setHeaderColor: function(headerColor){
			if(this.options.borderBottom === true){
            	this.$element.css('border-bottom', '3px solid ' + headerColor + '');
        	}
            this.$header.css('background', headerColor);
            this.options.headerColor = headerColor;
		},

		setBackground: function(background){
			if(background === false){
				this.options.background = null;
				this.$element.css('background', '');
			} else{
            	this.$element.css('background', background);
            	this.options.background = background;
			}
		},

		setZindex: function(zindex){

	        if (!isNaN(parseInt(this.options.zindex))) {
	        	this.options.zindex = zindex;
			 	this.$element.css('z-index', zindex);
			 	this.$navigate.css('z-index', zindex-1);
			 	this.$overlay.css('z-index', zindex-2);
	        }
		},

		setFullscreen: function(value){

			if(value){
			    this.isFullscreen = true;
			    this.$element.addClass('isFullscreen');
			} else {
				this.isFullscreen = false;
			    this.$element.removeClass('isFullscreen');
			}

		},

		setContent: function(content){

			if( typeof content == 'object' ){
				var replace = content.default || false;
				if(replace === true){
					this.content = content.content;
				}
				content = content.content;
			}
            if (this.options.iframe === false) {
        		this.$element.find('.'+PLUGIN_NAME+'-content').html(content);
            }

		},

		setTransitionIn: function(transition){

			this.options.transitionIn = transition;
		},

		setTransitionOut: function(transition){

			this.options.transitionOut = transition;
		},

		setTimeout: function(timeout){

			this.options.timeout = timeout;
		},

		resetContent: function(){

			this.$element.find('.'+PLUGIN_NAME+'-content').html(this.content);
		},

		startLoading: function(){

			if( !this.$element.find('.'+PLUGIN_NAME+'-loader').length ){
				this.$element.append('<div class="'+PLUGIN_NAME+'-loader fadeIn"></div>');
			}
			this.$element.find('.'+PLUGIN_NAME+'-loader').css({
				top: this.headerHeight,
    			borderRadius: this.options.radius
			});
		},

		stopLoading: function(){

			var $loader = this.$element.find('.'+PLUGIN_NAME+'-loader');

			if( !$loader.length ){
				this.$element.prepend('<div class="'+PLUGIN_NAME+'-loader fadeIn"></div>');
				$loader = this.$element.find('.'+PLUGIN_NAME+'-loader').css('border-radius', this.options.radius);
			}
			$loader.removeClass('fadeIn').addClass('fadeOut');
			setTimeout(function(){
				$loader.remove();
			},600);
		},

		recalcWidth: function(){

			var that = this;

            this.$element.css('max-width', this.options.width);

            if(isIE()){
            	var modalWidth = that.options.width;

            	if(modalWidth.toString().split('%').length > 1){
					modalWidth = that.$element.outerWidth();
            	}
            	that.$element.css({
            		left: '50%',
            		marginLeft: -(modalWidth/2)
            	});
            }
		},

		recalcVerticalPos: function(first){

			if(this.options.top !== null && this.options.top !== false){
            	this.$element.css('margin-top', this.options.top);
            	if(this.options.top === 0){
            		this.$element.css({
            			borderTopRightRadius: 0,
            			borderTopLeftRadius: 0
            		});
            	}
			} else {
				if(first === false){
					this.$element.css({
						marginTop: '',
            			borderRadius: this.options.radius
            		});
				}
			}
			if (this.options.bottom !== null && this.options.bottom !== false){
            	this.$element.css('margin-bottom', this.options.bottom);
            	if(this.options.bottom === 0){
            		this.$element.css({
            			borderBottomRightRadius: 0,
            			borderBottomLeftRadius: 0
            		});
            	}
			} else {
				if(first === false){
					this.$element.css({
						marginBottom: '',
            			borderRadius: this.options.radius
            		});
				}
			}

		},

		recalcLayout: function(){

			var that = this,
        		windowHeight = $window.height(),
                modalHeight = this.$element.outerHeight(),
                modalWidth = this.$element.outerWidth(),
                contentHeight = this.$element.find('.'+PLUGIN_NAME+'-content')[0].scrollHeight,
            	outerHeight = contentHeight + this.headerHeight,
            	wrapperHeight = this.$element.innerHeight() - this.headerHeight,
                modalMargin = parseInt(-((this.$element.innerHeight() + 1) / 2)) + 'px',
            	scrollTop = this.$wrap.scrollTop(),
            	borderSize = 0;

			if(isIE()){
				if( modalWidth >= $window.width() || this.isFullscreen === true ){
					this.$element.css({
						left: '0',
						marginLeft: ''
					});
				} else {
	            	this.$element.css({
	            		left: '50%',
	            		marginLeft: -(modalWidth/2)
	            	});
				}
			}

			if(this.options.borderBottom === true && this.options.title !== ''){
				borderSize = 3;
			}

            if(this.$element.find('.'+PLUGIN_NAME+'-header').length && this.$element.find('.'+PLUGIN_NAME+'-header').is(':visible') ){
            	this.headerHeight = parseInt(this.$element.find('.'+PLUGIN_NAME+'-header').innerHeight());
            	this.$element.css('overflow', 'hidden');
            } else {
            	this.headerHeight = 0;
            	this.$element.css('overflow', '');
            }

			if(this.$element.find('.'+PLUGIN_NAME+'-loader').length){
				this.$element.find('.'+PLUGIN_NAME+'-loader').css('top', this.headerHeight);
			}

			if(modalHeight !== this.modalHeight){
				this.modalHeight = modalHeight;

				if (this.options.onResize && typeof(this.options.onResize) === "function") {
			        this.options.onResize(this);
			    }
			}

            if(this.state == STATES.OPENED || this.state == STATES.OPENING){

				if (this.options.iframe === true) {

					// If the height of the window is smaller than the modal with iframe
					if(windowHeight < (this.options.iframeHeight + this.headerHeight+borderSize) || this.isFullscreen === true){
						this.$element.find('.'+PLUGIN_NAME+'-iframe').css( 'height', windowHeight - (this.headerHeight+borderSize));
					} else {
						this.$element.find('.'+PLUGIN_NAME+'-iframe').css( 'height', this.options.iframeHeight);
					}
				}

				if(modalHeight == windowHeight){
					this.$element.addClass('isAttached');
				} else {
					this.$element.removeClass('isAttached');
				}

        		if(this.isFullscreen === false && this.$element.width() >= $window.width() ){
        			this.$element.find('.'+PLUGIN_NAME+'-button-fullscreen').hide();
        		} else {
        			this.$element.find('.'+PLUGIN_NAME+'-button-fullscreen').show();
        		}
				this.recalcButtons();

				if(this.isFullscreen === false){
	                	windowHeight = windowHeight - (clearValue(this.options.top) || 0) - (clearValue(this.options.bottom) || 0);
				}
                // If the modal is larger than the height of the window..
                if (outerHeight > windowHeight) {
					if(this.options.top > 0 && this.options.bottom === null && contentHeight < $window.height()){
				    	this.$element.addClass('isAttachedBottom');
					}
					if(this.options.bottom > 0 && this.options.top === null && contentHeight < $window.height()){
				    	this.$element.addClass('isAttachedTop');
					}
					if( $('.'+PLUGIN_NAME+':visible').length === 1 ){
						$('html').addClass(PLUGIN_NAME+'-isAttached');
					}
					this.$element.css( 'height', windowHeight );

                } else {
                	this.$element.css('height', contentHeight + (this.headerHeight+borderSize));
		    		this.$element.removeClass('isAttachedTop isAttachedBottom');
		    		if( $('.'+PLUGIN_NAME+':visible').length === 1 ){
		    			$('html').removeClass(PLUGIN_NAME+'-isAttached');
		    		}
                }

                (function applyScroll(){
                	if(contentHeight > wrapperHeight && outerHeight > windowHeight){
                		that.$element.addClass('hasScroll');
                		that.$wrap.css('height', modalHeight - (that.headerHeight+borderSize));
                	} else {
                		that.$element.removeClass('hasScroll');
                		that.$wrap.css('height', 'auto');
                	}
            	})();

	            (function applyShadow(){
	                if (wrapperHeight + scrollTop < (contentHeight - 30)) {
	                    that.$element.addClass('hasShadow');
	                } else {
	                    that.$element.removeClass('hasShadow');
	                }
				})();

        	}
		},

		recalcButtons: function(){
			var widthButtons = this.$header.find('.'+PLUGIN_NAME+'-header-buttons').innerWidth()+10;
			if(this.options.rtl === true){
				this.$header.css('padding-left', widthButtons);
			} else {
				this.$header.css('padding-right', widthButtons);
			}
		}

	};


	$window.off('load.'+PLUGIN_NAME).on('load.'+PLUGIN_NAME, function(e) {

		var modalHash = document.location.hash;

		if(window.$iziModal.autoOpen === 0 && !$('.'+PLUGIN_NAME).is(':visible')){

			try {
				var data = $(modalHash).data();
				if(typeof data !== 'undefined'){
					if(data.iziModal.options.autoOpen !== false){
						$(modalHash).iziModal('open');
					}
				}
			} catch(exc) { /* console.warn(exc); */ }
		}

	});

	$window.off('hashchange.'+PLUGIN_NAME).on('hashchange.'+PLUGIN_NAME, function(e) {

		var modalHash = document.location.hash;

		if(modalHash !== ''){
			try {
      			var data = $(modalHash).data();

				if(typeof data !== 'undefined' && $(modalHash).iziModal('getState') !== 'opening'){
					setTimeout(function(){
						$(modalHash).iziModal('open', { preventClose: false });
					},200);
				}
			} catch(exc) { /* console.warn(exc); */ }

		} else {

			if(window.$iziModal.history){
				$.each( $('.'+PLUGIN_NAME) , function(index, modal) {
					if( $(modal).data().iziModal !== undefined ){
						var state = $(modal).iziModal('getState');
						if(state == 'opened' || state == 'opening'){
							$(modal).iziModal('close');
						}
					}
				});
			}
		}

	});

	$document.off('click', '[data-'+PLUGIN_NAME+'-open]').on('click', '[data-'+PLUGIN_NAME+'-open]', function(e) {
		e.preventDefault();

		var modal = $('.'+PLUGIN_NAME+':visible');
		var openModal = $(e.currentTarget).attr('data-'+PLUGIN_NAME+'-open');
		var preventClose = $(e.currentTarget).attr('data-'+PLUGIN_NAME+'-preventClose');
		var transitionIn = $(e.currentTarget).attr('data-'+PLUGIN_NAME+'-transitionIn');
		var transitionOut = $(e.currentTarget).attr('data-'+PLUGIN_NAME+'-transitionOut');
		var zindex = $(e.currentTarget).attr('data-'+PLUGIN_NAME+'-zindex');

		if(zindex !== undefined)
			$(openModal).iziModal('setZindex', zindex);

		if(preventClose === undefined){
			if(transitionOut !== undefined){
				modal.iziModal('close', {
					transition: transitionOut
				});
			} else {
				modal.iziModal('close');
			}
		}
		
		setTimeout(function(){
			if(transitionIn !== undefined){
				$(openModal).iziModal('open', {
					transition: transitionIn
				});
			} else {
				$(openModal).iziModal('open');
			}
		}, 200);
	});

	$document.off('keyup.'+PLUGIN_NAME).on('keyup.'+PLUGIN_NAME, function(event) {

		if( $('.'+PLUGIN_NAME+':visible').length ){
			var modal = $('.'+PLUGIN_NAME+':visible')[0].id,
				arrowKeys = $('#'+modal).data().iziModal.options.arrowKeys,
				group = $('#'+modal).iziModal('getGroup'),
				e = event || window.event,
				target = e.target || e.srcElement,
				modals = {};

			if(modal !== undefined && arrowKeys && group.name !== undefined && !e.ctrlKey && !e.metaKey && !e.altKey && target.tagName.toUpperCase() !== 'INPUT' && target.tagName.toUpperCase() != 'TEXTAREA'){ //&& $(e.target).is('body')

				if(e.keyCode === 37) { // left
					$('#'+modal).iziModal('prev', e);
				}
				else if(e.keyCode === 39 ) { // right
					$('#'+modal).iziModal('next', e);
				}
			}
		}
	});

	$.fn[PLUGIN_NAME] = function(option, args) {


		if( !$(this).length && typeof option == 'object'){

			var newEL = {
				$el: document.createElement('div'),
				id: this.selector.split('#'),
				class: this.selector.split('.')
			};

			if(newEL.id.length > 1){
				try{
					newEL.$el = document.createElement(id[0]);
				} catch(exc){ }

				newEL.$el.id = this.selector.split('#')[1].trim();

			} else if(newEL.class.length > 1){
				try{
					newEL.$el = document.createElement(newEL.class[0]);
				} catch(exc){ }

				for (var x=1; x<newEL.class.length; x++) {
					newEL.$el.classList.add(newEL.class[x].trim());
				}
			}
			document.body.appendChild(newEL.$el);

			this.push($(this.selector));
		}
		var objs = this;

		for (var i=0; i<objs.length; i++) {

			var $this = $(objs[i]);
			var data = $this.data(PLUGIN_NAME);
			var options = $.extend({}, $.fn[PLUGIN_NAME].defaults, $this.data(), typeof option == 'object' && option);

			if (!data && (!option || typeof option == 'object')){

				$this.data(PLUGIN_NAME, (data = new iziModal($this, options)));
			}
			else if (typeof option == 'string' && typeof data != 'undefined'){

				return data[option].apply(data, [].concat(args));
			}
			if (options.autoOpen){ // Automatically open the modal if autoOpen setted true or ms

				if( !isNaN(parseInt(options.autoOpen)) ){

					setTimeout(function(){
						data.open();
					}, options.autoOpen);

				} else if(options.autoOpen === true ) {

					data.open();
				}
				window.$iziModal.autoOpen++;
			}
		}

        return this;
    };

	$.fn[PLUGIN_NAME].defaults = {
	    title: '',
	    subtitle: '',
	    headerColor: '#88A0B9',
	    background: null,
	    theme: '',  // light
	    icon: null,
	    iconText: null,
	    iconColor: '',
	    rtl: false,
	    width: 600,
	    top: null,
	    bottom: null,
	    borderBottom: true,
	    padding: 0,
	    radius: 3,
	    zindex: 999,
	    iframe: false,
	    iframeHeight: 400,
	    iframeURL: null,
	    focusInput: true,
	    group: '',
	    loop: false,
	    arrowKeys: true,
	    navigateCaption: true,
	    navigateArrows: true, // Boolean, 'closeToModal', 'closeScreenEdge'
	    history: false,
	    restoreDefaultContent: false,
	    autoOpen: 0, // Boolean, Number
	    bodyOverflow: false,
	    fullscreen: false,
	    openFullscreen: false,
	    closeOnEscape: true,
	    closeButton: true,
	    appendTo: 'body', // or false
	    appendToOverlay: 'body', // or false
	    overlay: true,
	    overlayClose: true,
	    overlayColor: 'rgba(0, 0, 0, 0.4)',
	    timeout: false,
	    timeoutProgressbar: false,
	    pauseOnHover: false,
	    timeoutProgressbarColor: 'rgba(255,255,255,0.5)',
	    transitionIn: 'comingIn',   // comingIn, bounceInDown, bounceInUp, fadeInDown, fadeInUp, fadeInLeft, fadeInRight, flipInX
	    transitionOut: 'comingOut', // comingOut, bounceOutDown, bounceOutUp, fadeOutDown, fadeOutUp, , fadeOutLeft, fadeOutRight, flipOutX
	    transitionInOverlay: 'fadeIn',
	    transitionOutOverlay: 'fadeOut',
	    onFullscreen: function(){},
	    onResize: function(){},
        onOpening: function(){},
        onOpened: function(){},
        onClosing: function(){},
        onClosed: function(){},
        afterRender: function(){}
	};

	$.fn[PLUGIN_NAME].Constructor = iziModal;

    return $.fn.iziModal;

}));

/*!
* Parsley.js
* Version 2.8.1 - built Sat, Feb 3rd 2018, 2:27 pm
* http://parsleyjs.org
* Guillaume Potier - <guillaume@wisembly.com>
* Marc-Andre Lafortune - <petroselinum@marc-andre.ca>
* MIT Licensed
*/
function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,i=Array(e.length);t<e.length;t++)i[t]=e[t];return i}return Array.from(e)}var _slice=Array.prototype.slice,_slicedToArray=function(){function e(e,t){var i=[],n=!0,r=!1,s=void 0;try{for(var a,o=e[Symbol.iterator]();!(n=(a=o.next()).done)&&(i.push(a.value),!t||i.length!==t);n=!0);}catch(l){r=!0,s=l}finally{try{!n&&o["return"]&&o["return"]()}finally{if(r)throw s}}return i}return function(t,i){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e};!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("jquery")):"function"==typeof define&&define.amd?define(["jquery"],t):e.parsley=t(e.jQuery)}(this,function(e){"use strict";function t(e,t){return e.parsleyAdaptedCallback||(e.parsleyAdaptedCallback=function(){var i=Array.prototype.slice.call(arguments,0);i.unshift(this),e.apply(t||M,i)}),e.parsleyAdaptedCallback}function i(e){return 0===e.lastIndexOf(D,0)?e.substr(D.length):e}/**
   * inputevent - Alleviate browser bugs for input events
   * https://github.com/marcandre/inputevent
   * @version v0.0.3 - (built Thu, Apr 14th 2016, 5:58 pm)
   * @author Marc-Andre Lafortune <github@marc-andre.ca>
   * @license MIT
   */
function n(){var t=this,i=window||global;_extends(this,{isNativeEvent:function(e){return e.originalEvent&&e.originalEvent.isTrusted!==!1},fakeInputEvent:function(i){t.isNativeEvent(i)&&e(i.target).trigger("input")},misbehaves:function(i){t.isNativeEvent(i)&&(t.behavesOk(i),e(document).on("change.inputevent",i.data.selector,t.fakeInputEvent),t.fakeInputEvent(i))},behavesOk:function(i){t.isNativeEvent(i)&&e(document).off("input.inputevent",i.data.selector,t.behavesOk).off("change.inputevent",i.data.selector,t.misbehaves)},install:function(){if(!i.inputEventPatched){i.inputEventPatched="0.0.3";for(var n=["select",'input[type="checkbox"]','input[type="radio"]','input[type="file"]'],r=0;r<n.length;r++){var s=n[r];e(document).on("input.inputevent",s,{selector:s},t.behavesOk).on("change.inputevent",s,{selector:s},t.misbehaves)}}},uninstall:function(){delete i.inputEventPatched,e(document).off(".inputevent")}})}var r=1,s={},a={attr:function(e,t,i){var n,r,s,a=new RegExp("^"+t,"i");if("undefined"==typeof i)i={};else for(n in i)i.hasOwnProperty(n)&&delete i[n];if(!e)return i;for(s=e.attributes,n=s.length;n--;)r=s[n],r&&r.specified&&a.test(r.name)&&(i[this.camelize(r.name.slice(t.length))]=this.deserializeValue(r.value));return i},checkAttr:function(e,t,i){return e.hasAttribute(t+i)},setAttr:function(e,t,i,n){e.setAttribute(this.dasherize(t+i),String(n))},getType:function(e){return e.getAttribute("type")||"text"},generateID:function(){return""+r++},deserializeValue:function(e){var t;try{return e?"true"==e||"false"!=e&&("null"==e?null:isNaN(t=Number(e))?/^[\[\{]/.test(e)?JSON.parse(e):e:t):e}catch(i){return e}},camelize:function(e){return e.replace(/-+(.)?/g,function(e,t){return t?t.toUpperCase():""})},dasherize:function(e){return e.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()},warn:function(){var e;window.console&&"function"==typeof window.console.warn&&(e=window.console).warn.apply(e,arguments)},warnOnce:function(e){s[e]||(s[e]=!0,this.warn.apply(this,arguments))},_resetWarnings:function(){s={}},trimString:function(e){return e.replace(/^\s+|\s+$/g,"")},parse:{date:function S(e){var t=e.match(/^(\d{4,})-(\d\d)-(\d\d)$/);if(!t)return null;var i=t.map(function(e){return parseInt(e,10)}),n=_slicedToArray(i,4),r=(n[0],n[1]),s=n[2],a=n[3],S=new Date(r,s-1,a);return S.getFullYear()!==r||S.getMonth()+1!==s||S.getDate()!==a?null:S},string:function(e){return e},integer:function(e){return isNaN(e)?null:parseInt(e,10)},number:function(e){if(isNaN(e))throw null;return parseFloat(e)},"boolean":function(e){return!/^\s*false\s*$/i.test(e)},object:function(e){return a.deserializeValue(e)},regexp:function(e){var t="";return/^\/.*\/(?:[gimy]*)$/.test(e)?(t=e.replace(/.*\/([gimy]*)$/,"$1"),e=e.replace(new RegExp("^/(.*?)/"+t+"$"),"$1")):e="^"+e+"$",new RegExp(e,t)}},parseRequirement:function(e,t){var i=this.parse[e||"string"];if(!i)throw'Unknown requirement specification: "'+e+'"';var n=i(t);if(null===n)throw"Requirement is not a "+e+': "'+t+'"';return n},namespaceEvents:function(t,i){return t=this.trimString(t||"").split(/\s+/),t[0]?e.map(t,function(e){return e+"."+i}).join(" "):""},difference:function(t,i){var n=[];return e.each(t,function(e,t){i.indexOf(t)==-1&&n.push(t)}),n},all:function(t){return e.when.apply(e,_toConsumableArray(t).concat([42,42]))},objectCreate:Object.create||function(){var e=function(){};return function(t){if(arguments.length>1)throw Error("Second argument not supported");if("object"!=typeof t)throw TypeError("Argument must be an object");e.prototype=t;var i=new e;return e.prototype=null,i}}(),_SubmitSelector:'input[type="submit"], button:submit'},o={namespace:"data-parsley-",inputs:"input, textarea, select",excluded:"input[type=button], input[type=submit], input[type=reset], input[type=hidden]",priorityEnabled:!0,multiple:null,group:null,uiEnabled:!0,validationThreshold:3,focus:"first",trigger:!1,triggerAfterFailure:"input",errorClass:"parsley-error",successClass:"parsley-success",classHandler:function(e){},errorsContainer:function(e){},errorsWrapper:'<ul class="parsley-errors-list"></ul>',errorTemplate:"<li></li>"},l=function(){this.__id__=a.generateID()};l.prototype={asyncSupport:!0,_pipeAccordingToValidationResult:function(){var t=this,i=function(){var i=e.Deferred();return!0!==t.validationResult&&i.reject(),i.resolve().promise()};return[i,i]},actualizeOptions:function(){return a.attr(this.element,this.options.namespace,this.domOptions),this.parent&&this.parent.actualizeOptions&&this.parent.actualizeOptions(),this},_resetOptions:function(e){this.domOptions=a.objectCreate(this.parent.options),this.options=a.objectCreate(this.domOptions);for(var t in e)e.hasOwnProperty(t)&&(this.options[t]=e[t]);this.actualizeOptions()},_listeners:null,on:function(e,t){this._listeners=this._listeners||{};var i=this._listeners[e]=this._listeners[e]||[];return i.push(t),this},subscribe:function(t,i){e.listenTo(this,t.toLowerCase(),i)},off:function(e,t){var i=this._listeners&&this._listeners[e];if(i)if(t)for(var n=i.length;n--;)i[n]===t&&i.splice(n,1);else delete this._listeners[e];return this},unsubscribe:function(t,i){e.unsubscribeTo(this,t.toLowerCase())},trigger:function(e,t,i){t=t||this;var n,r=this._listeners&&this._listeners[e];if(r)for(var s=r.length;s--;)if(n=r[s].call(t,t,i),n===!1)return n;return!this.parent||this.parent.trigger(e,t,i)},asyncIsValid:function(e,t){return a.warnOnce("asyncIsValid is deprecated; please use whenValid instead"),this.whenValid({group:e,force:t})},_findRelated:function(){return this.options.multiple?e(this.parent.element.querySelectorAll("["+this.options.namespace+'multiple="'+this.options.multiple+'"]')):this.$element}};var u=function(e,t){var i=e.match(/^\s*\[(.*)\]\s*$/);if(!i)throw'Requirement is not an array: "'+e+'"';var n=i[1].split(",").map(a.trimString);if(n.length!==t)throw"Requirement has "+n.length+" values when "+t+" are needed";return n},d=function(e,t,i){var n=null,r={};for(var s in e)if(s){var o=i(s);"string"==typeof o&&(o=a.parseRequirement(e[s],o)),r[s]=o}else n=a.parseRequirement(e[s],t);return[n,r]},h=function(t){e.extend(!0,this,t)};h.prototype={validate:function(e,t){if(this.fn)return arguments.length>3&&(t=[].slice.call(arguments,1,-1)),this.fn(e,t);if(Array.isArray(e)){if(!this.validateMultiple)throw"Validator `"+this.name+"` does not handle multiple values";return this.validateMultiple.apply(this,arguments)}var i=arguments[arguments.length-1];if(this.validateDate&&i._isDateInput())return arguments[0]=a.parse.date(arguments[0]),null!==arguments[0]&&this.validateDate.apply(this,arguments);if(this.validateNumber)return!isNaN(e)&&(arguments[0]=parseFloat(arguments[0]),this.validateNumber.apply(this,arguments));if(this.validateString)return this.validateString.apply(this,arguments);throw"Validator `"+this.name+"` only handles multiple values"},parseRequirements:function(t,i){if("string"!=typeof t)return Array.isArray(t)?t:[t];var n=this.requirementType;if(Array.isArray(n)){for(var r=u(t,n.length),s=0;s<r.length;s++)r[s]=a.parseRequirement(n[s],r[s]);return r}return e.isPlainObject(n)?d(n,t,i):[a.parseRequirement(n,t)]},requirementType:"string",priority:2};var p=function(e,t){this.__class__="ValidatorRegistry",this.locale="en",this.init(e||{},t||{})},c={email:/^((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/,number:/^-?(\d*\.)?\d+(e[-+]?\d+)?$/i,integer:/^-?\d+$/,digits:/^\d+$/,alphanum:/^\w+$/i,date:{test:function(e){return null!==a.parse.date(e)}},url:new RegExp("^(?:(?:https?|ftp)://)?(?:\\S+(?::\\S*)?@)?(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]-*)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]-*)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:/\\S*)?$")};c.range=c.number;var f=function(e){var t=(""+e).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);return t?Math.max(0,(t[1]?t[1].length:0)-(t[2]?+t[2]:0)):0},m=function(e,t){return t.map(a.parse[e])},g=function(e,t){return function(i){for(var n=arguments.length,r=Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return r.pop(),t.apply(void 0,[i].concat(_toConsumableArray(m(e,r))))}},v=function(e){return{validateDate:g("date",e),validateNumber:g("number",e),requirementType:e.length<=2?"string":["string","string"],priority:30}};p.prototype={init:function(e,t){this.catalog=t,this.validators=_extends({},this.validators);for(var i in e)this.addValidator(i,e[i].fn,e[i].priority);window.Parsley.trigger("parsley:validator:init")},setLocale:function(e){if("undefined"==typeof this.catalog[e])throw new Error(e+" is not available in the catalog");return this.locale=e,this},addCatalog:function(e,t,i){return"object"==typeof t&&(this.catalog[e]=t),!0===i?this.setLocale(e):this},addMessage:function(e,t,i){return"undefined"==typeof this.catalog[e]&&(this.catalog[e]={}),this.catalog[e][t]=i,this},addMessages:function(e,t){for(var i in t)this.addMessage(e,i,t[i]);return this},addValidator:function(e,t,i){if(this.validators[e])a.warn('Validator "'+e+'" is already defined.');else if(o.hasOwnProperty(e))return void a.warn('"'+e+'" is a restricted keyword and is not a valid validator name.');return this._setValidator.apply(this,arguments)},hasValidator:function(e){return!!this.validators[e]},updateValidator:function(e,t,i){return this.validators[e]?this._setValidator.apply(this,arguments):(a.warn('Validator "'+e+'" is not already defined.'),this.addValidator.apply(this,arguments))},removeValidator:function(e){return this.validators[e]||a.warn('Validator "'+e+'" is not defined.'),delete this.validators[e],this},_setValidator:function(e,t,i){"object"!=typeof t&&(t={fn:t,priority:i}),t.validate||(t=new h(t)),this.validators[e]=t;for(var n in t.messages||{})this.addMessage(n,e,t.messages[n]);return this},getErrorMessage:function(e){var t;if("type"===e.name){var i=this.catalog[this.locale][e.name]||{};t=i[e.requirements]}else t=this.formatMessage(this.catalog[this.locale][e.name],e.requirements);return t||this.catalog[this.locale].defaultMessage||this.catalog.en.defaultMessage},formatMessage:function(e,t){if("object"==typeof t){for(var i in t)e=this.formatMessage(e,t[i]);return e}return"string"==typeof e?e.replace(/%s/i,t):""},validators:{notblank:{validateString:function(e){return/\S/.test(e)},priority:2},required:{validateMultiple:function(e){return e.length>0},validateString:function(e){return/\S/.test(e)},priority:512},type:{validateString:function(e,t){var i=arguments.length<=2||void 0===arguments[2]?{}:arguments[2],n=i.step,r=void 0===n?"any":n,s=i.base,a=void 0===s?0:s,o=c[t];if(!o)throw new Error("validator type `"+t+"` is not supported");if(!o.test(e))return!1;if("number"===t&&!/^any$/i.test(r||"")){var l=Number(e),u=Math.max(f(r),f(a));if(f(l)>u)return!1;var d=function(e){return Math.round(e*Math.pow(10,u))};if((d(l)-d(a))%d(r)!=0)return!1}return!0},requirementType:{"":"string",step:"string",base:"number"},priority:256},pattern:{validateString:function(e,t){return t.test(e)},requirementType:"regexp",priority:64},minlength:{validateString:function(e,t){return e.length>=t},requirementType:"integer",priority:30},maxlength:{validateString:function(e,t){return e.length<=t},requirementType:"integer",priority:30},length:{validateString:function(e,t,i){return e.length>=t&&e.length<=i},requirementType:["integer","integer"],priority:30},mincheck:{validateMultiple:function(e,t){return e.length>=t},requirementType:"integer",priority:30},maxcheck:{validateMultiple:function(e,t){return e.length<=t},requirementType:"integer",priority:30},check:{validateMultiple:function(e,t,i){return e.length>=t&&e.length<=i},requirementType:["integer","integer"],priority:30},min:v(function(e,t){return e>=t}),max:v(function(e,t){return e<=t}),range:v(function(e,t,i){return e>=t&&e<=i}),equalto:{validateString:function(t,i){var n=e(i);return n.length?t===n.val():t===i},priority:256}}};var y={},_=function k(e,t,i){for(var n=[],r=[],s=0;s<e.length;s++){for(var a=!1,o=0;o<t.length;o++)if(e[s].assert.name===t[o].assert.name){a=!0;break}a?r.push(e[s]):n.push(e[s])}return{kept:r,added:n,removed:i?[]:k(t,e,!0).added}};y.Form={_actualizeTriggers:function(){var e=this;this.$element.on("submit.Parsley",function(t){e.onSubmitValidate(t)}),this.$element.on("click.Parsley",a._SubmitSelector,function(t){e.onSubmitButton(t)}),!1!==this.options.uiEnabled&&this.element.setAttribute("novalidate","")},focus:function(){if(this._focusedField=null,!0===this.validationResult||"none"===this.options.focus)return null;for(var e=0;e<this.fields.length;e++){var t=this.fields[e];if(!0!==t.validationResult&&t.validationResult.length>0&&"undefined"==typeof t.options.noFocus&&(this._focusedField=t.$element,"first"===this.options.focus))break}return null===this._focusedField?null:this._focusedField.focus()},_destroyUI:function(){this.$element.off(".Parsley")}},y.Field={_reflowUI:function(){if(this._buildUI(),this._ui){var e=_(this.validationResult,this._ui.lastValidationResult);this._ui.lastValidationResult=this.validationResult,this._manageStatusClass(),this._manageErrorsMessages(e),this._actualizeTriggers(),!e.kept.length&&!e.added.length||this._failedOnce||(this._failedOnce=!0,this._actualizeTriggers())}},getErrorsMessages:function(){if(!0===this.validationResult)return[];for(var e=[],t=0;t<this.validationResult.length;t++)e.push(this.validationResult[t].errorMessage||this._getErrorMessage(this.validationResult[t].assert));return e},addError:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=t.message,n=t.assert,r=t.updateClass,s=void 0===r||r;this._buildUI(),this._addError(e,{message:i,assert:n}),s&&this._errorClass()},updateError:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=t.message,n=t.assert,r=t.updateClass,s=void 0===r||r;this._buildUI(),this._updateError(e,{message:i,assert:n}),s&&this._errorClass()},removeError:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=t.updateClass,n=void 0===i||i;this._buildUI(),this._removeError(e),n&&this._manageStatusClass()},_manageStatusClass:function(){this.hasConstraints()&&this.needsValidation()&&!0===this.validationResult?this._successClass():this.validationResult.length>0?this._errorClass():this._resetClass()},_manageErrorsMessages:function(t){if("undefined"==typeof this.options.errorsMessagesDisabled){if("undefined"!=typeof this.options.errorMessage)return t.added.length||t.kept.length?(this._insertErrorWrapper(),0===this._ui.$errorsWrapper.find(".parsley-custom-error-message").length&&this._ui.$errorsWrapper.append(e(this.options.errorTemplate).addClass("parsley-custom-error-message")),this._ui.$errorsWrapper.addClass("filled").find(".parsley-custom-error-message").html(this.options.errorMessage)):this._ui.$errorsWrapper.removeClass("filled").find(".parsley-custom-error-message").remove();for(var i=0;i<t.removed.length;i++)this._removeError(t.removed[i].assert.name);for(i=0;i<t.added.length;i++)this._addError(t.added[i].assert.name,{message:t.added[i].errorMessage,assert:t.added[i].assert});for(i=0;i<t.kept.length;i++)this._updateError(t.kept[i].assert.name,{message:t.kept[i].errorMessage,assert:t.kept[i].assert})}},_addError:function(t,i){var n=i.message,r=i.assert;this._insertErrorWrapper(),this._ui.$errorClassHandler.attr("aria-describedby",this._ui.errorsWrapperId),this._ui.$errorsWrapper.addClass("filled").append(e(this.options.errorTemplate).addClass("parsley-"+t).html(n||this._getErrorMessage(r)))},_updateError:function(e,t){var i=t.message,n=t.assert;this._ui.$errorsWrapper.addClass("filled").find(".parsley-"+e).html(i||this._getErrorMessage(n))},_removeError:function(e){this._ui.$errorClassHandler.removeAttr("aria-describedby"),this._ui.$errorsWrapper.removeClass("filled").find(".parsley-"+e).remove()},_getErrorMessage:function(e){var t=e.name+"Message";return"undefined"!=typeof this.options[t]?window.Parsley.formatMessage(this.options[t],e.requirements):window.Parsley.getErrorMessage(e)},_buildUI:function(){if(!this._ui&&!1!==this.options.uiEnabled){var t={};this.element.setAttribute(this.options.namespace+"id",this.__id__),t.$errorClassHandler=this._manageClassHandler(),t.errorsWrapperId="parsley-id-"+(this.options.multiple?"multiple-"+this.options.multiple:this.__id__),t.$errorsWrapper=e(this.options.errorsWrapper).attr("id",t.errorsWrapperId),t.lastValidationResult=[],t.validationInformationVisible=!1,this._ui=t}},_manageClassHandler:function(){if("string"==typeof this.options.classHandler&&e(this.options.classHandler).length)return e(this.options.classHandler);var t=this.options.classHandler;if("string"==typeof this.options.classHandler&&"function"==typeof window[this.options.classHandler]&&(t=window[this.options.classHandler]),"function"==typeof t){var i=t.call(this,this);if("undefined"!=typeof i&&i.length)return i}else{if("object"==typeof t&&t instanceof jQuery&&t.length)return t;t&&a.warn("The class handler `"+t+"` does not exist in DOM nor as a global JS function")}return this._inputHolder()},_inputHolder:function(){return this.options.multiple&&"SELECT"!==this.element.nodeName?this.$element.parent():this.$element},_insertErrorWrapper:function(){var t=this.options.errorsContainer;if(0!==this._ui.$errorsWrapper.parent().length)return this._ui.$errorsWrapper.parent();if("string"==typeof t){if(e(t).length)return e(t).append(this._ui.$errorsWrapper);"function"==typeof window[t]?t=window[t]:a.warn("The errors container `"+t+"` does not exist in DOM nor as a global JS function")}return"function"==typeof t&&(t=t.call(this,this)),"object"==typeof t&&t.length?t.append(this._ui.$errorsWrapper):this._inputHolder().after(this._ui.$errorsWrapper)},_actualizeTriggers:function(){var e,t=this,i=this._findRelated();i.off(".Parsley"),this._failedOnce?i.on(a.namespaceEvents(this.options.triggerAfterFailure,"Parsley"),function(){t._validateIfNeeded()}):(e=a.namespaceEvents(this.options.trigger,"Parsley"))&&i.on(e,function(e){t._validateIfNeeded(e)})},_validateIfNeeded:function(e){var t=this;e&&/key|input/.test(e.type)&&(!this._ui||!this._ui.validationInformationVisible)&&this.getValue().length<=this.options.validationThreshold||(this.options.debounce?(window.clearTimeout(this._debounced),this._debounced=window.setTimeout(function(){return t.validate()},this.options.debounce)):this.validate())},_resetUI:function(){this._failedOnce=!1,this._actualizeTriggers(),"undefined"!=typeof this._ui&&(this._ui.$errorsWrapper.removeClass("filled").children().remove(),this._resetClass(),this._ui.lastValidationResult=[],this._ui.validationInformationVisible=!1)},_destroyUI:function(){this._resetUI(),"undefined"!=typeof this._ui&&this._ui.$errorsWrapper.remove(),delete this._ui},_successClass:function(){this._ui.validationInformationVisible=!0,this._ui.$errorClassHandler.removeClass(this.options.errorClass).addClass(this.options.successClass)},_errorClass:function(){this._ui.validationInformationVisible=!0,this._ui.$errorClassHandler.removeClass(this.options.successClass).addClass(this.options.errorClass)},_resetClass:function(){this._ui.$errorClassHandler.removeClass(this.options.successClass).removeClass(this.options.errorClass)}};var w=function(t,i,n){this.__class__="Form",this.element=t,this.$element=e(t),this.domOptions=i,this.options=n,this.parent=window.Parsley,this.fields=[],this.validationResult=null},b={pending:null,resolved:!0,rejected:!1};w.prototype={onSubmitValidate:function(e){var t=this;if(!0!==e.parsley){var i=this._submitSource||this.$element.find(a._SubmitSelector)[0];if(this._submitSource=null,this.$element.find(".parsley-synthetic-submit-button").prop("disabled",!0),!i||null===i.getAttribute("formnovalidate")){window.Parsley._remoteCache={};var n=this.whenValidate({event:e});"resolved"===n.state()&&!1!==this._trigger("submit")||(e.stopImmediatePropagation(),e.preventDefault(),"pending"===n.state()&&n.done(function(){t._submit(i)}))}}},onSubmitButton:function(e){this._submitSource=e.currentTarget},_submit:function(t){if(!1!==this._trigger("submit")){if(t){var i=this.$element.find(".parsley-synthetic-submit-button").prop("disabled",!1);0===i.length&&(i=e('<input class="parsley-synthetic-submit-button" type="hidden">').appendTo(this.$element)),i.attr({name:t.getAttribute("name"),value:t.getAttribute("value")})}this.$element.trigger(_extends(e.Event("submit"),{parsley:!0}))}},validate:function(t){if(arguments.length>=1&&!e.isPlainObject(t)){a.warnOnce("Calling validate on a parsley form without passing arguments as an object is deprecated.");var i=_slice.call(arguments),n=i[0],r=i[1],s=i[2];t={group:n,force:r,event:s}}return b[this.whenValidate(t).state()]},whenValidate:function(){var t,i=this,n=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],r=n.group,s=n.force,o=n.event;this.submitEvent=o,o&&(this.submitEvent=_extends({},o,{preventDefault:function(){a.warnOnce("Using `this.submitEvent.preventDefault()` is deprecated; instead, call `this.validationResult = false`"),i.validationResult=!1}})),this.validationResult=!0,this._trigger("validate"),this._refreshFields();var l=this._withoutReactualizingFormOptions(function(){return e.map(i.fields,function(e){return e.whenValidate({force:s,group:r})})});return(t=a.all(l).done(function(){i._trigger("success")}).fail(function(){i.validationResult=!1,i.focus(),i._trigger("error")}).always(function(){i._trigger("validated")})).pipe.apply(t,_toConsumableArray(this._pipeAccordingToValidationResult()))},isValid:function(t){if(arguments.length>=1&&!e.isPlainObject(t)){a.warnOnce("Calling isValid on a parsley form without passing arguments as an object is deprecated.");var i=_slice.call(arguments),n=i[0],r=i[1];t={group:n,force:r}}return b[this.whenValid(t).state()]},whenValid:function(){var t=this,i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=i.group,r=i.force;this._refreshFields();var s=this._withoutReactualizingFormOptions(function(){return e.map(t.fields,function(e){return e.whenValid({group:n,force:r})})});return a.all(s)},refresh:function(){return this._refreshFields(),this},reset:function(){for(var e=0;e<this.fields.length;e++)this.fields[e].reset();this._trigger("reset")},destroy:function(){this._destroyUI();for(var e=0;e<this.fields.length;e++)this.fields[e].destroy();this.$element.removeData("Parsley"),this._trigger("destroy")},_refreshFields:function(){return this.actualizeOptions()._bindFields()},_bindFields:function(){var t=this,i=this.fields;return this.fields=[],this.fieldsMappedById={},this._withoutReactualizingFormOptions(function(){t.$element.find(t.options.inputs).not(t.options.excluded).each(function(e,i){var n=new window.Parsley.Factory(i,{},t);if(("Field"===n.__class__||"FieldMultiple"===n.__class__)&&!0!==n.options.excluded){var r=n.__class__+"-"+n.__id__;"undefined"==typeof t.fieldsMappedById[r]&&(t.fieldsMappedById[r]=n,t.fields.push(n))}}),e.each(a.difference(i,t.fields),function(e,t){t.reset()})}),this},_withoutReactualizingFormOptions:function(e){var t=this.actualizeOptions;this.actualizeOptions=function(){return this};var i=e();return this.actualizeOptions=t,i},_trigger:function(e){return this.trigger("form:"+e)}};var F=function(e,t,i,n,r){var s=window.Parsley._validatorRegistry.validators[t],a=new h(s);n=n||e.options[t+"Priority"]||a.priority,r=!0===r,_extends(this,{validator:a,name:t,requirements:i,priority:n,isDomConstraint:r}),this._parseRequirements(e.options)},C=function(e){var t=e[0].toUpperCase();return t+e.slice(1)};F.prototype={validate:function(e,t){var i;return(i=this.validator).validate.apply(i,[e].concat(_toConsumableArray(this.requirementList),[t]))},_parseRequirements:function(e){var t=this;this.requirementList=this.validator.parseRequirements(this.requirements,function(i){return e[t.name+C(i)]})}};var A=function(t,i,n,r){this.__class__="Field",this.element=t,this.$element=e(t),"undefined"!=typeof r&&(this.parent=r),this.options=n,this.domOptions=i,this.constraints=[],this.constraintsByName={},this.validationResult=!0,this._bindConstraints()},E={pending:null,resolved:!0,rejected:!1};A.prototype={validate:function(t){arguments.length>=1&&!e.isPlainObject(t)&&(a.warnOnce("Calling validate on a parsley field without passing arguments as an object is deprecated."),t={options:t});var i=this.whenValidate(t);if(!i)return!0;switch(i.state()){case"pending":return null;case"resolved":return!0;case"rejected":return this.validationResult}},whenValidate:function(){var e,t=this,i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=i.force,r=i.group;if(this.refresh(),!r||this._isInGroup(r))return this.value=this.getValue(),this._trigger("validate"),(e=this.whenValid({force:n,value:this.value,_refreshed:!0}).always(function(){t._reflowUI()}).done(function(){t._trigger("success")}).fail(function(){t._trigger("error")}).always(function(){t._trigger("validated")})).pipe.apply(e,_toConsumableArray(this._pipeAccordingToValidationResult()))},hasConstraints:function(){return 0!==this.constraints.length},needsValidation:function(e){return"undefined"==typeof e&&(e=this.getValue()),!(!e.length&&!this._isRequired()&&"undefined"==typeof this.options.validateIfEmpty)},_isInGroup:function(t){return Array.isArray(this.options.group)?-1!==e.inArray(t,this.options.group):this.options.group===t},isValid:function(t){if(arguments.length>=1&&!e.isPlainObject(t)){a.warnOnce("Calling isValid on a parsley field without passing arguments as an object is deprecated.");var i=_slice.call(arguments),n=i[0],r=i[1];t={force:n,value:r}}var s=this.whenValid(t);return!s||E[s.state()]},whenValid:function(){var t=this,i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=i.force,r=void 0!==n&&n,s=i.value,o=i.group,l=i._refreshed;if(l||this.refresh(),!o||this._isInGroup(o)){if(this.validationResult=!0,!this.hasConstraints())return e.when();if("undefined"!=typeof s&&null!==s||(s=this.getValue()),!this.needsValidation(s)&&!0!==r)return e.when();var u=this._getGroupedConstraints(),d=[];return e.each(u,function(i,n){var r=a.all(e.map(n,function(e){return t._validateConstraint(s,e)}));if(d.push(r),"rejected"===r.state())return!1}),a.all(d)}},_validateConstraint:function(t,i){var n=this,r=i.validate(t,this);return!1===r&&(r=e.Deferred().reject()),a.all([r]).fail(function(e){n.validationResult instanceof Array||(n.validationResult=[]),n.validationResult.push({assert:i,errorMessage:"string"==typeof e&&e})})},getValue:function(){var e;return e="function"==typeof this.options.value?this.options.value(this):"undefined"!=typeof this.options.value?this.options.value:this.$element.val(),"undefined"==typeof e||null===e?"":this._handleWhitespace(e)},reset:function(){return this._resetUI(),this._trigger("reset")},destroy:function(){this._destroyUI(),this.$element.removeData("Parsley"),this.$element.removeData("FieldMultiple"),this._trigger("destroy")},refresh:function(){return this._refreshConstraints(),this},_refreshConstraints:function(){return this.actualizeOptions()._bindConstraints()},refreshConstraints:function(){return a.warnOnce("Parsley's refreshConstraints is deprecated. Please use refresh"),this.refresh()},addConstraint:function(e,t,i,n){if(window.Parsley._validatorRegistry.validators[e]){var r=new F(this,e,t,i,n);"undefined"!==this.constraintsByName[r.name]&&this.removeConstraint(r.name),this.constraints.push(r),this.constraintsByName[r.name]=r}return this},removeConstraint:function(e){for(var t=0;t<this.constraints.length;t++)if(e===this.constraints[t].name){this.constraints.splice(t,1);break}return delete this.constraintsByName[e],this},updateConstraint:function(e,t,i){return this.removeConstraint(e).addConstraint(e,t,i)},_bindConstraints:function(){for(var e=[],t={},i=0;i<this.constraints.length;i++)!1===this.constraints[i].isDomConstraint&&(e.push(this.constraints[i]),t[this.constraints[i].name]=this.constraints[i]);this.constraints=e,this.constraintsByName=t;for(var n in this.options)this.addConstraint(n,this.options[n],void 0,!0);return this._bindHtml5Constraints()},_bindHtml5Constraints:function(){null!==this.element.getAttribute("required")&&this.addConstraint("required",!0,void 0,!0),null!==this.element.getAttribute("pattern")&&this.addConstraint("pattern",this.element.getAttribute("pattern"),void 0,!0);var e=this.element.getAttribute("min"),t=this.element.getAttribute("max");null!==e&&null!==t?this.addConstraint("range",[e,t],void 0,!0):null!==e?this.addConstraint("min",e,void 0,!0):null!==t&&this.addConstraint("max",t,void 0,!0),null!==this.element.getAttribute("minlength")&&null!==this.element.getAttribute("maxlength")?this.addConstraint("length",[this.element.getAttribute("minlength"),this.element.getAttribute("maxlength")],void 0,!0):null!==this.element.getAttribute("minlength")?this.addConstraint("minlength",this.element.getAttribute("minlength"),void 0,!0):null!==this.element.getAttribute("maxlength")&&this.addConstraint("maxlength",this.element.getAttribute("maxlength"),void 0,!0);var i=a.getType(this.element);return"number"===i?this.addConstraint("type",["number",{step:this.element.getAttribute("step")||"1",base:e||this.element.getAttribute("value")}],void 0,!0):/^(email|url|range|date)$/i.test(i)?this.addConstraint("type",i,void 0,!0):this},_isRequired:function(){return"undefined"!=typeof this.constraintsByName.required&&!1!==this.constraintsByName.required.requirements},_trigger:function(e){return this.trigger("field:"+e)},_handleWhitespace:function(e){return!0===this.options.trimValue&&a.warnOnce('data-parsley-trim-value="true" is deprecated, please use data-parsley-whitespace="trim"'),"squish"===this.options.whitespace&&(e=e.replace(/\s{2,}/g," ")),"trim"!==this.options.whitespace&&"squish"!==this.options.whitespace&&!0!==this.options.trimValue||(e=a.trimString(e)),e},_isDateInput:function(){var e=this.constraintsByName.type;return e&&"date"===e.requirements},_getGroupedConstraints:function(){if(!1===this.options.priorityEnabled)return[this.constraints];for(var e=[],t={},i=0;i<this.constraints.length;i++){var n=this.constraints[i].priority;t[n]||e.push(t[n]=[]),t[n].push(this.constraints[i])}return e.sort(function(e,t){return t[0].priority-e[0].priority}),e}};var x=A,$=function(){this.__class__="FieldMultiple"};$.prototype={addElement:function(e){return this.$elements.push(e),this},_refreshConstraints:function(){var t;if(this.constraints=[],"SELECT"===this.element.nodeName)return this.actualizeOptions()._bindConstraints(),this;for(var i=0;i<this.$elements.length;i++)if(e("html").has(this.$elements[i]).length){t=this.$elements[i].data("FieldMultiple")._refreshConstraints().constraints;for(var n=0;n<t.length;n++)this.addConstraint(t[n].name,t[n].requirements,t[n].priority,t[n].isDomConstraint)}else this.$elements.splice(i,1);return this},getValue:function(){if("function"==typeof this.options.value)return this.options.value(this);if("undefined"!=typeof this.options.value)return this.options.value;if("INPUT"===this.element.nodeName){var t=a.getType(this.element);if("radio"===t)return this._findRelated().filter(":checked").val()||"";if("checkbox"===t){
var i=[];return this._findRelated().filter(":checked").each(function(){i.push(e(this).val())}),i}}return"SELECT"===this.element.nodeName&&null===this.$element.val()?[]:this.$element.val()},_init:function(){return this.$elements=[this.$element],this}};var P=function(t,i,n){this.element=t,this.$element=e(t);var r=this.$element.data("Parsley");if(r)return"undefined"!=typeof n&&r.parent===window.Parsley&&(r.parent=n,r._resetOptions(r.options)),"object"==typeof i&&_extends(r.options,i),r;if(!this.$element.length)throw new Error("You must bind Parsley on an existing element.");if("undefined"!=typeof n&&"Form"!==n.__class__)throw new Error("Parent instance must be a Form instance");return this.parent=n||window.Parsley,this.init(i)};P.prototype={init:function(e){return this.__class__="Parsley",this.__version__="2.8.1",this.__id__=a.generateID(),this._resetOptions(e),"FORM"===this.element.nodeName||a.checkAttr(this.element,this.options.namespace,"validate")&&!this.$element.is(this.options.inputs)?this.bind("parsleyForm"):this.isMultiple()?this.handleMultiple():this.bind("parsleyField")},isMultiple:function(){var e=a.getType(this.element);return"radio"===e||"checkbox"===e||"SELECT"===this.element.nodeName&&null!==this.element.getAttribute("multiple")},handleMultiple:function(){var t,i,n=this;if(this.options.multiple=this.options.multiple||(t=this.element.getAttribute("name"))||this.element.getAttribute("id"),"SELECT"===this.element.nodeName&&null!==this.element.getAttribute("multiple"))return this.options.multiple=this.options.multiple||this.__id__,this.bind("parsleyFieldMultiple");if(!this.options.multiple)return a.warn("To be bound by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.",this.$element),this;this.options.multiple=this.options.multiple.replace(/(:|\.|\[|\]|\{|\}|\$)/g,""),t&&e('input[name="'+t+'"]').each(function(e,t){var i=a.getType(t);"radio"!==i&&"checkbox"!==i||t.setAttribute(n.options.namespace+"multiple",n.options.multiple)});for(var r=this._findRelated(),s=0;s<r.length;s++)if(i=e(r.get(s)).data("Parsley"),"undefined"!=typeof i){this.$element.data("FieldMultiple")||i.addElement(this.$element);break}return this.bind("parsleyField",!0),i||this.bind("parsleyFieldMultiple")},bind:function(t,i){var n;switch(t){case"parsleyForm":n=e.extend(new w(this.element,this.domOptions,this.options),new l,window.ParsleyExtend)._bindFields();break;case"parsleyField":n=e.extend(new x(this.element,this.domOptions,this.options,this.parent),new l,window.ParsleyExtend);break;case"parsleyFieldMultiple":n=e.extend(new x(this.element,this.domOptions,this.options,this.parent),new $,new l,window.ParsleyExtend)._init();break;default:throw new Error(t+"is not a supported Parsley type")}return this.options.multiple&&a.setAttr(this.element,this.options.namespace,"multiple",this.options.multiple),"undefined"!=typeof i?(this.$element.data("FieldMultiple",n),n):(this.$element.data("Parsley",n),n._actualizeTriggers(),n._trigger("init"),n)}};var V=e.fn.jquery.split(".");if(parseInt(V[0])<=1&&parseInt(V[1])<8)throw"The loaded version of jQuery is too old. Please upgrade to 1.8.x or better.";V.forEach||a.warn("Parsley requires ES5 to run properly. Please include https://github.com/es-shims/es5-shim");var T=_extends(new l,{element:document,$element:e(document),actualizeOptions:null,_resetOptions:null,Factory:P,version:"2.8.1"});_extends(x.prototype,y.Field,l.prototype),_extends(w.prototype,y.Form,l.prototype),_extends(P.prototype,l.prototype),e.fn.parsley=e.fn.psly=function(t){if(this.length>1){var i=[];return this.each(function(){i.push(e(this).parsley(t))}),i}if(0!=this.length)return new P(this[0],t)},"undefined"==typeof window.ParsleyExtend&&(window.ParsleyExtend={}),T.options=_extends(a.objectCreate(o),window.ParsleyConfig),window.ParsleyConfig=T.options,window.Parsley=window.psly=T,T.Utils=a,window.ParsleyUtils={},e.each(a,function(e,t){"function"==typeof t&&(window.ParsleyUtils[e]=function(){return a.warnOnce("Accessing `window.ParsleyUtils` is deprecated. Use `window.Parsley.Utils` instead."),a[e].apply(a,arguments)})});var O=window.Parsley._validatorRegistry=new p(window.ParsleyConfig.validators,window.ParsleyConfig.i18n);window.ParsleyValidator={},e.each("setLocale addCatalog addMessage addMessages getErrorMessage formatMessage addValidator updateValidator removeValidator hasValidator".split(" "),function(e,t){window.Parsley[t]=function(){return O[t].apply(O,arguments)},window.ParsleyValidator[t]=function(){var e;return a.warnOnce("Accessing the method '"+t+"' through Validator is deprecated. Simply call 'window.Parsley."+t+"(...)'"),(e=window.Parsley)[t].apply(e,arguments)}}),window.Parsley.UI=y,window.ParsleyUI={removeError:function(e,t,i){var n=!0!==i;return a.warnOnce("Accessing UI is deprecated. Call 'removeError' on the instance directly. Please comment in issue 1073 as to your need to call this method."),e.removeError(t,{updateClass:n})},getErrorsMessages:function(e){return a.warnOnce("Accessing UI is deprecated. Call 'getErrorsMessages' on the instance directly."),e.getErrorsMessages()}},e.each("addError updateError".split(" "),function(e,t){window.ParsleyUI[t]=function(e,i,n,r,s){var o=!0!==s;return a.warnOnce("Accessing UI is deprecated. Call '"+t+"' on the instance directly. Please comment in issue 1073 as to your need to call this method."),e[t](i,{message:n,assert:r,updateClass:o})}}),!1!==window.ParsleyConfig.autoBind&&e(function(){e("[data-parsley-validate]").length&&e("[data-parsley-validate]").parsley()});var M=e({}),R=function(){a.warnOnce("Parsley's pubsub module is deprecated; use the 'on' and 'off' methods on parsley instances or window.Parsley")},D="parsley:";e.listen=function(e,n){var r;if(R(),"object"==typeof arguments[1]&&"function"==typeof arguments[2]&&(r=arguments[1],n=arguments[2]),"function"!=typeof n)throw new Error("Wrong parameters");window.Parsley.on(i(e),t(n,r))},e.listenTo=function(e,n,r){if(R(),!(e instanceof x||e instanceof w))throw new Error("Must give Parsley instance");if("string"!=typeof n||"function"!=typeof r)throw new Error("Wrong parameters");e.on(i(n),t(r))},e.unsubscribe=function(e,t){if(R(),"string"!=typeof e||"function"!=typeof t)throw new Error("Wrong arguments");window.Parsley.off(i(e),t.parsleyAdaptedCallback)},e.unsubscribeTo=function(e,t){if(R(),!(e instanceof x||e instanceof w))throw new Error("Must give Parsley instance");e.off(i(t))},e.unsubscribeAll=function(t){R(),window.Parsley.off(i(t)),e("form,input,textarea,select").each(function(){var n=e(this).data("Parsley");n&&n.off(i(t))})},e.emit=function(e,t){var n;R();var r=t instanceof x||t instanceof w,s=Array.prototype.slice.call(arguments,r?2:1);s.unshift(i(e)),r||(t=window.Parsley),(n=t).trigger.apply(n,_toConsumableArray(s))};e.extend(!0,T,{asyncValidators:{"default":{fn:function(e){return e.status>=200&&e.status<300},url:!1},reverse:{fn:function(e){return e.status<200||e.status>=300},url:!1}},addAsyncValidator:function(e,t,i,n){return T.asyncValidators[e]={fn:t,url:i||!1,options:n||{}},this}}),T.addValidator("remote",{requirementType:{"":"string",validator:"string",reverse:"boolean",options:"object"},validateString:function(t,i,n,r){var s,a,o={},l=n.validator||(!0===n.reverse?"reverse":"default");if("undefined"==typeof T.asyncValidators[l])throw new Error("Calling an undefined async validator: `"+l+"`");i=T.asyncValidators[l].url||i,i.indexOf("{value}")>-1?i=i.replace("{value}",encodeURIComponent(t)):o[r.element.getAttribute("name")||r.element.getAttribute("id")]=t;var u=e.extend(!0,n.options||{},T.asyncValidators[l].options);s=e.extend(!0,{},{url:i,data:o,type:"GET"},u),r.trigger("field:ajaxoptions",r,s),a=e.param(s),"undefined"==typeof T._remoteCache&&(T._remoteCache={});var d=T._remoteCache[a]=T._remoteCache[a]||e.ajax(s),h=function(){var t=T.asyncValidators[l].fn.call(r,d,i,n);return t||(t=e.Deferred().reject()),e.when(t)};return d.then(h,h)},priority:-1}),T.on("form:submit",function(){T._remoteCache={}}),l.prototype.addAsyncValidator=function(){return a.warnOnce("Accessing the method `addAsyncValidator` through an instance is deprecated. Simply call `Parsley.addAsyncValidator(...)`"),T.addAsyncValidator.apply(T,arguments)},T.addMessages("en",{defaultMessage:"This value seems to be invalid.",type:{email:"This value should be a valid email.",url:"This value should be a valid url.",number:"This value should be a valid number.",integer:"This value should be a valid integer.",digits:"This value should be digits.",alphanum:"This value should be alphanumeric."},notblank:"This value should not be blank.",required:"This value is required.",pattern:"This value seems to be invalid.",min:"This value should be greater than or equal to %s.",max:"This value should be lower than or equal to %s.",range:"This value should be between %s and %s.",minlength:"This value is too short. It should have %s characters or more.",maxlength:"This value is too long. It should have %s characters or fewer.",length:"This value length is invalid. It should be between %s and %s characters long.",mincheck:"You must select at least %s choices.",maxcheck:"You must select %s choices or fewer.",check:"You must select between %s and %s choices.",equalto:"This value should be the same."}),T.setLocale("en");var I=new n;I.install();var q=T;return q});
//# sourceMappingURL=parsley.min.js.map

/*
 * Gritter for jQuery
 * http://www.boedesign.com/
 *
 * Copyright (c) 2012 Jordan Boesch
 * Dual licensed under the MIT and GPL licenses.
 *
 * Date: February 24, 2012
 * Version: 1.7.4
 */

(function($){
 	
	/**
	* Set it up as an object under the jQuery namespace
	*/
	$.gritter = {};
	
	/**
	* Set up global options that the user can over-ride
	*/
	$.gritter.options = {
		position: '',
		class_name: '', // could be set to 'gritter-light' to use white notifications
		fade_in_speed: 'medium', // how fast notifications fade in
		fade_out_speed: 1000, // how fast the notices fade out
		time: 6000 // hang on the screen for...
	}
	
	/**
	* Add a gritter notification to the screen
	* @see Gritter#add();
	*/
	$.gritter.add = function(params){

		try {
			return Gritter.add(params || {});
		} catch(e) {
		
			var err = 'Gritter Error: ' + e;
			(typeof(console) != 'undefined' && console.error) ? 
				console.error(err, params) : 
				alert(err);
				
		}
		
	}
	
	/**
	* Remove a gritter notification from the screen
	* @see Gritter#removeSpecific();
	*/
	$.gritter.remove = function(id, params){
		Gritter.removeSpecific(id, params || {});
	}
	
	/**
	* Remove all notifications
	* @see Gritter#stop();
	*/
	$.gritter.removeAll = function(params){
		Gritter.stop(params || {});
	}
	
	/**
	* Big fat Gritter object
	* @constructor (not really since its object literal)
	*/
	var Gritter = {
		
		// Public - options to over-ride with $.gritter.options in "add"
		position: '',
		fade_in_speed: '',
		fade_out_speed: '',
		time: '',
		
		// Private - no touchy the private parts
		_custom_timer: 0,
		_item_count: 0,
		_is_setup: 0,
		_tpl_close: '<a class="gritter-close" href="#" tabindex="1">Close Notification</a>',
		_tpl_title: '<span class="gritter-title">[[title]]</span>',
		_tpl_item: '<div id="gritter-item-[[number]]" class="gritter-item-wrapper [[item_class]]" style="display:none" role="alert"><div class="gritter-top"></div><div class="gritter-item">[[close]][[image]]<div class="[[class_name]]">[[title]]<p>[[text]]</p></div><div style="clear:both"></div></div><div class="gritter-bottom"></div></div>',
		_tpl_wrap: '<div id="gritter-notice-wrapper"></div>',
		
		/**
		* Add a gritter notification to the screen
		* @param {Object} params The object that contains all the options for drawing the notification
		* @return {Integer} The specific numeric id to that gritter notification
		*/
		add: function(params){
			// Handle straight text
			if(typeof(params) == 'string'){
				params = {text:params};
			}

			// We might have some issues if we don't have a title or text!
			if(params.text === null){
				throw 'You must supply "text" parameter.'; 
			}
			
			// Check the options and set them once
			if(!this._is_setup){
				this._runSetup();
			}
			
			// Basics
			var title = params.title, 
				text = params.text,
				image = params.image || '',
				sticky = params.sticky || false,
				item_class = params.class_name || $.gritter.options.class_name,
				position = $.gritter.options.position,
				time_alive = params.time || '';

			this._verifyWrapper();
			
			this._item_count++;
			var number = this._item_count, 
				tmp = this._tpl_item;
			
			// Assign callbacks
			$(['before_open', 'after_open', 'before_close', 'after_close']).each(function(i, val){
				Gritter['_' + val + '_' + number] = ($.isFunction(params[val])) ? params[val] : function(){}
			});

			// Reset
			this._custom_timer = 0;
			
			// A custom fade time set
			if(time_alive){
				this._custom_timer = time_alive;
			}
			
			var image_str = (image != '') ? '<img src="' + image + '" class="gritter-image" />' : '',
				class_name = (image != '') ? 'gritter-with-image' : 'gritter-without-image';
			
			// String replacements on the template
			if(title){
				title = this._str_replace('[[title]]',title,this._tpl_title);
			}else{
				title = '';
			}
			
			tmp = this._str_replace(
				['[[title]]', '[[text]]', '[[close]]', '[[image]]', '[[number]]', '[[class_name]]', '[[item_class]]'],
				[title, text, this._tpl_close, image_str, this._item_count, class_name, item_class], tmp
			);

			// If it's false, don't show another gritter message
			if(this['_before_open_' + number]() === false){
				return false;
			}

			$('#gritter-notice-wrapper').addClass(position).append(tmp);
			
			var item = $('#gritter-item-' + this._item_count);
			
			item.fadeIn(this.fade_in_speed, function(){
				Gritter['_after_open_' + number]($(this));
			});
			
			if(!sticky){
				this._setFadeTimer(item, number);
			}
			
			// Bind the hover/unhover states
			$(item).bind('mouseenter mouseleave', function(event){
				if(event.type == 'mouseenter'){
					if(!sticky){ 
						Gritter._restoreItemIfFading($(this), number);
					}
				}
				else {
					if(!sticky){
						Gritter._setFadeTimer($(this), number);
					}
				}
				Gritter._hoverState($(this), event.type);
			});
			
			// Clicking (X) makes the perdy thing close
			$(item).find('.gritter-close').click(function(){
				Gritter.removeSpecific(number, {}, null, true);
				return false;
			});
			
			return number;
		
		},
		
		/**
		* If we don't have any more gritter notifications, get rid of the wrapper using this check
		* @private
		* @param {Integer} unique_id The ID of the element that was just deleted, use it for a callback
		* @param {Object} e The jQuery element that we're going to perform the remove() action on
		* @param {Boolean} manual_close Did we close the gritter dialog with the (X) button
		*/
		_countRemoveWrapper: function(unique_id, e, manual_close){
			
			// Remove it then run the callback function
			e.remove();
			this['_after_close_' + unique_id](e, manual_close);
			
			// Check if the wrapper is empty, if it is.. remove the wrapper
			if($('.gritter-item-wrapper').length == 0){
				$('#gritter-notice-wrapper').remove();
			}
		
		},
		
		/**
		* Fade out an element after it's been on the screen for x amount of time
		* @private
		* @param {Object} e The jQuery element to get rid of
		* @param {Integer} unique_id The id of the element to remove
		* @param {Object} params An optional list of params to set fade speeds etc.
		* @param {Boolean} unbind_events Unbind the mouseenter/mouseleave events if they click (X)
		*/
		_fade: function(e, unique_id, params, unbind_events){

			var params = params || {},
				fade = (typeof(params.fade) != 'undefined') ? params.fade : true,
				fade_out_speed = params.speed || this.fade_out_speed,
				manual_close = unbind_events;

			this['_before_close_' + unique_id](e, manual_close);
			
			// If this is true, then we are coming from clicking the (X)
			if(unbind_events){
				e.unbind('mouseenter mouseleave');
			}
			
			// Fade it out or remove it
			if(fade){
			
				e.animate({
					opacity: 0
				}, fade_out_speed, function(){
					e.animate({ height: 0 }, 300, function(){
						Gritter._countRemoveWrapper(unique_id, e, manual_close);
					})
				})
				
			}
			else {
				
				this._countRemoveWrapper(unique_id, e);
				
			}
						
		},
		
		/**
		* Perform actions based on the type of bind (mouseenter, mouseleave) 
		* @private
		* @param {Object} e The jQuery element
		* @param {String} type The type of action we're performing: mouseenter or mouseleave
		*/
		_hoverState: function(e, type){
			
			// Change the border styles and add the (X) close button when you hover
			if(type == 'mouseenter'){
				
				e.addClass('hover');
				
				// Show close button
				e.find('.gritter-close').show();
						
			}
			// Remove the border styles and hide (X) close button when you mouse out
			else {
				
				e.removeClass('hover');
				
				// Hide close button
				e.find('.gritter-close').hide();
				
			}
			
		},
		
		/**
		* Remove a specific notification based on an ID
		* @param {Integer} unique_id The ID used to delete a specific notification
		* @param {Object} params A set of options passed in to determine how to get rid of it
		* @param {Object} e The jQuery element that we're "fading" then removing
		* @param {Boolean} unbind_events If we clicked on the (X) we set this to true to unbind mouseenter/mouseleave
		*/
		removeSpecific: function(unique_id, params, e, unbind_events){
			
			if(!e){
				var e = $('#gritter-item-' + unique_id);
			}

			// We set the fourth param to let the _fade function know to 
			// unbind the "mouseleave" event.  Once you click (X) there's no going back!
			this._fade(e, unique_id, params || {}, unbind_events);
			
		},
		
		/**
		* If the item is fading out and we hover over it, restore it!
		* @private
		* @param {Object} e The HTML element to remove
		* @param {Integer} unique_id The ID of the element
		*/
		_restoreItemIfFading: function(e, unique_id){
			
			clearTimeout(this['_int_id_' + unique_id]);
			e.stop().css({ opacity: '', height: '' });
			
		},
		
		/**
		* Setup the global options - only once
		* @private
		*/
		_runSetup: function(){
		
			for(opt in $.gritter.options){
				this[opt] = $.gritter.options[opt];
			}
			this._is_setup = 1;
			
		},
		
		/**
		* Set the notification to fade out after a certain amount of time
		* @private
		* @param {Object} item The HTML element we're dealing with
		* @param {Integer} unique_id The ID of the element
		*/
		_setFadeTimer: function(e, unique_id){
			
			var timer_str = (this._custom_timer) ? this._custom_timer : this.time;
			this['_int_id_' + unique_id] = setTimeout(function(){ 
				Gritter._fade(e, unique_id);
			}, timer_str);
		
		},
		
		/**
		* Bring everything to a halt
		* @param {Object} params A list of callback functions to pass when all notifications are removed
		*/  
		stop: function(params){
			
			// callbacks (if passed)
			var before_close = ($.isFunction(params.before_close)) ? params.before_close : function(){};
			var after_close = ($.isFunction(params.after_close)) ? params.after_close : function(){};
			
			var wrap = $('#gritter-notice-wrapper');
			before_close(wrap);
			wrap.fadeOut(function(){
				$(this).remove();
				after_close();
			});
		
		},
		
		/**
		* An extremely handy PHP function ported to JS, works well for templating
		* @private
		* @param {String/Array} search A list of things to search for
		* @param {String/Array} replace A list of things to replace the searches with
		* @return {String} sa The output
		*/  
		_str_replace: function(search, replace, subject, count){
		
			var i = 0, j = 0, temp = '', repl = '', sl = 0, fl = 0,
				f = [].concat(search),
				r = [].concat(replace),
				s = subject,
				ra = r instanceof Array, sa = s instanceof Array;
			s = [].concat(s);
			
			if(count){
				this.window[count] = 0;
			}
		
			for(i = 0, sl = s.length; i < sl; i++){
				
				if(s[i] === ''){
					continue;
				}
				
				for (j = 0, fl = f.length; j < fl; j++){
					
					temp = s[i] + '';
					repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
					s[i] = (temp).split(f[j]).join(repl);
					
					if(count && s[i] !== temp){
						this.window[count] += (temp.length-s[i].length) / f[j].length;
					}
					
				}
			}
			
			return sa ? s : s[0];
			
		},
		
		/**
		* A check to make sure we have something to wrap our notices with
		* @private
		*/  
		_verifyWrapper: function(){
		  
			if($('#gritter-notice-wrapper').length == 0){
				$('body').append(this._tpl_wrap);
			}
		
		}
		
	}
	
})(jQuery);

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Sweetalert2=t()}(this,function(){"use strict";const D="SweetAlert2:",q=e=>e.charAt(0).toUpperCase()+e.slice(1),i=e=>Array.prototype.slice.call(e),r=e=>{console.warn("".concat(D," ").concat("object"==typeof e?e.join(" "):e))},l=e=>{console.error("".concat(D," ").concat(e))},V=[],N=(e,t)=>{e='"'.concat(e,'" is deprecated and will be removed in the next major release. Please use "').concat(t,'" instead.'),V.includes(e)||(V.push(e),r(e))},R=e=>"function"==typeof e?e():e,F=e=>e&&"function"==typeof e.toPromise,u=e=>F(e)?e.toPromise():Promise.resolve(e),U=e=>e&&Promise.resolve(e)===e;const a={title:"",titleText:"",text:"",html:"",footer:"",icon:void 0,iconColor:void 0,iconHtml:void 0,template:void 0,toast:!1,showClass:{popup:"swal2-show",backdrop:"swal2-backdrop-show",icon:"swal2-icon-show"},hideClass:{popup:"swal2-hide",backdrop:"swal2-backdrop-hide",icon:"swal2-icon-hide"},customClass:{},target:"body",color:void 0,backdrop:!0,heightAuto:!0,allowOutsideClick:!0,allowEscapeKey:!0,allowEnterKey:!0,stopKeydownPropagation:!0,keydownListenerCapture:!1,showConfirmButton:!0,showDenyButton:!1,showCancelButton:!1,preConfirm:void 0,preDeny:void 0,confirmButtonText:"OK",confirmButtonAriaLabel:"",confirmButtonColor:void 0,denyButtonText:"No",denyButtonAriaLabel:"",denyButtonColor:void 0,cancelButtonText:"Cancel",cancelButtonAriaLabel:"",cancelButtonColor:void 0,buttonsStyling:!0,reverseButtons:!1,focusConfirm:!0,focusDeny:!1,focusCancel:!1,returnFocus:!0,showCloseButton:!1,closeButtonHtml:"&times;",closeButtonAriaLabel:"Close this dialog",loaderHtml:"",showLoaderOnConfirm:!1,showLoaderOnDeny:!1,imageUrl:void 0,imageWidth:void 0,imageHeight:void 0,imageAlt:"",timer:void 0,timerProgressBar:!1,width:void 0,padding:void 0,background:void 0,input:void 0,inputPlaceholder:"",inputLabel:"",inputValue:"",inputOptions:{},inputAutoTrim:!0,inputAttributes:{},inputValidator:void 0,returnInputValueOnDeny:!1,validationMessage:void 0,grow:!1,position:"center",progressSteps:[],currentProgressStep:void 0,progressStepsDistance:void 0,willOpen:void 0,didOpen:void 0,didRender:void 0,willClose:void 0,didClose:void 0,didDestroy:void 0,scrollbarPadding:!0},W=["allowEscapeKey","allowOutsideClick","background","buttonsStyling","cancelButtonAriaLabel","cancelButtonColor","cancelButtonText","closeButtonAriaLabel","closeButtonHtml","color","confirmButtonAriaLabel","confirmButtonColor","confirmButtonText","currentProgressStep","customClass","denyButtonAriaLabel","denyButtonColor","denyButtonText","didClose","didDestroy","footer","hideClass","html","icon","iconColor","iconHtml","imageAlt","imageHeight","imageUrl","imageWidth","preConfirm","preDeny","progressSteps","returnFocus","reverseButtons","showCancelButton","showCloseButton","showConfirmButton","showDenyButton","text","title","titleText","willClose"],z={},K=["allowOutsideClick","allowEnterKey","backdrop","focusConfirm","focusDeny","focusCancel","returnFocus","heightAuto","keydownListenerCapture"],_=e=>Object.prototype.hasOwnProperty.call(a,e),Y=e=>-1!==W.indexOf(e),Z=e=>z[e],X=e=>{!e.backdrop&&e.allowOutsideClick&&r('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');for(const n in e)t=n,_(t)||r('Unknown parameter "'.concat(t,'"')),e.toast&&(t=n,K.includes(t)&&r('The parameter "'.concat(t,'" is incompatible with toasts'))),t=n,Z(t)&&N(t,Z(t));var t};var e=e=>{const t={};for(const n in e)t[e[n]]="swal2-"+e[n];return t};const p=e(["container","shown","height-auto","iosfix","popup","modal","no-backdrop","no-transition","toast","toast-shown","show","hide","close","title","html-container","actions","confirm","deny","cancel","default-outline","footer","icon","icon-content","image","input","file","range","select","radio","checkbox","label","textarea","inputerror","input-label","validation-message","progress-steps","active-progress-step","progress-step","progress-step-line","loader","loading","styled","top","top-start","top-end","top-left","top-right","center","center-start","center-end","center-left","center-right","bottom","bottom-start","bottom-end","bottom-left","bottom-right","grow-row","grow-column","grow-fullscreen","rtl","timer-progress-bar","timer-progress-bar-container","scrollbar-measure","icon-success","icon-warning","icon-info","icon-question","icon-error","no-war"]),o=e(["success","warning","info","question","error"]),m=()=>document.body.querySelector(".".concat(p.container)),$=e=>{const t=m();return t?t.querySelector(e):null},t=e=>$(".".concat(e)),g=()=>t(p.popup),J=()=>t(p.icon),G=()=>t(p.title),Q=()=>t(p["html-container"]),ee=()=>t(p.image),te=()=>t(p["progress-steps"]),ne=()=>t(p["validation-message"]),h=()=>$(".".concat(p.actions," .").concat(p.confirm)),f=()=>$(".".concat(p.actions," .").concat(p.deny));const d=()=>$(".".concat(p.loader)),b=()=>$(".".concat(p.actions," .").concat(p.cancel)),oe=()=>t(p.actions),ie=()=>t(p.footer),re=()=>t(p["timer-progress-bar"]),ae=()=>t(p.close),se=()=>{const e=i(g().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')).sort((e,t)=>{e=parseInt(e.getAttribute("tabindex")),t=parseInt(t.getAttribute("tabindex"));return t<e?1:e<t?-1:0});var t=i(g().querySelectorAll('\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex="0"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n')).filter(e=>"-1"!==e.getAttribute("tabindex"));return(t=>{const n=[];for(let e=0;e<t.length;e++)-1===n.indexOf(t[e])&&n.push(t[e]);return n})(e.concat(t)).filter(e=>P(e))},ce=()=>s(document.body,p.shown)&&!s(document.body,p["toast-shown"])&&!s(document.body,p["no-backdrop"]),le=()=>g()&&s(g(),p.toast);function ue(e){var t=1<arguments.length&&void 0!==arguments[1]&&arguments[1];const n=re();P(n)&&(t&&(n.style.transition="none",n.style.width="100%"),setTimeout(()=>{n.style.transition="width ".concat(e/1e3,"s linear"),n.style.width="0%"},10))}const n={previousBodyPadding:null},v=(t,e)=>{if(t.textContent="",e){const n=new DOMParser,o=n.parseFromString(e,"text/html");i(o.querySelector("head").childNodes).forEach(e=>{t.appendChild(e)}),i(o.querySelector("body").childNodes).forEach(e=>{t.appendChild(e)})}},s=(t,e)=>{if(!e)return!1;var n=e.split(/\s+/);for(let e=0;e<n.length;e++)if(!t.classList.contains(n[e]))return!1;return!0},de=(t,n)=>{i(t.classList).forEach(e=>{Object.values(p).includes(e)||Object.values(o).includes(e)||Object.values(n.showClass).includes(e)||t.classList.remove(e)})},y=(e,t,n)=>{if(de(e,t),t.customClass&&t.customClass[n]){if("string"!=typeof t.customClass[n]&&!t.customClass[n].forEach)return r("Invalid type of customClass.".concat(n,'! Expected string or iterable object, got "').concat(typeof t.customClass[n],'"'));w(e,t.customClass[n])}},pe=(e,t)=>{if(!t)return null;switch(t){case"select":case"textarea":case"file":return e.querySelector(".".concat(p.popup," > .").concat(p[t]));case"checkbox":return e.querySelector(".".concat(p.popup," > .").concat(p.checkbox," input"));case"radio":return e.querySelector(".".concat(p.popup," > .").concat(p.radio," input:checked"))||e.querySelector(".".concat(p.popup," > .").concat(p.radio," input:first-child"));case"range":return e.querySelector(".".concat(p.popup," > .").concat(p.range," input"));default:return e.querySelector(".".concat(p.popup," > .").concat(p.input))}},me=e=>{var t;e.focus(),"file"!==e.type&&(t=e.value,e.value="",e.value=t)},ge=(e,t,n)=>{e&&t&&(t="string"==typeof t?t.split(/\s+/).filter(Boolean):t).forEach(t=>{Array.isArray(e)?e.forEach(e=>{n?e.classList.add(t):e.classList.remove(t)}):n?e.classList.add(t):e.classList.remove(t)})},w=(e,t)=>{ge(e,t,!0)},C=(e,t)=>{ge(e,t,!1)},A=(e,t)=>{var n=i(e.childNodes);for(let e=0;e<n.length;e++)if(s(n[e],t))return n[e]},c=(e,t,n)=>{(n=n==="".concat(parseInt(n))?parseInt(n):n)||0===parseInt(n)?e.style[t]="number"==typeof n?"".concat(n,"px"):n:e.style.removeProperty(t)},k=function(e){e.style.display=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"flex"},B=e=>{e.style.display="none"},he=(e,t,n,o)=>{const i=e.querySelector(t);i&&(i.style[n]=o)},fe=function(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"flex";t?k(e,n):B(e)},P=e=>!(!e||!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)),be=()=>!P(h())&&!P(f())&&!P(b()),ve=e=>!!(e.scrollHeight>e.clientHeight),ye=e=>{const t=window.getComputedStyle(e);var e=parseFloat(t.getPropertyValue("animation-duration")||"0"),n=parseFloat(t.getPropertyValue("transition-duration")||"0");return 0<e||0<n},we=()=>"undefined"==typeof window||"undefined"==typeof document,Ce=100,x={},Ae=()=>{x.previousActiveElement instanceof HTMLElement?(x.previousActiveElement.focus(),x.previousActiveElement=null):document.body&&document.body.focus()},ke=o=>new Promise(e=>{if(!o)return e();var t=window.scrollX,n=window.scrollY;x.restoreFocusTimeout=setTimeout(()=>{Ae(),e()},Ce),window.scrollTo(t,n)}),Be='\n <div aria-labelledby="'.concat(p.title,'" aria-describedby="').concat(p["html-container"],'" class="').concat(p.popup,'" tabindex="-1">\n   <button type="button" class="').concat(p.close,'"></button>\n   <ul class="').concat(p["progress-steps"],'"></ul>\n   <div class="').concat(p.icon,'"></div>\n   <img class="').concat(p.image,'" />\n   <h2 class="').concat(p.title,'" id="').concat(p.title,'"></h2>\n   <div class="').concat(p["html-container"],'" id="').concat(p["html-container"],'"></div>\n   <input class="').concat(p.input,'" />\n   <input type="file" class="').concat(p.file,'" />\n   <div class="').concat(p.range,'">\n     <input type="range" />\n     <output></output>\n   </div>\n   <select class="').concat(p.select,'"></select>\n   <div class="').concat(p.radio,'"></div>\n   <label for="').concat(p.checkbox,'" class="').concat(p.checkbox,'">\n     <input type="checkbox" />\n     <span class="').concat(p.label,'"></span>\n   </label>\n   <textarea class="').concat(p.textarea,'"></textarea>\n   <div class="').concat(p["validation-message"],'" id="').concat(p["validation-message"],'"></div>\n   <div class="').concat(p.actions,'">\n     <div class="').concat(p.loader,'"></div>\n     <button type="button" class="').concat(p.confirm,'"></button>\n     <button type="button" class="').concat(p.deny,'"></button>\n     <button type="button" class="').concat(p.cancel,'"></button>\n   </div>\n   <div class="').concat(p.footer,'"></div>\n   <div class="').concat(p["timer-progress-bar-container"],'">\n     <div class="').concat(p["timer-progress-bar"],'"></div>\n   </div>\n </div>\n').replace(/(^|\n)\s*/g,""),Pe=()=>{const e=m();return!!e&&(e.remove(),C([document.documentElement,document.body],[p["no-backdrop"],p["toast-shown"],p["has-column"]]),!0)},E=()=>{x.currentInstance.resetValidationMessage()},xe=()=>{const e=g(),t=A(e,p.input),n=A(e,p.file),o=e.querySelector(".".concat(p.range," input")),i=e.querySelector(".".concat(p.range," output")),r=A(e,p.select),a=e.querySelector(".".concat(p.checkbox," input")),s=A(e,p.textarea);t.oninput=E,n.onchange=E,r.onchange=E,a.onchange=E,s.oninput=E,o.oninput=()=>{E(),i.value=o.value},o.onchange=()=>{E(),i.value=o.value}},Ee=e=>"string"==typeof e?document.querySelector(e):e,Te=e=>{const t=g();t.setAttribute("role",e.toast?"alert":"dialog"),t.setAttribute("aria-live",e.toast?"polite":"assertive"),e.toast||t.setAttribute("aria-modal","true")},Se=e=>{"rtl"===window.getComputedStyle(e).direction&&w(m(),p.rtl)},Le=(e,t)=>{if(e instanceof HTMLElement)t.appendChild(e);else if("object"==typeof e){var n=e,o=t;if(n.jquery)Oe(o,n);else v(o,n.toString())}else e&&v(t,e)},Oe=(t,n)=>{if(t.textContent="",0 in n)for(let e=0;e in n;e++)t.appendChild(n[e].cloneNode(!0));else t.appendChild(n.cloneNode(!0))},je=(()=>{if(we())return!1;var e=document.createElement("div"),t={WebkitAnimation:"webkitAnimationEnd",animation:"animationend"};for(const n in t)if(Object.prototype.hasOwnProperty.call(t,n)&&void 0!==e.style[n])return t[n];return!1})(),Me=(e,t)=>{var n,o,i,r,a,s=oe(),c=d();(t.showConfirmButton||t.showDenyButton||t.showCancelButton?k:B)(s),y(s,t,"actions"),s=s,n=c,o=t,i=h(),r=f(),a=b(),He(i,"confirm",o),He(r,"deny",o),He(a,"cancel",o),function(e,t,n,o){if(!o.buttonsStyling)return C([e,t,n],p.styled);w([e,t,n],p.styled),o.confirmButtonColor&&(e.style.backgroundColor=o.confirmButtonColor,w(e,p["default-outline"]));o.denyButtonColor&&(t.style.backgroundColor=o.denyButtonColor,w(t,p["default-outline"]));o.cancelButtonColor&&(n.style.backgroundColor=o.cancelButtonColor,w(n,p["default-outline"]))}(i,r,a,o),o.reverseButtons&&(o.toast?(s.insertBefore(a,i),s.insertBefore(r,i)):(s.insertBefore(a,n),s.insertBefore(r,n),s.insertBefore(i,n))),v(c,t.loaderHtml),y(c,t,"loader")};function He(e,t,n){fe(e,n["show".concat(q(t),"Button")],"inline-block"),v(e,n["".concat(t,"ButtonText")]),e.setAttribute("aria-label",n["".concat(t,"ButtonAriaLabel")]),e.className=p[t],y(e,n,"".concat(t,"Button")),w(e,n["".concat(t,"ButtonClass")])}const Ie=(e,t)=>{var n,o,i=m();i&&(o=i,"string"==typeof(n=t.backdrop)?o.style.background=n:n||w([document.documentElement,document.body],p["no-backdrop"]),o=i,(n=t.position)in p?w(o,p[n]):(r('The "position" parameter is not valid, defaulting to "center"'),w(o,p.center)),n=i,(o=t.grow)&&"string"==typeof o&&(o="grow-".concat(o))in p&&w(n,p[o]),y(i,t,"container"))};var T={awaitingPromise:new WeakMap,promise:new WeakMap,innerParams:new WeakMap,domCache:new WeakMap};const De=["input","file","range","select","radio","checkbox","textarea"],qe=(e,a)=>{const s=g();var t,e=T.innerParams.get(e);const c=!e||a.input!==e.input;De.forEach(e=>{const t=A(s,p[e]);{var n=e,o=a.inputAttributes;const i=pe(g(),n);if(i){Ve(i);for(const r in o)i.setAttribute(r,o[r])}}t.className=p[e],c&&B(t)}),a.input&&(c&&(e=>{if(!S[e.input])return l('Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "'.concat(e.input,'"'));const t=Fe(e.input),n=S[e.input](t,e);k(t),setTimeout(()=>{me(n)})})(a),e=a,t=Fe(e.input),"object"==typeof e.customClass&&w(t,e.customClass.input))},Ve=t=>{for(let e=0;e<t.attributes.length;e++){var n=t.attributes[e].name;["type","value","style"].includes(n)||t.removeAttribute(n)}},Ne=(e,t)=>{e.placeholder&&!t.inputPlaceholder||(e.placeholder=t.inputPlaceholder)},Re=(e,t,n)=>{if(n.inputLabel){e.id=p.input;const i=document.createElement("label");var o=p["input-label"];i.setAttribute("for",e.id),i.className=o,"object"==typeof n.customClass&&w(i,n.customClass.inputLabel),i.innerText=n.inputLabel,t.insertAdjacentElement("beforebegin",i)}},Fe=e=>A(g(),p[e]||p.input),Ue=(e,t)=>{["string","number"].includes(typeof t)?e.value="".concat(t):U(t)||r('Unexpected type of inputValue! Expected "string", "number" or "Promise", got "'.concat(typeof t,'"'))},S={},We=(S.text=S.email=S.password=S.number=S.tel=S.url=(e,t)=>(Ue(e,t.inputValue),Re(e,e,t),Ne(e,t),e.type=t.input,e),S.file=(e,t)=>(Re(e,e,t),Ne(e,t),e),S.range=(e,t)=>{const n=e.querySelector("input");var o=e.querySelector("output");return Ue(n,t.inputValue),n.type=t.input,Ue(o,t.inputValue),Re(n,e,t),e},S.select=(e,t)=>{if(e.textContent="",t.inputPlaceholder){const n=document.createElement("option");v(n,t.inputPlaceholder),n.value="",n.disabled=!0,n.selected=!0,e.appendChild(n)}return Re(e,e,t),e},S.radio=e=>(e.textContent="",e),S.checkbox=(e,t)=>{const n=pe(g(),"checkbox");n.value="1",n.id=p.checkbox,n.checked=Boolean(t.inputValue);e=e.querySelector("span");return v(e,t.inputPlaceholder),n},S.textarea=(n,e)=>{Ue(n,e.inputValue),Ne(n,e),Re(n,n,e);return setTimeout(()=>{if("MutationObserver"in window){const t=parseInt(window.getComputedStyle(g()).width);new MutationObserver(()=>{var e=n.offsetWidth+(e=n,parseInt(window.getComputedStyle(e).marginLeft)+parseInt(window.getComputedStyle(e).marginRight));e>t?g().style.width="".concat(e,"px"):g().style.width=null}).observe(n,{attributes:!0,attributeFilter:["style"]})}}),n},(e,t)=>{const n=Q();y(n,t,"htmlContainer"),t.html?(Le(t.html,n),k(n,"block")):t.text?(n.textContent=t.text,k(n,"block")):B(n),qe(e,t)}),ze=(e,t)=>{var n=ie();fe(n,t.footer),t.footer&&Le(t.footer,n),y(n,t,"footer")},Ke=(e,t)=>{const n=ae();v(n,t.closeButtonHtml),y(n,t,"closeButton"),fe(n,t.showCloseButton),n.setAttribute("aria-label",t.closeButtonAriaLabel)},_e=(e,t)=>{var e=T.innerParams.get(e),n=J();if(e&&t.icon===e.icon)return Je(n,t),void Ye(n,t);if(t.icon||t.iconHtml){if(t.icon&&-1===Object.keys(o).indexOf(t.icon))return l('Unknown icon! Expected "success", "error", "warning", "info" or "question", got "'.concat(t.icon,'"')),void B(n);k(n),Je(n,t),Ye(n,t),w(n,t.showClass.icon)}else B(n)},Ye=(e,t)=>{for(const n in o)t.icon!==n&&C(e,o[n]);w(e,o[t.icon]),Ge(e,t),Ze(),y(e,t,"icon")},Ze=()=>{const e=g();var t=window.getComputedStyle(e).getPropertyValue("background-color");const n=e.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix");for(let e=0;e<n.length;e++)n[e].style.backgroundColor=t},Xe='\n  <div class="swal2-success-circular-line-left"></div>\n  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n  <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n  <div class="swal2-success-circular-line-right"></div>\n',$e='\n  <span class="swal2-x-mark">\n    <span class="swal2-x-mark-line-left"></span>\n    <span class="swal2-x-mark-line-right"></span>\n  </span>\n',Je=(e,t)=>{let n=e.innerHTML,o;var i;t.iconHtml?o=Qe(t.iconHtml):"success"===t.icon?(o=Xe,n=n.replace(/ style=".*?"/g,"")):o="error"===t.icon?$e:(i={question:"?",warning:"!",info:"i"},Qe(i[t.icon])),n.trim()!==o.trim()&&v(e,o)},Ge=(e,t)=>{if(t.iconColor){e.style.color=t.iconColor,e.style.borderColor=t.iconColor;for(const n of[".swal2-success-line-tip",".swal2-success-line-long",".swal2-x-mark-line-left",".swal2-x-mark-line-right"])he(e,n,"backgroundColor",t.iconColor);he(e,".swal2-success-ring","borderColor",t.iconColor)}},Qe=e=>'<div class="'.concat(p["icon-content"],'">').concat(e,"</div>"),et=(e,t)=>{const n=ee();if(!t.imageUrl)return B(n);k(n,""),n.setAttribute("src",t.imageUrl),n.setAttribute("alt",t.imageAlt),c(n,"width",t.imageWidth),c(n,"height",t.imageHeight),n.className=p.image,y(n,t,"image")},tt=(e,n)=>{const o=te();if(!n.progressSteps||0===n.progressSteps.length)return B(o);k(o),o.textContent="",n.currentProgressStep>=n.progressSteps.length&&r("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"),n.progressSteps.forEach((e,t)=>{var e=(e=>{const t=document.createElement("li");return w(t,p["progress-step"]),v(t,e),t})(e);o.appendChild(e),t===n.currentProgressStep&&w(e,p["active-progress-step"]),t!==n.progressSteps.length-1&&(e=(e=>{const t=document.createElement("li");if(w(t,p["progress-step-line"]),e.progressStepsDistance)c(t,"width",e.progressStepsDistance);return t})(n),o.appendChild(e))})},nt=(e,t)=>{const n=G();fe(n,t.title||t.titleText,"block"),t.title&&Le(t.title,n),t.titleText&&(n.innerText=t.titleText),y(n,t,"title")},ot=(e,t)=>{var n=m();const o=g();t.toast?(c(n,"width",t.width),o.style.width="100%",o.insertBefore(d(),J())):c(o,"width",t.width),c(o,"padding",t.padding),t.color&&(o.style.color=t.color),t.background&&(o.style.background=t.background),B(ne());n=o;(n.className="".concat(p.popup," ").concat(P(n)?t.showClass.popup:""),t.toast)?(w([document.documentElement,document.body],p["toast-shown"]),w(n,p.toast)):w(n,p.modal);y(n,t,"popup"),"string"==typeof t.customClass&&w(n,t.customClass);t.icon&&w(n,p["icon-".concat(t.icon)])},it=(e,t)=>{ot(e,t),Ie(e,t),tt(e,t),_e(e,t),et(e,t),nt(e,t),Ke(e,t),We(e,t),Me(e,t),ze(e,t),"function"==typeof t.didRender&&t.didRender(g())},L=Object.freeze({cancel:"cancel",backdrop:"backdrop",close:"close",esc:"esc",timer:"timer"}),rt=()=>{const e=i(document.body.children);e.forEach(e=>{e===m()||e.contains(m())||(e.hasAttribute("aria-hidden")&&e.setAttribute("data-previous-aria-hidden",e.getAttribute("aria-hidden")),e.setAttribute("aria-hidden","true"))})},at=()=>{const e=i(document.body.children);e.forEach(e=>{e.hasAttribute("data-previous-aria-hidden")?(e.setAttribute("aria-hidden",e.getAttribute("data-previous-aria-hidden")),e.removeAttribute("data-previous-aria-hidden")):e.removeAttribute("aria-hidden")})},st=["swal-title","swal-html","swal-footer"],ct=e=>{const n={};return i(e.querySelectorAll("swal-param")).forEach(e=>{O(e,["name","value"]);var t=e.getAttribute("name"),e=e.getAttribute("value");"boolean"==typeof a[t]&&"false"===e&&(n[t]=!1),"object"==typeof a[t]&&(n[t]=JSON.parse(e))}),n},lt=e=>{const n={};return i(e.querySelectorAll("swal-button")).forEach(e=>{O(e,["type","color","aria-label"]);var t=e.getAttribute("type");n["".concat(t,"ButtonText")]=e.innerHTML,n["show".concat(q(t),"Button")]=!0,e.hasAttribute("color")&&(n["".concat(t,"ButtonColor")]=e.getAttribute("color")),e.hasAttribute("aria-label")&&(n["".concat(t,"ButtonAriaLabel")]=e.getAttribute("aria-label"))}),n},ut=e=>{const t={},n=e.querySelector("swal-image");return n&&(O(n,["src","width","height","alt"]),n.hasAttribute("src")&&(t.imageUrl=n.getAttribute("src")),n.hasAttribute("width")&&(t.imageWidth=n.getAttribute("width")),n.hasAttribute("height")&&(t.imageHeight=n.getAttribute("height")),n.hasAttribute("alt")&&(t.imageAlt=n.getAttribute("alt"))),t},dt=e=>{const t={},n=e.querySelector("swal-icon");return n&&(O(n,["type","color"]),n.hasAttribute("type")&&(t.icon=n.getAttribute("type")),n.hasAttribute("color")&&(t.iconColor=n.getAttribute("color")),t.iconHtml=n.innerHTML),t},pt=e=>{const n={},t=e.querySelector("swal-input");t&&(O(t,["type","label","placeholder","value"]),n.input=t.getAttribute("type")||"text",t.hasAttribute("label")&&(n.inputLabel=t.getAttribute("label")),t.hasAttribute("placeholder")&&(n.inputPlaceholder=t.getAttribute("placeholder")),t.hasAttribute("value")&&(n.inputValue=t.getAttribute("value")));e=e.querySelectorAll("swal-input-option");return e.length&&(n.inputOptions={},i(e).forEach(e=>{O(e,["value"]);var t=e.getAttribute("value"),e=e.innerHTML;n.inputOptions[t]=e})),n},mt=(e,t)=>{const n={};for(const o in t){const i=t[o],r=e.querySelector(i);r&&(O(r,[]),n[i.replace(/^swal-/,"")]=r.innerHTML.trim())}return n},gt=e=>{const t=st.concat(["swal-param","swal-button","swal-image","swal-icon","swal-input","swal-input-option"]);i(e.children).forEach(e=>{e=e.tagName.toLowerCase();-1===t.indexOf(e)&&r("Unrecognized element <".concat(e,">"))})},O=(t,n)=>{i(t.attributes).forEach(e=>{-1===n.indexOf(e.name)&&r(['Unrecognized attribute "'.concat(e.name,'" on <').concat(t.tagName.toLowerCase(),">."),"".concat(n.length?"Allowed attributes are: ".concat(n.join(", ")):"To set the value, use HTML within the element.")])})};var ht={email:(e,t)=>/^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(e)?Promise.resolve():Promise.resolve(t||"Invalid email address"),url:(e,t)=>/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(e)?Promise.resolve():Promise.resolve(t||"Invalid URL")};function ft(e){(t=e).inputValidator||Object.keys(ht).forEach(e=>{t.input===e&&(t.inputValidator=ht[e])}),e.showLoaderOnConfirm&&!e.preConfirm&&r("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request"),(n=e).target&&("string"!=typeof n.target||document.querySelector(n.target))&&("string"==typeof n.target||n.target.appendChild)||(r('Target parameter is not valid, defaulting to "body"'),n.target="body"),"string"==typeof e.title&&(e.title=e.title.split("\n").join("<br />"));var t,n=e,e=Pe();if(we())l("SweetAlert2 requires document to initialize");else{const o=document.createElement("div"),i=(o.className=p.container,e&&w(o,p["no-transition"]),v(o,Be),Ee(n.target));i.appendChild(o),Te(n),Se(i),xe()}}class bt{constructor(e,t){this.callback=e,this.remaining=t,this.running=!1,this.start()}start(){return this.running||(this.running=!0,this.started=new Date,this.id=setTimeout(this.callback,this.remaining)),this.remaining}stop(){return this.running&&(this.running=!1,clearTimeout(this.id),this.remaining-=(new Date).getTime()-this.started.getTime()),this.remaining}increase(e){var t=this.running;return t&&this.stop(),this.remaining+=e,t&&this.start(),this.remaining}getTimerLeft(){return this.running&&(this.stop(),this.start()),this.remaining}isRunning(){return this.running}}const vt=()=>{null===n.previousBodyPadding&&document.body.scrollHeight>window.innerHeight&&(n.previousBodyPadding=parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right")),document.body.style.paddingRight="".concat(n.previousBodyPadding+(()=>{const e=document.createElement("div");e.className=p["scrollbar-measure"],document.body.appendChild(e);var t=e.getBoundingClientRect().width-e.clientWidth;return document.body.removeChild(e),t})(),"px"))},yt=()=>{null!==n.previousBodyPadding&&(document.body.style.paddingRight="".concat(n.previousBodyPadding,"px"),n.previousBodyPadding=null)},wt=()=>{if((/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream||"MacIntel"===navigator.platform&&1<navigator.maxTouchPoints)&&!s(document.body,p.iosfix)){var e,t=document.body.scrollTop;document.body.style.top="".concat(-1*t,"px"),w(document.body,p.iosfix);{const n=m();let t;n.ontouchstart=e=>{t=Ct(e)},n.ontouchmove=e=>{t&&(e.preventDefault(),e.stopPropagation())}}{const o=navigator.userAgent,i=!!o.match(/iPad/i)||!!o.match(/iPhone/i),r=!!o.match(/WebKit/i),a=i&&r&&!o.match(/CriOS/i);a&&(e=44,g().scrollHeight>window.innerHeight-44&&(m().style.paddingBottom="".concat(44,"px")))}}},Ct=e=>{var t,n=e.target,o=m();return!((t=e).touches&&t.touches.length&&"stylus"===t.touches[0].touchType||(t=e).touches&&1<t.touches.length)&&(n===o||!(ve(o)||"INPUT"===n.tagName||"TEXTAREA"===n.tagName||ve(Q())&&Q().contains(n)))},At=()=>{var e;s(document.body,p.iosfix)&&(e=parseInt(document.body.style.top,10),C(document.body,p.iosfix),document.body.style.top="",document.body.scrollTop=-1*e)},kt=10,Bt=e=>{const t=g();if(e.target===t){const n=m();t.removeEventListener(je,Bt),n.style.overflowY="auto"}},Pt=(e,t)=>{je&&ye(t)?(e.style.overflowY="hidden",t.addEventListener(je,Bt)):e.style.overflowY="auto"},xt=(e,t,n)=>{wt(),t&&"hidden"!==n&&vt(),setTimeout(()=>{e.scrollTop=0})},Et=(e,t,n)=>{w(e,n.showClass.backdrop),t.style.setProperty("opacity","0","important"),k(t,"grid"),setTimeout(()=>{w(t,n.showClass.popup),t.style.removeProperty("opacity")},kt),w([document.documentElement,document.body],p.shown),n.heightAuto&&n.backdrop&&!n.toast&&w([document.documentElement,document.body],p["height-auto"])},j=e=>{let t=g();t||new kn,t=g();var n=d();if(le())B(J());else{var o=t;const i=oe(),r=d();!e&&P(h())&&(e=h());k(i),e&&(B(e),r.setAttribute("data-button-to-replace",e.className));r.parentNode.insertBefore(r,e),w([o,i],p.loading)}k(n),t.setAttribute("data-loading","true"),t.setAttribute("aria-busy","true"),t.focus()},Tt=(t,n)=>{const o=g(),i=e=>Lt[n.input](o,Ot(e),n);F(n.inputOptions)||U(n.inputOptions)?(j(h()),u(n.inputOptions).then(e=>{t.hideLoading(),i(e)})):"object"==typeof n.inputOptions?i(n.inputOptions):l("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(typeof n.inputOptions))},St=(t,n)=>{const o=t.getInput();B(o),u(n.inputValue).then(e=>{o.value="number"===n.input?parseFloat(e)||0:"".concat(e),k(o),o.focus(),t.hideLoading()}).catch(e=>{l("Error in inputValue promise: ".concat(e)),o.value="",k(o),o.focus(),t.hideLoading()})},Lt={select:(e,t,i)=>{const r=A(e,p.select),a=(e,t,n)=>{const o=document.createElement("option");o.value=n,v(o,t),o.selected=jt(n,i.inputValue),e.appendChild(o)};t.forEach(e=>{var t=e[0];const n=e[1];if(Array.isArray(n)){const o=document.createElement("optgroup");o.label=t,o.disabled=!1,r.appendChild(o),n.forEach(e=>a(o,e[1],e[0]))}else a(r,n,t)}),r.focus()},radio:(e,t,r)=>{const a=A(e,p.radio),n=(t.forEach(e=>{var t=e[0],e=e[1];const n=document.createElement("input"),o=document.createElement("label"),i=(n.type="radio",n.name=p.radio,n.value=t,jt(t,r.inputValue)&&(n.checked=!0),document.createElement("span"));v(i,e),i.className=p.label,o.appendChild(n),o.appendChild(i),a.appendChild(o)}),a.querySelectorAll("input"));n.length&&n[0].focus()}},Ot=n=>{const o=[];return"undefined"!=typeof Map&&n instanceof Map?n.forEach((e,t)=>{let n=e;"object"==typeof n&&(n=Ot(n)),o.push([t,n])}):Object.keys(n).forEach(e=>{let t=n[e];"object"==typeof t&&(t=Ot(t)),o.push([e,t])}),o},jt=(e,t)=>t&&t.toString()===e.toString();function Mt(){var e,t=T.innerParams.get(this);if(t){const n=T.domCache.get(this);B(n.loader),le()?t.icon&&k(J()):(t=n,(e=t.popup.getElementsByClassName(t.loader.getAttribute("data-button-to-replace"))).length?k(e[0],"inline-block"):be()&&B(t.actions)),C([n.popup,n.actions],p.loading),n.popup.removeAttribute("aria-busy"),n.popup.removeAttribute("data-loading"),n.confirmButton.disabled=!1,n.denyButton.disabled=!1,n.cancelButton.disabled=!1}}var Ht={swalPromiseResolve:new WeakMap,swalPromiseReject:new WeakMap};const It=()=>h()&&h().click();const Dt=e=>{e.keydownTarget&&e.keydownHandlerAdded&&(e.keydownTarget.removeEventListener("keydown",e.keydownHandler,{capture:e.keydownListenerCapture}),e.keydownHandlerAdded=!1)},qt=(e,t,n)=>{const o=se();if(o.length)return(t+=n)===o.length?t=0:-1===t&&(t=o.length-1),o[t].focus();g().focus()},Vt=["ArrowRight","ArrowDown"],Nt=["ArrowLeft","ArrowUp"],Rt=(e,n,t)=>{var o=T.innerParams.get(e);if(o&&(!n.isComposing&&229!==n.keyCode))if(o.stopKeydownPropagation&&n.stopPropagation(),"Enter"===n.key)e=e,s=n,i=o,R(i.allowEnterKey)&&s.target&&e.getInput()&&s.target instanceof HTMLElement&&s.target.outerHTML===e.getInput().outerHTML&&(["textarea","file"].includes(i.input)||(It(),s.preventDefault()));else if("Tab"===n.key){e=n;var i=o;var r=e.target,a=se();let t=-1;for(let e=0;e<a.length;e++)if(r===a[e]){t=e;break}e.shiftKey?qt(i,t,-1):qt(i,t,1);e.stopPropagation(),e.preventDefault()}else if([...Vt,...Nt].includes(n.key)){var s=n.key;const l=h(),u=f(),d=b();if(!(document.activeElement instanceof HTMLElement)||[l,u,d].includes(document.activeElement)){var c=Vt.includes(s)?"nextElementSibling":"previousElementSibling";let t=document.activeElement;for(let e=0;e<oe().children.length;e++){if(!(t=t[c]))return;if(t instanceof HTMLButtonElement&&P(t))break}t instanceof HTMLButtonElement&&t.focus()}}else if("Escape"===n.key){e=n,n=o,o=t;if(R(n.allowEscapeKey)){e.preventDefault();o(L.esc)}}};function Ft(e,t,n,o){le()?Kt(e,o):(ke(n).then(()=>Kt(e,o)),Dt(x)),/^((?!chrome|android).)*safari/i.test(navigator.userAgent)?(t.setAttribute("style","display:none !important"),t.removeAttribute("class"),t.innerHTML=""):t.remove(),ce()&&(yt(),At(),at()),C([document.documentElement,document.body],[p.shown,p["height-auto"],p["no-backdrop"],p["toast-shown"]])}function Ut(e){e=void 0!==(n=e)?Object.assign({isConfirmed:!1,isDenied:!1,isDismissed:!1},n):{isConfirmed:!1,isDenied:!1,isDismissed:!0};const t=Ht.swalPromiseResolve.get(this);var n=(e=>{const t=g();if(!t)return false;const n=T.innerParams.get(e);if(!n||s(t,n.hideClass.popup))return false;C(t,n.showClass.popup),w(t,n.hideClass.popup);const o=m();return C(o,n.showClass.backdrop),w(o,n.hideClass.backdrop),zt(e,t,n),true})(this);this.isAwaitingPromise()?e.isDismissed||(Wt(this),t(e)):n&&t(e)}const Wt=e=>{e.isAwaitingPromise()&&(T.awaitingPromise.delete(e),T.innerParams.get(e)||e._destroy())},zt=(e,t,n)=>{var o,i,r,a=m(),s=je&&ye(t);"function"==typeof n.willClose&&n.willClose(t),s?(s=e,o=t,t=a,i=n.returnFocus,r=n.didClose,x.swalCloseEventFinishedCallback=Ft.bind(null,s,t,i,r),o.addEventListener(je,function(e){e.target===o&&(x.swalCloseEventFinishedCallback(),delete x.swalCloseEventFinishedCallback)})):Ft(e,a,n.returnFocus,n.didClose)},Kt=(e,t)=>{setTimeout(()=>{"function"==typeof t&&t.bind(e.params)(),e._destroy()})};function _t(e,t,n){const o=T.domCache.get(e);t.forEach(e=>{o[e].disabled=n})}function Yt(e,t){if(!e)return!1;if("radio"===e.type){const n=e.parentNode.parentNode,o=n.querySelectorAll("input");for(let e=0;e<o.length;e++)o[e].disabled=t}else e.disabled=t}const Zt=e=>{e.isAwaitingPromise()?(Xt(T,e),T.awaitingPromise.set(e,!0)):(Xt(Ht,e),Xt(T,e))},Xt=(e,t)=>{for(const n in e)e[n].delete(t)};e=Object.freeze({hideLoading:Mt,disableLoading:Mt,getInput:function(e){var t=T.innerParams.get(e||this);return(e=T.domCache.get(e||this))?pe(e.popup,t.input):null},close:Ut,isAwaitingPromise:function(){return!!T.awaitingPromise.get(this)},rejectPromise:function(e){const t=Ht.swalPromiseReject.get(this);Wt(this),t&&t(e)},handleAwaitingPromise:Wt,closePopup:Ut,closeModal:Ut,closeToast:Ut,enableButtons:function(){_t(this,["confirmButton","denyButton","cancelButton"],!1)},disableButtons:function(){_t(this,["confirmButton","denyButton","cancelButton"],!0)},enableInput:function(){return Yt(this.getInput(),!1)},disableInput:function(){return Yt(this.getInput(),!0)},showValidationMessage:function(e){const t=T.domCache.get(this);var n=T.innerParams.get(this);v(t.validationMessage,e),t.validationMessage.className=p["validation-message"],n.customClass&&n.customClass.validationMessage&&w(t.validationMessage,n.customClass.validationMessage),k(t.validationMessage);const o=this.getInput();o&&(o.setAttribute("aria-invalid",!0),o.setAttribute("aria-describedby",p["validation-message"]),me(o),w(o,p.inputerror))},resetValidationMessage:function(){var e=T.domCache.get(this);e.validationMessage&&B(e.validationMessage);const t=this.getInput();t&&(t.removeAttribute("aria-invalid"),t.removeAttribute("aria-describedby"),C(t,p.inputerror))},getProgressSteps:function(){return T.domCache.get(this).progressSteps},update:function(e){var t=g(),n=T.innerParams.get(this);if(!t||s(t,n.hideClass.popup))return r("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");t=(t=>{const n={};return Object.keys(t).forEach(e=>{if(Y(e))n[e]=t[e];else r("Invalid parameter to update: ".concat(e))}),n})(e),n=Object.assign({},n,t),it(this,n),T.innerParams.set(this,n),Object.defineProperties(this,{params:{value:Object.assign({},this.params,e),writable:!1,enumerable:!0}})},_destroy:function(){var e=T.domCache.get(this);const t=T.innerParams.get(this);t?(e.popup&&x.swalCloseEventFinishedCallback&&(x.swalCloseEventFinishedCallback(),delete x.swalCloseEventFinishedCallback),"function"==typeof t.didDestroy&&t.didDestroy(),e=this,Zt(e),delete e.params,delete x.keydownHandler,delete x.keydownTarget,delete x.currentInstance):Zt(this)}});const $t=(e,t)=>{var n=T.innerParams.get(e);if(n.input){var o=((e,t)=>{const n=e.getInput();if(!n)return null;switch(t.input){case"checkbox":return n.checked?1:0;case"radio":return(o=n).checked?o.value:null;case"file":return(o=n).files.length?null!==o.getAttribute("multiple")?o.files:o.files[0]:null;default:return t.inputAutoTrim?n.value.trim():n.value}var o})(e,n);if(n.inputValidator){var i=e;var r=o;var a=t;const s=T.innerParams.get(i),c=(i.disableInput(),Promise.resolve().then(()=>u(s.inputValidator(r,s.validationMessage))));c.then(e=>{i.enableButtons(),i.enableInput(),e?i.showValidationMessage(e):("deny"===a?Jt:en)(i,r)})}else e.getInput().checkValidity()?("deny"===t?Jt:en)(e,o):(e.enableButtons(),e.showValidationMessage(n.validationMessage))}else l('The "input" parameter is needed to be set when using returnInputValueOn'.concat(q(t)))},Jt=(t,n)=>{const e=T.innerParams.get(t||void 0);if(e.showLoaderOnDeny&&j(f()),e.preDeny){T.awaitingPromise.set(t||void 0,!0);const o=Promise.resolve().then(()=>u(e.preDeny(n,e.validationMessage)));o.then(e=>{!1===e?(t.hideLoading(),Wt(t)):t.close({isDenied:!0,value:void 0===e?n:e})}).catch(e=>Qt(t||void 0,e))}else t.close({isDenied:!0,value:n})},Gt=(e,t)=>{e.close({isConfirmed:!0,value:t})},Qt=(e,t)=>{e.rejectPromise(t)},en=(t,n)=>{const e=T.innerParams.get(t||void 0);if(e.showLoaderOnConfirm&&j(),e.preConfirm){t.resetValidationMessage(),T.awaitingPromise.set(t||void 0,!0);const o=Promise.resolve().then(()=>u(e.preConfirm(n,e.validationMessage)));o.then(e=>{P(ne())||!1===e?(t.hideLoading(),Wt(t)):Gt(t,void 0===e?n:e)}).catch(e=>Qt(t||void 0,e))}else Gt(t,n)},tn=(n,e,o)=>{e.popup.onclick=()=>{var e,t=T.innerParams.get(n);t&&((e=t).showConfirmButton||e.showDenyButton||e.showCancelButton||e.showCloseButton||t.timer||t.input)||o(L.close)}};let nn=!1;const on=t=>{t.popup.onmousedown=()=>{t.container.onmouseup=function(e){t.container.onmouseup=void 0,e.target===t.container&&(nn=!0)}}},rn=t=>{t.container.onmousedown=()=>{t.popup.onmouseup=function(e){t.popup.onmouseup=void 0,e.target!==t.popup&&!t.popup.contains(e.target)||(nn=!0)}}},an=(n,o,i)=>{o.container.onclick=e=>{var t=T.innerParams.get(n);nn?nn=!1:e.target===o.container&&R(t.allowOutsideClick)&&i(L.backdrop)}},sn=e=>"object"==typeof e&&e.jquery,cn=e=>e instanceof Element||sn(e);const ln=()=>{if(x.timeout){{const n=re();var e=parseInt(window.getComputedStyle(n).width),t=(n.style.removeProperty("transition"),n.style.width="100%",parseInt(window.getComputedStyle(n).width)),e=e/t*100;n.style.removeProperty("transition"),n.style.width="".concat(e,"%")}return x.timeout.stop()}},un=()=>{var e;if(x.timeout)return e=x.timeout.start(),ue(e),e};let dn=!1;const pn={};const mn=t=>{for(let e=t.target;e&&e!==document;e=e.parentNode)for(const o in pn){var n=e.getAttribute(o);if(n)return void pn[o].fire({template:n})}};var gn=Object.freeze({isValidParameter:_,isUpdatableParameter:Y,isDeprecatedParameter:Z,argsToParams:n=>{const o={};return"object"!=typeof n[0]||cn(n[0])?["title","html","icon"].forEach((e,t)=>{t=n[t];"string"==typeof t||cn(t)?o[e]=t:void 0!==t&&l("Unexpected type of ".concat(e,'! Expected "string" or "Element", got ').concat(typeof t))}):Object.assign(o,n[0]),o},isVisible:()=>P(g()),clickConfirm:It,clickDeny:()=>f()&&f().click(),clickCancel:()=>b()&&b().click(),getContainer:m,getPopup:g,getTitle:G,getHtmlContainer:Q,getImage:ee,getIcon:J,getInputLabel:()=>t(p["input-label"]),getCloseButton:ae,getActions:oe,getConfirmButton:h,getDenyButton:f,getCancelButton:b,getLoader:d,getFooter:ie,getTimerProgressBar:re,getFocusableElements:se,getValidationMessage:ne,isLoading:()=>g().hasAttribute("data-loading"),fire:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return new this(...t)},mixin:function(n){class e extends this{_main(e,t){return super._main(e,Object.assign({},n,t))}}return e},showLoading:j,enableLoading:j,getTimerLeft:()=>x.timeout&&x.timeout.getTimerLeft(),stopTimer:ln,resumeTimer:un,toggleTimer:()=>{var e=x.timeout;return e&&(e.running?ln:un)()},increaseTimer:e=>{if(x.timeout)return e=x.timeout.increase(e),ue(e,!0),e},isTimerRunning:()=>x.timeout&&x.timeout.isRunning(),bindClickHandler:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"data-swal-template";pn[e]=this,dn||(document.body.addEventListener("click",mn),dn=!0)}});let M;class H{constructor(){if("undefined"!=typeof window){M=this;for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var o=Object.freeze(this.constructor.argsToParams(t)),o=(Object.defineProperties(this,{params:{value:o,writable:!1,enumerable:!0,configurable:!0}}),M._main(M.params));T.promise.set(this,o)}}_main(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},e=(X(Object.assign({},t,e)),x.currentInstance&&(x.currentInstance._destroy(),ce()&&at()),x.currentInstance=M,fn(e,t)),t=(ft(e),Object.freeze(e),x.timeout&&(x.timeout.stop(),delete x.timeout),clearTimeout(x.restoreFocusTimeout),bn(M));return it(M,e),T.innerParams.set(M,e),hn(M,t,e)}then(e){const t=T.promise.get(this);return t.then(e)}finally(e){const t=T.promise.get(this);return t.finally(e)}}const hn=(l,u,d)=>new Promise((e,t)=>{const n=e=>{l.closePopup({isDismissed:!0,dismiss:e})};var o,i,r;Ht.swalPromiseResolve.set(l,e),Ht.swalPromiseReject.set(l,t),u.confirmButton.onclick=()=>{var e=l,t=T.innerParams.get(e);e.disableButtons(),t.input?$t(e,"confirm"):en(e,!0)},u.denyButton.onclick=()=>{var e=l,t=T.innerParams.get(e);e.disableButtons(),t.returnInputValueOnDeny?$t(e,"deny"):Jt(e,!1)},u.cancelButton.onclick=()=>{var e=l,t=n;e.disableButtons(),t(L.cancel)},u.closeButton.onclick=()=>n(L.close),e=l,t=u,r=n,T.innerParams.get(e).toast?tn(e,t,r):(on(t),rn(t),an(e,t,r)),o=l,e=x,t=d,i=n,Dt(e),t.toast||(e.keydownHandler=e=>Rt(o,e,i),e.keydownTarget=t.keydownListenerCapture?window:g(),e.keydownListenerCapture=t.keydownListenerCapture,e.keydownTarget.addEventListener("keydown",e.keydownHandler,{capture:e.keydownListenerCapture}),e.keydownHandlerAdded=!0),r=l,"select"===(t=d).input||"radio"===t.input?Tt(r,t):["text","email","number","tel","textarea"].includes(t.input)&&(F(t.inputValue)||U(t.inputValue))&&(j(h()),St(r,t));{var a=d;const s=m(),c=g();"function"==typeof a.willOpen&&a.willOpen(c),e=window.getComputedStyle(document.body).overflowY,Et(s,c,a),setTimeout(()=>{Pt(s,c)},kt),ce()&&(xt(s,a.scrollbarPadding,e),rt()),le()||x.previousActiveElement||(x.previousActiveElement=document.activeElement),"function"==typeof a.didOpen&&setTimeout(()=>a.didOpen(c)),C(s,p["no-transition"])}vn(x,d,n),yn(u,d),setTimeout(()=>{u.container.scrollTop=0})}),fn=(e,t)=>{var n=(e=>{e="string"==typeof e.template?document.querySelector(e.template):e.template;if(!e)return{};e=e.content,gt(e),e=Object.assign(ct(e),lt(e),ut(e),dt(e),pt(e),mt(e,st));return e})(e);const o=Object.assign({},a,t,n,e);return o.showClass=Object.assign({},a.showClass,o.showClass),o.hideClass=Object.assign({},a.hideClass,o.hideClass),o},bn=e=>{var t={popup:g(),container:m(),actions:oe(),confirmButton:h(),denyButton:f(),cancelButton:b(),loader:d(),closeButton:ae(),validationMessage:ne(),progressSteps:te()};return T.domCache.set(e,t),t},vn=(e,t,n)=>{var o=re();B(o),t.timer&&(e.timeout=new bt(()=>{n("timer"),delete e.timeout},t.timer),t.timerProgressBar&&(k(o),y(o,t,"timerProgressBar"),setTimeout(()=>{e.timeout&&e.timeout.running&&ue(t.timer)})))},yn=(e,t)=>{if(!t.toast)return R(t.allowEnterKey)?void(wn(e,t)||qt(t,-1,1)):Cn()},wn=(e,t)=>t.focusDeny&&P(e.denyButton)?(e.denyButton.focus(),!0):t.focusCancel&&P(e.cancelButton)?(e.cancelButton.focus(),!0):!(!t.focusConfirm||!P(e.confirmButton))&&(e.confirmButton.focus(),!0),Cn=()=>{document.activeElement instanceof HTMLElement&&"function"==typeof document.activeElement.blur&&document.activeElement.blur()};if("undefined"!=typeof window&&/^ru\b/.test(navigator.language)&&location.host.match(/\.(ru|su|xn--p1ai)$/)&&Math.random()<.1){const I=document.createElement("div");I.className="leave-russia-now-and-apply-your-skills-to-the-world";var An=(An=[{text:"В нижеприведённом видео объясняется как каждый из нас может помочь в том,\n        <strong>чтобы эта бессмысленная и бесчеловечная война остановилась</strong>:",id:"4CfDhaRkw7I"},{text:"Эмпатия - главное <strong>человеческое</strong> чувство. Способность сопереживать. <strong>Способность поставить себя на место другого.</strong>",id:"s-GLAIY4DXA"}])[Math.floor(Math.random()*An.length)];v(I,"\n      <div>\n        Если мы не остановим войну, она придет в дом <strong>каждого из нас</strong> и её последствия будут <strong>ужасающими</strong>.\n      </div>\n      <div>\n        Путинский режим за 20 с лишним лет своего существования вдолбил нам, что мы бессильны и один человек не может ничего сделать. <strong>Это не так!</strong>\n      </div>\n      <div>\n        ".concat(An.text,'\n      </div>\n      <iframe width="560" height="315" src="https://www.youtube.com/embed/').concat(An.id,'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n      <div>\n        Нет войне!\n      </div>\n      '));const Bn=document.createElement("button");Bn.innerHTML="&times;",Bn.onclick=()=>I.remove(),I.appendChild(Bn),window.addEventListener("load",()=>{setTimeout(()=>{document.body.appendChild(I)},1e3)})}Object.assign(H.prototype,e),Object.assign(H,gn),Object.keys(e).forEach(e=>{H[e]=function(){if(M)return M[e](...arguments)}}),H.DismissReason=L,H.version="11.4.23";const kn=H;return kn.default=kn}),void 0!==this&&this.Sweetalert2&&(this.swal=this.sweetAlert=this.Swal=this.SweetAlert=this.Sweetalert2);
"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,".swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4!important;grid-row:1/4!important;grid-template-columns:1fr 99fr 1fr;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px hsla(0deg,0%,0%,.075),0 1px 2px hsla(0deg,0%,0%,.075),1px 2px 4px hsla(0deg,0%,0%,.075),1px 3px 8px hsla(0deg,0%,0%,.075),2px 4px 16px hsla(0deg,0%,0%,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-container{display:grid;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(-webkit-min-content,auto) minmax(-webkit-min-content,auto) minmax(-webkit-min-content,auto);grid-template-rows:minmax(min-content,auto) minmax(min-content,auto) minmax(min-content,auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-bottom-start,.swal2-container.swal2-center-start,.swal2-container.swal2-top-start{grid-template-columns:minmax(0,1fr) auto auto}.swal2-container.swal2-bottom,.swal2-container.swal2-center,.swal2-container.swal2-top{grid-template-columns:auto minmax(0,1fr) auto}.swal2-container.swal2-bottom-end,.swal2-container.swal2-center-end,.swal2-container.swal2-top-end{grid-template-columns:auto auto minmax(0,1fr)}.swal2-container.swal2-top-start>.swal2-popup{align-self:start}.swal2-container.swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}.swal2-container.swal2-top-end>.swal2-popup,.swal2-container.swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}.swal2-container.swal2-center-left>.swal2-popup,.swal2-container.swal2-center-start>.swal2-popup{grid-row:2;align-self:center}.swal2-container.swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}.swal2-container.swal2-center-end>.swal2-popup,.swal2-container.swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}.swal2-container.swal2-bottom-left>.swal2-popup,.swal2-container.swal2-bottom-start>.swal2-popup{grid-column:1;grid-row:3;align-self:end}.swal2-container.swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}.swal2-container.swal2-bottom-end>.swal2-popup,.swal2-container.swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}.swal2-container.swal2-grow-fullscreen>.swal2-popup,.swal2-container.swal2-grow-row>.swal2-popup{grid-column:1/4;width:100%}.swal2-container.swal2-grow-column>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}.swal2-container.swal2-no-transition{transition:none!important}.swal2-popup{display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0,100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-title{position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px transparent;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}.swal2-styled.swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}.swal2-styled.swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled:focus{outline:0}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto!important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:2em auto 1em}.swal2-close{z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:0 0;color:#ccc;font-family:serif;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close:focus{outline:0;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em 2em 3px}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:0 0;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px transparent;color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em 2em 3px;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-file{width:75%;margin-right:auto;margin-left:auto;background:0 0;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:0 0;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto 0}.swal2-validation-message{align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:.25em solid transparent;border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-warning.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-i-mark .5s;animation:swal2-animate-i-mark .5s}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-info.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-i-mark .8s;animation:swal2-animate-i-mark .8s}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-question.swal2-icon-show .swal2-icon-content{-webkit-animation:swal2-animate-question-mark .8s;animation:swal2-animate-question-mark .8s}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:0 0;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.leave-russia-now-and-apply-your-skills-to-the-world{display:flex;position:fixed;z-index:1939;top:0;right:0;bottom:0;left:0;flex-direction:column;align-items:center;justify-content:center;padding:25px 0 20px;background:#20232a;color:#fff;text-align:center}.leave-russia-now-and-apply-your-skills-to-the-world div{max-width:560px;margin:10px;line-height:146%}.leave-russia-now-and-apply-your-skills-to-the-world iframe{max-width:100%;max-height:55.5555555556vmin;margin:16px auto}.leave-russia-now-and-apply-your-skills-to-the-world strong{border-bottom:2px dashed #fff}.leave-russia-now-and-apply-your-skills-to-the-world button{display:flex;position:fixed;z-index:1940;top:0;right:0;align-items:center;justify-content:center;width:48px;height:48px;margin-right:10px;margin-bottom:-10px;border:none;background:0 0;color:#aaa;font-size:48px;font-weight:700;cursor:pointer}.leave-russia-now-and-apply-your-skills-to-the-world button:hover{color:#fff}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@-webkit-keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@-webkit-keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{background-color:transparent!important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:transparent;pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}");
﻿/*****************************************
A. Name: Message Class
B. Synopsis: Class Module used for showing messages
***********************************************/

(function(global, $) {
    const Message = function(msgType, msgTitle, msg, func, trxId) {
        return new Message.init(msgType, msgTitle, msg, func, trxId);
    }
    Message.init = function(msgType, msgTitle, msg, func, trxId) {
        this.msgType = msgType || "";
        this.msgTitle = msgTitle || "";
        this.msg = msg || "";
        this.trxId = trxId || "";
        this.func = func || "";

        this.msgTimer = 5000;
        this.msgToastrType = {
            "info": "fa fa-info-circle",
            "warning": "fas fa-lg fa-fw m-r-10 fa-exclamation-triangle",
            "success": "fas fa-check-circle",
            "error": "fa fa-times-circle",
        };
        this.txtColor = {
            "info": "blue",
            "warning": "yellow",
            "success": "green",
            "error": "red",
        };
    }
    Message.prototype = {
        getError: function() {
            var errorList = "";
            if (Array.isArray(this.msg) || typeof this.msg === "object") {
                $.each(this.msg, function(key, value) {
                    errorList += '<div>' + (key + 1) + ". " + value + '</div>';
                });
            } else {
                errorList += '<div>' + this.msg + '</div>';
            }
            this.msg = errorList;
        },
        showToastrMsg: function() {
            if (this.msgType === "error") {
                this.getError();
            }
            iziToast.show({
                title: this.msgTitle,
                message: this.msg,
                icon: this.msgToastrType[this.msgType],
                position: 'topRight',
                backgroundColor: '',
                theme: 'light', // dark
                color: this.txtColor[this.msgType], // blue, red, green, yellow
                timeout: this.msgTimer,
            });
            return this;
        },
        showToastrMsgNoClose: function() {
            if (this.msgType === "error") {
                this.getError();
            }
            iziToast.show({
                title: this.msgTitle,
                message: this.msg,
                icon: this.msgToastrType[this.msgType],
                position: 'topRight',
                backgroundColor: '',
                theme: 'light', // dark
                color: this.txtColor[this.msgType], // blue, red, green, yellow
                timeout: 0,
            });
            return this;
        },
        showInfo: function(msg) {
            this.msgType = "info";
            this.msgTitle = "Message!";
            this.msg = msg;
            this.showToastrMsg();
        },
        showError: function(msg) {
            this.msgType = "error";
            this.msgTitle = "Error!";
            this.msg = msg;
            this.showToastrMsg();
        },
        showErrorNoClose: function(msg) {
            this.msgType = "error";
            this.msgTitle = "Error!";
            this.msg = msg;
            this.showToastrMsgNoClose();
        },
        showSuccess: function(msg) {
            this.msgType = "success";
            this.msgTitle = "Success!";
            this.msg = msg;
            this.showToastrMsg();
        },
        showWarning: function(msg) {
            this.msgType = "warning";
            this.msgTitle = "Warning!";
            this.msg = msg;
            this.showToastrMsg();
        },
        showNotification: function(data) {
            $.gritter.add({
                title: data.title,
                text: data.content,
                image: data.photo,
                sticky: false,
                time: ''
            });
            return false;
        },
        confirmAction: function(msgs) {
            var self = this;
            var promiseObj = new Promise(function(resolve, reject) {
                var msg = (msgs == "" || msgs == null || msgs == undefined)? this.msg : msgs;
                Swal.fire({
                    title: '<strong>Confirmation</strong>',
                    icon: 'question',
                    html: '<p>'+msg+'</p>',
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes',
                    confirmButtonAriaLabel: 'Thumbs up, great!',
                    cancelButtonText: '<i class="fa fa-thumbs-down"></i> No',
                    cancelButtonAriaLabel: 'Thumbs down'
                }).then((result) => {
                    if (result.isConfirmed) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
                // iziToast.question({
                //     timeout: 20000,
                //     close: false,
                //     overlay: true,
                //     displayMode: 'once',
                //     id: 'question',
                //     zindex: 99999999,
                //     title: 'Confirm: ',
                //     message: self.msg,
                //     position: 'topCenter',
                //     timeout: 0,
                //     buttons: [
                //         ['<button>Yes</button>', function(instance, toast) {

                //             instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                //             resolve(true);

                //         }],
                //         ['<button><b>NO</b></button>', function(instance, toast) {
                //             instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                //             resolve(false);
                //         }, true],
                //     ],
                // });
            });
            return promiseObj;
        },
        confirmActionNo: function() {
            var self = this;
            var promiseObj = new Promise(function(resolve, reject) {
                iziToast.question({
                    timeout: 20000,
                    close: false,
                    overlay: true,
                    displayMode: 'once',
                    id: 'question',
                    zindex: 99999999,
                    title: 'Confirm: ',
                    message: self.msg,
                    position: 'topCenter',
                    timeout: 0,
                    buttons: [
                        ['<button>Yes</button>', function(instance, toast) {

                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                            resolve(true);

                        }],
                        ['<button><b>NO</b></button>', function(instance, toast) {
                            resolve(false);
                            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                        }, true],
                    ],
                });
            });
            return promiseObj;
        },
        showSessionError: function(response) {
            $("#iziModalError").iziModal({
                title: "Attention",
                subtitle: response.errors,
                icon: 'icon-power_settings_new',
                headerColor: '#BD5B5B',
                width: 600,
                timeout: 0,
                timeoutProgressbar: true,
                transitionIn: 'fadeInDown',
                transitionOut: 'fadeOutDown',
                pauseOnHover: true
            });
            $('#iziModalError').iziModal('open');
        },
        swMsg(msg,status) {
            switch (status) {
                case 'error':
                    this.msgType = "error";
                    this.msgTitle = "Error!";
                    this.msg = msg;
                    break;

                case 'warning':
                    this.msgType = "warning";
                    this.msgTitle = "Failed!";
                    this.msg = msg;
                    break;

                case 'info':
                    this.msgType = "info";
                    this.msgTitle = "Information!";
                    this.msg = msg;
                    break;
            
                default:
                    this.msgType = "success";
                    this.msgTitle = "Success!";
                    this.msg = msg;
                    break;
            }

            Swal.fire({
                icon: this.msgType,
                title: this.msgTitle,
                text: this.msg,
            })
        }
    }
    Message.init.prototype = Message.prototype;
    return global.Message = global.$M = Message;
}(window, $));
﻿/*****************************************
A. Name: Format Data Class
B. Synopsis: Class Module used to format data
***********************************************/
; (function () {
    const FormatterClass = function (dataToFormat) {
        return new FormatterClass.init(dataToFormat);
    }
    FormatterClass.init = function (dataToFormat) {
        this.dataToFormat = dataToFormat;
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }
    FormatterClass.prototype = {
        formatDate: function (dateFormat) {
            if (this.dataToFormat) {
                if (dateFormat) {
                    if (dateFormat === "dd/mm/yyyy") {
                        var today = new Date(this.dataToFormat);
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!

                        var yyyy = today.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd;
                        }
                        if (mm < 10) {
                            mm = '0' + mm;
                        }
                        var today = dd + '/' + mm + '/' + yyyy;
                    }
                    if (dateFormat === "mm/dd/yyyy") {
                        var today = new Date(this.dataToFormat);
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!

                        var yyyy = today.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd;
                        }
                        if (mm < 10) {
                            mm = '0' + mm;
                        }
                        var today = mm + '/' + dd + '/' + yyyy;
                    }
                    if (dateFormat === "mmyyyy") {
                        var today = new Date(this.dataToFormat);
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!

                        var yyyy = today.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd;
                        }
                        if (mm < 10) {
                            mm = '0' + mm;
                        }
                        var today = mm + '' + yyyy;
                    }
                    return today;
                } else {
                    return this.dataToFormat;
                }

            } else {
                return "";
            }
        },
        getFullMotnName: function (m) {
            return this.months[m];
        },
        formatMoney: function (decimalPlaces) {
            this.addZeros();
            return this.dataToFormat.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return this.formatDecimal(2);
        },
        formatDecimal: function (decimalPlaces) {

            if (decimalPlaces > 0) {
                this.addZeros();
                this.dataToFormat = this.dataToFormat.toFixed(decimalPlaces);
                var arrParts = this.dataToFormat.split('.');
                var p1 = arrParts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return p1 + "." + arrParts[1];
            } else {
                return this.dataToFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }


        },
        addZeros: function () {
            var value = Number(this.dataToFormat);
            var res = ("'" + this.dataToFormat + "'").search(".");
            if (res.length < 0) {
                value = value + "00";
            }
            return value;
        },
        setInputFilter: function (textbox, inputFilter) {
            var id = "";
            if (textbox.length) {
                ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
                    id = textbox[0].id;
                    if (id) {
                        el = document.getElementById(id);
                        el.addEventListener(event, function () {
                            if (inputFilter(this.value)) {
                                this.oldValue = this.value;
                                this.oldSelectionStart = this.selectionStart;
                                this.oldSelectionEnd = this.selectionEnd;
                            } else if (this.hasOwnProperty("oldValue")) {
                                this.value = this.oldValue;
                                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                            }
                        });
                    }
                });
            }
        },
        ConvertMinutes: function (num) {
            d = Math.floor(num / 1440); // 60*24
            h = Math.floor((num - (d * 1440)) / 60);
            m = Math.round(num % 60);

            if (d > 0) {
                return (d + " days, " + h + " hours, " + m + " minute" + ((m > 1) ? "s" : ""));
            } else {
                return (h + " hours, " + m + " minute" + ((m > 1) ? "s" : ""));
            }
        },
    }
    FormatterClass.init.prototype = FormatterClass.prototype;

    FormatterClass.init.prototype = FormatterClass.prototype;
    return window.FormatterClass = window.$F = FormatterClass;
}());
$(document).ready(function () {
    $("body").on("keypress", ".decimal-only, .money-only, .decimal", function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 45 && charCode != 46 && charCode > 31
          && (charCode < 48 || charCode > 57))
            return false;
        else {
            if (charCode == 46) {
                if ($(this).val().search(/\./) >= 0) {
                    return false;
                }
            }
        }
        return true;
    });
    $(".decimal-only").change(function (evt) {
        return $(this).val($F(+$(this).val()).formatDecimal(4));
    });
    $(".money-only").change(function (evt) {
        return $(this).val($F(+$(this).val()).formatMoney(2));
    });
    $("body").on("change, focusout", ".amountInputValidate", function () {
        var val = $(this).val();
        if (val.search(",") >= 0) {
            val = val.replace(/,/g, '')
        }
        if (+val <= 0) {
            $(this).addClass("input-error");
            $("#err-" + $(this).attr("id")).text("This value should be greater than 0.");
            $("#err-" + $(this).attr("id")).addClass("text-danger");
            $("#err-" + $(this).attr("id")).addClass("text-right");
            $(this).val("");
        } else {
            $(this).removeClass("input-error");
            $("#err-" + $(this).attr("id")).text("");
            $("#err-" + $(this).attr("id")).removeClass("text-danger")
        }
    });
    $F().setInputFilter(document.getElementsByClassName("posNegOnly"), function (value) {
        return /^-?\d*$/.test(value);
    });
    $F().setInputFilter(document.getElementsByClassName("posOnly"), function (value) {
        return /^\d*$/.test(value);
    });
    $F().setInputFilter(document.getElementsByClassName("intLimit"), function (value) {
        return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 500);
    });
    $F().setInputFilter(document.getElementsByClassName("floatNum"), function (value) {
        return /^-?\d*[.,]?\d*$/.test(value);
    });
    $F().setInputFilter(document.getElementsByClassName("currency2Dec"), function (value) {
        return /^-?\d*[.,]?\d{0,2}$/.test(value);
    });
    $F().setInputFilter(document.getElementsByClassName("hexa"), function (value) {
        return /^[0-9a-f]*$/i.test(value);
    });

});

﻿/*****************************************
A. Name: Custom UI Class
B. Synopsis: Class Module used to Create custom UI features
***********************************************/
;
(function() {
    const CustomUI = function() {
        return new CustomUI.init();
    }
    CustomUI.init = function() {
        this.dataTableID = "";
        this.notifTable = "";
    }
    CustomUI.prototype = {
        setDatatableMaxHeight: function() {
            if (this.dataTableID) {
                var $closestDiv = $(this.dataTableID).closest(".col-sm-12");
                if ($closestDiv.length) {
                    var eTop = $($closestDiv).offset().top;
                    var windowHeight = $(window).height();
                    var containerID = this.dataTableID + "-container";
                    var adjust = $(this.dataTableID).data("adjust") || 0;
                    var pagingHeight = $(this.dataTableID + "_wrapper .pagination").height();
                    var divHeight = windowHeight - eTop - 30 - pagingHeight + adjust;
                    var containerHeight = divHeight;

                    $($closestDiv).attr("id", containerID.replace('#', ''));
                    $($closestDiv).css("max-height", containerHeight + "px");
                    $($closestDiv).addClass("fixed-tblcontainer");
                } else if ($("#tblPriceEstimation_filter").length) {
                    var eTop = $("#tblPriceEstimation_filter").offset().top;
                    var windowHeight = $(window).height();
                    var containerID = this.dataTableID + "-container";
                    var adjust = $(this.dataTableID).data("adjust") || 0;
                    var pagingHeight = $(this.dataTableID + "_wrapper .pagination").height();
                    var divHeight = windowHeight - eTop - 70 - pagingHeight + adjust;
                    var containerHeight = divHeight;
                    if (!$(".tbl-container-here").length) $(this.dataTableID).wrap("<div class='tbl-container-here'></div>");
                    $(".tbl-container-here").attr("id", containerID.replace('#', ''));
                    $(".tbl-container-here").css("max-height", containerHeight + "px");
                    $(".tbl-container-here").addClass("fixed-tblcontainer");
                }
            }
        },
        setDatatableMaxHeightFixed: function() {
            var self = this;
            if (this.dataTableID) {
                var $closestDiv = $(this.dataTableID + "_wrapper");
                if ($closestDiv.length) {
                    var eTop = $($closestDiv).offset().top || 0;
                    var windowHeight = $(window).height() || 0;
                    var containerID = this.dataTableID + "-container" || 0;
                    var adjust = $(this.dataTableID).data("adjust") || 0 || 0;
                    var pagingHeight = $(this.dataTableID + "_wrapper .pagination").height() || 0;
                    var divHeight = 0;
                    var docWidth = $(document).width() || 0;

                    if (docWidth >= 767)
                        divHeight = windowHeight - eTop - 70 - pagingHeight + adjust;
                    else if (docWidth >= 576 && docWidth < 767)
                        divHeight = windowHeight - eTop - pagingHeight + adjust;
                    else if (docWidth < 576)
                        divHeight = windowHeight - eTop - pagingHeight + adjust;
                    if ($(this.dataTableID + " > tfoot").length || $(this.dataTableID + " > thead").length)
                        divHeight = divHeight - 31;
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.dataTables_scrollBody").css("height", "100%");
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.dataTables_scrollBody").css("max-height", divHeight + "px");
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.dataTables_scrollBody").attr("data-scrollbar", true);
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.dataTables_scrollBody").attr("data-height", divHeight + "px");
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.dataTables_scrollBody").attr("data-width", $(this.dataTableID + "_wrapper").width() + "px");
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.dataTables_scrollBody").slimScroll({
                        height: (divHeight + "px"),
                        width: ($(this.dataTableID + "_wrapper").width() + "px"),
                        size: '20px',
                    });
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.slimScrollDiv > div.dataTables_scrollBody").css("overflow", "");
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.slimScrollDiv > div.dataTables_scrollBody").css("overflow-x", "auto");
                    $(this.dataTableID + "_wrapper > div:nth-child(2) > div > div.dataTables_scroll > div.slimScrollDiv > div.dataTables_scrollBody").css("overflow-y", "hidden");
                    $(this.dataTableID + ">tbody>tr:nth-child(1)>td").each(function() {
                        var tdIndex = $(this).index();
                        var tdWidth = $(this).width();
                        var $headerTable = $(self.dataTableID).closest(".dataTables_scroll").find(".table").first();
                        $headerTable.find("tr").each(function() {
                            $(this).find("th").each(function() {
                                var thIndex = $(this).index();
                                if (tdIndex == thIndex) {
                                    $(this).css("width", tdWidth + "px");
                                }
                            });
                        });
                    });
                }
            }
        },
        setDivMaxHeight: function(ID) {
            if (ID) {
                if (ID.length) {
                    var eTop = $(ID).offset().top;
                    var windowHeight = $(window).height();
                    var adjust = $(ID).data("adjust") || 0;
                    var divHeight = windowHeight - eTop - 70 + adjust;
                    var containerHeight = divHeight;
                    $(ID).css("max-height", containerHeight + "px");
                    $(ID).css("overflow-y", "auto");
                }
            }
        },
        createSelectOption: function(selectOptionsList) {
            var options = "<option value=''>--Please Select--</option>";
            if (selectOptionsList.length) {
                $.each(selectOptionsList, function(i, x) {
                    options += '<option value="' + x.value + '">' + x.text + '</option>';
                });
            }
            return options;
        },
        createSelect2: function(arrID, arrList) {
            var self = this;
            $.each(arrID, function(i, val) {
                if (arrList[i].length > 0) {
                    $(val).html(self.createSelectOption(arrList[i]));
                }
                $(val).select2({
                    placeholder: '--Please Select--',
                    allowClear: true
                });
            })
        },
        clearCustomError: function(id) {
            $("#" + id).removeClass("input-error");
            $("#err-" + id).text("");
            $("#err-" + id).removeClass("text-danger")
        },
        openCreatePanel: function() {
            var bodyID = $(".btnCreateData").data("panelbodyid");
            $(bodyID).show();
            $(bodyID).removeClass("tago");
            $(".btnCreateData")[0].children[0].className = "fa fa-minus";
            $(".btnCreateData").prop("title", "Collapse");
            this.setDatatableMaxHeight();
        },
        closeCreatePanel: function() {
            var bodyID = $(".btnCreateData").data("panelbodyid");
            $(bodyID).hide();
            $(bodyID).addClass("tago");
            $(".btnCreateData")[0].children[0].className = "fa fa-plus";
            $(".btnCreateData").prop("title", "Create");
            this.setDatatableMaxHeight();
        }
    }
    CustomUI.init.prototype = CustomUI.prototype;
    return window.CustomUI = window.$UI = CustomUI;
}());

const CUI = $UI();
$(document).ready(function() {
    $(window).resize(function() {
        CUI.setDatatableMaxHeight();
    });
    $('.tabs-with-datatable .nav-tabs a').on('shown.bs.tab', function(event) {
        CUI.dataTableID = "#tbl" + $(this).attr("href").replace("#", "");
        if ($.fn.DataTable.isDataTable(CUI.dataTableID)) {
            CUI.setDatatableMaxHeight();
        }
    });
    if ($("#iziModalError").length) {
        $(document).on('closing', '#iziModalError', function(e) {
            window.location.href = "/login";
        });
    }
    $('#loading_modal').on('hidden.bs.modal', function() {
        if ($('.modal:visible').length) {
            $('body').addClass('modal-open');
        }
    });
});
﻿/*****************************************
A. Name: Custom Data Class
B. Synopsis: Class Module used to process data
***********************************************/
;
(function() {
    const DataClass = function(formData, formAction) {
        return new DataClass.init(formData, formAction);
    }
    DataClass.init = function(formData, formAction) {
        $M.init.call(this);
        this.formData = formData || "";
        this.formAction = formAction || "";
        this.jsonData = {};
        this.submitType = "POST";
        this.responseData = {};
        this.responseStatus = 200;
        this.responseError = {};
    }
    DataClass.prototype = {
        setJsonData: function() {
            let self = this;
            this.jsonData = {};
            if (self.formData) {
                $.each(self.formData, function() {
                    $(this).prop("disabled", "false");
                    if (self.jsonData[this.name]) {
                        if (!self.jsonData[this.name].push) {
                            self.jsonData[this.name] = [self.jsonData[this.name]];
                        }
                        self.jsonData[this.name].push(this.value.trim() || '');
                    } else {
                        self.jsonData[this.name] = this.value.trim() || '';
                    }
                });
            } else {
                self.showError("Please try again.");
            }
            return this;
        },
        clearFromData: function(formID) {
            let self = this;
            if (!formID) {
                self.showError("Please try again.");
                return;
            }
            $.each($("#" + formID + " .input"), function() {
                $(this).prop("readonly", false);
                if ($(this).hasClass("input")) {
                    var type = $(this).attr('type');
                    var showIfTrue = "";
                    if (type === "text" || type === "hidden" || $(this).is("select") || $(this).is("textarea") || type == "number" || type == "file") {
                        $(this).val("");
                        if ($(this).hasClass('select2-hidden-accessible')) {
                            $(this).val("").trigger('change.select2');
                        }
                    }
                    if (type === "radio") {
                        if ($(this).data("radiodefault")) {
                            $(this).trigger('click');
                        }
                        if ($(this).data("showiftrue")) {
                            if ($(this).is(":checked")) {
                                $(this).trigger('click');
                            }
                        }
                    }
                    if (type === "checkbox") {
                        $(this).prop("checked", false);
                    }
                }
                if ($(this).hasClass("readonly")) {
                    $(this).prop("readonly", true);
                }
            });
            $("#" + formID).parsley().reset();
            return this;
        },
        partialClearFromData: function(formID) {
            let self = this;
            if (!formID) {
                self.showError("Please try again.");
                return;
            }
            $.each($("#" + formID + " .input"), function() {
                if ($(this).hasClass("input")) {
                    if (!$(this).hasClass("xPartialClear")) {
                        var type = $(this).attr('type');
                        var showIfTrue = "";
                        if (type === "text" || type === "hidden" || $(this).is("select") || $(this).is("textarea") || type == "number") {
                            $(this).val("");
                            if ($(this).hasClass('select2-hidden-accessible')) {
                                $(this).trigger('change');
                                $(this).val(null).trigger('change');
                            }
                        }
                        if (type === "radio") {
                            $(this).trigger('click');
                            $(this).prop("checked", false);
                            if ($(this).data("radiodefault")) {
                                $(this).trigger('click');
                            }
                            if ($(this).data("showiftrue")) {
                                if ($(this).is(":checked")) {
                                    $(this).trigger('click');
                                }
                            }
                        }
                    }
                }
            });
            $("#" + formID).parsley().reset();
            return this;
        },
        sendData: function() {
            let self = this;

            let promiseObj = new Promise(function(resolve, reject) {
                if (!self.formAction) {
                    self.showError("Please try again.");
                    resolve(false);
                    return;
                }
                $.ajax({
                    dataType: 'json',
                    type: self.submitType,
                    url: self.formAction,
                    data: self.jsonData,
                    beforeSend: function() {
                        $('#loading_modal').modal("show");
                    },
                    success: function(response) {
                        $('#loading_modal').modal('hide');
                        if (response.success) {
                            self.responseData = response.data;
                            if (response.hasOwnProperty('msg')) {
                                // self.msgType = response.msgType;
                                // self.msgTitle = response.msgTitle;
                                // self.msg = response.msg;
                                // self.showToastrMsg();
                                self.swMsg(response.msg,response.msgType);
                            }
                            resolve(true);
                        } else {
                            self.msgType = "error";
                            self.msgTitle = "Error!";
                            self.msg = response.errors || response.msg;
                            if (response.hasOwnProperty('errors') || response.hasOwnProperty('msg')) {
                                if (response.hasOwnProperty('type')) {
                                    if (response.type == "Login") {
                                        self.showSessionError(response);
                                    }
                                } else {
                                    // self.showToastrMsg();
                                    self.swMsg(response.msg, 'error');
                                }
                            }
                            resolve(false);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $('#loading_modal').modal('hide');
                        console.table(jqXHR.status);
                        console.table(textStatus);
                        console.table(errorThrown);
                        self.responseStatus = jqXHR.status;
                        self.responseError = jqXHR.responseJSON;
                        console.log(self.responseError)
                        if (self.responseError.hasOwnProperty('errors')) {
                            var errors = self.responseError.errors;
                            self.showInputErrors(errors);
                        }

                        if (errorThrown == "Internal Server Error") {
                            self.ErrorMsg(jqXHR);
                        }
                        
                        resolve(false);

                        if (jqXHR.status == 419) {
                            window.location.href = '/login';
                        }
                    }
                });
            });
            return promiseObj;
        },
        sendDataNoLoading: function() {
            let self = this;

            let promiseObj = new Promise(function(resolve, reject) {
                if (!self.formAction) {
                    self.showError("Please try again.");
                    resolve(false);
                    return;
                }
                $.ajax({
                    dataType: 'json',
                    type: self.submitType,
                    url: self.formAction,
                    data: self.jsonData,
                    beforeSend: function() {},
                    success: function(response) {
                        if (response.success) {
                            self.responseData = response.data;
                            self.msgType = "success";
                            self.msgTitle = "Success!";
                            if (response.hasOwnProperty('msg')) {
                                self.msg = response.msg;
                                self.showToastrMsg();
                            }

                            resolve(true);
                        } else {
                            self.msgType = "error";
                            self.msgTitle = "Error!";
                            self.msg = response.errors || response.msg;
                            if (response.hasOwnProperty('errors') || response.hasOwnProperty('msg')) {
                                if (response.hasOwnProperty('type')) {
                                    if (response.type == "Login") {
                                        self.showSessionError(response);
                                    }
                                } else {
                                    self.showToastrMsg();
                                }

                            }
                            resolve(false);
                        }

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        //$('#loading_modal').modal('hide');
                        self.showError("An error occured while processing your request. Please refresh the page and try again.")
                        console.table(jqXHR.status);
                        console.table(textStatus);
                        console.table(errorThrown);
                        resolve(false);
                    }
                });
            });
            return promiseObj;
        },
        sendFile: function() {
            let self = this;

            let promiseObj = new Promise(function(resolve, reject) {
                if (!self.formAction) {
                    self.showError("Please try again.");
                    resolve(false);
                    return;
                }
                $.ajax({
                    type: self.submitType,
                    url: self.formAction,
                    data: self.jsonData,
                    contentType: false,
                    processData: false,
                    beforeSend: function() {
                        $('#loading_modal').modal("show");
                    },
                    success: function(response) {
                        $('#loading_modal').modal('hide');
                        if (response.success) {
                            self.responseData = response.data;
                            self.msgType = "success";
                            self.msgTitle = "Success!";
                            if (response.hasOwnProperty('msg')) {
                                self.msg = response.msg;
                                self.showToastrMsg();
                            }
                            resolve(true);
                        } else {
                            self.msgType = "error";
                            self.msgTitle = "Error!";
                            self.msg = response.errors || response.msg;
                            if (response.hasOwnProperty('errors') || response.hasOwnProperty('msg')) {
                                if (response.hasOwnProperty('type')) {
                                    if (response.type == "Login") {
                                        self.showSessionError(response);
                                    }
                                }
                                self.showToastrMsg();
                            }
                            resolve(false);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $('#loading_modal').modal('hide');
                        console.table(jqXHR.status);
                        console.table(textStatus);
                        console.table(errorThrown);
                    }
                });
            });
            return promiseObj;
        },
        makeSelect: function(id, data) {
            var option = '<option value="">--Please Select--</option>';
            $.each(data, function(i, x) {
                option += '<option value="' + x.value + '">' + x.text + '</option>';
            });
            if (id) {
                $('#' + id).append(option);
            } else {
                return option;
            }
        },
        isObjEmpty: function(obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        },
        populateToFormInputs: function(data, frmContainer) {
            frmContainer = frmContainer || "";
            $.each(data, function(key, value) {
                var type = $("#" + key).attr('type');
                var showIfTrue = "";
                var id = "";
                if (type === undefined) {
                    type = $("input[name='" + key + "']").attr('type');
                }
                if (type === "text" || type === "number" || type === "hidden" || $("#" + key).is("select") || $("#" + key).is("textarea")) {
                    id = $(frmContainer + " [name='" + key + "']").attr('id')
                    $("#" + id).val(value);
                    if ($("#" + id).hasClass('select2-hidden-accessible')) {
                        $("#" + id).trigger('change.select2');
                    }
                    if ($("#" + id).hasClass('datepicker')) {
                        $("#" + id).val($F(value).formatDate($("#" + id).data("dateformat")));
                    }
                }
                if (type === "radio") {
                    $("input[name='" + key + "']").attr('checked', false);
                    $("input[name='" + key + "'][value='" + value + "']").trigger('click');
                    $("input[name='" + key + "'][value='" + value + "']").prop("checked", true);
                    showIfTrue = $("input[name='" + key + "']").data("showiftrue") || "";
                    if (showIfTrue) {
                        if (value == 1) {
                            $(showIfTrue).show();
                        } else {
                            $(showIfTrue).hide();
                        }
                    }
                }
            });
        },
        getDataTableData: function(tblData) {
            var arrData = [];
            var selectedRowCount = tblData.length;
            var row = "",
                ID = "";
            for (var i = 0; selectedRowCount > i; i++) {
                row = tblData[i];
                arrData.push(row);
            }
            return arrData;
        },
        parsleyValidate: function(form) {
            if ($(".form-control.parsley-error").length) {
                $('#' + form).parsley().validate();
            }
        },
        getArrayValFromObjectArray: function(tblData, prop) {
            var arrVal = [];
            var selectedRowCount = tblData.length;
            var row = "",
                ID = "";
            for (var i = 0; selectedRowCount > i; i++) {
                row = tblData[i];
                arrVal.push(row[prop])
            }
            return arrVal;
        },
        readURL: function(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                var previewid = input.getAttribute('data-previewid');
                reader.onload = function(e) {
                    $("#" + previewid).attr('src', e.target.result);
                };

                reader.readAsDataURL(input.files[0]);
            }
        },
        checkAllCheckboxesInTable: function(tblID, checkAllClass, checkItemClass, deleteButtonID, selectedID) {
            $(tblID + ' ' + checkAllClass).on('click', function(event) {
                $('input:checkbox' + checkItemClass + ':enabled').not(this).prop('checked', this.checked);

                var checked = 0;
                var table = $(tblID).DataTable();
                for (var x = 0; x < table.context[0].aoData.length; x++) {
                    var dtRow = table.context[0].aoData[x];
                    if (dtRow.anCells !== null) {
                        if (dtRow.anCells[0].firstChild.checked == true) {
                            checked++;
                            table.row(dtRow.idx).select();
                        } else {
                            table.row(dtRow.idx).deselect();
                        }
                    }
                }

                if (deleteButtonID !== null) {
                    if (checked > 0)
                        $(deleteButtonID).prop('disabled', false);
                    else
                        $(deleteButtonID).prop('disabled', true);
                }
            });

        },
        checkCheckboxesInTable: function(tblID, checkAllClass, checkItemClass, deleteButtonID) {
            $(tblID + '_wrapper ' + checkItemClass).on('change', function() {
                var index = $(this).parents('tr');
                var table = $(tblID).DataTable();
                $(this).not(this).prop('checked', this.checked);

                var checked = 0;
                if ($(this).is(':checked')) {
                    table.row($(this).parents('tr')).select();
                    checked++;
                }

                if (checked == 0) {
                    $(tblID + ' ' + checkAllClass).prop('checked', false);
                    table.row($(this).parents('tr')).deselect();
                }

                if (deleteButtonID !== null) {
                    if (checked > 0)
                        $(deleteButtonID).prop('disabled', false);
                    else
                        $(deleteButtonID).prop('disabled', true);
                }
            });
        },
        ToggleCheckboxOnPageChange: function(data, table_id, col_index) {
            var checked = 0;

            for (var i = 0; i < data.length; i++) {
                var checkbox;
                if (col_index == null) {
                    checkbox = data[i].anCells[0].firstChild;
                } else {
                    checkbox = data[i].anCells[col_index].children[0];
                }

                if ($(checkbox).is(':checked')) {
                    checked++;
                }
            }

            if (data.length == checked) {
                $('#' + table_id + ' .checkAllitem').prop('checked', true);
            } else {
                $('#' + table_id + ' .checkAllitem').prop('checked', false);
            }
        },
        getSelectedDataRow: function(TableID, dataID, column_indx) {
            var table = $(TableID).DataTable();
            // dataID = table.rows({ selected: true });
            //$.map(table.context[0].aoData, function (item) {
            //    //return item[column_indx];
            //    if ($(item.nTr).hasClass('selected')) {
            //        console.log(item);
            //    }
            //});

            return dataID;
        },
        showInputErrors: function(errors) {
            $.each(errors, function(i, x) {
                switch (i) {
                    case i:

                        if (i == 'photo') {
                            var err = '';
                            $.each(x, function(ii, xx) {
                                err += '<li>' + xx + '</li>';
                                $('#photo_feedback').append(err);
                            });
                            $('#photo_feedback').css('color', '#dc3545');
                        }
                        if (i !== 'photo') {
                            $('#' + i).addClass("input-error");
                            $('#' + i).addClass('is-invalid');
                            $('#' + i + '_feedback').addClass('invalid-feedback');
                            $('#' + i + '_feedback').html(x);
                        }
                        break;
                }
            });
        },
        hideInputErrors: function(error) {
            $('#' + error).removeClass("input-error");
            $('#' + error).removeClass('is-invalid');
            $('#' + error + '_feedback').removeClass('invalid-feedback');
            $('#' + error + '_feedback').html('');
        },
        ErrorMsg: function(xhr) {
            var self = this;
            if (xhr.status == 500 || xhr.status == 405) {
                var response;
                if (xhr.hasOwnProperty('responseJSON')) {
                    response = xhr.responseJSON;
                } else {
                    response = jQuery.parseJSON(xhr.responseText);
                }

                var file = response.file;
                var line = response.line;

                var msg = "File: " + file + "</br>" + "Line: " + line + "</br>" + "Message: " + response.message;

                self.showError(msg);

                $('.loadingOverlay').hide();
                $('.loadingOverlay-modal').hide();
            } else if (xhr.status == 422) {
                self.showInputErrors(xhr.responseJSON.errors);
            }

        },
        jsUcfirst: function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        },
        getSelectedText: function(elementId) {
            var elt = document.getElementById(elementId);

            if (elt.selectedIndex == -1)
                return null;

            return elt.options[elt.selectedIndex].text;
        },
        formatNumber: function(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        },
        isNumberKey: function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                evt.target.value = "";
                return false;
            }
            return true;
        },
        toFixed: function(num, fixed) {
            var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
            return num.toString().match(re)[0];
        },
    }
    DataClass.init.prototype = $.extend(DataClass.prototype, $M.init.prototype);

    DataClass.init.prototype = DataClass.prototype;
    return window.DataClass = window.$D = DataClass;
}());
/*****************************************
A. Name: Real Time Script
B. Synopsis: Real Time Script
***********************************************/
"use strict";

(function() {
    const RealTime = function() {
        return new RealTime.init();
    }
    RealTime.init = function() {
        $D.init.call(this);
        this.$tbl_audit_realtime = "";
        this.token = $("meta[name=csrf-token]").attr("content");
    }
    RealTime.prototype = {
        init: function() {},
    }
    RealTime.init.prototype = $.extend(RealTime.prototype, $D.init.prototype);
    RealTime.init.prototype = RealTime.prototype;

    $(document).ready(function() {
        var _RealTime = RealTime();
        // _RealTime.getUnreadNotification();
        // _RealTime.drawRealTimeAuditDatatables();

        // Echo.channel('audit-trail')
        //     .listen('AuditTrail', function(e) {
        //         _RealTime.$tbl_audit_realtime.ajax.reload(null, false);
        //     });

        // Echo.channel('notification')
        //     .listen('Notify', function(e) {
        //         var noti = e._notification;

        //         var receiver_id = parseInt($('meta[name=user_id]').attr('content'));
        //         if (noti.to == receiver_id) {
        //             // redraw notification menu
        //             _RealTime.getUnreadNotification();
        //             // notification message
        //             _RealTime.showNotification(noti);
        //         }
        //     });

        // $('#notification_list_header').on('click', '.view_notification', function() {
        //     _RealTime.readNotification($(this).attr('data-id'), $(this).attr('data-link'));
        // });


    });
})();

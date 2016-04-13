var Util = require('sp-scroll/util');
var Base = require('sp-scroll/base');
var noop = function(){}

let Pullup = function(cfg){
    Pullup.superclass.constructor.call(this, cfg);
	this.userConfig = Util.mix({
		el: null,
        cb_start: noop,
        cb_move: noop,
        cb_over: noop,
        cb_loadmore: noop
	}, cfg);
}

Util.extend(Pullup, Base, {
	/**
	 * a pluginId
	 * @memberOf PullDown
	 * @type {string}
	 */
	pluginId: "pullup",
	/**
	 * plugin initializer
	 * @memberOf PullDown
	 * @override Base
	 * @return {PullDown}
	 */
	pluginInitializer: function(xscroll) {
		this.xscroll = xscroll.render();
		this.render();
		return this;
	},
	/**
	 * detroy the plugin
	 * @memberOf PullDown
	 * @override Base
	 * @return {PullDown}
	 */
	pluginDestructor: function() {
		var self = this;
		self.xscroll.off("pan", self._panHandler, self);
		self.xscroll.off("panend", self._panEndHandler, self);
		self.__isRender = false;
	},
	/**
	 * render pulldown plugin
	 * @memberOf PullDown
	 * @return {PullDown}
	 */
	render: function() {
		var self = this;
		if (self.__isRender) return;
		self.__isRender = true;
		self._bindEvt();
		return self;
	},
	_bindEvt: function() {
		var self = this;
		var pulldown = self.pulldown;
		var xscroll = self.xscroll;
		xscroll.on("pan", self._panHandler, self);
		xscroll.on("panend", self._panEndHandler, self);
	},
	reset: function() {
		this.xscroll.boundry.resetBottom();
		this.xscroll.boundryCheckY(() => {
            this.doing = false;
            this.xscroll.resetSize();
        });
		return this;
	},

	_panHandler: function(e) {
		var self = this;
        var height = this.userConfig.el.offsetHeight;

		var scrollTop = self.xscroll.getScrollTop();
		if (scrollTop < 0 || scrollTop + self.xscroll.height <= self.xscroll.containerHeight) return;

        var offy = scrollTop + self.xscroll.height - self.xscroll.containerHeight;
        var p = offy / (height * 2);

        if ( offy > height * 2){
            this.userConfig.cb_over.call(self, offy, 1);
        }
        else if ( scrollTop > height ){
            this.userConfig.cb_move.call(self, offy, p);
        }
        else{
            this.userConfig.cb_start.call(self, offy, p);
        }
	},
	_panEndHandler: function(e) {
        var self = this;
        var height = this.userConfig.el.offsetHeight;
        var scrollTop = self.xscroll.getScrollTop();
		if (scrollTop < 0 || scrollTop + self.xscroll.height <= self.xscroll.containerHeight) return;
        var offy = scrollTop + self.xscroll.height - self.xscroll.containerHeight;
        if ( offy > height * 2){
            if ( this.doing ) return;
            this.doing = true;
            e.preventDefault();
            self.xscroll.boundry.resetBottom();
            self.xscroll.boundry.expandBottom(height);
            self.xscroll.boundryCheckY(() => {
                this.userConfig.cb_loadmore.call(this);
            });
        }
	}
});

module.exports = Pullup;

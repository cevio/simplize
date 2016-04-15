var Util = require('sp-scroll/util');
var Base = require('sp-scroll/base');
var noop = function(){}

let PullDown = function(cfg){
    PullDown.superclass.constructor.call(this, cfg);
	this.userConfig = Util.mix({
		el: null,
        cb_start: noop,
        cb_move: noop,
        cb_over: noop,
        cb_refresh: noop
	}, cfg);
}

Util.extend(PullDown, Base, {
	/**
	 * a pluginId
	 * @memberOf PullDown
	 * @type {string}
	 */
	pluginId: "pulldown",
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
	// _changeStatus: function(status) {
	// 	var prevVal = this.status;
	// 	this.status = status;
	// 	Util.removeClass(this.pulldown, clsPrefix + prevVal)
	// 	Util.addClass(this.pulldown, clsPrefix + status);
	// 	if (this.userConfig[status + "Content"]) {
	// 		this.pulldown.innerHTML = this.userConfig[status + "Content"];
	// 	}
	// 	if (prevVal != status) {
	// 		this.trigger("statuschange", {
	// 			prevVal: prevVal,
	// 			newVal: status
	// 		});
	// 		if (status == "loading") {
	// 			this.trigger("loading");
	// 		}
	// 	}
	// },
	// /**
	//  * reset the pulldown plugin
	//  * @memberOf PullDown
	//  * @param {function} callback
	//  * @return {PullDown}
	//  */
	reset: function() {
		this.xscroll.boundry.resetTop();
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
		if (scrollTop > 0) return;

        var p = (scrollTop * -1) / (height * 2);

        if ( scrollTop < height * 2 * -1 ){
            this.userConfig.cb_over.call(self, scrollTop, 1);
        }
        else if ( scrollTop < height * -1 ){
            this.userConfig.cb_move.call(self, scrollTop, p);
        }
        else{
            this.userConfig.cb_start.call(self, scrollTop, p);
        }
	},
	_panEndHandler: function(e) {
        var self = this;
        var height = this.userConfig.el.offsetHeight;
        var scrollTop = self.xscroll.getScrollTop();
        if ( scrollTop < height * 2 * -1 ){
            if ( this.doing ) return;
            this.doing = true;
            e.preventDefault();
            self.xscroll.boundry.resetTop();
            self.xscroll.boundry.expandTop(height);
            self.xscroll.boundryCheckY(() => {
                this.userConfig.cb_refresh.call(this);
            });
        }
	}
});

module.exports = PullDown;

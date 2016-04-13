import * as Util from 'sp-scroll/util';
import * as Base from 'sp-scroll/base';


let PULLDOWN = function(cfg){
    PullDown.superclass.constructor.call(this, cfg);
    this.userConfig = Util.mix({
		content: content,
		height: 60,
		autoRefresh: true,
		downContent: "Pull Down To Refresh",
		upContent: "Release To Refresh",
		loadingContent: loadingContent,
		clsPrefix: "xs-plugin-pulldown-"
	}, cfg);
}

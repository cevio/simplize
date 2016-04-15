import './resource'; // 加载资源文件

// load simplize
import * as simplize from 'simplize';

// load browsers.
import * as browsers from './example/resource.js';

simplize.ready(function() {
    let app = simplize.bootstrap(browsers, { SP_animate_switch: 'fade' });

    app
        .$use(
            app.$browser('cores')
                .$active('/modal/:id', function(next){
                    const id = this.root.req.params.id;
                    if ( id ) { this.$render(id); }
                    else{ next() }
                })
                .$active('/component/:id', function(next){
                    const id = this.root.req.params.id;
                    if ( id ) { this.$render(id); }
                    else{ next() }
                })
                .$define('/modals', 'modals')
                .$define('/buttons', 'buttons')
                .$define('/components', 'components')
                .$define('/cell', 'cell')
                .$define('/1px', 'pxborder')
                .$define('/panel', 'panel')
                .$define('/layout', 'layout')
                .$define('/icons', 'icons')
                .$define('index')
        );

    app.$run();
});

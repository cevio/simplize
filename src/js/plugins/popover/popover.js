import {
    nextTick
} from '../../utils/index';

let init_style_obj = {
    opacity: 0
};

let padding = 10;

export let POPOVER = {
    name: 'sp-ui-popover',
    template: require('./popover.html'),
    data: function(){
        return {
            list: [],
            angleClass: false,
            angleStyle: {},
            listStyle: {},
            status: false
        }
    },
    methods: {
        $constructor(ele, menus){
            let listStyle = Object.assign({}, init_style_obj);
            this.listStyle = listStyle;
            let rect = ele.getBoundingClientRect();
            this.status = true;
            this.$parent.nextTick(() => {
                this.list = menus;

                nextTick(() => {
                    let direct;
                    let listRect = this.$els.list.getBoundingClientRect();
                    let angleRect = this.$els.angle.getBoundingClientRect();
                    let bodyHeight = window.document.body.clientHeight;
                    let bodyWidth = window.document.body.clientWidth;

                    let fullHeight = listRect.height + angleRect.height / 2;

                    if(fullHeight < rect.top){
                        direct = 'bottom';
                    }
                    else if(fullHeight < rect.bottom){
                        direct = 'top'
                    }
                    else if(listRect.left > listRect.right){
                        direct = 'right';
                    }
                    else {
                        direct = 'left';
                    }

                    this.angleClass = 'sp-ui-popover-angle-' + direct;
                    
                    let angleStyle = {};
                    if(direct === 'top' || direct === 'bottom'){
                        let baseLeft = rect.left + rect.width / 2;
                        let tempLeft = baseLeft - listRect.width / 2;
                        let angleLeft = listRect.width / 2 - angleRect.width / 2;

                        if(tempLeft < padding){
                            let diff = padding - tempLeft;
                            tempLeft = padding;
                            angleLeft -= diff;
                            if(angleLeft < 0){
                                angleLeft = 0;
                            }
                        }
                        else if((tempLeft + listRect.width / 2) > (bodyWidth - padding)){
                            let diff = (tempLeft + listRect.width / 2) -  (bodyWidth - padding);
                            tempLeft -= diff;
                            angleLeft += diff;
                            if((angleLeft + angleRect.width) > listRect.width){
                                angleLeft = listRect.width - angleRect.width;
                            }
                        }

                        listStyle = {
                            left: tempLeft + 'px'
                        };

                        angleStyle = {
                            left: angleLeft + 'px'
                        };

                        if( direct === 'top' ){
                            listStyle.top = rect.top + rect.height - angleRect.height / 2 + 'px';
                        }
                        else {
                            listStyle.bottom = rect.bottom + rect.height - angleRect.height / 2 + 'px';
                            listStyle.top = null;
                        }
                    }
                    else {
                        let baseTop= rect.top + rect.height / 2;
                        let tempTop = baseTop - listRect.height / 2;
                        let angleTop = listRect.height / 2 - angleRect.height / 2;

                        if(tempTop < padding){
                            let diff = padding - tempTop;
                            tempTop = padding;
                            angleTop -= diff;
                            if(angleTop < 0){
                                angleTop = 0;
                            }
                        }
                        else if((tempTop + listRect.height / 2) > (bodyHeight - padding)){
                            let diff = (tempTop + listRect.height / 2) -  (bodyHeight - padding);
                            tempTop -= diff;
                            angleTop += diff;
                            if((angleTop + angleRect.height) > listRect.height){
                                angleTop = listRect.height - angleRect.height;
                            }
                        }

                        listStyle = {
                            top: tempTop + 'px'
                        };

                        angleStyle = {
                            top: angleTop + 'px'
                        };

                        if( direct === 'left' ){
                            listStyle.left = rect.left + rect.width - angleRect.width / 2;
                            if((listStyle.left + listRect.width + angleRect.width / 2) > (bodyWidth - padding)){
                                listStyle.left -= (listStyle.left + listRect.width + angleRect.width / 2) - (bodyWidth - padding);
                            }
                            listStyle.left += 'px';
                        }
                        else {
                            listStyle.right = rect.right + rect.width - angleRect.width / 2;
                            if((listStyle.right + listRect.width + angleRect.width / 2) > (bodyWidth - padding))
                            listStyle.right = (listStyle.right + listRect.width + angleRect.width / 2) - (bodyWidth - padding);
                            listStyle.right += 'px';
                        }
                    }

                    this.listStyle = Object.assign({}, this.listStyle, listStyle);
                    this.angleStyle = angleStyle;
                    this.listStyle.opacity = 1;

                    nextTick(() => {
                        this.$parent.mask = true;
                    })
                })
            });
        },

        select: function(index){
            this.$emit('popover:select', this.list[index]);
        }
    },
    
    events: {
        'modal:maskclick': function(){
            this.$emit('popover:close');
            this.$parent.prevTick(() => {
                this.list = [];
                this.status = false;
            });
        }
    }
};
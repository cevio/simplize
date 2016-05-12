const temp = `
<p>simplize是一套基于vue创建的独立单页面框架，主要适用于接近原生的html5应用开发。</p>
<p>很高兴能为大家写一下关于simplize的介绍文章。在此，我主要阐述simplize作为国内比较完善的单页面应用框架所具有的特性和扩展性。你们可以认识到simplize是否能够完全胜任开发时候的业务需求。</p>
<p>在html5定稿之后，因其api扩充到40万多个，很多公司已经开始使用html5来制作一些试验性的业务逻辑，包括我所在的51信用卡管家，不断将html5作为定性业务之前不断迭代更新的主要手段。不过html5不仅仅作为实验性产品的需要，同时也具备了独立app化（可接近原生）的能力。微信将在不久之后开放应用号。据我对此的了解，应用号完全以html5为主，快速接入不同的html5 app在微信中扩充其内容，同时也方便用户，省去下载app的麻烦。不过之后应用号如何发展，对html5是否产生冲击将不得而知。</p>
<p>simplize可谓是为应用号量身定制的产品，其丰富的组件和强大的ui，以及对html标签功能的自定义性，让开发者快速灵活在最短时间内实现你的app应用。</p>
<p>举个例子来说明simplize快速开发的能力。</p>
<p>当所有ui的html都书写完毕后，你只需要对数据进行赋值处理或者稍微复杂一些地处理下数据即可。而view层将自动根据你的数据及时渲染在页面上。你仅仅所需要做的是处理数据，而非处理数据的同时还要关心页面上各个节点的情况。</p>
<p>simplize的工作量不在js方面，相反，却在html代码的编写上。一个项目从开始到完成，几乎70%的时间是在书写html代码，而30%时间是让你处理数据和绑定路由的。虽然html编写占据了大概70%的时间，但是整个项目，相比不使用simplize开发，节省了好几倍时间。如果你的代码能够自己整理清楚，而且分模块写，那么效率更加会提升。同时代码维护明显的方便。多人同时开发也不是问题。</p>
<p>经过我在公司很多业务的测试，simplize在处理数据上特别占优势，快速，准确地将数据同步到各个环境中。我们公司现在全部使用simplize作为前端开发的工具，在很大程度上，之前需要3天完成的项目，而现在仅仅需要1天或者更短时间即可完成。</p>
<p>simplize的底层采用vuejs作为数据驱动，自带vue所有特性。你可以从vue的官方网站上学习到vue的使用。创建simplize项目，我们开发了cli工具，快速创建一个simplize项目，并且具备了调试和打包的功能。所有操作都采用nodejs编写，这是前端喜欢的开发模式。</p>
`;
export let index = {
    zindex: 2,
    template: require('../../html/index.html'),
    events: {
        "webview:preset": function(head, tool) {
            head.active();
            head.data.left.icon = '<i class="iconfont icon-info"></i>';
            head.data.right.icon = '<i class="iconfont icon-more"></i>';
            head.data.center.text = 'Simplize Application Builder';
            this.SP_webviewContentClass = 'test1';
            head.data.right.click = () => {
                this.openList();
            }
            head.data.left.click = () => {
                this.openView();
            }
        }
    },
    methods: {
        openList(){
            const list = [
                { text: 'evio shen', mail: 'evio@vip.qq.com' },
                { text: 'jack wu', mail: 'wufengjie@u51.com' },
                { text: 'guanyx', mail: 'guanyuxing@u51.com' }
            ];
            this.$actionsheet(list).then((action)=>{
                action.$on("actionsheet:select", (select) => {
                    this.$alert('该作者邮箱是：' + select.mail);
                })
            })
        },
        openView(){
            this.$popup('<div class="p10 f8">' + temp + '</div>', true,true);
        }
    }
}

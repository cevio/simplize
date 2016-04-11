export let circle = {
    template: require('./circle.html'),
    props: {
        height: {
            type: Number,
            default: 100
        },
        width: {
            type: Number,
            default: 100
        },
        strokeWidth: {
            type: Number,
            default: 1
        },
        strokeColor: {
            type: String,
            default: '#3FC7FA'
        },
        trailWidth: {
            type: Number,
            default: 1
        },
        trailColor: {
            type: String,
            default: '#D9D9D9'
        },
        percent: {
            type: Number,
            default: 0
        }
    },
    computed: {
        viewbox: function(){
            return `0 0 ${this.width} ${this.height}`;
        },
        sr: function() {
            if( this.trailWidth >= this.strokeWidth ){
                return (this.width - this.strokeWidth * 2 - (this.trailWidth - this.strokeWidth) * 2) / 2;
            }
            return (this.width - this.strokeWidth * 2) / 2;
        },
        tr: function() {
            if(this.strokeWidth >= this.trailWidth){
                return (this.width - this.trailWidth * 2 - (this.strokeWidth - this.trailWidth) * 2) / 2;
            }
            return (this.width - this.trailWidth * 2) / 2;
        },
        cx: function() {
            return this.width / 2;
        },
        cy: function() {
            return this.height / 2;
        },
        transform: function() {
            return `matrix(0,-1,1,0,0,${this.width})`;
        },
        dasharray: function(){
            let percent = this.percent / 100;
            let perimeter = Math.PI * 2 * this.sr;
            return `${perimeter * percent} ${perimeter * (1- percent)}`;
        }
    }
}
export let circle = {
    props: {
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
        radius: function () {
            return 50 - this.strokeWidth / 2
        },
        pathString: function () {
            return `M 50,50 m 0,-${this.radius}
     a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}
     a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}`
        },
        len: function () {
            return Math.PI * 2 * this.radius
        },
        pathStyle: function () {
            return {
                'stroke-dasharray': `${this.len}px ${this.len}px`,
                'stroke-dashoffset': `${((100 - this.percent) / 100 * this.len)}px`,
                'transition': 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
            }
        }
    }
}
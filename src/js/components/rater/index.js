import {
    nextTick
} from '../../utils/index';

export let rater = {
    template: require('./rater.html'),
    props: {
        max: {
            type: Number,
            default: 5
        },

        value: {
            type: Number,
            default: 0
        },

        activeColor: {
            type: String,
            default: '#fc6'
        },

        grayColor: {
            type: String,
            default: '#ccc'
        },

        star: {
            type: String,
            default: '★'
        },

        disabled: {
            type: Boolean,
            default: false
        },

        margin: {
            type: Number,
            default: 2
        },

        fontSize: {
            type: Number,
            default: 25
        }
    },
    ready () {
        for (var i = 0; i < this.max; i++) {
            this.colors.push(this.grayColor)
        }
        if (this.value) {
            this.handleClick(this.value - 1, true)
        }
    },
    computed: {
        sliceValue: function () {
            const _val = this.value.toString().split('.')
            return _val.length === 1 ? [_val[0], 0] : _val
        },
        cutIndex: function () {
            return this.sliceValue[0] * 1
        },
        cutPercent: function () {
            return this.sliceValue[1] * 10
        }
    },
    methods: {
        handleClick (i, force) {
            if (!this.disabled || force) {
                let colors = [];
                this.value = i + 1
                for (var j = 0; j < this.max; j++) {
                    if (j <= i) {
                        colors[j] = this.activeColor;
                    } else {
                        colors[j] = this.grayColor;
                    }
                }
                this.colors = colors;
                
                nextTick(() => {
                    this.$emit('rater:value', this.value);
                });
            }
        }
    },
    data () {
        return {
            colors: [],
            cutIndex: -1,
            cutPercent: 0
        }
    },
    watch: {
        value: function (val) {
            this.handleClick(val - 1)
        }
    }
};
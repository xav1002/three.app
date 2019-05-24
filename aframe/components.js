AFRAME.registerComponent('sphere', {
    init: function() {
        this.el.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 1
        })
        this.el.setAttribute('material',{
            src: '#bball'
        })
    }
});

AFRAME.registerComponent('plane', {
    init: function() {
        this.el.setAttribute('geometry', {
            primitive: 'plane',
            height: 1000,
            width: 1000
        })
        this.el.setAttribute('material', {
            src: '#pic'
        })
    }
})

AFRAME.registerComponent('flyingcamera', {
    schema: {
        acceleration: {default: 1000},
        fly: {default: 'true'}
    }
})
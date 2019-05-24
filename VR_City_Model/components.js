AFRAME.registerComponent('red', {
    init: function() {
        camera.el.setAttribute('material', {
            color: 'red'
        })
    }
});

AFRAME.registerComponent('box', {
    init: function() {
        this.el.setAttribute('geometry', {
            primitive: 'box',
            width: '5',
            height: '5',
            depth: '5'
        })
        this.el.setAttribute('material', {
            color: 'red'
        })
    }
})

AFRAME.registerComponent('ground', {
    init: function() {
        this.el.setAttribute('geometry', {
            primitive: 'plane',
            width: '25000',
            height: '25000'
        })
        this.el.setAttribute('material', {
            src: '#grasstexture'
        })
        this.el.setAttribute('rotation', '-90 0 0')
        this.el.setAttribute('position', '0 -500 0')
    }
})

AFRAME.registerComponent('modify-cabin', {
    init: function() {
            const obj = [];
            obj.push(this.el.getObject3D('mesh'));
            obj.forEach(node => {
                node.setAttribute('material', {
                    color: 'red'
                })
                node.setAttribute('position', '10 0 20');
                node.setAttribute('geometry', {
                    primitive: 'box'
                })
            })
    }
})
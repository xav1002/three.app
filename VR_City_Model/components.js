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
        this.el.addEventListener('model-loaded', () => {
            const obj = this.el.getObject3D('mesh');
            obj.traverse(node => {
                node.children.forEach(child => {
                    child.material.color.set('red');
                });
                node.position.set('10 0 20');
                })
            })
        }
})
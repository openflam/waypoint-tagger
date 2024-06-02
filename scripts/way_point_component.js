AFRAME.registerComponent('way_point',{
    schema:{
        ID: {type: 'string'},
        name: {type: 'string'},
        description: {type: 'string'},
    },
    init: function(){
        var data = this.data;
        var el = this.el;
        this.geometry = new THREE.SphereGeometry(0.5,32,16);
        this.material = new THREE.MeshBasicMaterial({color: 0xb5b5b5});
        this.mesh = new THREE.Mesh(this.geometry,this.material);
        el.setObject3D('mesh',this.mesh);
    },
    update: function(oldData){
        var data = this.data;
        var el = this.el;
        if (Object.keys(oldData).length === 0) { return; }
    },
    remove: function(){
        this.el.removeObject3D('mesh');
    }
})
function Interactable( position , name){

  this.innerRadius = .01;
  this.outerRadius = .02;

  this.cutoffSpeed = .6;
  this.cutoffMatch = .9;

  var geo = G.geometries.icosahedron1;
  var mat = G.materials.normal.clone();

  mat.transparent = true;
  mat.opacity = .5;
  mat.needsUpdate = true;

  this.body = new THREE.Mesh( geo , mat );
  this.body.scale.multiplyScalar( this.innerRadius );

  var mat = mat.clone();
  mat.wireframe = true;
  mat.needsUpdate = true;

  this.shell = new THREE.Mesh( geo , mat );
  this.shell.scale.multiplyScalar( this.outerRadius / this.innerRadius );

  this.body.add( this.shell );

  this.position = new THREE.Vector3();
  
  this.position.copy( position );
  this.body.position.copy( this.position );

  // Keeping it so we have the info in
  // terms of camera coordinates
  this.viewPosition = new THREE.Vector3();

  this.active = false;
  this.selected = false;

  var geo = new THREE.Geometry();
  geo.vertices.push( this.position );
  geo.vertices.push( new THREE.Vector3() );

  var mat = new THREE.LineBasicMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  this.line = new THREE.Line( geo , mat );

  //scene.add( this.line );
  scene.add( this.body );

  this.title = textCreator.createMesh( name );
  this.title.scale.multiplyScalar( .1 );
  this.title.position.y = 0.;
  this.title.position.x = this.title.scaledWidth *2.5;
  this.title.material.opacity = .2;
  this.title.material.depthWrite = false;
  this.title.material.needsUpdate = true;
  this.body.add( this.title );

  this.body.hoverOver   = this._hoverOver.bind( this );
  this.body.hoverOut    = this._hoverOut.bind( this );
  this.body.select      = this._select.bind( this );
  this.body.deselect    = this._deselect.bind( this );
  
  this.shell.hoverOver  = this._hoverOver.bind( this );
  this.shell.hoverOut   = this._hoverOut.bind( this );
  this.shell.select     = this._select.bind( this );
  this.shell.deselect   = this._deselect.bind( this );
  

}

Interactable.prototype.update = function( position , velocity ){

  this.line.geometry.vertices[1].copy( position );
  this.line.geometry.verticesNeedUpdate = true;

  this.setViewPosition( this.position );

  tv1.copy( position );
  tv1.sub( this.position );
  var dist = tv1.length();

  this.body.lookAt( camera.position );
  //console.log( tv );
  //console.log( 3 - dist );
  
  this.line.material.color.r = .1 / dist;
  this.line.material.color.g = .1 / dist;
  this.line.material.color.b = .1 / dist;


  //this.line.material.color.r = velocity.x;
  //this.line.material.color.g = velocity.y;
  //this.line.material.color.b = velocity.z;
 
 /* if( this.selected ){ };
  this.check( position , velocity );
  if( this.selected ){this._updateSelected( position , velocity ) }*/


  if( this.selected ){ this._updateSelected( position , velocity ); }
}


Interactable.prototype.setViewPosition = function( position ){

  this.viewPosition.copy( camera.position );
  tv1.copy( position );
  tv1.applyQuaternion( camera.quaternion );
  this.viewPosition.add( tv1 );

}


Interactable.prototype._hoverOver = function(){

  console.log('hoverOver');
  this.title.material.opacity = 1;
  this.body.material.opacity = 1;
  this.hovered = true;

  this.hoverOver();
  

}

Interactable.prototype._hoverOut = function(){

  if( this.selected === false ){
    console.log('make less');
    this.title.material.opacity = .5;
    this.body.material.opacity = .5;
  }
 
  this.hovered = false;
  
  this.hoverOut();

}

Interactable.prototype._select   = function(){

  //this.shell.material.wireframe = false;
  //this.shell.material.needsUpdate = true;
  //
  this.body.scale.multiplyScalar(2);
  this.selected = true;
  
  this.select();

}

Interactable.prototype._deselect   = function(){

  this.body.scale.multiplyScalar(.5);
  this.selected = false;

  this.deselect();

}


Interactable.prototype.select    = function(){};
Interactable.prototype.deselect  = function(){};
Interactable.prototype.hoverOver = function(){};
Interactable.prototype.hoverOut  = function(){};


Interactable.prototype._updateSelected = function( position , velocity ){

  //this.position.copy( position );


  tv2.set( 0 , 0 , -.1 );
  tv2.applyQuaternion( camera.quaternion );

  tv1.copy( position );
  tv1.sub( this.position );
  tv1.x *= tv2.x; //multiplyScalar( .5 );
  tv1.y *= tv2.y; //multiplyScalar( .5 );
  tv1.z *= tv2.z; //multiplyScalar( .5 );

  this.position.copy( position );


  this.body.position.copy( this.position );
 // tv1.copy( velocity );
 // tv1.multiplyScalar( -1 );
 // this.position.add( tv1 );


}


Interactable.prototype.updateSelected = function(){}


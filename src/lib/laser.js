import Phaser from './phaser.js'
/** 
This function preloads json paths into the scene
paths is a list of objects as follows
[
    {
        path_key: <name of the path>
        path: <path to json file>
    },
]
**/
function preload(scene,paths) {
    console.log(paths)
    for(let index=0;index<paths.length;index++) {
        scene.load.json(paths[index].path_key, paths[index].path);
    }
}

/** 
This function adds a laser to the scene
Example config object
{
        path_key: 'test_laser',
        colours: ['blue'],
        start: 0.1,
        end: 0.1,
        quantity: 48,
        yoyo: true,
        particle_key: 'flares'
}
**/
function addLaser(scene,config) {
   
    if(!scene.particles) {
        scene.particles = scene.add.particles(config.particle_key);
    }

    var path = new Phaser.Curves.Path(scene.cache.json.get(config.path_key));

    scene.particles.createEmitter({
        frame: { frames: config.colours, cycle: true },
        scale: { start: config.start, end: config.end },
        blendMode: 'ADD',
        emitZone: { type: 'edge', source: path, quantity: config.quantity, yoyo: config.yoyo },
    });

}

export {preload,addLaser};
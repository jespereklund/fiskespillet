var Example = Example || {}

Example.sprites = function() {
    Settings.load()
    document.querySelector("#player").value = Settings.player
    var w = 1300
    var h = 700
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        //Events = Matter.Events,
        Composites = Matter.Composites,
        //Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies
        
    // create engine
    var engine = Engine.create(),
        world = engine.world

    // create renderer
    var render = Render.create({
        //element: document.body,
        element:  document.querySelector("#game"),
        engine: engine,

        options: {
            background: 'transparent',
            wireframeBackground: 'transparent',
            width: w,
            height: h,
            showAngleIndicator: false,
            wireframes: false
        }
    });

    Render.run(render)

    // create runner
    var runner = Runner.create()
    Runner.run(runner, engine)

    var optionsWall = { 
        isStatic: true,
        render: {
            fillStyle: '#123456'
        }
    }

    world.bodies = []

    //fish images sizes: [[x,y],[x,y],[x,y]...]
    var sizesSmall = [[78,40],[76,34],[37,41],[98,35],[73,41],[98,33],[56,31],
        [76,30],[93,14],[90,34],[78,40],[76,34],[37,41],[98,35],[73,41],[98,33],[56,31],[76,30],[93,14],[90,34]]

    //5 random different fish in game
    var game = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort( () => .5 - Math.random() ).slice(5)

    var wallEnclosureThickness = 500
    var dividerThickness = 30
    var dividerX = 300
    var dividerY = 200
    var dividerHeight = 500
    var dividerSpacing = 200

    var sensorBoxY = 500
    var sensorBoxHeight = 198
    var sensorBoxWidth = 166

    var stopwatchStart = Date.now()
    var stopwatchNow = Date.now()
    var stopwatchDiff
    var divtime = "checksum"

    //statics, enclosure, walls, fish signs
    Composite.add(world, [
        
        //wall
        Bodies.rectangle(c2cc(dividerX,dividerThickness)-20, 
            c2cc(dividerY,dividerHeight), dividerThickness+40, dividerHeight, optionsWall),

        //enclosure
        Bodies.rectangle(w/2, -wallEnclosureThickness/2, w+wallEnclosureThickness, wallEnclosureThickness, optionsWall),
        Bodies.rectangle(w/2, h+wallEnclosureThickness/2, w+wallEnclosureThickness, wallEnclosureThickness, optionsWall),
        Bodies.rectangle(w+wallEnclosureThickness/2, h/2, wallEnclosureThickness, h+wallEnclosureThickness, optionsWall),
        Bodies.rectangle(-wallEnclosureThickness/2, h/2, wallEnclosureThickness, h+wallEnclosureThickness, optionsWall)
    ])

    //buckets, bucket sensor blocks and passive signs
    game.forEach((fish, index) => {
        var x = dividerX + dividerSpacing * (index +1)
        var x2 = dividerX + dividerSpacing * (index)

        Composite.add(world, [
            //wall
            Bodies.rectangle(c2cc(x,dividerThickness), 
                c2cc(dividerY,dividerHeight), dividerThickness, dividerHeight, optionsWall),

            //sensor box
            Bodies.rectangle(c2cc(2+x2+dividerThickness,sensorBoxWidth), 
                c2cc(sensorBoxY,sensorBoxHeight), sensorBoxWidth, sensorBoxHeight, {
                isStatic: true,
                isSensor: true,
                label: fish,
                render: {
                    __strokeStyle: '#000000',
                    fillStyle: '#001122'
                }
            }),

            //fiske skilt
            Bodies.rectangle(c2cc(x - 110, 50), c2cc(70, 50), 50, 50, {
                isStatic: true,
                isSensor: true,
                render: {
                    sprite: {
                        texture: './img-cropped-small/fisk'+ (1+fish)+'.png'
                    }
                }    
            }),

            //pil ned
            Bodies.rectangle(c2cc(x - 106, 50), c2cc(150, 50), 50, 50, {
                isStatic: true,
                isSensor: true,        
                render: {
                    sprite: {
                        texture: './pil.png'
                    }
                }    
            })
        ])
    })

    //add fish
    var currentFishIndex = 0 //0, 100, 3, 8
    Composite.add(world, Composites.stack(0, 100, 3, 8, 0, 0, function(x, y) {
        var fishIndex = currentFishIndex++
        currentFishIndex %= game.length
        var fishNr = game[fishIndex]
        var flipped = (Math.random() > 0.5) ? 10 : 0
        var fishNr10 = fishNr + flipped
        return Bodies.rectangle(x, y, sizesSmall[fishNr10][0], sizesSmall[fishNr10][1], {
            angle: 3.14 * Math.random(),
            label: fishNr,
            render: {
                sprite: {
                    texture: './img-cropped-small/fisk'+ (1+fishNr10)+'.png'
                }
            }
        });
    }));

    var timerTestGameDone = setInterval(testGameDone, 1)

    function testGameDone() {
        var count = 0
        var hitboxes = world.bodies.filter(box => {
            return typeof box.label == "number"
        })

        stopwatchNow = Date.now()
        stopwatchDiff = stopwatchNow - stopwatchStart

        var time = stopwatchSeconds()

        document.getElementById("topbar").textContent = time

        var fishes = world.composites[0].bodies

        //var totalSpeed = 0

        fishes.forEach(fish => {

            //totalSpeed += Math.abs(fish.velocity.x + fish.velocity.y)

            hitboxes.forEach(box => {
                if(Matter.SAT.collides(fish, box).collided === true) {
                    if (fish.label == box.label) {
                        count++
                        if (fishes.length == count) {
                            clearTimeout(timerTestGameDone)
                            document.querySelector("#div-message").innerHTML = "Tillykke! Du klarede opgaven på " + 
                            time + " sekunder."
                            document.getElementById('score').value = time
                            document.getElementById(divtime).value = checktime(time)
                            showView("#form")
                        }
                    }
                }
            })
        })
        //console.log(totalSpeed)
    }

    var mouse = Mouse.create(render.canvas)
    var mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.006,
            render: {
                visible: false
            }
        }
    });

    Composite.add(world, mouseConstraint);

    render.mouse = mouse

    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: w, y: h }
    });

    /*
    Events.on(engine, 'beforeUpdate', function() {
        //dump()
    })
    */

    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render)
            Matter.Runner.stop(runner)
        }
    };
    
    function c2cc(x, s) {
        return x + s/2
    }
    
    function restartGame() {
        location.reload()
    }

    function stopwatchSeconds() {
        return stopwatchDiff / 1000
    }

};

function showView(view) {
    document.querySelector("#game").style.visibility = "hidden";
    document.querySelector("#topbar").style.visibility = "hidden";
    document.querySelector("#form").style.visibility = "hidden";

    document.querySelector(view).style.visibility = "visible";

}

function checktime(time) {
    return ((2 + time + Math.sin(1.23456 + time)).toString().substr(0,5));
}

Example.sprites.title = 'Sprites'
Example.sprites.for = '>=0.14.2'

if (typeof module !== 'undefined') {
    module.exports = Example.sprites
}
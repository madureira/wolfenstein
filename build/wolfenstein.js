// Defines the namespace container
var App = App || {};

App.maps = App.maps || {};

App.Properties = {

    container: 'stage',

    selectorEngine: (function() {
        return {
            byId: function(id) {
                return document.getElementById(id);
            },
            createTag: function(tagName) {
                return document.createElement(tagName);
            },
            getByTag: function(tagName) {
                return document.getElementsByTagName(tagName)[0];
            },
            removeById: function(id) {
                var elem = document.getElementById(id);
                var parentNode = elem.parentNode;
                parentNode.removeChild(elem);
            }
        };
    })(),

    templateEngine: App.template,
    texturesPath: 'src/resources/textures/',
    spritesPath: 'src/resources/sprites/',
    statusbarPath: 'src/resources/statusbar/',
    soundPath: 'src/resources/sounds/',
    fps: 30,

    playerSpeed: 0.20,

    playerRotateSpeed: 3,

    raycastingColor: 'rgba(0,100,0,0.3)',

    screenWidth: 720,
    screenHeight: 480,
    stripWidth: 2,

    miniMapElementId: 'minimap',
    miniMapObjectElementId: 'minimapobjects',
    miniMapScale: 4,
    miniMapBlocksColor: '#000',
    miniMapDebugMode: false

};

/**
 * This object contains several useful methods.
 *
 * @author Madureira
 */
App.Helpful = {

    isNull: function(value) {
        return (value === undefined || value === null);
    },

    isNumber: function(number) {
        return (typeof number === 'number');
    },

    hasOnlyNumbers: function(list) {
        var isNumber = true;
        for (var i=0; i < list.length; i++) {
            if (!App.Helpful.isNumber(list[i])) {
                isNumber = false;
                break;
            }
        }

        return isNumber;
    },

    isArray: function(array) {
        return (array instanceof Array);
    },

    mergeObjects: function(source, target) {
        for (var property in source) {
            if (source[property] && source[property].constructor && source[property].constructor === Object) {
                target[property] = target[property] || {};
                arguments.callee(source[property], target[property]);
            } else {
                target[property] = source[property];
            }
        }

        return target;
    },

    isNodeWebkit: function() {
        return (typeof process === "object");
    }

};

/**
 * This function is responsible to generate the namespace dynamically.
 *
 * @author Madureira
 *
 * @param string namespace
 *
 * @return void
 */
App.define = App.define || function(clazz, namespace, object) {

    /**
     * Generates an object based on array.
     * # Example
     *      Given: array([0] => 'a', [1] => 'b')
     *      Return: Object({ a: { b: {} } });
     *
     * @param array list
     *
     * @return object
     */
    function generatesObjectByArray(list) {
        var namespaceTree = {};
        var rootPackage = list[0];

        list.reverse();

        for (var i=0; list.length > i; i++) {
            var tmp = {};

            if (i === 0) {
                var implementation = {};

                switch(rootPackage) {
                    case 'views':
                        implementation = object(function(){}, App.Properties.selectorEngine, App.Properties.templateEngine);
                        break;
                    default:
                        implementation = object(function(){});
                }

                tmp[list[i]] = implementation;
            } else {
                tmp[list[i]] = namespaceTree;
            }

            namespaceTree = tmp;
        }

        return namespaceTree;
    }

    /**
     * Creates a namespace or merge if it exist on namespace container tree.
     *
     * @param object namespace
     * @param object context
     *
     * @return object
     */
    function createNamespace(namespace, context) {
        return App.Helpful.mergeObjects(namespace, context);
    }

    var namespaceList = namespace.split('/');
    namespaceList.push(clazz);

    var newNamespaceObject = generatesObjectByArray(namespaceList);

    App = createNamespace(newNamespaceObject, App);
};


App.define('Shortcut', 'core/config', (function(fn) {
    'use strict';

    var defaultShortcuts = [{
        key: 'container',
        value: App.Properties.container
    }];

    fn = function() {
        _addDefaultShortcuts();
    };

    /**
     * Add a shortcut to instantiate objects.
     *
     * @param String node
     * @param Object item
     *
     * @return void
     */
    fn.prototype.addShortcut = function(node, item) {
        App[node] = item;
    };

    function _addDefaultShortcuts() {
        var i = 0,
            listSize = defaultShortcuts.length;

        for (i; i < listSize; i++) {
            var current = defaultShortcuts[i];
            App[current.key] = current.value;
        }
    }

    return fn;
}));

new App.core.config.Shortcut();

App.Exception = {

    throw: function(msg, e) {
        var title = '::Exception::';

        if (!App.Helpful.isNull(msg) && !App.Helpful.isNull(e)) {
            console.error(title + "\n\t Message: " + msg + "\n\t Cause: ", e);
        } else {
            console.error(title + "\n\t Message: " + msg);
        }
    }

};

/**
 * Prototype responsible to detect collision.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Collision', 'engine', (function(fn) {
    'use strict';

    /**
     * Detect collision between the player and Wall or Sprites.
     *
     * @param Float fromX
     * @param Float fromY
     * @param Float toX
     * @param Float toY
     * @param Float radius
     * @param App.engine.MiniMap miniMap
     * @param App.engine.Screen screen
     *
     * @return Boolean
     */
    fn.prototype.checkCollision = function(fromX, fromY, toX, toY, radius, miniMap, screen) {
        var pos = {
            x : fromX,
            y : fromY
        };

        if (toY < 0 || toY >= miniMap.mapHeight || toX < 0 || toX >= miniMap.mapWidth) {
            return pos;
        }

        var blockX = Math.floor(toX);
        var blockY = Math.floor(toY);


        if (_isBlocking(blockX, blockY, miniMap, screen)) {
            return pos;
        }

        pos.x = toX;
        pos.y = toY;

        var blockTop = _isBlocking(blockX, blockY-1, miniMap, screen);
        var blockBottom = _isBlocking(blockX, blockY+1, miniMap, screen);
        var blockLeft = _isBlocking(blockX-1, blockY, miniMap, screen);
        var blockRight = _isBlocking(blockX+1, blockY, miniMap, screen);

        if (blockTop && toY - blockY < radius) {
            toY = pos.y = blockY + radius;
        }
        if (blockBottom && blockY+1 - toY < radius) {
            toY = pos.y = blockY + 1 - radius;
        }
        if (blockLeft && toX - blockX < radius) {
            toX = pos.x = blockX + radius;
        }
        if (blockRight && blockX+1 - toX < radius) {
            toX = pos.x = blockX + 1 - radius;
        }

        var dx = 0;
        var dy = 0;

        // is tile to the top-left a wall
        if (_isBlocking(blockX-1, blockY-1, miniMap, screen) !== 0 && !(blockTop !== 0 && blockLeft !== 0)) {
            dx = toX - blockX;
            dy = toY - blockY;
            if (dx*dx+dy*dy < radius*radius) {
                if (dx*dx > dy*dy) {
                    toX = pos.x = blockX + radius;
                } else {
                    toY = pos.y = blockY + radius;
                }
            }
        }

        // is tile to the top-right a wall
        if (_isBlocking(blockX+1, blockY-1, miniMap, screen) !== 0 && !(blockTop !== 0 && blockRight !== 0)) {
            dx = toX - (blockX+1);
            dy = toY - blockY;
            if (dx*dx+dy*dy < radius*radius) {
                if (dx*dx > dy*dy) {
                    toX = pos.x = blockX + 1 - radius;
                } else {
                    toY = pos.y = blockY + radius;
                }
            }
        }

        // is tile to the bottom-left a wall
        if (_isBlocking(blockX-1, blockY+1, miniMap, screen) !== 0 && !(blockBottom !== 0 && blockBottom !== 0)) {
            dx = toX - blockX;
            dy = toY - (blockY+1);
            if (dx*dx+dy*dy < radius*radius) {
                if (dx*dx > dy*dy) {
                    toX = pos.x = blockX + radius;
                } else {
                    toY = pos.y = blockY + 1 - radius;
                }
            }
        }

        // is tile to the bottom-right a wall
        if (_isBlocking(blockX+1, blockY+1, miniMap, screen) !== 0 && !(blockBottom !== 0 && blockRight !== 0)) {
            dx = toX - (blockX+1);
            dy = toY - (blockY+1);
            if (dx*dx+dy*dy < radius*radius) {
                if (dx*dx > dy*dy) {
                    toX = pos.x = blockX + 1 - radius;
                } else {
                    toY = pos.y = blockY + 1 - radius;
                }
            }
        }

        return pos;
    };

    function _isBlocking(x,y, miniMap, screen) {
        // first make sure that we cannot move outside the boundaries of the level
        if (y < 0 || y >= miniMap.mapHeight || x < 0 || x >= miniMap.mapWidth) {
            return true;
        }

        var ix = Math.floor(x);
        var iy = Math.floor(y);

        // return true if the map block is not 0, ie. if there is a blocking wall.
        if (miniMap.level.map[iy][ix] !== 0) {
            return true;
        }

        if (screen.sprites.spriteMap[iy][ix] && screen.sprites.spriteMap[iy][ix].block) {
            return true;
        }

        return false;
    }


    return fn;

}));

/**
 * Prototype responsible to supply the controls.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Controls', 'engine', (function(fn) {
    'use strict';

    var MAP_ENABLED = false;
    var FPS_DISPLAY_ENABLED = false;

    /**
     * Sets default attirbutes.
     *
     * @return void
     */
    fn = function() {
        console.log('[Controls] Configured');
        // up, W
        this.forwardKey = [38, 87];

        // down, S
        this.backwardKey = [40, 83];

        // right, D
        this.rightKey = [39, 68];

        // left, A
        this.leftKey = [37, 65];

        // M
        this.enableMap = 77;

        // F
        this.enableFPSDisplay = 70;

        // SPACE
        this.shoot = [0, 32];
    };

    /**
     * Defines the keyboard map.
     *
     * @param App.engine.Player player
     *
     * @return void
     */
    fn.prototype.keyboardMap = function(player) {
        var self = this;

        var $selector = App.Properties.selectorEngine;

        var $minimap = $selector.byId('minimap-container');
        var $fpsDisplay = $selector.byId('fps-debug');

        var shootEvent;

        try {
            // Chrome, Safari, Firefox
            shootEvent = new Event('shoot');
        } catch (e) {
            // PhantomJS (wat!)
            shootEvent = document.createEvent('CustomEvent');
            shootEvent.initCustomEvent('shoot', false, false, null);
        }

        document.onkeydown = function(e) {
            e = e || window.event;
            switch (e.keyCode) {
                case self.forwardKey[0]:
                case self.forwardKey[1]:
                    player.speed = 1;
                    break;

                case self.backwardKey[0]:
                case self.backwardKey[1]:
                    player.speed = -1;
                    break;

                case self.leftKey[0]:
                case self.leftKey[1]:
                    player.dir = -1;
                    break;

                case self.rightKey[0]:
                case self.rightKey[1]:
                    player.dir = 1;
                    break;

                case self.enableMap:
                    if (MAP_ENABLED) {
                        MAP_ENABLED = false;
                        $minimap.style.display = 'none';
                    } else {
                        MAP_ENABLED = true;
                        $minimap.style.display = 'block';
                    }
                    break;

                case self.enableFPSDisplay:
                    if (FPS_DISPLAY_ENABLED) {
                        FPS_DISPLAY_ENABLED = false;
                        $fpsDisplay.style.display = 'none';
                    } else {
                        FPS_DISPLAY_ENABLED = true;
                        $fpsDisplay.style.display = 'block';
                    }
                    break;

                case self.shoot[0]:
                case self.shoot[1]:
                    document.dispatchEvent(shootEvent);
            }
        };

        document.onkeyup = function(e) {
            e = e || window.event;
            switch (e.keyCode) {
                case self.forwardKey[0]:
                case self.forwardKey[1]:
                case self.backwardKey[0]:
                case self.backwardKey[1]:
                    player.speed = 0;
                    break;

                case self.leftKey[0]:
                case self.leftKey[1]:
                case self.rightKey[0]:
                case self.rightKey[1]:
                    player.dir = 0;
                    break;
            }
        };
    };

    return fn;

}));

/**
 * Prototype responsible to manager the enemies.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Enemies', 'engine', (function(fn) {
    'use strict';

    var GUARD = 'guard';

    fn = function($selector) {
        console.log('[Enemies] Add enemies');
        this.$selector = $selector;
        this.enemiesList = [];

        this.entity = new App.engine.Entity();
    };

    /**
     * Init the enemies by type.
     *
     * @param App.engine.Enemies enemies
     *
     * @return Objs
     */
    fn.prototype.init = function(enemies) {
        this.enemiesAmount = enemies.length;
        var i = 0;
        var $screen = this.$selector.byId('screen');

        for (i; this.enemiesAmount > i; i++) {
            var enemyData = enemies[i];

            if (enemyData.type === GUARD) {
                var guard = new App.engine.enemies.Guard(enemyData, this.$selector);

                this.enemiesList.push(guard);

                $screen.appendChild(guard.img);
            }
        }
    };

    fn.prototype.render = function(player, viewDist, screen) {
        var i = 0;

        for (i; i < this.enemiesAmount; i++) {
            var enemy = this.enemiesList[i];

            var img = enemy.img;

            var dx = enemy.x - player.x;
            var dy = enemy.y - player.y;

            var angle = Math.atan2(dy, dx) - player.rot;

            if (angle < -Math.PI) {
                angle += 2 * Math.PI;
            }

            if (angle >= Math.PI) {
                angle -= 2 * Math.PI;
            }

            var distSquared = 0;
            var dist = 0;
            var size = 0;
            var x = Math.tan(angle) * viewDist;
            var style = null;
            var oldStyles = null;
            var styleWidth = null;
            var styleTop = null;
            var styleLeft = null;
            var styleZIndex = 0;
            var styleDisplay = 'none';
            var styleClip = null;

            if (angle > -Math.PI * 0.5 && angle < Math.PI * 0.5) {
                distSquared = dx*dx + dy*dy;
                dist = Math.sqrt(distSquared);
                size = viewDist / (Math.cos(angle) * dist);

                if (size <= 0) {
                    continue;
                }

                x = Math.tan(angle) * viewDist;

                style = img.style;
                oldStyles = enemy.oldStyles;

                // height is equal to the sprite size
                if (size !== oldStyles.height) {
                    style.height =  size + 'px';
                    oldStyles.height = size;
                }

                // width is equal to the sprite size times the total number of states
                styleWidth = size * enemy.totalStates;

                if (styleWidth !== oldStyles.width) {
                    style.width = styleWidth + 'px';
                    oldStyles.width = styleWidth;
                }

                // top position is halfway down the screen, minus half the sprite height
                styleTop = ((screen.screenHeight - size) / 2);
                if (styleTop != oldStyles.top) {
                    style.top = styleTop + 'px';
                    oldStyles.top = styleTop;
                }

                // place at x position, adjusted for sprite size and the current sprite state
                styleLeft = (screen.screenWidth / 2 + x - size/2 - size * enemy.state);
                if (styleLeft !== oldStyles.left) {
                    style.left = styleLeft + 'px';
                    oldStyles.left = styleLeft;
                }

                styleZIndex = -(distSquared * 1000) >> 0;
                if (styleZIndex !== oldStyles.zIndex) {
                    style.zIndex = styleZIndex;
                    oldStyles.zIndex = styleZIndex;
                }

                styleDisplay = 'block';
                if (styleDisplay !== oldStyles.display) {
                    style.display = styleDisplay;
                    oldStyles.display = styleDisplay;
                }

                styleClip = 'rect(0px, ' + (size*(enemy.state+1)) + 'px, ' + size + 'px, ' + (size*(enemy.state)) + 'px)';
                if (styleClip !== oldStyles.clip) {
                    style.clip = styleClip;
                    oldStyles.clip = styleClip;
                }
            } else {
                styleDisplay = 'none';
                if (styleDisplay !== enemy.oldStyles.display) {
                    img.style.display = styleDisplay;
                    enemy.oldStyles.display = styleDisplay;
                }
            }
        }
    };

    fn.prototype.ai = function(timeDelta, player, miniMap, screen, gameCycleDelay) {
        var i=0;

        for (i; i < this.enemiesAmount; i++) {
            var enemy = this.enemiesList[i];

            var dx = player.x - enemy.x;
            var dy = player.y - enemy.y;

            var dist = Math.sqrt(dx*dx + dy*dy);
            if (dist > 4) {
                var angle = Math.atan2(dy, dx);

                enemy.rotDeg = angle * 180 / Math.PI;
                enemy.rot = angle;
                enemy.speed = 1;

                enemy.state = Math.floor((new Date() % enemy.walkCycleTime) / (enemy.walkCycleTime / enemy.numWalkSprites)) + 1;
            } else {
                enemy.state = 0;
                enemy.speed = 0;
            }

            this.entity.move(enemy, timeDelta, miniMap, screen, gameCycleDelay);
        }
    };

    return fn;

}));

/**
 * Prototype responsible to defines some actions to Player/Enemies.
 *
 * @para contextFunction fn
 *
 * @author madureira
 * 
 */
App.define('Entity', 'engine', (function(fn) {
    'use strict';

    fn = function() {
        this.collision = new App.engine.Collision();
    };

    /**
     * Move the entity.
     *
     * @param Entity entity
     * @param Float timDelta
     * @param App.engine.MiniMap miniMap
     * @param App.engine.Screen screen
     * @param Integer gameCycleDelay
     *
     * @return void
     */
    fn.prototype.move = function(entity, timeDelta, miniMap, screen, gameCycleDelay) {
        // time timeDelta has passed since we moved last time. We should have moved after time gameCycleDelay,
        // so calculate how much we should multiply our movement to ensure game speed is constant
        var mul = timeDelta / gameCycleDelay;

        var moveStep = mul * entity.speed * entity.moveSpeed; // entity will move this far along the current direction vector

        entity.rotDeg += mul * entity.dir * entity.rotSpeed; // add rotation if entity is rotating (entity.dir != 0)
        entity.rotDeg %= 360;

        if (entity.rotDeg < -180) {
            entity.rotDeg += 360;
        }

        if (entity.rotDeg >= 180) {
            entity.rotDeg -= 360;
        }

        var snap = (entity.rotDeg+360) % 90;
        if (snap < 2 || snap > 88) {
            entity.rotDeg = Math.round(entity.rotDeg / 90) * 90;
        }

        entity.rot = entity.rotDeg * Math.PI / 180;

        var newX = entity.x + Math.cos(entity.rot) * moveStep;  // calculate new entity position with simple trigonometry
        var newY = entity.y + Math.sin(entity.rot) * moveStep;

        var pos = this.collision.checkCollision(entity.x, entity.y, newX, newY, 0.35, miniMap, screen);

        // set new position
        entity.x = pos.x;
        entity.y = pos.y;
    };

    return fn;

}));

/**
 * Prototype responsible to manage the hero's face reactions.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('FaceReaction', 'engine', (function(fn) {
    'use strict';

    var FACE_IMG = 'reactions.png',
        SPRITE_PATH = App.Properties.statusbarPath,
        FRAME_TRANSITION_TIME = 500,
        frames = [
            'face01',
            'face02',
            'face03',
            'face02',
            'face01',
            'face01',
            'face01',
            'face02',
            'face02',
            'face03',
            'face03',
            'face01',
            'face03',
            'face01',
            'face02',
            'face03',
            'face02'
        ];

    fn = function($selector) {
        console.log('[FaceReaction] Creating the face reaction');
        this.$ = $selector;
        this.reactions = _createReactionsImage(this.$);
        _startAnimate(this);
    };

    fn.prototype.faces = function() {
        return this.reactions;
    };

    function _startAnimate(self) {

        var interval = FRAME_TRANSITION_TIME*frames.length;
        for(var x=0; x < 100; x++) {
            _animate(self, interval * x);
        }
    }

    function _animate(self, time) {
        var size = frames.length;
        setTimeout(function() {
            for(var i = 0; i < size; i++) {
                _changeFace(self, frames[i], FRAME_TRANSITION_TIME*i);
            }
        }, time);
    }

    function _changeFace(self, face, time) {
        setTimeout(function() {
            self.reactions.className = face;
        }, time);
    }

    function _createReactionsImage($selector) {
        var div = $selector.createTag('div');
        div.id = 'reactions';
        div.className = 'face01';
        return div;
    }

    return fn;

}));

/**
 * Prototype responsible to debug FPS.
 *
 * @param fn context function
 *
 * @author madureira
 */
App.define('FPSDebug', 'engine', (function(fn) {
    'use strict';

    var overlay;
    var overlayText = "";

    fn = function() {
        console.log('[FPS debug] Enabled');

        var $selector = App.Properties.selectorEngine;
        this.overlay = $selector.byId('fps-debug');
    };

    /**
     * Update the FPS on the Screen.
     *
     * @param Integer fps
     *
     * @return void
     */
    fn.prototype.update = function(fps) {
        this.overlay.innerHTML = "FPS: " + fps.toFixed(1) + "<br/>" + this.overlayText;
        this.overlayText = "";
    };

    return fn;

}));

/**
 * Prototype responsible to manage the game live cycle.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('GameCycle', 'engine', (function(fn) {
    'use strict';

    var FPS = App.Properties.fps;

    var GAME_CYCLE_DELAY = 1000/FPS;
    //var GAME_CYCLE_DELAY = 1000;

    var lastGameCycleTime = 0;
    var lastRenderCycleTime = 0;

    fn = function() {
        console.log('[GameCycle] Creating the Game Cycle');
    };

    /**
     * Set elements in game cycle and expose a method to init the cycle.
     *
     * @param App.engine.Player player
     * @param App.engine.MiniMap miniMap
     * @param App.engine.Raycasting raycasting
     *
     * @return Function init
     */
    fn.prototype.setElements = function(player, miniMap, screen, raycasting, statusBar, levelSound, gameEvents) {
        this.player = player;
        this.miniMap = miniMap;
        this.raycasting = raycasting;
        this.screen = screen;
        this.statusBar = statusBar;
        this.fpsDebug = new App.engine.FPSDebug();
        this.levelSound = levelSound;
        this.levelSound.play();
        this.gameEvents = gameEvents;
    };

    /**
     * Init the game cycle and call itself recursively.
     *
     * @return void
     */
    fn.prototype.init = function() {
        var now = new Date().getTime();

        // Time since last game logic
        var timeDelta = now - lastGameCycleTime;

        this.player.move(this.miniMap, this.screen, timeDelta, GAME_CYCLE_DELAY);

        this.screen.enemies.ai(timeDelta, this.player, this.miniMap, this.screen, GAME_CYCLE_DELAY);

        this.statusBar.update();

        var cycleDelay = GAME_CYCLE_DELAY;

        // The timer will likely not run that fast
        // due to the rendering cycle hogging the CPU
        // so figure out how much time was lost since last cycle
        if (timeDelta > cycleDelay) {
            cycleDelay = Math.max(1, cycleDelay - (timeDelta - cycleDelay));
        }

        var self = this;

        setTimeout(function() {
            self.init();
        }, cycleDelay);

        lastGameCycleTime = now;
    };

    /**
     * Init the render cycle and call itself recursively.
     *
     * @return void
     */
    fn.prototype.renderCycle = function() {
        this.miniMap.update(this.player);
        this.screen.sprites.clearObjects();
        this.raycasting.castRays();
        this.screen.sprites.renderObjects(this.player, this.raycasting.viewDist, this.screen.screenWidth, this.screen.screenHeight);
        this.screen.enemies.render(this.player, this.raycasting.viewDist, this.screen);

        // time since last rendering
        var now = new Date().getTime();
        var timeDelta = now - lastRenderCycleTime;
        var cycleDelay = GAME_CYCLE_DELAY;

        this.gameEvents.process(this.player, this.raycasting.viewDist, this.screen, this.miniMap, cycleDelay, timeDelta);

        if (timeDelta > cycleDelay) {
            cycleDelay = Math.max(1, cycleDelay - (timeDelta - cycleDelay));
        }

        lastRenderCycleTime = now;

        var self = this;

        setTimeout(function() {
            self.renderCycle();
        }, cycleDelay);

        this.fpsDebug.update(1000 / timeDelta);
    };

    return fn;

}));

/**
 * Prototype responsible to manager all game events.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('GameEvents', 'engine', (function(fn) {
    'use strict';

    fn = function($selector) {
        console.log('[GameEvents] Preparing to manager all game events');
        this.$selector = $selector;
        this.playerShoots = [];
        this.entity = new App.engine.Entity();
    };

    fn.prototype.process = function(player, viewDist, screen, miniMap, gameCycleDelay, timeDelta) {
        var self = this;

        if (this.playerShoots.length > 0) {
            for (var i=0; this.playerShoots.length > i; i++) {
                var shoot = this.playerShoots[i];

                var collided = _renderShoot(shoot, this.entity, player, viewDist, screen, miniMap, gameCycleDelay, timeDelta);

                if (collided) {
                    this.$selector.removeById(shoot.id);
                    delete this.playerShoots[i];
                }
            }
        }
    };

    fn.prototype.postEvent = function(eventObject) {
        var $screen = this.$selector.byId('screen');

        if (eventObject.type === 'PLAYER_SHOOT') {
            var shootData = {
                id: 'shoot-' + _idGenerator(),
                positionX: eventObject.x,
                positionY: eventObject.y,
                rotDeg: eventObject.rotDeg,
                gunType: eventObject.gunType,
                moveSpeed: eventObject.moveSpeed,
                speed: eventObject.speed
            };

            var shoot = new App.engine.Shoot(shootData, this.$selector);

            this.playerShoots.push(shoot);

            $screen.appendChild(shoot.img);
        }
    };

    function _renderShoot(shoot, entity, player, viewDist, screen, miniMap, gameCycleDelay, timeDelta) {
        if (shoot === undefined) {
            return false;
        }

        var sameX = player.x === shoot.x;
        var sameY = player.y === shoot.y;
        var sameRot = player.rotDeg === shoot.rotDeg;
        var img = shoot.img;

        var dx = shoot.x - player.x;
        var dy = shoot.y - player.y;

        var angle = Math.atan2(dy, dx) - player.rot;

        if (angle < -Math.PI) {
            angle += 2 * Math.PI;
        }

        if (angle >= Math.PI) {
            angle -= 2 * Math.PI;
        }

        var distSquared = 0;
        var dist = 0;
        var size = 0;
        var x = Math.tan(angle) * viewDist;
        var style = null;
        var oldStyles = null;
        var styleWidth = null;
        var styleTop = null;
        var styleLeft = null;
        var styleZIndex = 0;
        var styleDisplay = 'none';
        var styleClip = null;

        if (angle > -Math.PI * 0.5 && angle < Math.PI * 0.5) {
            distSquared = dx*dx + dy*dy;
            dist = Math.sqrt(distSquared);
            size = viewDist / (Math.cos(angle) * dist);

            if (size <= 0) {
                return false;
            }

            x = Math.tan(angle) * viewDist;

            style = img.style;
            oldStyles = shoot.oldStyles;

            // height is equal to the sprite size
            if (size !== oldStyles.height) {
                style.height =  size + 'px';
                oldStyles.height = size;
            }

            // width is equal to the sprite size times the total number of states
            styleWidth = size * shoot.totalStates;

            if (styleWidth !== oldStyles.width) {
                style.width = styleWidth + 'px';
                oldStyles.width = styleWidth;
            }

            // top position is halfway down the screen, minus half the sprite height
            styleTop = ((screen.screenHeight - size) / 2);
            if (styleTop != oldStyles.top) {
                style.top = styleTop + 'px';
                oldStyles.top = styleTop;
            }

            // place at x position, adjusted for sprite size and the current sprite state
            styleLeft = (screen.screenWidth / 2 + x - size/2 - size * shoot.state);
            if (styleLeft !== oldStyles.left) {
                style.left = styleLeft + 'px';
                oldStyles.left = styleLeft;
            }

            styleZIndex = -(distSquared * 1000) >> 0;
            if (styleZIndex !== oldStyles.zIndex) {
                style.zIndex = styleZIndex;
                oldStyles.zIndex = styleZIndex;
            }

            styleDisplay = 'block';
            if (styleDisplay !== oldStyles.display) {
                style.display = styleDisplay;
                oldStyles.display = styleDisplay;
            }

            styleClip = 'rect(0px, ' + (size*(shoot.state+1)) + 'px, ' + size + 'px, ' + (size*(shoot.state)) + 'px)';
            if (styleClip !== oldStyles.clip) {
                style.clip = styleClip;
                oldStyles.clip = styleClip;
            }
        } else {
            styleDisplay = 'none';
            if (styleDisplay !== shoot.oldStyles.display) {
                img.style.display = styleDisplay;
                shoot.oldStyles.display = styleDisplay;
            }
        }

        dx = player.x - shoot.x;
        dy = player.y - shoot.y;
        dist = Math.sqrt(dx*dx + dy*dy);

        angle = Math.atan2(dy, dx);
        shoot.state = Math.floor((new Date() % shoot.walkCycleTime) / (shoot.walkCycleTime / shoot.numWalkSprites)) + 1;

        var oldX = shoot.x;
        var oldY = shoot.y;

        var collided = false;

        entity.move(shoot, timeDelta, miniMap, screen, gameCycleDelay);

        if (shoot.x === oldX || shoot.y === oldY) {
            collided = true;
        }

        return collided;
    }

    function _idGenerator() {
        var length = 8;
        var timestamp = + new Date();

        var _getRandomInt = function( min, max ) {
            return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
        };

        var ts = timestamp.toString();
        var parts = ts.split( "" ).reverse();
        var id = "";

        for( var i = 0; i < length; ++i ) {
            var index = _getRandomInt( 0, parts.length - 1 );
            id += parts[index];
        }

        return id;
    }

    return fn;

}));

/**
 * Prototype responsible to build the minimap.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('MiniMap', 'engine', (function(fn) {
    'use strict';

    var MINI_MAP = App.Properties.miniMapElementId;
    var MINI_MAP_OBJECT = App.Properties.miniMapObjectElementId;
    var MINI_MAP_SCALE = App.Properties.miniMapScale;

    var mapWidth = 0;
    var mapHeight = 0;

    var WALL_BLOCKS_COLOR = App.Properties.miniMapBlocksColor;

    var DEBUG_MODE = App.Properties.miniMapDebugMode;
    var BLOCK_TO_DRAW_IN_DEBUG_MODE = 1;

    fn  = function(levelMap, $selector) {
        console.log('[MiniMap] Creating the mini map');
        this.level = levelMap;
        this.$selector = $selector;
    };

    /**
     * build the miniMap.
     *
     * @return void
     */
    fn.prototype.init = function() {
        mapWidth = this.level.map[0].length;
        mapHeight = this.level.map.length;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.miniMapScale = MINI_MAP_SCALE;

        _drawMiniMap(this.level, this.$selector);
    };


    /**
     * Redraw the miniMap and position player again.
     *
     * @param App.engine.Player player
     *
     * @return void
     */
    fn.prototype.update = function(player) {
        var miniMap = this.$selector.byId(MINI_MAP);

        this.miniMapObjects = this.$selector.byId(MINI_MAP_OBJECT);

        var objectCtx = this.miniMapObjects.getContext("2d");
        objectCtx.clearRect(0, 0, miniMap.width, miniMap.height);

        objectCtx.fillRect(
            // draw a dot at the current player position
            player.x * this.miniMapScale - 2,
            player.y * this.miniMapScale - 2,
            4, 4
        );

        objectCtx.beginPath();
        objectCtx.moveTo(player.x * this.miniMapScale, player.y * this.miniMapScale);
        objectCtx.lineTo(
            (player.x + Math.cos(player.rot) * 4) * this.miniMapScale,
            (player.y + Math.sin(player.rot) * 4) * this.miniMapScale
        );

        objectCtx.closePath();
        objectCtx.stroke();
    };

    function _drawMiniMap(level, $selector) {
        // draw the topdown view minimap
        var miniMap = $selector.byId(MINI_MAP);
        var miniMapObjects = $selector.byId(MINI_MAP_OBJECT);

        miniMap.width = mapWidth * MINI_MAP_SCALE; // resize the internal canvas dimensions
        miniMap.height = mapHeight * MINI_MAP_SCALE;
        miniMapObjects.width = miniMap.width;
        miniMapObjects.height = miniMap.height;


        var w = (mapWidth * MINI_MAP_SCALE) + "px";     // resize the canvas CSS dimensions
        var h = (mapHeight * MINI_MAP_SCALE) + "px";     // resize the canvas CSS dimensions

        miniMap.style.width = miniMapObjects.style.width = w;
        miniMap.style.height = miniMapObjects.style.height = h;

        // Loop through all blocks on the map
        var ctx = miniMap.getContext('2d');
        for (var y=0; y < mapHeight; y++) {
            for (var x=0; x < mapWidth; x++) {
                var wall = level.map[y][x];

                // If there is a wall block at this (x,y)…
                if (wall > 0) {
                    ctx.fillStyle = WALL_BLOCKS_COLOR;

                    // …Then draw a block on the minimap
                    _draw(ctx, x, y);
                }
            }
        }
    }

    function _draw(ctx, x, y) {
        if (DEBUG_MODE) {
            var speedPaint = 25;
            var timeToCall = BLOCK_TO_DRAW_IN_DEBUG_MODE * speedPaint;
            BLOCK_TO_DRAW_IN_DEBUG_MODE++;

            setTimeout(function() {
                _paint(ctx, x, y);
            }, timeToCall);
        } else {
            _paint(ctx, x, y);
        }
    }

    function _paint(ctx, x, y) {
        ctx.fillRect(
            x * MINI_MAP_SCALE,
            y * MINI_MAP_SCALE,
            MINI_MAP_SCALE, MINI_MAP_SCALE
        );
    }

    return fn;

}));

/**
 * Prototype responsible to manage the Player actions.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Player', 'engine', (function(fn) {
    'use strict';

    /**
     * Sets default attributes
     */
    fn = function(playerX, playerY) {
        console.log('[Player] Creating a Player');

        this.x = playerX;
        this.y = playerY;

        // The direction that the player is turning,
        // either -1 for left or 1 for right
        this.dir = 0;

        // The current angle of rotation
        this.rot = 0;

        // Add rotation if player is rotating (player.dir != 0)
        this.rotDeg = 0;

        // Is the playing moving forward (speed = 1)
        // or backwards (speed = -1).
        this.speed = 0;

        this.moveSpeed = App.Properties.playerSpeed;

        this.rotSpeed = App.Properties.playerRotateSpeed;

        this.setControls();

        this.entity = new App.engine.Entity();

        this.shootListener();
    };

    /**
     * Move the player.
     *
     * @param App.engine.MiniMap miniMap
     * @param Integer timeDelta
     * @param Integer gameCycleDelay
     *
     * @return void;
     */
    fn.prototype.move = function(miniMap, screen, timeDelta, gameCycleDelay) {
        this.entity.move(this, timeDelta, miniMap, screen, gameCycleDelay);
    };

    /**
     * Bind the key events.
     *
     * @return void
     */
    fn.prototype.setControls = function() {
        var controls = new App.engine.Controls();

        controls.keyboardMap(this);
    };

    fn.prototype.shootListener = function() {
        var self = this;
        document.addEventListener('shoot', function (e) {
            self.shoot(self);
        }, false);
    };

    fn.prototype.shoot = function(self) {
        var shoot = { 
            type: 'PLAYER_SHOOT',
            gunType: 'pistol',
            x: self.x,
            y: self.y,
            rotDeg: self.rotDeg,
            moveSpeed: 0.100,
            speed: 10
        };

        document.gameEvents.postEvent(shoot);
    };

    return fn;

}));

/**
 * Prototype responsible to manage the Raycasting.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Raycasting', 'engine', (function(fn) {
    'use strict';

    var fov         = 60 * Math.PI / 180,
        twoPI       = Math.PI * 2;

    /**
     * Contructor
     *
     * @param App.engine.Player player
     * @param App.engine.MiniMap miniMap
     * @param App.engine.Screen screen
     *
     */
    fn = function(player, miniMap, screen) {
        this.player = player;
        this.miniMap = miniMap;
        this.screen = screen;

        this.numRays     = Math.ceil(this.screen.screenWidth / this.screen.stripWidth);
        this.viewDist    = (this.screen.screenWidth / 2) / Math.tan((fov / 2));
    };

    /**
     * Launches the rays.
     *
     * @return void
     */
    fn.prototype.castRays = function() {
        var stripIdx = 0;

        for (var i=0; i < this.numRays; i++) {
            // where on the screen does ray go through?
            var rayScreenPos = (-this.numRays / 2 + i) * this.screen.stripWidth;

            // the distance from the viewer to the point on the screen, simply Pythagoras.
            var rayViewDist = Math.sqrt(rayScreenPos * rayScreenPos + this.viewDist * this.viewDist);

            // the angle of the ray, relative to the viewing direction.
            // right triangle: a = sin(A) * c
            var rayAngle = Math.asin(rayScreenPos / rayViewDist);

            _castSingleRay(this.screen, this.player, this.miniMap, this.viewDist, rayAngle, stripIdx++);
        }
    };

    function _castSingleRay(screen, player, miniMap, viewDist, rayAngle, stripIdx) {
        rayAngle = player.rot + rayAngle; // add the players viewing direction to get the angle in world space

        // first make sure the angle is between 0 and 360 degrees
        rayAngle %= twoPI;
        if (rayAngle < 0) {
            rayAngle += twoPI;
        }

        // moving right/left? up/down? Determined by which quadrant the angle is in.
        var right = (rayAngle > twoPI * 0.75 || rayAngle < twoPI * 0.25);
        var up = (rayAngle < 0 || rayAngle > Math.PI);

        var wallType = 0;

        // only do these once
        var angleSin = Math.sin(rayAngle);
        var angleCos = Math.cos(rayAngle);

        var dist = 0;   // the distance to the block we hit
        var xHit = 0;   // the x and y coord of where the ray hit the block
        var yHit = 0;
        var xWallHit = 0;
        var yWallHit = 0;

        var textureX;   // the x-coord on the texture of the block, ie. what part of the texture are we going to render
        var wallX;  // the (x,y) map coords of the block
        var wallY;

        var wallIsShaded = false;

        var wallIsHorizontal = false;

        // first check against the vertical map/wall lines
        // we do this by moving to the right or left edge of the block we're standing in
        // and then moving in 1 map unit steps horizontally. The amount we have to move vertically
        // is determined by the slope of the ray, which is simply defined as sin(angle) / cos(angle).

        var slope = angleSin / angleCos;    // the slope of the straight line made by the ray
        var dXVer = right ? 1 : -1;    // we move either 1 map unit to the left or right
        var dYVer = dXVer * slope;        // how much to move up or down

        var x = right ? Math.ceil(player.x) : Math.floor(player.x); // starting horizontal position, at one of the edges of the current map block
        var y = player.y + (x - player.x) * slope;          // starting vertical position. We add the small horizontal step we just made, multiplied by the slope.
        var distX = 0;
        var distY = 0;

        while (x >= 0 && x < miniMap.mapWidth && y >= 0 && y < miniMap.mapHeight) {
            wallX = Math.floor(x + (right ? 0 : -1));
            wallY = Math.floor(y);

            if (screen.sprites.spriteMap[wallY][wallX] && !screen.sprites.spriteMap[wallY][wallX].visible) {
                screen.sprites.spriteMap[wallY][wallX].visible = true;
                screen.sprites.visibleSprites.push(screen.sprites.spriteMap[wallY][wallX]);
            }

            // is this point inside a wall block?
            if (miniMap.level.map[wallY][wallX] > 0) {

                distX = x - player.x;
                distY = y - player.y;
                dist = (distX * distX) + (distY * distY);   // the distance from the player to this point, squared.

                wallType = miniMap.level.map[wallY][wallX]; // we'll remember the type of wall we hit for later
                textureX = y % 1;   // where exactly are we on the wall? textureX is the x coordinate on the texture that we'll use when texturing the wall.
                if (!right) {
                    textureX = 1 - textureX; // if we're looking to the left side of the map, the texture should be reversed
                }

                xHit = x;   // save the coordinates of the hit. We only really use these to draw the rays on minimap.
                yHit = y;
                xWallHit = wallX;
                yWallHit = wallY;

                // make horizontal walls shaded
                wallIsShaded = true;

                wallIsHorizontal = true;

                break;
            }
            x += dXVer;
            y += dYVer;
        }


        // now check against horizontal lines. It's basically the same, just "turned around".
        // the only difference here is that once we hit a map block,
        // we check if there we also found one in the earlier, vertical run. We'll know that if dist != 0.
        // If so, we only register this hit if this distance is smaller.

        slope = angleCos / angleSin;    // the slope of the straight line made by the ray
        var dYHor = up ? -1 : 1;
        var dXHor = dYHor * slope;
        y = up ? Math.floor(player.y) : Math.ceil(player.y);
        x = player.x + (y - player.y) * slope;

        while (x >= 0 && x < miniMap.mapWidth && y >= 0 && y < miniMap.mapHeight) {
            wallY = Math.floor(y + (up ? -1 : 0));
            wallX = Math.floor(x);

            if (screen.sprites.spriteMap[wallY][wallX] && !screen.sprites.spriteMap[wallY][wallX].visible) {
                screen.sprites.spriteMap[wallY][wallX].visible = true;
                screen.sprites.visibleSprites.push(screen.sprites.spriteMap[wallY][wallX]);
            }

            if (miniMap.level.map[wallY][wallX] > 0) {
                distX = x - player.x;
                distY = y - player.y;
                var blockDist = (distX * distX) + (distY * distY);

                if (!dist || blockDist < dist) {
                    dist = blockDist;
                    xHit = x;
                    yHit = y;
                    xWallHit = wallX;
                    yWallHit = wallY;

                    wallType = miniMap.level.map[wallY][wallX];
                    textureX = x % 1;
                    if (up) {
                        textureX = 1 - textureX;
                    }

                    wallIsShaded = false;
                }
                break;
            }
            x += dXHor;
            y += dYHor;
        }

        if (dist) {
            _drawRay(xHit, yHit, miniMap, player);
            _drawScreen(screen, stripIdx, dist, player, viewDist, rayAngle, wallType, textureX, miniMap.level, wallIsShaded, xWallHit, yWallHit);
        }

    }

    function _drawRay(rayX, rayY, miniMap, player) {
        var objectCtx = miniMap.miniMapObjects.getContext("2d");

        objectCtx.strokeStyle = App.Properties.raycastingColor;
        objectCtx.lineWidth = 0.5;
        objectCtx.beginPath();
        objectCtx.moveTo(player.x * miniMap.miniMapScale, player.y * miniMap.miniMapScale);
        objectCtx.lineTo(
            rayX * miniMap.miniMapScale,
            rayY * miniMap.miniMapScale
        );
        objectCtx.closePath();
        objectCtx.stroke();
    }

    function _drawScreen(screen, stripIdx, dist, player, viewDist, rayAngle, wallType, textureX, level, wallIsShaded, xWallHit, yWallHit) {
        var strip = screen.screenStrips[stripIdx];

        dist = Math.sqrt(dist);

        // use perpendicular distance to adjust for fish eye
        // distorted_dist = correct_dist / cos(relative_angle_of_ray)
        dist = dist * Math.cos(player.rot - rayAngle);

        //now calc the position, height and width of the wall strip
        //"real" wall height in the game world is 1 unit, the distance from the player to the screen is viewDist,
        //thus the height on the screen is equal to wall_height_real * viewDist / dist
        var height = Math.round(viewDist / dist);

        //width is the same, but we have to stretch the texture to a factor of stripWidth to make it fill the strip correctly
        var width = height * screen.stripWidth;

        //top placement is easy since everything is centered on the x-axis, so we simply move
        //it half way down the screen and then half the wall height back up.
        var top = Math.round((screen.screenHeight - height) / 2);

        var imgTop = 0;

        var styleHeight;

        var mapTextures = level.mapTextures;

        var styleSrc = App.Properties.texturesPath;

        var texturesLength = mapTextures.length;

        for (var i=0; texturesLength > i; i++) {
            var current = mapTextures[i];

            if (current.id === (wallType)) {
                if (current.texture) {
                    styleSrc = styleSrc + current.texture;
                    break;
                }
            }
        }

        strip.src = styleSrc;
        strip.oldStyles.src = styleSrc;

        styleHeight = height;

        if (strip.oldStyles.height !== styleHeight) {
            strip.style.height = styleHeight + "px";
            strip.oldStyles.height = styleHeight;
        }

        var texX = Math.round(textureX * width);
        if (texX > width - screen.stripWidth) {
            texX = width - screen.stripWidth;
        }

        texX += (wallIsShaded ? width : 0);

        var styleWidth = Math.floor(width * 2);
        if (strip.oldStyles.width !== styleWidth) {
            strip.style.width = styleWidth +"px";
            strip.oldStyles.width = styleWidth;
        }

        var styleTop = top - imgTop;
        if (strip.oldStyles.top !== styleTop) {
            strip.style.top = styleTop + "px";
            strip.oldStyles.top = styleTop;
        }

        var styleLeft = (stripIdx * screen.stripWidth) - texX;
        if (strip.oldStyles.left !== styleLeft) {
            strip.style.left = styleLeft + "px";
            strip.oldStyles.left = styleLeft;
        }

        var styleClip = 'rect(' + imgTop + 'px, ' + (texX + screen.stripWidth)  + 'px, ' + (imgTop + height) + 'px, ' + texX + 'px)';
        if (strip.oldStyles.clip !== styleClip) {
            strip.style.clip = styleClip;
            strip.oldStyles.clip = styleClip;
        }

        var dwx = xWallHit - player.x;
        var dwy = yWallHit - player.y;

        var wallDist = (dwx * dwx) + (dwy * dwy);
        strip.style.zIndex = -Math.floor(wallDist * 1000);
    }

    return fn;

}));

/**
 * Prototype responsible to build the screen.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Screen', 'engine', (function(fn) {
    'use strict';


    fn = function($selector) {
        console.log('[Screen] Creating the screen');
        this.$selector = $selector;

        this.screenWidth = App.Properties.screenWidth;
        this.screenHeight = App.Properties.screenHeight;
        this.screenStrips = [];
        this.stripWidth = App.Properties.stripWidth;
    };

    /**
     * Init the screen and determine the size of strip.
     *
     * @return void
     */
    fn.prototype.init = function() {
        var screen = this.$selector.byId('screen');

        for (var i=0; i < this.screenWidth; i += this.stripWidth) {
            var strip = this.$selector.createTag('img');

            strip.style.position = 'absolute';
            strip.style.left = '0px';
            strip.style.height = '0px';

            strip.oldStyles = {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                clip: '',
                src: ''
            };

            this.screenStrips.push(strip);
            screen.appendChild(strip);
        }
    };

    /**
     * Add sprites on the screen.
     *
     * @param App.engine.Sprites
     *
     * @return void
     */
    fn.prototype.addSprites = function(sprites) {
        this.sprites = sprites;
    };

    /**
     * Add enemies on the screen.
     *
     * @param App.engine.Enemies
     *
     * @return void
     */
    fn.prototype.addEnemies = function(enemies) {
        this.enemies = enemies;
    };

    return fn;

}));

/**
 * Prototype responsible to manager a single shoot int the space.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Shoot', 'engine', (function(fn) {
    'use strict';

    var SPRITE_PATH = App.Properties.spritesPath + 'shoot/';

    fn = function(shoot, $selector) {
        this.id = shoot.id;
        this.cssRoot = 'shoot';
        this.x = shoot.positionX;
        this.y = shoot.positionY;
        this.type = shoot.gunType;
        this.state = 0;
        this.rot = 0;
        this.rotDeg = shoot.rotDeg;
        this.dir = 0;
        this.speed = shoot.speed;
        this.moveSpeed = shoot.moveSpeed;
        this.rotSpeed = 3;
        this.totalStates = 3;
        this.walkCycleTime = 250;
        this.numWalkSprites = 2;

        var img = $selector.createTag('img');
        img.id = this.id;
        img.src = SPRITE_PATH + 'shoot_' + this.type + '.png';
        img.style.display = 'none';
        img.style.position = 'absolute';
        img.classList.add(this.cssRoot);

        this.oldStyles = _getOldStyle();
        this.img = img;

        return this;
    };

    function _getOldStyle() {
        return {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            clip: "",
            display: "none",
            zIndex: 0
        };
    }

    return fn;

}));

/**
 * Prototype responsible to play sound in the game.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Sound', 'engine', (function(fn) {
    'use strict';

    var elemId = 'sounds';

    fn = function($selector) {
        this.$ = $selector;
        return this;
    };

    fn.prototype.init = function(id, soundUrl, autoPlay, repeat) {
        this.audio = this.$.createTag('audio');
        this.audio.setAttribute("id", id);
        this.audio.autoplay = autoPlay;
        this.audio.loop = repeat;

        var source = this.$.createTag('source');
        source.setAttribute('src', soundUrl + '.wav');
        source.setAttribute('type', 'audio/wav');

        this.audio.appendChild(source);

        var soundsPanel = this.$.byId(elemId);

        soundsPanel.appendChild(this.audio);
    };

    fn.prototype.play = function() {
        this.audio.play();
    };

    fn.prototype.pause = function() {
        this.audio.pause();
    };

    fn.prototype.reset = function() {
        this.audio.currentTime = 0;
    };

    return fn;

}));

/**
 * Prototype responsible to manager sprites in the game.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Sprites', 'engine', (function(fn) {
    'use strict';

    fn = function($selector) {
        console.log('[Sprite] Adding sprites in the game');

        this.$selector = $selector;

        this.spriteMap = [];
        this.visibleSprites = [];
        this.oldVisibleSprites = [];
    };

    /**
     * Put sprites on screen.
     *
     * @param Array map
     * @param Object objs
     *
     * @return void
     */
    fn.prototype.init = function(map, objs) {
        var mapLength = map.length;

        for (var y=0; y < mapLength; y++) {
            this.spriteMap[y] = [];
        }

        var screen = this.$selector.byId('screen');
        var objsLength = objs.length;

        for (var i=0; i < objsLength; i++) {
            var sprite = objs[i];

            var img = this.$selector.createTag('img');

            img.src = App.Properties.spritesPath + sprite.img;
            img.style.display = "none";
            img.style.position = "absolute";

            sprite.visible = false;
            sprite.block = sprite.block;
            sprite.img = img;

            this.spriteMap[sprite.positionY][sprite.positionX] = sprite;

            screen.appendChild(img);
        }
    };

    /**
     * Clean all sprites from screen.
     *
     * @return void
     */
    fn.prototype.clearObjects = function() {
       // clear the visible sprites array but keep a copy in oldVisibleSprites for later.
       // also mark all the sprites as not visible so they can be added to visibleSprites again during raycasting.
       this.oldVisibleSprites = [];

       for (var i=0; i < this.visibleSprites.length; i++) {
           var sprite = this.visibleSprites[i];
           this.oldVisibleSprites[i] = sprite;
           sprite.visible = false;
       }
       this.visibleSprites = [];
    };

    /**
     * Render the sprites given a player position and view distance.
     *
     * @param App.engine.Player
     * @param Float viewDist
     * @param Float screenWidth
     * @param Float screenHeight
     *
     * @return void
     */
    fn.prototype.renderObjects = function(player, viewDist, screenWidth, screenHeight) {
        var sprite = '';

        for (var i=0; i < this.visibleSprites.length; i++) {
            sprite = this.visibleSprites[i];
            var img = sprite.img;
            img.style.display = "block";

            // translate position to viewer space
            var dx = sprite.positionX + 0.5 - player.x;
            var dy = sprite.positionY + 0.5 - player.y;

            // distance to sprite
            var dist = Math.sqrt(dx*dx + dy*dy);

            // sprite angle relative to viewing angle
            var spriteAngle = Math.atan2(dy, dx) - player.rot;

            // size of the sprite
            var size = viewDist / (Math.cos(spriteAngle) * dist);

            if (size <= 0) continue;

            // x-position on screen
            var x = Math.tan(spriteAngle) * viewDist;

            img.style.left = (screenWidth/2 + x - size/2) + "px";

            // y is constant since we keep all sprites at the same height and vertical position
            img.style.top = ((screenHeight-size)/2)+"px";

            var dbx = sprite.positionX - player.x;
            var dby = sprite.positionY - player.y;

            img.style.width = size + "px";
            img.style.height =  size + "px";

            var blockDist = dbx*dbx + dby*dby;
            img.style.zIndex = -Math.floor(blockDist*1000);
        }

        // hide the sprites that are no longer visible
        for (i=0; i < this.oldVisibleSprites.length; i++) {
            sprite = this.oldVisibleSprites[i];

            if (this.visibleSprites.indexOf(sprite) < 0) {
                sprite.visible = false;
                sprite.img.style.display = "none";
            }
        }
    };


    return fn;

}));

/**
 * Prototype responsible to manage the status bar of hero..
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('StatusBar', 'engine', (function(fn) {
    'use strict';

    var STATUS_BAR_IMG = 'statusbar.jpg',
        SPRITE_PATH = App.Properties.statusbarPath;


    fn = function($selector) {
        console.log('[StatusBar] Creating the status bar');
        this.$selector = $selector;
        this.weapon = new App.engine.Weapon($selector);
        this.reactions = new App.engine.FaceReaction($selector);
        this.init();
    };

    fn.prototype.init = function() {
        var $screen = this.$selector.byId('screen');
        var statusBar = _createStatusBarImage(this.$selector);

        $screen.appendChild(this.weapon.default());
        $screen.appendChild(statusBar);
        $screen.appendChild(this.reactions.faces());
    };

    fn.prototype.update = function() {

    };

    function _createStatusBarImage($selector) {
        var img = $selector.createTag('img');
        img.src = SPRITE_PATH + STATUS_BAR_IMG;
        img.id = 'status-bar';
        return img;
    }

    return fn;

}));

/**
 * Prototype responsible to manage the weapon instance for the game.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Weapon', 'engine', (function(fn) {
    'use strict';

    var Pistol;

    fn = function($) {
        console.log('[Weapon] Creating the weapon');

        Pistol = App.engine.weapons.Pistol;
        this.$ = $;
        this.listeningShootEvent();
    };

    fn.prototype.current = function() {
        return this.current;
    };

    fn.prototype.default = function() {
        var pistol = new Pistol(this.$);
        pistol.init();
        this.current = pistol;
        return pistol.img;
    };

    fn.prototype.listeningShootEvent = function() {
        var self = this;
        document.addEventListener('shoot', function (e) {
            self.current.shoot();
        }, false);
    };

    return fn;

}));

/**
 * Prototype responsible to manager a enemy type of guard.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Guard', 'engine/enemies', (function(fn) {
    'use strict';

    var WALK_FRAMES = 'guard-walk.png',
        SPRITE_PATH = App.Properties.spritesPath + 'guard/';

    fn = function(enemy, $selector) {
        console.log('[Guard] Add guard');

        this.cssRoot = 'guard';
        this.x = enemy.positionX;
        this.y = enemy.positionY;
        this.state = 0;
        this.rot = 0;
        this.rotDeg = 0;
        this.dir = 0;
        this.speed = 0;
        this.moveSpeed = 0.05;
        this.rotSpeed = 3;
        this.totalStates = 5;
        this.walkCycleTime = 1000;
        this.numWalkSprites = 4;

        var img = $selector.createTag('img');
        img.src = SPRITE_PATH + WALK_FRAMES;
        img.style.display = 'none';
        img.style.position = 'absolute';
        img.classList.add(this.cssRoot);

        this.oldStyles = _getOldStyle();
        this.img = img;

        return this;
    };

    function _getOldStyle() {
        return {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            clip: "",
            display: "none",
            zIndex: 0
        };
    }

    return fn;

}));

/**
 * Prototype responsible to represent the pistol.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Pistol', 'engine/weapons', (function(fn) {
    'use strict';

    var SPRITE_PATH = App.Properties.statusbarPath + 'pistol/',
        SOUND_PATH = App.Properties.soundPath + 'weapons/',
        FRAME_TRANSITION_TIME = 50,
        remainingFrames = 0;

    fn = function($) {
        this.$ = $;
    };

    fn.prototype.init = function() {
        this.soundPistolShooting = new App.engine.Sound(this.$);
        this.soundPistolShooting.init('pistol', SOUND_PATH + 'pistol', false, false);

        this.frames = [
            'pistol_0.png',
            'pistol_4.png',
            'pistol_1.png',
            'pistol_2.png',
            'pistol_3.png',
            'pistol_1.png',
            'pistol_4.png',
            'pistol_0.png'
        ];

        _preLoadImages(this.frames);
        _rest(this);
    };

    fn.prototype.shoot = function() {
        if (remainingFrames === 0) {
            var self = this;
            var size = self.frames.length;
            remainingFrames = size;
            for (var i = 0; i < size; i++) {
                _animate(self, self.img, self.frames[i], FRAME_TRANSITION_TIME * i);
            }
        }
    };

    function _preLoadImages(frames) {
        var size = frames.length;
        for (var i = 0; i < size; i++) {
            var image = new Image();
            image.src = SPRITE_PATH + frames[i];
        }
    }

    function _animate(self, img, frame, time) {
        setTimeout(function() {
            img.src = SPRITE_PATH + frame;
            if (remainingFrames == 2) {
                self.soundPistolShooting.reset();
                self.soundPistolShooting.play();
            }

            if (remainingFrames > 0) {
                remainingFrames--;
            }
        }, time);
    }

    function _rest(self) {
        var img = self.$.createTag('img');
        img.src = SPRITE_PATH + 'pistol_0.png';
        img.id = 'weapon';
        img.className = 'pistol';
        self.img = img;
    }

    return fn;

}));

App.maps.firstLevel = {

    playerX: 10.5,
    playerY: 6.5,

    map: [
            [1,1,1,1,1,1,1,1,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,3,0,3,0,0,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1,0,0,0,0,0,0,0,0,1],
            [1,0,0,3,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,1,1,1],
            [1,0,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,3,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
            [1,0,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
            [1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,0,0,0,0,3,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,4,0,0,4,2,0,2,2,2,2,2,2,2,2,0,2,4,4,0,0,4,0,0,0,0,0,0,0,1],
            [1,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,1],
            [1,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,1],
            [1,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,1],
            [1,0,0,4,3,3,4,2,2,2,2,2,2,2,2,2,2,2,2,2,4,3,3,4,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],

    mapTextures: [
        {
            id: 1,
            texture: 'walls_1.png'
        },
        {
            id: 2,
            texture: 'walls_2.png'
        },
        {
            id: 3,
            texture: 'walls_3.png'
        },
        {
            id: 4,
            texture: 'walls_4.png'
        },
        {
            id: 5,
            texture: 'walls_5.png'
        }
    ],

    objects: [
        {
            img: 'lamp.png',
            positionX: 10,
            positionY: 7,
            block: false
        },
        {
            img: 'lamp.png',
            positionX: 15,
            positionY: 7,
            block: false
        },
        {
            img: 'tablechairs.png',
            positionX: 10,
            positionY: 18,
            block: true
        },
        {
            img: 'tablechairs.png',
            positionX: 15,
            positionY: 18,
            block: true
        },
        {
            img: 'plantgreen.png',
            positionX: 10,
            positionY: 11,
            block: true
        },
        {
            img: 'plantgreen.png',
            positionX: 15,
            positionY: 11,
            block: true
        }
    ],

    enemies: [
        {
            type: 'guard',
            positionX: 20,
            positionY: 9
        },
        {
            type: 'guard',
            positionX: 18,
            positionY: 6
        }
    ],

    backgroundSound: {
        id: 'sound-level-01',
        track: 'level_01',
        type: 'wav'
    }

};

/**
 * Prototype responsible to build the stage.
 *
 * @param fn contextFunction
 * @param $ selector engine
 * @param tmpl template engine
 *
 * @author madureira
 *
 */
App.define('Stage', 'views/stage', (function(fn, $, tmpl) {
    'use strict';

    var MiniMap = App.engine.MiniMap,
        Screen = App.engine.Screen,
        GameCycle = App.engine.GameCycle,
        Player = App.engine.Player,
        Raycasting = App.engine.Raycasting,
        Sprites = App.engine.Sprites,
        Enemies = App.engine.Enemies,
        StatusBar = App.engine.StatusBar,
        Sound = App.engine.Sound,
        GameEvents = App.engine.GameEvents,
        BG_SOUND_PATH = App.Properties.soundPath + 'levels/';

    /**
     * Build the stage.
     *
     * @return void
     */
    fn.prototype.init = function() {
        var body;
        if (!App.Helpful.isNodeWebkit()) {
            body = $.getByTag('body');
            body.className = 'in-browser';
        }
        var $stage = $.byId(App.container);
        _buildHTMLElements($stage);
        _initGameCycle();
    };

    function _buildHTMLElements($stage) {
        $stage.innerHTML += tmpl.screen();
        $stage.innerHTML += tmpl.mini_map();
        $stage.innerHTML += tmpl.fps_debug();
    }

    function _initGameCycle() {
        var levelMap = App.maps.firstLevel;
        var miniMap = new MiniMap(levelMap, $);
        miniMap.init();

        var screen = new Screen($);
        screen.init();

        var sprites = new Sprites($);
        sprites.init(levelMap.map, levelMap.objects);

        var enemies = new Enemies($);
        enemies.init(levelMap.enemies);

        screen.addSprites(sprites);
        screen.addEnemies(enemies);

        var gameCycle = new GameCycle();
        var player = new Player(levelMap.playerX, levelMap.playerY);

        var raycasting = new Raycasting(player, miniMap, screen);

        var statusBar = new StatusBar($);

        var bgSound = levelMap.backgroundSound;
        var levelSound = new Sound($);
        levelSound.init(bgSound.id, BG_SOUND_PATH + bgSound.track, true, true);

        var gameEvents = new GameEvents($);

        // set game events to be accessed globaly
        document.gameEvents = gameEvents;

        gameCycle.setElements(player, miniMap, screen, raycasting, statusBar, levelSound, gameEvents);
        gameCycle.init();
        gameCycle.renderCycle();
    }

    return fn;

}));

document.addEventListener("DOMContentLoaded", function(event) {
    var stageView = new App.views.stage.Stage();
    stageView.init();
});

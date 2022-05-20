window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || void 0;
    }
    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i, listeners;
      this._events || (this._events = {});
      if ("error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) throw er;
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
        err.context = er;
        throw err;
      }
      handler = this._events[type];
      if (isUndefined(handler)) return false;
      if (isFunction(handler)) switch (arguments.length) {
       case 1:
        handler.call(this);
        break;

       case 2:
        handler.call(this, arguments[1]);
        break;

       case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

       default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      var m;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      this._events || (this._events = {});
      this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener;
      if (isObject(this._events[type]) && !this._events[type].warned) {
        m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners;
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          "function" === typeof console.trace && console.trace();
        }
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      var fired = false;
      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }
      g.listener = listener;
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, position, length, i;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[type]) return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        this._events.removeListener && this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
        if (position < 0) return this;
        if (1 === list.length) {
          list.length = 0;
          delete this._events[type];
        } else list.splice(position, 1);
        this._events.removeListener && this.emit("removeListener", type, listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var key, listeners;
      if (!this._events) return this;
      if (!this._events.removeListener) {
        0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type];
        return this;
      }
      if (0 === arguments.length) {
        for (key in this._events) {
          if ("removeListener" === key) continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }
      listeners = this._events[type];
      if (isFunction(listeners)) this.removeListener(type, listeners); else if (listeners) while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      delete this._events[type];
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var ret;
      ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
      return ret;
    };
    EventEmitter.prototype.listenerCount = function(type) {
      if (this._events) {
        var evlistener = this._events[type];
        if (isFunction(evlistener)) return 1;
        if (evlistener) return evlistener.length;
      }
      return 0;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return emitter.listenerCount(type);
    };
    function isFunction(arg) {
      return "function" === typeof arg;
    }
    function isNumber(arg) {
      return "number" === typeof arg;
    }
    function isObject(arg) {
      return "object" === typeof arg && null !== arg;
    }
    function isUndefined(arg) {
      return void 0 === arg;
    }
  }, {} ],
  User: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "32649Kmyi1BY7pgNcJaEbe9", "User");
    "use strict";
    var User = cc.Class({
      name: null,
      score: null
    });
    module.exports = User;
    cc._RF.pop();
  }, {} ],
  card: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cb4bcixDeRGp7yvJ31dhztz", "card");
    "use strict";
    var Emitter = require("mEmitter");
    var COLOR = require("color");
    cc.Class({
      extends: cc.Component,
      properties: {
        lblCard: {
          default: null,
          type: cc.Label
        },
        _handleMoveUp: null,
        _handleMoveDown: null,
        _handleMoveLeft: null,
        _handleMoveRight: null,
        _handleDoneRandom: null,
        _action: null
      },
      onLoad: function onLoad() {
        this._handleMoveUp = this.handleMoveUp.bind(this);
        this._handleMoveDown = this.handleMoveDown.bind(this);
        this._handleMoveLeft = this.handleMoveLeft.bind(this);
        this._handleMoveRight = this.handleMoveRight.bind(this);
        this._handleDoneRandom = this.handleDoneRandom.bind(this);
        Emitter.instance.registerEvent("moveUp", this._handleMoveUp);
        Emitter.instance.registerEvent("moveDown", this._handleMoveDown);
        Emitter.instance.registerEvent("moveLeft", this._handleMoveLeft);
        Emitter.instance.registerEvent("moveRight", this._handleMoveRight);
      },
      setColorNumber: function setColorNumber(number) {
        if (0 == number) {
          this.lblCard.node.active = false;
          this.node.color = COLOR[0];
        } else {
          this.lblCard.string = number;
          this.lblCard.node.active = true;
          switch (number) {
           case 2:
            this.node.color = COLOR[2];
            break;

           case 4:
            this.node.color = COLOR[4];
            break;

           case 8:
            this.node.color = COLOR[8];
            break;

           case 16:
            this.node.color = COLOR[16];
            break;

           case 32:
            this.node.color = COLOR[32];
            break;

           case 64:
            this.node.color = COLOR[64];
            break;

           case 128:
            this.node.color = COLOR[128];
            break;

           case 256:
            this.node.color = COLOR[256];
            break;

           case 512:
            this.node.color = COLOR[512];
            break;

           case 1024:
            this.node.color = COLOR[1024];
            break;

           case 2048:
            this.node.color = COLOR[2048];
          }
        }
      },
      setColor: function setColor(number) {
        switch (number) {
         case 0:
          this.node.color = COLOR[0];
          break;

         case 2:
          this.node.color = COLOR[2];
          break;

         case 4:
          this.node.color = COLOR[4];
          break;

         case 8:
          this.node.color = COLOR[8];
          break;

         case 16:
          this.node.color = COLOR[16];
          break;

         case 32:
          this.node.color = COLOR[32];
          break;

         case 64:
          this.node.color = COLOR[64];
          break;

         case 128:
          this.node.color = COLOR[128];
          break;

         case 256:
          this.node.color = COLOR[256];
          break;

         case 512:
          this.node.color = COLOR[512];
          break;

         case 1024:
          this.node.color = COLOR[1024];
          break;

         case 2048:
          this.node.color = COLOR[2048];
        }
      },
      handleDoneRandom: function handleDoneRandom(objCard) {
        if (objCard.x == this.node.x && objCard.y == this.node.y) {
          this.node.opacity = 255;
          this.node.children[0].getComponent("cc.Label").string = 2;
          this.node.color = new cc.color(235, 224, 213, 255);
          cc.log(objCard);
        }
      },
      move: function move(x, y) {},
      handleMoveUp: function handleMoveUp() {
        this.move(0, 150);
      },
      handleMoveDown: function handleMoveDown() {
        this.move(0, -150);
      },
      handleMoveLeft: function handleMoveLeft() {
        this.move(-150, 0);
      },
      handleMoveRight: function handleMoveRight() {
        this.move(150, 0);
      },
      animMerge: function animMerge() {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    color: "color",
    mEmitter: "mEmitter"
  } ],
  color: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ae1182/+G9GD52Yva923Y7S", "color");
    "use strict";
    var COLOR = [];
    COLOR[0] = cc.color(245, 245, 220, 255);
    COLOR[2] = cc.color(235, 224, 213, 255);
    COLOR[4] = cc.color(234, 219, 193, 255);
    COLOR[8] = cc.color(240, 167, 110, 255);
    COLOR[16] = cc.color(244, 138, 89, 255);
    COLOR[32] = cc.color(245, 112, 85, 255);
    COLOR[64] = cc.color(245, 83, 52, 255);
    COLOR[128] = cc.color(234, 200, 103, 255);
    COLOR[256] = cc.color(234, 197, 87, 255);
    COLOR[512] = cc.color(234, 192, 71, 255);
    COLOR[1024] = cc.color(146, 208, 80, 255);
    COLOR[2048] = cc.color(0, 176, 240, 255);
    module.exports = COLOR;
    cc._RF.pop();
  }, {} ],
  controller: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dc122IXeP9Nl7HSkZ6UWyCu", "controller");
    "use strict";
    var emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        menuStart: cc.Node,
        gameOver: cc.Node,
        menuPlaying: cc.Node,
        menuRank: cc.Node,
        listBlock: cc.Node,
        title: cc.Node,
        _playingState: null,
        _gameOverState: null,
        _defaultState: null,
        _titleState: null,
        _rankState: null
      },
      onLoad: function onLoad() {
        emitter.instance = new emitter();
        this._playingState = this.onPlaying.bind(this);
        this._gameOverState = this.onGameOver.bind(this);
        this._defaultState = this.onDefault.bind(this);
        this._rankState = this.onRank.bind(this);
        emitter.instance.registerEvent("PLAYING", this._playingState);
        emitter.instance.registerEvent("GAMEOVER", this._gameOverState);
        emitter.instance.registerEvent("DEFAULT", this._defaultState);
        emitter.instance.registerEvent("RANK", this._rankState);
      },
      start: function start() {
        this.offAll();
        this.onDefault();
      },
      offAll: function offAll() {
        this.menuStart.active = false;
        this.title.active = false;
        this.gameOver.active = false;
        this.menuPlaying.active = false;
        this.menuRank.active = false;
        this.listBlock.active = false;
      },
      onRank: function onRank(data) {
        this.doClose(data).start();
        cc.delayTime(.5);
        this.doShow(this.menuRank).start();
      },
      onDefault: function onDefault(currentNode) {
        null != currentNode && this.doClose(currentNode).start();
        this.doClose(this.listBlock).start();
        this.doClose(this.menuPlaying).start();
        this.doCloseTitle(this.title).start();
        this.doShow(this.menuStart).start();
      },
      onGameOver: function onGameOver(node) {
        null != node && this.doClose(node).start();
        this.doShow(this.gameOver).start();
      },
      onPlaying: function onPlaying(node) {
        null != node && this.doClose(node).start();
        this.doShowMenuPlaying(this.menuPlaying).start();
        this.doShowTitle(this.title).start();
        cc.delayTime(1);
        this.doShow(this.listBlock).start();
      },
      doShow: function doShow(node) {
        var t = cc.tween(node).to(0, {
          scale: 0
        }, {
          easing: "sineIn"
        }).to(1e-4, {
          position: cc.v2(0, 0)
        }, {
          easing: "sineOut"
        }).delay(.5).call(function(node) {
          node.active = true;
        }).to(1, {
          scale: 1
        }, {
          easing: "sineIn"
        });
        return t;
      },
      doClose: function doClose(node) {
        var t = cc.tween(node).delay(.5).by(.07, {
          position: cc.v2(64, 0)
        }, {
          easing: "sineIn"
        }).repeat(10).to(.7, {
          scale: 0
        }, {
          easing: "sineIn"
        }).call(function(node) {
          node.active = false;
        });
        return t;
      },
      doShowMenuPlaying: function doShowMenuPlaying(node) {
        var t = cc.tween(node).to(1e-4, {
          position: cc.v2(0, -580)
        }, {
          easing: "sineOut"
        }).call(function(node) {
          node.active = true;
        }).delay(.5).to(.1, {
          scale: 1
        }, {
          easing: "sineIn"
        }).to(1, {
          position: cc.v2(0, -390)
        }, {
          easing: "sineOut"
        });
        return t;
      },
      doShowTitle: function doShowTitle(node) {
        var t = cc.tween(node).to(1e-4, {
          position: cc.v2(0, 300)
        }, {
          easing: "sineOut"
        }).call(function(node) {
          node.active = true;
        }).delay(.5).to(1, {
          position: cc.v2(0, 0)
        }, {
          easing: "sineOut"
        });
        return t;
      },
      doCloseTitle: function doCloseTitle(node) {
        var t = cc.tween(node).to(1, {
          position: cc.v2(0, 300)
        }, {
          easing: "backInOut"
        }).delay(.5).call(function(node) {
          node.active = false;
        });
        return t;
      }
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  gameOverHandle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "89d30fH4l9F/p5p/dc+JWMx", "gameOverHandle");
    "use strict";
    var User = require("User");
    var emitter = require("mEmitter");
    var db = JSON.parse(cc.sys.localStorage.getItem("users"));
    cc.Class({
      extends: cc.Component,
      properties: {
        edbUsername: cc.EditBox,
        btnSubmit: cc.Button,
        lblScore: cc.Label,
        openGameOver: null,
        clickSubmit: null,
        users: []
      },
      onLoad: function onLoad() {
        this.openGameOver = this.doOpenGameOver.bind(this);
        emitter.instance.registerEvent("OPEN_GAMEOVER", this.openGameOver);
      },
      start: function start() {
        this.checkData();
        this.btnSubmit.node.on("click", this.doSubmit, this);
      },
      doOpenGameOver: function doOpenGameOver(totalScore) {
        var _this = this;
        cc.log(totalScore);
        cc.log("gameover");
        var countScore = 0;
        var actions = [ cc.callFunc(function() {
          countScore += 1;
        }), cc.delayTime(.001), cc.callFunc(function() {
          _this.lblScore.string = countScore;
        }) ];
        this.lblScore.node.runAction(cc.repeat(cc.sequence(actions), totalScore));
      },
      getInfoUserAndPushToArray: function getInfoUserAndPushToArray() {
        var user = new User();
        user.name = this.edbUsername.string;
        user.score = this.lblScore.string;
        this.users.push(user);
      },
      doSubmit: function doSubmit() {
        if ("" == this.edbUsername.string) return;
        this.getInfoUserAndPushToArray();
        null != this.users && cc.sys.localStorage.setItem("users", JSON.stringify(this.users));
        this.edbUsername.string = "";
        emitter.instance.emit("DEFAULT", this.node);
      },
      checkData: function checkData() {
        null != db && (this.users = db);
      }
    });
    cc._RF.pop();
  }, {
    User: "User",
    mEmitter: "mEmitter"
  } ],
  mEmitter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d803cCt5mRA3J7kpXzbrNXx", "mEmitter");
    "use strict";
    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          "value" in descriptor && (descriptor.writable = true);
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        protoProps && defineProperties(Constructor.prototype, protoProps);
        staticProps && defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var EventEmitter = require("events");
    var mEmitter = function() {
      function mEmitter() {
        _classCallCheck(this, mEmitter);
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
      }
      _createClass(mEmitter, [ {
        key: "emit",
        value: function emit() {
          var _emiter;
          (_emiter = this._emiter).emit.apply(_emiter, arguments);
        }
      }, {
        key: "registerEvent",
        value: function registerEvent(event, listener, target) {
          this._emiter.on(event, listener, target);
        }
      }, {
        key: "registerOnce",
        value: function registerOnce(event, listener) {
          this._emiter.once(event, listener);
        }
      }, {
        key: "removeEvent",
        value: function removeEvent(event, listener) {
          this._emiter.removeListener(event, listener);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this._emiter.removeAllListeners();
          this._emiter = null;
          mEmitter.instance = null;
        }
      } ]);
      return mEmitter;
    }();
    mEmitter.instance = null;
    module.exports = mEmitter;
    cc._RF.pop();
  }, {
    events: 1
  } ],
  main: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7f252HpQsBHib03NO/PkRbb", "main");
    "use strict";
    var COLOR = require("color");
    var emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        card: {
          default: null,
          type: cc.Prefab
        },
        updateScore: {
          default: null,
          type: cc.Label
        },
        compareAudio: {
          default: null,
          type: cc.AudioClip
        },
        newCardAudio: {
          default: null,
          type: cc.AudioClip
        },
        _arrBlocks: [],
        _canRandom: true,
        _updateScore: 0,
        _totalScore: 0,
        _canPress: false,
        playGame: null
      },
      compareSound: function compareSound() {
        cc.audioEngine.playEffect(this.compareAudio, false);
      },
      newCardSound: function newCardSound() {
        cc.audioEngine.playEffect(this.newCardAudio, false);
      },
      onLoad: function onLoad() {
        this.canPress = false;
        this.playGame = this.onPlayGame.bind(this);
        emitter.instance.registerEvent("CLICK_PLAY", this.playGame);
      },
      handleKeyUp: function handleKeyUp(evt) {
        switch (evt.keyCode) {
         case cc.macro.KEY.up:
         case cc.macro.KEY.down:
         case cc.macro.KEY.left:
         case cc.macro.KEY.right:
          this.randomNumber();
          this._canPress = false;
        }
      },
      handleKeyDown: function handleKeyDown(evt) {
        if (this._canPress) return;
        this._canPress = true;
        switch (evt.keyCode) {
         case cc.macro.KEY.up:
          this.moveUp();
          break;

         case cc.macro.KEY.down:
          this.moveDown();
          break;

         case cc.macro.KEY.left:
          this.moveLeft();
          break;

         case cc.macro.KEY.right:
          this.moveRight();
        }
      },
      moveUp: function moveUp() {
        for (var col = 0; col < 4; col++) {
          var flatArrCard = [ 0, 0, 0, 0 ];
          for (var row = 0; row < 4; row++) flatArrCard[row] = this._arrBlocks[row][col];
          this.handle(flatArrCard);
        }
      },
      moveDown: function moveDown() {
        for (var col = 0; col < 4; col++) {
          var flatArrCard = [ 0, 0, 0, 0 ];
          for (var row = 0; row < 4; row++) flatArrCard[row] = this._arrBlocks[row][col];
          this.handle(flatArrCard.reverse());
        }
      },
      moveLeft: function moveLeft() {
        for (var row = 0; row < 4; row++) {
          var flatArrCard = [ 0, 0, 0, 0 ];
          for (var col = 0; col < 4; col++) flatArrCard[col] = this._arrBlocks[row][col];
          this.handle(flatArrCard);
        }
      },
      moveRight: function moveRight() {
        for (var row = 0; row < 4; row++) {
          var flatArrCard = [ 0, 0, 0, 0 ];
          for (var col = 0; col < 4; col++) flatArrCard[col] = this._arrBlocks[row][col];
          this.handle(flatArrCard.reverse());
        }
      },
      handle: function handle(arrCard) {
        for (var i = 1; i < arrCard.length; i++) {
          if (false == arrCard[i].active) continue;
          var checkCompare = false;
          for (var j = i - 1; j >= 0; j--) {
            if (true == checkCompare) {
              j = -1;
              break;
            }
            checkCompare = this.changeValueCards(arrCard, i, j);
          }
        }
      },
      changeValueCards: function changeValueCards(arrCard, i, j) {
        if (false == arrCard[j].active) {
          if (0 == j) {
            arrCard[j].getComponent("card").lblCard.string = arrCard[i].getComponent("card").lblCard.string;
            arrCard[i].getComponent("card").lblCard.string = "0";
            arrCard[i].active = false;
            arrCard[j].active = true;
            return true;
          }
        } else {
          if (arrCard[j].getComponent("card").lblCard.string == arrCard[i].getComponent("card").lblCard.string) {
            arrCard[j].getComponent("card").lblCard.string = 2 * parseInt(arrCard[j].getComponent("card").lblCard.string) + "";
            arrCard[i].getComponent("card").lblCard.string = "0";
            arrCard[j].active = true;
            arrCard[i].active = false;
            this.changeScore(parseInt(arrCard[j].getComponent("card").lblCard.string));
            return true;
          }
          if (arrCard[j].getComponent("card").lblCard.string != arrCard[i].getComponent("card").lblCard.string) {
            var reValue = j + 1;
            if (reValue != i) {
              arrCard[reValue].getComponent("card").lblCard.string = arrCard[i].getComponent("card").lblCard.string;
              arrCard[i].getComponent("card").lblCard.string = "0";
              arrCard[reValue].active = true;
              arrCard[i].active = false;
            }
            return true;
          }
        }
      },
      reloadColor: function reloadColor(arrCard) {
        for (var col = 0; col < arrCard.length; col++) for (var row = 0; row < arrCard.length; row++) {
          var number = parseInt(arrCard[col][row].children[1].getComponent("cc.Label").string);
          arrCard[col][row].children[0].color = COLOR[number];
        }
      },
      start: function start() {},
      render: function render() {
        for (var col = 0; col < 4; col++) {
          var arrRow = [];
          for (var row = 0; row < 4; row++) {
            var x = 150 * row - 225;
            var y = 225 - 150 * col;
            var newCard = cc.instantiate(this.card);
            newCard.parent = this.node;
            newCard.x = x;
            newCard.y = y;
            newCard.width = 140;
            newCard.height = 140;
            newCard.color = COLOR[0];
            newCard.active = false;
            arrRow.push(newCard);
          }
          this._arrBlocks.push(arrRow);
        }
      },
      randomNumber: function randomNumber() {
        var flatArray = this._arrBlocks.flat(Infinity);
        var arrNone = flatArray.filter(function(value) {
          return false == value.active;
        });
        if (arrNone.length) {
          var index = Math.floor(Math.random() * arrNone.length);
          arrNone[index].children[1].getComponent("cc.Label").string = 2;
          arrNone[index].color = COLOR[2];
          arrNone[index].active = true;
          arrNone[index].scale = 0;
          var action = cc.scaleTo(.1, 1);
          arrNone[index].runAction(action);
          this.reloadColor(this._arrBlocks);
          return true;
        }
        cc.log("full card");
        cc.log(this._totalScore);
        emitter.instance.emit("GAMEOVER");
        emitter.instance.emit("OPEN_GAMEOVER", this._totalScore);
        return false;
      },
      changeScore: function changeScore(number) {
        var score = this.updateScore;
        var currentScore = Number(score.string);
        this._totalScore = currentScore + number;
        var actions = [ cc.callFunc(function() {
          currentScore += 1;
        }), cc.delayTime(.01), cc.callFunc(function() {
          score.string = currentScore;
        }) ];
        var scale = cc.sequence(cc.scaleTo(.15, 1.2), cc.scaleTo(.15, 1));
        score.node.runAction(cc.spawn(cc.repeat(cc.sequence(actions), number), scale));
      },
      checkGameOver: function checkGameOver(arrCard) {
        for (var col = 0; col < 4; col++) for (var row = 0; row < 4; row++) cc.log(arrCard[col][row].children[1].getComponent("cc.Label").string);
      },
      onPlayGame: function onPlayGame() {
        this.node.removeAllChildren();
        this._arrBlocks = [];
        this.updateScore.string = "0";
        this.render();
        this.randomNumber();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.handleKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.handleKeyUp, this);
      }
    });
    cc._RF.pop();
  }, {
    color: "color",
    mEmitter: "mEmitter"
  } ],
  playingHandle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2681eMNollL85TUYZQnvkZL", "playingHandle");
    "use strict";
    var emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        lblScore: cc.Label,
        btnReplay: cc.Button,
        btnQuit: cc.Button,
        replay: null,
        quit: null
      },
      onLoad: function onLoad() {},
      start: function start() {
        this.btnReplay.node.on("click", this.onReplay, this);
        this.btnQuit.node.on("click", this.onQuit, this);
      },
      onReplay: function onReplay() {
        emitter.instance.emit("CLICK_PLAY");
        emitter.instance.emit("PLAYING");
      },
      onQuit: function onQuit() {
        emitter.instance.emit("DEFAULT", null);
        cc.log("quit");
      }
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  rankHandle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "771c5yYjkNE/5RCQRT6yqX8", "rankHandle");
    "use strict";
    var emitter = require("mEmitter");
    var db = JSON.parse(cc.sys.localStorage.getItem("users"));
    cc.Class({
      extends: cc.Component,
      properties: {
        rank: cc.Layout,
        prefab_item: cc.Prefab,
        btnClose: cc.Button,
        openRank: null,
        render: null,
        clickClose: null
      },
      onLoad: function onLoad() {
        this.openRank = this.doOpenRank.bind(this);
        this.clickClose = this.doClickClose.bind(this);
        this.render = this.doRender.bind(this);
        emitter.instance.registerEvent("OPEN_RANK", this.openRank);
        emitter.instance.registerEvent("RENDER", this.render);
      },
      start: function start() {
        this.btnClose.node.on("click", this.clickClose, this);
      },
      doClickClose: function doClickClose() {
        emitter.instance.emit("DEFAULT", this.node);
        this.removeItem();
      },
      doOpenRank: function doOpenRank() {},
      doRender: function doRender() {
        var data = JSON.parse(cc.sys.localStorage.getItem("users"));
        if (null != data) {
          data = data.sort(function(a, b) {
            return parseInt(b.score) - parseInt(a.score);
          });
          this.renderAllUser(data);
        }
      },
      renderAllUser: function renderAllUser(data) {
        var _this = this;
        data.forEach(function(user, index) {
          _this.renderUser(user, index);
        });
      },
      renderUser: function renderUser(user, index) {
        var item = cc.instantiate(this.prefab_item);
        item.parent = this.rank.node;
        item.active = true;
        item.children[0].getComponent("cc.Label").string = index + 1;
        item.children[1].getComponent("cc.Label").string = user.name;
        item.children[2].getComponent("cc.Label").string = user.score;
        return item;
      },
      removeItem: function removeItem() {
        this.rank.node.removeAllChildren();
      },
      checkData: function checkData() {
        null != db && (this.users = db);
      }
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  startHandle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "67fa7fmcH9PQap9vA5udek6", "startHandle");
    "use strict";
    var User = require("User");
    var emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        btnPlay: cc.Button,
        btnRank: cc.Button,
        openStart: null,
        clickPlay: null,
        users: []
      },
      onLoad: function onLoad() {
        this.openStart = this.doOpenStart.bind(this);
        emitter.instance.registerEvent("OPEN_START", this.openStart);
      },
      start: function start() {
        this.btnRank.node.on("click", this.onClickRank, this);
        this.btnPlay.node.on("click", this.onClickPlay, this);
      },
      onClickPlay: function onClickPlay() {
        emitter.instance.emit("CLICK_PLAY");
        emitter.instance.emit("PLAYING", this.node);
      },
      onClickRank: function onClickRank() {
        emitter.instance.emit("RANK", this.node);
        emitter.instance.emit("RENDER");
      },
      doOpenStart: function doOpenStart() {}
    });
    cc._RF.pop();
  }, {
    User: "User",
    mEmitter: "mEmitter"
  } ]
}, {}, [ "gameOverHandle", "playingHandle", "rankHandle", "startHandle", "card", "color", "controller", "User", "main", "mEmitter" ]);
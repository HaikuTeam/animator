var Haiku = require("@haiku/core");

module.exports = {
  metadata: {
    uuid: "HAIKU_SHARE_UUID",
    type: "haiku",
    name: "ClickableSquare2",
    relpath: "code/main/code.js",
    core: "2.1.47",
    version: "0.0.6",
    organization: "Matthew",
    project: "ClickableSquare2",
    branch: "master"
  },

  options: {},
  states: { clicks: { value: 0 }, meow: { value: 12 } },
  eventHandlers: {
    "haiku:some-component": {
      'meow:meow': {
        handler: function(event) {
          console.log('cs2 heard meow meow')
          this.emit('ruff:ruff',123)
        }
      }
    },
    "haiku:696562c8dc61": {
      click: {
        handler: function(event) {
          console.info('cs2 heard click');
          this.getTimeline("Default").gotoAndPlay(0);
          this.state.clicks = this.state.clicks + 1;
        }
      },
      "timeline:Default:26": {
        handler: function(event) {
          console.info('cs2 heard frame listener 26');
          this.state.meow = 122;
        }
      },
      "timeline:Default:0": {
        handler: function(event) {
          console.info('cs2 heard frame listener 0');
          this.state.meow = 12;
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:696562c8dc61": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 550 } },
        "sizeAbsolute.y": { "0": { value: 400 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } },
        opacity: {
          "0": {
            value: Haiku.inject(
              function($user) {
                return $user.mouse.x * 0.001;
              },
              "$user"
            ),
            edited: true
          }
        }
      },
      "haiku:94a14025d5c9": {
        viewBox: { "0": { value: "0 0 46 50" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 46 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 50 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function(Number, meow) {
                return Number(meow) + 100;
              },
              "Number",
              "meow"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function(Math) {
                return Math.PI + Math.sin(123);
              },
              "Math"
            ),
            edited: true
          }
        },
        "style.zIndex": { "0": { value: 1 } },
        "scale.x": { "0": { value: 4.7391304347826075, edited: true } },
        "scale.y": { "0": { value: 4.239999999999999, edited: true } },
        "rotation.z": {
          "0": {
            value: Haiku.inject(
              function(clicks, Math) {
                var n = clicks < 1 ? 0 : clicks - 1;

                return n * Math.PI / 2;
              },
              "clicks",
              "Math"
            ),
            edited: true,
            curve: "easeOutBounce"
          },
          "1000": {
            value: Haiku.inject(
              function(clicks, Math) {
                return clicks * Math.PI / 2;
              },
              "clicks",
              "Math"
            ),
            edited: true
          }
        }
      },
      "haiku:d6c81fb49043": {
        x: { "0": { value: "0" } },
        y: { "0": { value: "0" } },
        "sizeAbsolute.x": { "0": { value: 46 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 50 } },
        "sizeMode.y": { "0": { value: 1 } }
      },
      "haiku:1cb4f8113ec3": {
        stroke: { "0": { value: "none" } },
        "stroke-width": { "0": { value: "1" } },
        fill: { "0": { value: "none" } },
        "fill-rule": { "0": { value: "evenodd" } }
      },
      "haiku:92df766f8d0e": {
        fill: { "0": { value: "#D8D8D8" } },
        "fill-rule": { "0": { value: "evenodd" } },
        "xlink:href": { "0": { value: "#path-1-1b778b" } }
      },
      "haiku:f0cda9800f1c": {
        stroke: { "0": { value: "#979797" } },
        "stroke-width": { "0": { value: "1" } },
        x: { "0": { value: "0.5" } },
        y: { "0": { value: "0.5" } },
        "sizeAbsolute.x": { "0": { value: 45 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 49 } },
        "sizeMode.y": { "0": { value: 1 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: {
      "haiku-title": "ClickableSquare2",
      "haiku-id": "696562c8dc61"
    },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          source: "designs/micro.sketch.contents/slices/Rectangle.svg",
          "haiku-title": "Rectangle",
          "haiku-id": "94a14025d5c9"
        },
        children: [
          {
            elementName: "title",
            attributes: { "haiku-id": "25fd869a140f" },
            children: ["Rectangle"]
          },
          {
            elementName: "desc",
            attributes: { "haiku-id": "4c06da00f45e" },
            children: ["Created with sketchtool."]
          },
          {
            elementName: "defs",
            attributes: { "haiku-id": "209fda7021ea" },
            children: [
              {
                elementName: "rect",
                attributes: { id: "path-1-1b778b", "haiku-id": "d6c81fb49043" },
                children: []
              }
            ]
          },
          {
            elementName: "g",
            attributes: { id: "Page-1", "haiku-id": "1cb4f8113ec3" },
            children: [
              {
                elementName: "g",
                attributes: { id: "Rectangle", "haiku-id": "783085053a0b" },
                children: [
                  {
                    elementName: "use",
                    attributes: { "haiku-id": "92df766f8d0e" },
                    children: []
                  },
                  {
                    elementName: "rect",
                    attributes: { "haiku-id": "f0cda9800f1c" },
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        elementName: {
          eventHandlers: {
            'haiku:some-div': {
              'click': {
                handler: function (target, event) {
                  console.log('some-component heard some-div click', target, event)
                  this.emit('meow:meow', 'hallo')
                }
              }
            }
          },
          template: {
            elementName: "div",
            attributes: {
              'haiku-id': 'some-div',
              style: {
                width: '100px',
                height: '100px',
                backgroundColor: 'red'
              }
            },
            children: ['Hello']
          }
        },
        attributes: {
          "haiku-id": "some-component"
        },
        children: []
      }
    ]
  }
};

var Haiku = require("@haiku/core");
module.exports = {
  metadata: {
    folder: "/Users/zack/.haiku/projects/zack4/stardew",
    uuid: "4749fd59-b916-43be-aa61-fd8ea766f27d",
    core: "3.5.1",
    username: "zack4",
    organization: "zack4",
    project: "stardew",
    branch: "master",
    version: "0.0.0",
    title: "Sunflower",
    type: "haiku",
    relpath: "code/sunflower/code.js"
  },
  options: {},
  states: { current: { type: "number", value: 0, edited: true } },
  eventHandlers: {
    "haiku:Sunflower-3099df4cef2cc425": {
      click: {
        handler: function(target, event) {
          var FINAL_STATE = 3;
          var c = this.state.current;
          c++;
          if (c > FINAL_STATE) {
            c = 0;
          }
          this.setState({ current: c });
          this.gotoAndStop(c);
        }
      },
      "timeline:Default:0": {
        handler: function(target, event) {
          this.pause();
        }
      }
    }
  },
  timelines: {
    Default: {
      "haiku:Sunflower-3099df4cef2cc425": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "visible" } },
        "style.overflowY": { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 95, edited: true } },
        "sizeAbsolute.y": { "0": { value: 199, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:Layer-1-Stardew-Artboard-2-Copy-3-8a45ad37c2a2023e": {
        x: { "0": { value: "0px" } },
        y: { "0": { value: "0px" } },
        viewBox: { "0": { value: "0 0 95 199" } },
        enableBackground: { "0": { value: "new 0 0 95 199" } },
        "xml:space": { "0": { value: "preserve" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: 95 } },
        "sizeAbsolute.y": { "0": { value: 199 } },
        "translation.x": {
          "0": { value: 47.5, edited: true },
          "17": { value: 47.5 }
        },
        "translation.y": {
          "0": { value: 99.5, edited: true },
          "17": { value: 99.5 }
        },
        "style.zIndex": { "0": { value: 1 } },
        "controlFlow.if": {
          "0": { value: true, edited: true },
          "17": { value: false, edited: true }
        }
      },
      "haiku:Layer_1_7_-590fa175bf99ea7d": {
        overflow: { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 88 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 58 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: 14 } },
        "translation.y": { "0": { value: 152 } },
        "scale.x": { "0": { value: 0.75 } },
        "scale.y": { "0": { value: 0.75 } }
      },
      "haiku:Layer-1-Stardew-Artboard-2-Copy-2-1c903843800033f2": {
        x: { "0": { value: "0px" } },
        y: { "0": { value: "0px" } },
        viewBox: { "0": { value: "0 0 95 199" } },
        enableBackground: { "0": { value: "new 0 0 95 199" } },
        "xml:space": { "0": { value: "preserve" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: 95 } },
        "sizeAbsolute.y": { "0": { value: 199 } },
        "translation.x": {
          "0": { value: 47.5, edited: true },
          "17": { value: 47.5 }
        },
        "translation.y": {
          "0": { value: 99.5, edited: true },
          "17": { value: 99.5 }
        },
        "style.zIndex": { "0": { value: 2 } },
        "controlFlow.if": {
          "0": { value: false, edited: true },
          "17": { value: true, edited: true },
          "33": { value: false, edited: true }
        }
      },
      "haiku:Layer_1_4_-18db7d3ecbb65803": {
        overflow: { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 127 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 146 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: -1 } },
        "translation.y": { "0": { value: 89 } },
        "scale.x": { "0": { value: 0.75 } },
        "scale.y": { "0": { value: 0.75 } }
      },
      "haiku:Layer-1-Stardew-Artboard-2-Copy-a2427d045a52446e": {
        x: { "0": { value: "0px" } },
        y: { "0": { value: "0px" } },
        viewBox: { "0": { value: "0 0 95 199" } },
        enableBackground: { "0": { value: "new 0 0 95 199" } },
        "xml:space": { "0": { value: "preserve" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: 95 } },
        "sizeAbsolute.y": { "0": { value: 199 } },
        "translation.x": {
          "0": { value: 47.5, edited: true },
          "33": { value: 47.5 }
        },
        "translation.y": {
          "0": { value: 99.5, edited: true },
          "33": { value: 99.5 }
        },
        "style.zIndex": { "0": { value: 3 } },
        "controlFlow.if": {
          "0": { value: false, edited: true },
          "33": { value: true, edited: true },
          "50": { value: false, edited: true }
        }
      },
      "haiku:Layer_1_2_-a6f1ff6dd96790b0": {
        overflow: { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 140 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 234 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.x": { "0": { value: -5 } },
        "translation.y": { "0": { value: 23 } },
        "scale.x": { "0": { value: 0.75 } },
        "scale.y": { "0": { value: 0.75 } }
      },
      "haiku:Layer-1-Stardew-Artboard-2-5c3acd45ed23e978": {
        x: { "0": { value: "0px" } },
        y: { "0": { value: "0px" } },
        viewBox: { "0": { value: "0 0 95 199" } },
        enableBackground: { "0": { value: "new 0 0 95 199" } },
        "xml:space": { "0": { value: "preserve" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: 95 } },
        "sizeAbsolute.y": { "0": { value: 199 } },
        "translation.x": { "0": { value: 47.5, edited: true } },
        "translation.y": { "0": { value: 99.5, edited: true } },
        "style.zIndex": { "0": { value: 4 } },
        "controlFlow.if": {
          "0": { value: false, edited: true },
          "50": { value: true, edited: true }
        }
      },
      "haiku:Layer_1_1_-06654f6c3cd7a52e": {
        overflow: { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 127 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 263 } },
        "sizeMode.y": { "0": { value: 1 } },
        "translation.y": { "0": { value: 2 } },
        "scale.x": { "0": { value: 0.75 } },
        "scale.y": { "0": { value: 0.75 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: {
      "haiku-id": "Sunflower-3099df4cef2cc425",
      "haiku-title": "Sunflower"
    },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Layer-1-Stardew-Artboard-2-5c3acd45ed23e978",
          "haiku-title": "stardew_Artboard 2",
          "haiku-source": "designs/stardew.ai.contents/artboards/stardew_Artboard 2.svg",
          "haiku-locked": true,
          id: "Layer_1"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "CKQV8t.tif-f3f9e4ff7042aa05",
              id: "CKQV8t.tif"
            },
            children: [
              {
                elementName: "image",
                attributes: {
                  "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAEICAYAAACXqvzKAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA\nGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAB5dJREFUeNrsnU1MXFUYhu9YygAX\naEFhWlsiYEtim6ahE+NCYy42Jg1748rgpsG41UWXGDcuTFwaN6YuiXuCC8No0KSLgYVpmkChNLYR\nKPIzMDA//Mhsm5r70n5zz5T7POsv58y992HO8OY79yS8GmZkMD1hOt5YdiDqedU5XVHn1TZBzOaN\nnFc8iDUIgACAAIAAgACAAIAAECucBUFK2jb0zYzxrFrCZzuvNqerxNBlEhiEFXRf2Yx8zirMG9Ty\nNwBLAL8BAAEAAQABAAEAASBWmOcAajvVje41u0mntTJ5TmW8fuM5B90ERtUIggKl6IxfsptxXSuT\n51y3+2hHuM7AxTcASwC/AQABAAEAAQABAAEAASA+yEGQmvCp7VQpISBZ+qFDGmt8uk2qu3dvRap7\nK9cXWnNjRkv4Up89keqG8hvikwh/DkdJC4+SBAZKkWU71dJcUqpb+LtFqptbXZTqGoXxCq3bmgDD\nRamu2yuaPgeWAEAAQABAAEAAQABAAEAAeBp3ewOFvrvxBS3he7D8SKrrSZ03G2/c75TGGp7WPpva\nY3h8BBD67hbz9dJQ+cKOVOd3NpqNp342y/5ClgBAAEAAQABAAEAAQABAAHgRjhIESX1mP93q03YH\nnw7vqXOR8KnjqWMt3RH7Gn9pM30O5gKMjGUzUp2XlsYrXA7vqcsXctJYlgmfOp46VmG1VapbuNti\n+hxYAgABAAEAAQABAAEAAeCFcgDrzaEz4ZtDe6belMZyERipY6XemZPqhj6J2+ZQYaOun4w+4FHH\nU8dqaBc3h15hcyjwGwAQABAAEAAQABAAEACqi7u9gcJmSPWwhXwx+pYw+SCIfgR4NqfDS9TDFvyk\n1k9nmRie8XNm18kSAAgACAAIAAgACAAIAAgAUeBuc2hPeJImH7YwqfXTzf/eLNX1vh/e15h6Twup\n5EMvHsRtc+h++OZQ+bCFh1pdov2UVPdGl9DX2KvdN/nQCzaHAr8BAAEAAQABAAEAAQABoMpUoyVM\nSqrGF9pCE8Nhz/awhfHvtbRtuP+R2c1QD73wjBM+ZwLIieFg2m5Sse9OPuTBsI9PndM64WMJAAQA\nBAAEAAQABAAEgChygCMQGnyo7WUqo2uzUl33rb5Ir9MliVr+cCOD6QPL8b5dmpLqvkxds7uGsWxN\n32OWAH4DAAIAAgACAAIAAgACQHyoa04nJlxMvJU9UBIyKUUbXZuNPDH8uO3iwHEQIHEowIEjAcwS\nMhfXYPn5WQIAAQABAAEAAQABAAEAASAK5J7Am9+dlepmVstS3W9fr4Smd2JaKNNwTrvcwuNdBHia\nnqsNUt3akvylEkR9sScaE/zJswQAAgACAAIAAgACIAAgAMQW893Bd3/NS3W9n4a/u3/e2zDt9Wvu\nPinV5e+XEeB5yS1rMWr7NSlZDEwvtokvPJYAQABAAEAAQABAAASAWCPnALNr2v/3rX3a69E3Z8NP\n3nzt3UZprJU/dniS1RZgs7SvDdisfamUN8PHS756gifEEgAIAAgACAAIAAgACAAIAEZUgiBpA6ay\nmbPC21+0SxPvboUHQbmZkunFbj3UWr20TaS7tfx6PV2AwwEzWmlRqmoS267UxNCS3byWZoqbSAOW\nAEAAQABAAEAAQABAAEAAeJmQX5vVnE4ESl3HpaSUkG1vh4cySlpYobiyJ9X5F7TNocomUv/8SScP\nbGlyOxNaM1qS00K5J9A6MaxllE2kfrcbAbxJ2wSSJYDfAIAAgACAAIAAgACAABAf6qowposjVSPv\nz1N2N1eD1z/0Q2vy98vS/aj0F5oLoCeGdjSnoz8IQtndXA1aLkrb7wOWAEAAQABAAEAAQABAAHgG\ncg5w+L/2RFxuirKJVAlkKnR1aZ1D6jkL1682hdb8VQ0BvGOyGVJB2USqbm5t7bTN2jpP2b46jyWA\n3wCAAIAAgACAAIAAgAAQH+rUhE856bNCTmyVuvyBb3YRd35cl+rUk0O3FsKTwPnbG9JYTZ+3affj\nuu9GAE9M+NTNkMVVbadux6Wk2UWIr3UzPTk0v6C9c1DZBV2hqyvpRACWAH4DAAIAAgACAAIAAgAC\nQHyQ+5XU3jb11W4Kap9c4bF2rK0nhk/ieNIm2PnbG1LSuiiGVFP1CTcCuDgIIresPdi9nQPTm6KM\np2+C1RLDvPjZnrAEAAIAAgACAAIAAgACAALAc+Ls6Fgl5Vv5c8f0Ylv7pDdsef8KR8duZcvqtAM1\nLYCro2OVlE89CUS+WDGlVHsMFVy8No8lABAAEAAQABAAEAAQAP7vX+Mj1JoGRmK3jzRnw7m6CR5l\nlQVwcXKoOqd/IcGTZAkABAAEAAQABAAEAAQABIAQjsvJoVArAtR6CxSwBAACAAIAAgACIAC3AAEA\nASCu1B2Hi5BfE+doPASoMi5eE8cSAAgACAAIAAgACAAIAAgALxvmQVC9lw6iv4wpqWpTPNbWxXWW\nvGzmWAhwSEet2l7e3I/FdbIEAAIAAgACAAIAAgACQIQ5QEasC6wm3Pvn7FdK3XqmXhyvxcX9cIKz\n96vVe+mP4vAXVvKyP7MEAAIAAgACAAIAAgACAAJALeByb2CG2++e/wQYAMJNA6+/XjXyAAAAAElF\nTkSuQmCC",
                  "haiku-id": "Layer_1_1_-06654f6c3cd7a52e",
                  id: "Layer_1_1_"
                },
                children: []
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Layer-1-Stardew-Artboard-2-Copy-a2427d045a52446e",
          "haiku-title": "stardew_Artboard 2 copy",
          "haiku-source": "designs/stardew.ai.contents/artboards/stardew_Artboard 2 copy.svg",
          "haiku-locked": true,
          id: "Layer_1"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "Zu7B99.tif-8c9292ab502fc2da",
              id: "Zu7B99.tif"
            },
            children: [
              {
                elementName: "image",
                attributes: {
                  "xlink:href": "data:image/png;base64,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",
                  "haiku-id": "Layer_1_2_-a6f1ff6dd96790b0",
                  id: "Layer_1_2_"
                },
                children: []
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Layer-1-Stardew-Artboard-2-Copy-2-1c903843800033f2",
          "haiku-title": "stardew_Artboard 2 copy 2",
          "haiku-source": "designs/stardew.ai.contents/artboards/stardew_Artboard 2 copy 2.svg",
          "haiku-locked": true,
          id: "Layer_1"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "JhWGWm.tif-f4ff48558a511a14",
              id: "JhWGWm.tif"
            },
            children: [
              {
                elementName: "image",
                attributes: {
                  "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACTCAYAAABGfBH+AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA\nGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABBlJREFUeNrsnU9PE0EYhxfYltKC\nfxoaQ0gTJahJPSnx5MGtfhHPXj17MHwPw/cwhnIxeKgXw8FgqoQI/qkVaAvSUhCuxGR/xXc7dfd5\nzm9mdqYPO8ubd2Z8z5jJhZFlb8C0qidlDy6EH0GbAdP6/zDKFCAAIAAgACAAIAAgACAAJAbfVccP\nn0+HxmxudqW2at6ulH1UM4ZJymY6E6BQGg+NaYzJzQXGjxck5Q3AEsA3ACAAIAAgACAAIAAkCn+Y\nH65YTElx7SeXpTg1YTQntKc+28piHQEuSjarvaBy11Nqk4FVe4Xb47F4A7AE8A0ACAAIAAgACAAI\nAAgAySGKRJBU2rSyWDcru8rdtU3KNNc74UHGiSC1DM26dMxcgNMHrGiRh2Z9pudTpmPoNo9d/DEG\nLAGAAIAAgACAAIAAgACAABAlLkvCzDJarY2u6WbOS7fSoTFvX+5IbU0/mND6vJmW4pS6xn6yhc4E\n0DOG4eTmbTN3/mT4i7HxqSO1daWkpYyt6xpZAgABAAEAAQABAAEAAQAB4Dx+HAbx+8uRaXvbr9pm\nbbU2tKPuUlPa36Kyc7mfY/NiIUDv4MS0vYNvdkIdtbUspVqHmL+XUcIClgBAAEAAQABAAEAAQAD4\nC3IewMUZ+tZkZrXhKomlOfFoumJRK/X6sLovthdeOfQ+CgG8GJyhPzYxogkgJJYy17Spy98QS71W\ntTD16DyWAEAAQABAAEAAQABAAEAAOI+vZvjUzNfeurZn7s6jnNkg1I2ak+L+u/bH8DKu2tKu1Fb2\n6VVtPh7n3AjgGV6icMZhoyfFFUp25+ypGT7fMIvW/qzV+u3va6VexaKbCyhYAvgGAAQABAAEAAQA\nBAAEgOQgl4SpV6UetexO7Fp7rW3SlDeHlkyTLdJRbLUlbaPm1+zocAug1qIpR6yp7H3XfljrzaEK\n+jF3Wsaw7egNwBLANwAgACAAIAAgACAAIAAkh7NEkOlVr/ef5aWOlSxf/c2B6WCViyDO+CnsIm5V\nu2q35aEWwPqqVzVjqGT5Dus928GKWUq1xlDB8mIMlgBAAEAAQABAAEAAQAD413+N+4g1TRiJ1T5S\nn5lZf5mfMmIBrBNGln3m5kf4JVkCAAEAAQABAAEAAQABAAEghCgujiwzrQkWYNhLoIAlABAAEAAQ\nABAAAZgCBAAEgKTix2EQ8jFxjtpDgIixPibOxbFzLAGAAIAAgACAAIAAgACAABA15omgtLcQDH4Y\n76SopnitrYtxdrxqJRYCnFIYVtu7zeNEjJMlABAAEAAQABAAEAAQAAaYB6iIcYFVh73tmRdK3E4l\nLbY35WI+4iFAx6v+UOLS3oJZn72tmTUl7tfW4CdYnQ+WAEAAQABAAEAAQABAAEAAiBqXewMrTL97\n/ggwAEME8fuS/1t/AAAAAElFTkSuQmCC",
                  "haiku-id": "Layer_1_4_-18db7d3ecbb65803",
                  id: "Layer_1_4_"
                },
                children: []
              }
            ]
          }
        ]
      },
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Layer-1-Stardew-Artboard-2-Copy-3-8a45ad37c2a2023e",
          "haiku-title": "stardew_Artboard 2 copy 3",
          "haiku-source": "designs/stardew.ai.contents/artboards/stardew_Artboard 2 copy 3.svg",
          "haiku-locked": true,
          id: "Layer_1"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "_x39_iBZKN.tif-604cd838922cacba",
              id: "_x39_iBZKN.tif"
            },
            children: [
              {
                elementName: "image",
                attributes: {
                  "xlink:href": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAA7CAYAAAD/9U3AAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA\nGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAh1JREFUeNrsm09OwkAUh9/QKVVE\nxBiMxgUrTdSYNHIBDuMFOAl3cOkpWJuY1MRo3MmS+K+INNB2OnaMW3mDIqL5fRs2L+2br/DSX2YQ\nZEm5Idr5h0/zpfV6oYO/3Juc4oJmAc05L6L613srEPhRIBiCIRhAMARDMPgawvYl/fik6q9uS/bd\nr3s9pqifTayJujGlkWabSx5VoEY65Oq8TccXrmB7K9VdkqXJ36n6oUelCv+9uzp7CR5vY7Y3afuS\nnsul2oHH3vihr0gtqYk18VOBtM54wcIuneVyyVkWbJ234ZBk5K3vFqmS17E/fUf4GBGYwRAMIBiC\nIRhAMASDz4OGFZenfXJX+OcRvShKEya07BdpecflA4QUlA74QFLeK5Jb5nsb3MSUMNcbno/IcfnQ\nEt4lsxUcdpOZPdW1I49NVO/NlQTplF+skWtzPSN33Esn1ox7GBGYwQCCIRiCAQRDMASD72L25MzW\nR3WeN/VqTpsK/JaLSXzu6mwSmkFFWStPhsE81yptTgjOnIYKbcpsE59NQvsgyNfbwYjADAYQDMEQ\nDCAYgiEYCn44aCxyc+YUpjkoyCa0YQbBX8EccbU5hamVxojADAYQDMEAgiEYgsE0iN+4qe02VSHe\n8oXm/zqWyedAO0ObXRKzoxH+e8G2FKnRzD9qFqWdmC7uMSIwgwEEQzCAYAiGYADBi4Fc8P7MuTnX\noi5c1AW8CTAA7T+aVBT+kZ4AAAAASUVORK5CYII=",
                  "haiku-id": "Layer_1_7_-590fa175bf99ea7d",
                  id: "Layer_1_7_"
                },
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
};
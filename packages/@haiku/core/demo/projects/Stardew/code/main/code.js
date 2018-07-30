var Haiku = require("@haiku/core");
var _code_sunflower_code = require("./../sunflower/code.js");
module.exports = {
  metadata: {
    title: "Main",
    uuid: "4749fd59-b916-43be-aa61-fd8ea766f27d",
    type: "haiku",
    relpath: "code/main/code.js",
    core: "3.5.1",
    version: "0.0.0",
    folder: "/Users/zack/.haiku/projects/zack4/stardew",
    username: "zack4",
    organization: "zack4",
    project: "stardew",
    branch: "master"
  },
  options: {},
  states: {},
  eventHandlers: {
    "haiku:Main-03757d2ca1026e0a": {},
    "haiku:Sunflower-5ad52c7d1d2a6d96": {},
    "haiku:Layer-1-Stardew-05-1267a4848949b5d9": {}
  },
  timelines: {
    Default: {
      "haiku:Main-03757d2ca1026e0a": {
        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },
        "style.position": { "0": { value: "relative" } },
        "style.overflowX": { "0": { value: "hidden" } },
        "style.overflowY": { "0": { value: "hidden" } },
        "sizeAbsolute.x": { "0": { value: 470.213, edited: true } },
        "sizeAbsolute.y": { "0": { value: 473.367, edited: true } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeMode.z": { "0": { value: 1 } }
      },
      "haiku:Sunflower-5ad52c7d1d2a6d96": {
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: "auto" } },
        "sizeAbsolute.y": { "0": { value: "auto" } },
        "translation.x": {
          "0": {
            value: Haiku.inject(
              function($repeat) {
                var margin = 150;
                var spacing = 92;
                var gridLen = 3;
                var i = $repeat.index;
                var col = i % gridLen;
                return margin + col * spacing;
              },
              "$repeat"
            ),
            edited: true
          }
        },
        "translation.y": {
          "0": {
            value: Haiku.inject(
              function($repeat) {
                var margin = 150;
                var spacing = 92;
                var gridLen = 3;
                var i = $repeat.index;
                var row = Math.floor(i / gridLen);
                return margin + row * spacing;
              },
              "$repeat"
            ),
            edited: true
          }
        },
        "origin.x": { "0": { value: 0.5, edited: true } },
        "origin.y": { "0": { value: 0.8, edited: true } },
        "style.zIndex": { "0": { value: 2 } },
        "controlFlow.repeat": {
          "0": { value: 9, edited: true }
        }
      },
      "haiku:Layer-1-Stardew-05-1267a4848949b5d9": {
        x: { "0": { value: "0px" } },
        y: { "0": { value: "0px" } },
        viewBox: { "0": { value: "0 0 474 474" } },
        enableBackground: { "0": { value: "new 0 0 474 474" } },
        "xml:space": { "0": { value: "preserve" } },
        "style.position": { "0": { value: "absolute" } },
        "style.margin": { "0": { value: "0" } },
        "style.padding": { "0": { value: "0" } },
        "style.border": { "0": { value: "0" } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeMode.y": { "0": { value: 1 } },
        "sizeAbsolute.x": { "0": { value: 474 } },
        "sizeAbsolute.y": { "0": { value: 474 } },
        "translation.x": { "0": { value: 237, edited: true } },
        "translation.y": { "0": { value: 236.36700000000002, edited: true } },
        "style.zIndex": { "0": { value: 1 } }
      },
      "haiku:vqG9U3-501916d02e7e2cd1": {
        overflow: { "0": { value: "visible" } },
        "sizeAbsolute.x": { "0": { value: 515 } },
        "sizeMode.x": { "0": { value: 1 } },
        "sizeAbsolute.y": { "0": { value: 517 } },
        "sizeMode.y": { "0": { value: 1 } },
        "scale.x": { "0": { value: 0.917 } },
        "scale.y": { "0": { value: 0.917 } }
      }
    }
  },
  template: {
    elementName: "div",
    attributes: { "haiku-id": "Main-03757d2ca1026e0a", "haiku-title": "Main" },
    children: [
      {
        elementName: "svg",
        attributes: {
          version: "1.1",
          xmlns: "http://www.w3.org/2000/svg",
          "xmlns:xlink": "http://www.w3.org/1999/xlink",
          "haiku-id": "Layer-1-Stardew-05-1267a4848949b5d9",
          "haiku-title": "stardew-05",
          "haiku-source": "designs/stardew.ai.contents/artboards/stardew-05.svg",
          id: "Layer_1"
        },
        children: [
          {
            elementName: "g",
            attributes: {
              "haiku-id": "vqG9U3_1_-9e65a4af1b5024ca",
              id: "vqG9U3_1_"
            },
            children: [
              {
                elementName: "image",
                attributes: {
                  "xlink:href": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEATwBPAAD/7AARRHVja3kAAQAEAAAAHgAA/+4AIUFkb2JlAGTAAAAAAQMA\nEAMCAwYAABGuAAAhFwAAKpH/2wCEABALCwsMCxAMDBAXDw0PFxsUEBAUGx8XFxcXFx8eFxoaGhoX\nHh4jJSclIx4vLzMzLy9AQEBAQEBAQEBAQEBAQEABEQ8PERMRFRISFRQRFBEUGhQWFhQaJhoaHBoa\nJjAjHh4eHiMwKy4nJycuKzU1MDA1NUBAP0BAQEBAQEBAQEBAQP/CABEIAggCBwMBIgACEQEDEQH/\nxADCAAEBAQEBAQEAAAAAAAAAAAAAAQIDBAUGAQEBAQEBAQEAAAAAAAAAAAABAAIDBAUGEAACAQMD\nAwMDAwUBAQAAAAAAAREQAhIgMQMhEwQwMjMURAUkNBVAQSIjRSVCEQABAgIGBwYCCgIDAAAAAAAB\nADERAhAwIZFyAyBAQXEysjNQscHREpJhoWBRgeEiQlKi4nMTs4LSIxIAAAMGBgEFAQEBAAAAAAAA\nAAHCIEARMYOEMFAhkQIycRBBYaHBUWNE/9oADAMBAAIRAxEAAAD7Vy/IfZ2wrcimLz1q61SmpDOi\nVYtajIazC1FaZVq4VuZUwa1NaUsBoyGktajIVktubVRWmVamVTOd63ndBbBmwq3NrUYDTJe7L2ce\nUufH3MNa6XG8hrZnmWpViLKiJ1IoVQCS4dVgvS42GWkLNBKsSazJFakUVJZElwtYrrdzozjWlCgU\nEzrK1FayUpXVXs48Fnk75m08tWq3nWcVAWIqEgwpNRFklCLM7Lz1bN1LnFQBCwKFDQTURcpNguJs\nvPWrWrGcVBIKgoUNAsB2Ze3jyNePvlVZWLUVWbVylViuts0LYDUiBVjVDM1KgWpK0zaRmbeel2zT\nN1lWpALLRbWZqVLC1IWmbCSa1pi1tKDUBZLXQezjy1m+PtplWslZzuOufSaYASqxnodUpmLQy1Km\nsq2zYuOkLln0F8vbeq5TsjjO8nzz0xcNgw3Ky1mrcq2yq5srE3Naz0lIUJjcbnrR1VZwVW2ns48D\nPk72YOuoM0oRpGZuTlZKzUS1UqBVVi73HB15TeePF1173x+PXH3nwifdfCV918FX3nwtV9zfy/Vy\n367y7ci47M54uyuDpjWsldS2hlpGVTBRVS0EsjdmXs5ccbnl9GbbV1nWc1AIKRQKFNOQejfz+esf\nR8XHz9Hz8859p0ZspTZm1YbVhtGG04ulZ1LSyFpEej1/O689foNfLvjPqY8XtwSdMDM2OqloKCha\nzNRdq9nHnZfF1KrNiblltXG6Cgq2bDz+PHl9Rrz4ek6xoubZrrWsa53fQODtJ5Ouq4O4ODurheyu\nU9OS87ubzupeOfQbhnXPee30/iXF+j18z2+N9E3z5oLSBS0qAiL1Ht44R4uwlZzua1hqOoWmpoL0\nzzzz7fL7/L7nCTfts9NdM03Nc9VQRU5moslVLLVKVBnSJhEqWSWgqce+E87rN2ZIno+9+c+j573J\nrzaJS1EqBSWuo9nDkPH3MyduPVk0DlrZZq7zmeP6HytY8vg68voLvOta2ctRVABmLtjdTO1YulSq\nUbFhYjGy50VnRQAZjrWLuPNPVx2c5Oez9H18Pp+fvdawYtlILFV1Hs4cpZ4++J0OsboBIt56resb\nznl8x5vW8NO3ozvVclnUmKq51Ky0malgkrTNrWsUtZSgg1mZNRs7zqpNSstFmpQY3muPn9fn6nf3\nfM9/K+rLnwwLGpWc7zrW2ns44Hi625BqRUzca21uxOmdYx+czl9Q6dePbGug5gUFBQUFTNOpdIlK\nABa1jeRg0AQUFBTOi8uPp8+ye/5n0g+tjtx+e2yrZcVYL1Hr4cpZ5O+YmtbuNBqWhKoXpjecflS/\nVd+jj35pLlFCKmS5UhtXNAqigUFLGhG1ABaiyoHUQ2maWksTn0y3k+j876Lj7PHtx+fpY1qwpVDo\nr2ceA8nfM2nlehpuXOagLXQPynS36b03jfNzbqs7YLcyoIzNl560qagtsCsECpNFGgmpmd4ICszZ\n1idEZq1Ma8+jn9D530nP2ePbj87RWtQ2Eskd2Hs5YS+PslRlY6WKoC7xsPzlr6JveN40ABQNdZoy\nVEWSI1SxJZalGtgLYAKCrrNHKkiqgqc+mNPl+j876Lj7HDv5/BvdyW2UEF6j2ceVjx9tsA3mKBaA\nu8bM/Ex38/uzd+f0PQMg3WG5ORGrhO8FTOzc+hQAzouG1ABdThvFBG2A7YMlNnOvPq5/R+b9Kx9j\nz+nj4N8tautDWTLVjTT2ceEufJ3STWuozlQAq7xoz8rzejz+15enzencsuKy5nUikRVzY0UJZaqh\nzLECgrShhltZKRFXOooAqsef0+bpcvpfN+jZ+1x7cfnapVUCEXqj2cefLq8nfleiZQzblWpJVN18\nTl24+7hj0+b0vYaxZbxWbSzHRWLpTeBbmVBBmLsAFDdYazOdDTHRWbVAG2E3yenOrx/S+d9HWPs8\ne3H52g1obDE3Jrb28eY8XUsqWFRmdXGq30x1xz+Dx7cfocsenzel7LGKwoKCgoJiFtzYKoAFqrmU\nICgoJCksact8N2Po/N+lY+zw78PnatVVSESeo9nHCPH2Cuees1rnOkdZLW/T5/Rz4/B4sfQw9Pm9\nN03JnDWdMRVAJS5mk5mo0stKpUGdXKYZbTOqM6oASly1Jw3Gxy750eX6Xzvo2Ps8+nH5zuSOgUK6\nj2cOZPF2M51rWuXSrnQMXanblrOPzvPfP6br1+P15bKwZ0ki0JRJOrjcSaVlpUqkaFhYzOjSlSy0\nFRJOmSblZs8+nm3Y+h8/6Dj7PPc+drMsVLFqK7I9nHGNzx9uTqdY2plGa3eOq63nvOfzHXlr6h6X\nPty1dGa8t5nNpE1Ky0aalIkrTFrpcUtZSgg1JzNRc7liTUnLSoqqyh5+3DY9/n9mL6WZPEwqmoGM\n9JrVdHs45nTHg3ApFTGuet7uqE1KZ/M2X6menp83p5O5ZzchAoKCgrMrWloJQghZa1nWRgQKCgoJ\nxc6054enz6z7/V07eOwsxpVC51iiF7D2cOeN58ffE1NbusaM6TQS0AV8jh9Xw+s8vbj26uxzBqst\nSczUbKxbrGiqaCNKWQtZRiGoAtnLWYk1HWQ11jRUGc+b2dF+j2568OM89TXQKopVDor2cOMs8feK\nXF0pqUKiESeni9vJPlcfpfJ9mvVZoC4rUiAqKXNqlgtMqsICopVmwhmdZICpNFzapLmuv0/mfb85\nxkzz1S0FLNhCV1R7OOLm+PsVGGpMIunPdMbk8+/PVdfF6pZ+Jr08vW5Z05Am8amTSstZghazqpKn\nGhrcg0ACgq6ymNYinpHxevv252PVicLON51qUnVxY0lCFrqPZw5WPF31cI3mKk0Xl0qQhKqejgDn\n5fpctvyXv+b6LbM0bYN1vKF2zzVqQt1hG7zpamS1FbYRtilpitpkXoz7fTwfl+71Y55287F242KS\n61Fpc7s0rQZbBpt7OHnlx5PRC61s1jEVSxCEwK1mhqRDG7XO2sXAaLUa1HN0Fzbi5aVlpWWlYulZ\naVk1WM7w66MisaqWohJQkGtzQtyqxK7I9nHljbyd8XSWs0zpJViUChVQCzVRqVhqLOfUuNUTeNGb\nJK1koFCighqo1K56FzjqXGqJvNM2ZlayLRQURVuegZmpW1e3jzL4u0FRIusyLrXPVaZoUUqgJFhK\nEqsQlLmLZIutc9VpmhS0oAQzZIKqhCUSKZOtaxY0gKWigEpBeo9nDDLxdrBcZ6l4uuVxWpzq6MrA\nauAAoUuFdGaDNLjHYvF0y6ybqatMtZZzuZUXkvRjdLz3WmQM6LjPWLybjrNapbTLWWc7mZVSqFdF\nezjxHj7SI6nTn0qyjMq1KoUBJrKwKJVRVJUiOp15dYSglWllCgJLFkpRKrOqEqZNadMbCKCVaVTI\nFJYsCkV2ZezjjJ4++BrWthkAUC0AKkFgVgXNHW8hnIda2ZyEWgKAhUgoLMi46kskY0OtaM4CmgKA\nQbIdBWcjroPbx//aAAgBAgABBQCWSyWJuMmSyWSyWSyWSyWSyXGTJZLJYmyWSyWSyWS0ZMlkslib\nJZL+gIQ0S16CIQyarSiEMmq0f88kkeuKSSP0ZG/Q/wCfoikIikUmsECRC9CCCEQtH/PIpI3WaSTS\nBMyQ70ZIyRmiSawIkdEyelP+eRWSazV3MTkt40xeNY19Lxn0vGfS8Y/F4y7jtSah5MyYnSSdUf8A\nnpkj1JSdnkZx8PIr1aiLT/ElEolEolHQ/wASLS+yW+DlLrLrBPUj7CqQ6s4+K3JWJH95Y25dzMmZ\nMyZkzJivZkzJmTEX8Nl5fx222rV9hSUSqOCGzh4ro6IdyGyaT6Vrh5IhHPxXXXbafsCBqCSRs4ev\nJZbCufSsUkmk6oNhXS0i+3/LR9gSiaQxnFxO25tIl06UmsHUjQ6TRb2PpzW24Kqg6fQVRIyOl3oT\noWu3bmX+pbCp9gjoNVZ/83P0l6KOb4bdq/8APJJHRsb/AMWNm5FJJpGnesk0tUnP8Nu1Y/8AP0sl\nQ9D9N6Ec3w2bRX7AjQy1yXKKzSKSN1mk1giiUnP8Nu00kn/z0QtDLN796Rp66Ouh1s25/it2rH/n\npwTWKWl+9ZJpFI1TWC1wuf4bdqJk/oKpDRdvaX7/ANFakc/w27V+wpJNL97bWX7paZ0xqkkTOf4b\ndor9gQNKkj6u1dL4nRA6TSdUEUtUnN8S6aPsEZIkggaH7X0oiaTSCCBaHSaQW7ctywikiZP6BOq2\nkZ/837rV/adC127X8lzdFT7BUa0cfJa7rqzV0mi9FX22l3W9aP8AnkkvRY3bdx3O5Uis0jQ9EkiO\ndtXJVdP+fogRd1VrxFfa6vXGh0dytL+ax2t5CpFfsCCCRurUll7V1l2RBBiRSCCKQQQQPldpdyu4\nxEopJNJJ/wDPR09CbkTef7CeQyvMrybybybybybybyeQTvIZ0p11fYJwSP0JEyRkaponRkaXT7Ck\nCQ0R6EEEejBBGr7CKSTRukVisk0bpAlI0NVkmk0iv2FH6HWiH6b9CP0Co9aP7I/s9aLhDHR6UfYf\n/9oACAEDAAEFAIRBCElEo6HQ6CRCIRCIIElEo6HQ6CRCOh0IIISJR0Oh0EiER+oRCGjJqkipFUQh\nk0kWlIhDJdVo+4JG0PXFExtD1pUTG16EfqCaQQJIhEUiksmkECQ0qxSawQJIhaPuCBITG5ohNUkm\nkCYr0h3pmaM0dy0lE1gRI3NExtQST+oRCrJNZq7mJyO1IaIRCIIFamXKHkzNidJJ0TSP1CaJHqbG\nn6kCgYhPUj7mqQ1Vs2JrA0JIaIrBBBCrCQtX3FE0SqNofVLpSCOgiV6cVlafuCBqCTIbE+rFuTSK\nSTqbpGjHpOj7hEobkgaYx4wlRRRQSMgjSoooJHRksVJE0SvqSKJdHcXbi1/2n02SW7Cp9wjoNExS\n6ZWlRR+iop0qy3av3BJkOjYt2ToknTOmSRskZbtWP1Gl7pqX6KiEP0WWbRX7ggir3tshzrmqJ9Bs\nZY+k9CSf1CIWhkoWhemktDGWbHWkfqE4JpBBMFvuVZpPotkk1iRluw2Jk/qapDRc3NnuWtJD9JD6\nDLNpr9xRMmnJ7rbWmqxWazpaoiaNDLdor9wQNIkyZd1aIrNIGST6EEUboumj7lGSGyB2saFvNEyR\nMkbII0p0TJJIGQQf2kTJX1KdbV0ljotf9p9NidGxU+4RKGqTVaFR6Y0J0dIbIcqrZ9wSSx0Rapd3\nTTJOmdMk0dzQlV0j9RWCGIu6q14jT1RSRD1QxXKX/kIZDr9wQQSNzW5SK6W0QRpgVIIIILlCV7jB\nFqikkjJJ/UI6UnTB1IcK25mNxFxDIuIuIuIuIuIuMbhW3RDOiJOp1rDIPuE4JGRqkkTgkZGlkkic\nEjII0On3FIEhoivXTDIGiPQggaZFetPuIpJNG6RWCKZCdG6QJSNQNEUTJJG6RX7gSLojXDokXUnV\n1q9cEP6lH9nR6UPZH9nrRcIY6PSj7r//2gAIAQEAAQUAyuMrhXXGVxlcO64uuujO4zvFfdFt905X\nGVxlcZXGVxlcO64yuMrjK4yuMrjK4V1xlcZXGVxdfdN195neZ3Ft9xlcZXGVxlcK66crh3XDuuMr\njK4yuMrjK4yuMrjK4d10Z3F194r75zuFddGVxlcZXGVxbdcZXGVw7rjK48e67uauT2i20PRd6fJv\nx71VHutqPf0Xsce1VoWnx/kHdA74O4ZCcp25nYZsQQYkDpJkNzWCB9DId8Cvkypdbk7bcaQK0xIH\numSZD61ijcGR3BXyK6Rrp2y22KQQQNdJJEzKsSeOv9g97t1S3azce4q3a0Mew97d9Sq9/Qu2paLf\nXdtqR4/yUu3dFtZvV+gt6XbUu3e1LNlVj21W70e9bhbrcVWPXbseP76QmYowtFahJJkkjZOpIhEj\nuZLdJITMUYWmKEopJI2TqSURBJk9GKMEzC0xVZJGydUI2G2eO33CGQyNEkkjaMkZ2iuTJVU0jJEo\nZBDMWQx9CaJkkkjaMkZ2mSN6pqG0TSCGYsh6JRKJRKG1LuSFejJaJQ2hnj/IKsOsoytNx7QzG4Sa\npktSE+tGnEOsoytpcNOMWLZNIyWqUJqrTIdJRkjJUacu1itaorkkmnp8f5BCq97tqW+2tw9ta3Fo\nuLqLZ1ZdvbvqWh7Olxb7q3bD3499Hj/ISZMyZkzcakxRhaLoqtSYowtokQjFGKGoRLMmWuXBihcV\ntw+Cxn0/Gdq07Vp2rTtWnZsHwWM7FiMEYoxRijFD3klmTMmS6YodqYrUnVoxRghWpUgSIR46XcJQ\n7kjO3RBDMWQyHoghiTpNLk2sLmdu8wuR7Du2H1fAP8j4vGfynhH8p4R/KeEfynhH8p4R/KeEfynh\nH8p4R/J+HcfWcAubjuSvtuIMbh8d89u87d5ixpqsMhmLIZD0QQyGRSUeO13B73brei0PQtS2Ldy7\nfm9g9/J93ocfyHF8fD7tV+9VoehVYzx/kLt1stxbelLLBbwi7f8AKX3WePdz86t+p8g+o8gfPzs7\n3MdzkHdcyWSyWSyWSyWSyWjuXi5uVHf5kfUeQfU+QfU+QeJz875O7yi2tSaaUQqMZL1zW48Z/wCy\nB2S1ZBjRPpJkT6GBzc/Yb/I4r+bH+Zl+b+R+o4nfKFZK7Z2ztnbO2ds7Z2ztnbO2ds7Z2ztnbO2d\ns7Zx3dm760X5jovzUHB+V7/KYF6xckehiQO08e3/AGEEEUTG0ZIyROncxaPruI87zeJu7y+N25oT\nlXJtYMwZZx3Y9u47dx2bjtXI7Vx2rjs3nZuOzcdm87F52bjsXn0152L0dm87F527jt3F3Dc19PfR\n3JHjeRZw89v5nxXd/IcJbzW85i1pmkEMkbGzx/kFtou2ottC3ex5u9LPbXj9tX6K3Hvr5Nzj954H\nse2lCq6eP8kUY9pY25lkslksTcy6caTOdK3hfNyx3eUuuuuFvCLLVjbbbOFhhYQkNKksl1libFvS\n1KGlEvRCIRCIRhac1tuUIhI7l4/I57DwvJ8i/wAqEPcVEXEsl18f5JJriOwdkGNMS23riYnL5H05\nz/kZ4X5nQ4+PMXj9ewKzFWrrVqSDEdsDVIEiKq6DKjuhq6aTpv482+CE+PoXWyeO+zzfzBw3d7id\nsUkyG5I0eP8AJWUSqPaGQxJxanMMhn5BpPlut7RDPHThJyPdaZVGNMh0VIZD0NObd9UoezTjG4aa\npKPCut+luaa1MR4/yUu3dLPbot3p+a913tpwbanu/QW9Lt/SYt6c+93tPD/bce63o6unj/INubm5\nlkIt2rBbuPn5E/y/Lfdcrm2rLZ7VhbbbbSWO5lrbb2ljdI1WpMhUbctzoZLMmLZksk3EutOS1N8l\nlqsOLy+ezj/G8/LzcrSVG9Fz6u5o8a67uDR20ztowREDcGTO4xXuLLm2X/kOVX+RzXeQ7eNZdtaI\nMUJRSDFGKIo3A7jJkltzMmZMfWi3xQ+j3IMVTcgxRiiK3F6mzBCUL8R89200SkxIHaOxM8axdyiq\ny7aSGJOOP3HK13Ey33eqxkOi0rcu39O4vTxJR+H689y6UVXTx/k1X7C2Ldzl+Wwt93q3b2+gtx7+\npyewu934L9xye2i0+P8AINuXc0Z3EsT6NJmFtILEssUc3y8ZZ7sVrZLMmJsl0aTEkqpJmKMUPemT\n1MlmTE2SyXW5Tb27TkUX/gv3HJ7SSWZOsHjr/YNObrXMMlCuUJy4IZBZ0eSOb5eK1sssuVxKJpiz\nFjTQ9oY0bEolUSkxZixdDJGSHvJKqlJizF0ZDIpJJKJHscvyfgv3HJ7dKRDPHX+yl27otrN6qnL8\nvj7LeiFvS7aj3dUW1u0Pdb0t3o96vQh7HL8n4L9xye2irbseP79EIgWiz3HKl3eMW9LR7f0i2u29\nPk9ksu934L9xye3Sxnj/ACQiENIjRLpJa3Ms5fk4xb0lol6FvCHvrZLJZLFWWS9Fu8LXd1WNpydL\n/wAF+45fZLFtSWSxnj/JKE0bkEPVausHJx3dyy12i31rfJDUmLMXSSUZKjRDMXRNIyWtOHkjFmLM\nWYukjag5Pk/BfuOX2CuSFcnp8f5BbKr30W7nJ8jFv6Nu1WPU92Lf03sMdOT5PwX7jl9g97N9Hj/J\nWWTqs3L0s/I6OxvOq3hEIu2rLJdYRC1QiFW3eEQh70lkslkut/sll3u/BfuOT2QQiFVEHj/INwO+\nBX9dVu5f7/J3s99EpMYMjIbkZJkJzoSkxMRqNKMTEjEyMqPoSZCc6eT2F3u/BfuOT2CRiYkGxJ47\n/wBhc1L6iTmkEMh0t6OUX3LPyGm7PfS1jair2pbuQyGLoSiUXPSt5RKLmoJVHtS3akMhnIngXe78\nF+45PYJ9E0SiUNobR47XcL/dbstxCq63+/lLPfpe63u2ELRd6y2u2oqLenL8Zd7vwX7jk9uq48b5\nPSt3OT38pZ76Wj29W4W+lbXbem9jl+T8F+45PZpYzx/kpBFJG+mRkLqWKbsDk+TlLPfRODL0m4JJ\no1IrYejEmBufTbguui3ul7m/8F+45PZJEitMSRsmTx/k0SiUNqJRKE1HG07jk+TlLPeQ/SlEobrK\nJWiGJOZQ9/QlEolDaL/aXe78F+45PZDFsiVR08f5KMew99HB8hyfJzb2e+l3oPbUhb0t2e3ovTd7\nS73fgv3F/tpdto8f5NGKMbR22xCoko4Uszl5L+67ncWe8yZdcxNyNuU9MIhDSHSBIiqbRLo25tbb\nJemCEQjFDSGk1hacii/8F+45PbLJY29Pj/JRtIyR3LRNNNSsWYXCtccai7JHL8t1ytOO+130akVr\no0JVklGSo0O1mLIEhGLMWNRVpyk0yHolGSMkZKjUl3Rdy05HN/4Nx5F7m3FkDpNfH+QlFzUyiGWL\n/HRbuct1vdutd5x8XIuSVSGyGSiUSnSUNqWQ9STEnJKHvolEqsqjIFvTk9hda5/CprndG1LarsZJ\nHj3W9wu3u3W5btoW5y/L4+1bR7DLd3sMWu2r30Pai2e1Fp5PZT8R872Huq3b3HjfIQmYWs7dpiiI\nG4WTM7hXXRbc5lnL8vFc0W33O7FGKH0JZCMUJJUhGKMUQqNjbMmSy1syZk6rfFD3IRCrCMUQiEQi\nWSy9vEs47Hb+PtVnLkyWMtUvFEIaU4pnj2W9zBj6Ok0ucLJGDFa4tTTOX5eMs99LvTufXcxZDEtK\n3Hv6L2kiS+14nB4fNfw+P43JxXRSGWqGShsR4/yF3u0cntFtXl+XjLPfS707t7fQW49/RexacnsP\nC/aXD2FsqsR4/wAksu3ublNyLYhab7bc+ZJO33a3sMWu2r39B0kQt68nsPB/Z37Xe2i0I8f5BqXd\nb1xMhXdLXLgxIIo/x9jf5Dx1wO33aMTEaikDXXYkkTkSkxMT2mRkPqNk1SkxMaNEEGwn1mtti5H/\nAB1h49vb4L7ujulQRoSkSg8df7KNSYnbYrIVqhkkjZNPyHjXc7u8G/jt7iolJjBkZDc1aHaYmIlA\nnBkZDc6GpIorZIxMjLRA7TEijcHjf58/01wrsC67JacRdBs8e7/ZqWh7CObfyPgW5aPb+kW123pX\nHh/ujk94tTGeP8lH6F2xLPH6rktt7bssiS3TbuXb62MkQttdu+h7HhpO3jttV8l/uuFuLarEeP8A\nJImbkGI+jbgyO4Jyn1MTAsu7Z3cx+Mo+iRzcXZeWhdHkRJiY0bgyMqNSYmJEGUCu66k4MjEueL4/\n8714ab/ibTh8FcS7KsO4Pq2pMYpnBbdJOjx/kEJolEoe72hmLLdqss6XO62MLzzOLkb7XKiUSiUS\niUK62MrTK0lDaHSUSiUShtSxbyiUSiUSiUSiUdu8u8fnufB43kW8ttlyuztM7S+6126IY05tTTIZ\nDIZ46fc/oebfl+L+rW3je17PYWha1Tx/eNuXc5V100RBCIQ0iFVEKjtVw+Lja+j8Y+j8Yt8LxW/o\nfEPofEPofFPofFPofEPofEPofEPofEPofEPofEPofFPofFPofEPofEPofEPofEPofFPofEPofEPo\nfFPofEPofFLvC8VL6Pxjt2HsHfdGVxCEkQjFGKGlVJRCIVGNs8dvuFzeW4rVIl0hEEkslk6JMmZM\nyZkx8lydvJdN3Lcl9RyC574XNezu3GbM2Zs7lx3LjuXHcuO5cdy47lx3Lju3HduO5cdy47153bi/\nlujvXncuMncLq8EQbDZkyWTWTJmTMmSNnj/IXJ5JOEnRbE+nDpcnKXW72wxJwt6ShtelDIdIYtr+\nqhkMQtyUNobUehDIGeP8mlbP07aset+mtn6C3o6rbWxnj/IQQiKSNuMmZMW2mCEbEk1RCIQ1SS5s\nlmT1IhGKNhtkuqIRCHSWSyWLeNMIVqMUSNunj/JFGyTJGaQ70zJGSFeoV6ZkqJEEGSG0TXcSpI2o\nyR3EO9MyRkjNCuTJpAlTJEjrAlSRtGSM0ZIyQrlOaMkJzSBI2MkSN08f5KMdHvoW9F6Cq97ttVot\nxbD29G4e2lbWi3pdto8f5NV21Ftbv6L3t31Xb3VWu73Wb0W2l0uFuLbQ9Pj/ACUbcyzK4tbdrIRi\niEJKkIhELVCIVW3LbjK6sIxRCEkQiEQhqrSEkqQtEsbZa3JCIRiiEJKEkQiEQhpafH+QmC5qZRiy\n1f41gSIrOnJGaFcmSZIdyluTF6YEiKSNk1mDJHctNxuDJGSNy1OdECVZG0N1mB3JHjXruD3u3W5b\ntVbKr0vYe9m72HvbvqVWPRdtRbXbUt2W9VvV0e9bt7jxvk//2gAIAQICBj8AmJiYn6TExMTExMTE\nxMRj6TExMTExMTExMT9JiYmJiYn/ANSMhukZDdIyG6RkN0jGOMRGPIT5CfIT5CfIe+LdIwYFMaF9\nkOJnx08kJEJFtgSLYSLYRIiHX7IQ5FDAukYJDTHicdCESbukNwKYOJe4iJ42omNSBHwLSHgQP2Zu\nkNkXkG5Q9OR/Js3SGy5GROvI4FFm6Q2TryP4ZukPnLwzdIfOXhm6Q+cvDN0hsideXhm6Q2Try8M3\nSGydeXhm6Q2Try8M3SGydeXhm6Q2UQUHTl4ZukPnImbpD5y4+0TZukNkRG6QMGfybN0hsjIGfJzK\nH8EWbpDeg1ECcNRAj+ho1dIwS0GuNGA1L4wLpGFoZ7jse47HuOx7jse47HuOx7jse47HuOx7jse4\n7HuOx7jse41wbpGQ3SMhukZDdIyG6RkNygf/2gAIAQMCBj8AYlhREsKIk1SUxphwcqSshpfuQ0lZ\nDSVikX9wIYlJWQ0VPUW6Sm9Bq80VPkWaKm9C1dZs0VZDSVkNL9yGl+tzeqKm4xeqSshpKyGirIaS\nm4vVJWQ0VZDH/FWQ0lPejVL9wNHPQRZpKbgQhyc9GqKsGGPHBpfuJMTExMTExMTExMT9NcGkrIaK\nmJPtFWQ0VZDRVkNFQ//aAAgBAQEGPwBzenN6c3pzenN6c3pzeuI3riN64jenN6c3pzenN6c3pzen\nN6c3pzenN6c3pzenN6c3pzenN6c3pzenN64jeuI3riN6c3pzenN6c3pzenN6c3pzenN6c3pzenN6\nc3pzenN6c3pzenN64jeuI3riN64jenN6c3pzenN6c3pzenN6c3pzenN6Np4Mzkm146oaDWnBmck1\nLJqYMnUNQZNqjJk1L1xwZnJN9ATgzOSbtIV5wZnJN9ATgzOSb6AnBmck1S+gytoeral0+g1Fqeud\nPSytFDqw6JwZnJNVDXBXjTOicGZyTVUNTtitq2ratq2ratq2qNtlfHTs0TgzOSbWGojMydcXyKhN\nMQT8CuM+0rjPtK4z7SuM+0rjPtK4z7SuM+0rjPtKgJzEtYVxG4qINh+CgKWTJqLdRODM5JtAat9t\nI3VMu+iVHdrBwZnJNqRoaiUyTGU+sWgw2FGGZP7iurP7iurP7ircyf3FdSa8riN5VpJTp06dOnTp\n05XEbyrJ5ryrMyYf8iurP7iurP7iurP7iiDmTn8O2Y/WFxzXlBWptQP9eZyTURinrnQHp9Xq+MGR\nm/xxhbxfcuj+/wDiuj+7+KEn+P0wmBj6o7D8FCFEYp06dOnTp06dOnTp06dOnTp16oeqIhBlwfP7\nkP8Ax/d/FdH938VLlf4vT6tvqj8f00OhWnBmck2oRTTXDzUlk23YPNEATWiGzzojobFsWxOE4Wxb\nE4ThOE4ThOE4ThOE4ThbFsUAQnFFqkzJgTLK8HZAejMtP1D/ALLhmuHmoyAgS2GNacGZyTV4Rok+\n2kaA1cUS7x30T7604Mzkm0nT0unpMRFTkWEAwIR/HNeVxzXlfiJO8xQTIWBMFwi5cIuVgpfU2FyF\ngZMogLiN6hJmTyxeExCypZs2eaUzWgzEgpkao4Mzkm0XTp9F06A9Pq9XxgynH+N5T+b7lwfP7qDb\nCCH4vkuL5KEdN9UjGCj6vknodSZvF6DGDRXR/d/FS5vD6xGDwqjgzOSbRfQbRkiYWF1NaGNDKaz6\nuwCmKtsodZVo4VYY1JwZnJNXZW6bwRpPYQRoy9yNScGZyTVsI/JZUTsPgoFjQys29hCKJolllmsA\nssCmlzDECWIshtqT/Xmf65tB6IaMKJh6ZbCRtUpmAHpjCHxQtT9ikUQU+HxFSf68zkmqW0J7fzHv\noGrivNM8P0+IqTgzOSatnxHvRQ7GNBWZg8QjUHBmck2nA6U+I96KG/sYighZmDxCNQcGZyTVs+I9\n6MED8dSt1abeszB4hGoODM5Jq2fEe9TfZ2TNvWZg8QjUHBmck1bPiPeih2MaCszB4hGoODM5Jq2f\nEe9FDsYpkVmYPEI1BwZnJNWz2fmPejFCqiNem3rMweIRogrNE4MzkmrZt576Bq41GbeszB4hGoOD\nM5Jq2azaVLCx0LdvYxTorMweIRobSODM5JqWTVM28qX7UN+hHVo1hoKzMHiEag4MzkmpsQqHU1u0\nqWHxQ319tU9aaCszB4hGoODM5JqDVzbyghv7Gm3UFZmDxCNQf68zkmrZt570EN/ZE29ZmDxCNQcG\nZyTVDJqXU2896CG/WHUK0mCZErMweIR0H0DgzOSbSdPS6eibee9BDf2I9BoKzMHiEag4Mzkmq/so\nm3nvQQ39jGgrMweIqTgzOSbSZNofZRPb+Y96tQ39jsiFmYPEI1BwZnJNpR0YmifEe9WqUfHsYk7K\nCVmYPEKAqDgzOSatnt/Me9fgEYOpSRYDb2MaDYsyP6PEVJt/Jmck1bPiPepvs0T2EaZ8PiKmb+vN\n/wBc1bPiPejBAHbTZ2GaASLSpjL+nxqTgzOSaiFXPiPeihvr7NWsRoknlhAiItRmnhAiFlScGZyT\nUGrnxHvRQ39jGjKw1RwZnJNWzWByhAQQ7GNGVhqjgzOSatJ9ZttUgBJ9QL/BDsYSEwE1kVxm5SSC\n0SiEaIVBwZnJNovUyETAekF/ijmGYESiMNyamOrRrJJWiVxBek2wqjgzOSauCzMJ7Gy99BqjgzOS\natdTRt3qawMj+EXdiTREbdqBAFBqjgzOSapZRpdHbFeiEPVZFH8XyXH8kAD6vVoxojrAkaO1Aep7\nGXVN33oj1xj8F6oxhsTKOhCGkcGZyTVLIaIJ+tOmKkhKS6iZSALSYJ6XTp06dPpvoOnT0PocJUZc\nuYj4BSmbLmADkhAkGEU4ThG3SbSODM5JtSCnwnu1wI76DXnBmck1Lp660RRBFhsK6YvK6YvKtyxe\nV0xefNdMXnzXTF5810xefNdMXnzXTF5810xefNdMXnzXTF5810xefNdMXnzXTF5810xefNdMXnzX\nTF5810xefNdMXnzXTF5810xefNdMXnzXTF5810xefNdMXnzXTF5TKEtgTp9Bqs4MzkmoKt1SNi2L\nYti2aOxbFsWxbFsWxbFsWxbFsWxbFsotUNQODM5JqDYm1Qpk2qWJtF644Mzkm+gJwZnJNqVnZ5wZ\nnJNrm3sU4Mzkm+gJwZnJN2QdZODM5JtF9BtRdPSyapaodC2lk1YcGZyTatZoQGpR0LENQODM5Juz\nBu1Wb+vN/wBcy//Z",
                  "haiku-id": "vqG9U3-501916d02e7e2cd1",
                  id: "vqG9U3"
                },
                children: []
              }
            ]
          }
        ]
      },
      {
        elementName: _code_sunflower_code,
        attributes: {
          "haiku-id": "Sunflower-5ad52c7d1d2a6d96",
          "haiku-var": "_code_sunflower_code",
          "haiku-title": "Sunflower",
          "haiku-source": "./code/sunflower/code.js"
        },
        children: []
      }
    ]
  }
};
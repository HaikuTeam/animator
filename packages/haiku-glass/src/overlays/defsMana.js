export default {
  elementName: 'defs',
  children: [
    {
      elementName: 'filter',
      attributes: {
        x: '-35.7%',
        y: '-21.4%',
        width: '171.4%',
        height: '171.4%',
        filterUnits: 'objectBoundingBox',
        id: 'a',
      },
      children: [
        {
          elementName: 'feMorphology',
          attributes: {
            radius: 0.5,
            operator: 'dilate',
            in: 'SourceAlpha',
            result: 'shadowSpreadOuter1',
          },
        },
        {
          elementName: 'feOffset',
          attributes: {
            dy: '1', in: 'shadowSpreadOuter1', result: 'shadowOffsetOuter1',
          },
        },
        {
          elementName: 'feGaussianBlur',
          attributes: {
            stdDeviation: '.5', in: 'shadowOffsetOuter1', result: 'shadowBlurOuter1',
          },
        },
        {
          elementName: 'feComposite',
          attributes: {
            in: 'shadowBlurOuter1', in2: 'SourceAlpha', operator: 'out', result: 'shadowBlurOuter1',
          },
        },
        {
          elementName: 'feColorMatrix',
          attributes: {
            values: '0 0 0 0 0.0572963765 0 0 0 0 0.0587644961 0 0 0 0 0.059204932 0 0 0 0.307631341 0',
            in: 'shadowBlurOuter1',
          },
        },
      ],
    },
    {
      elementName: 'filter',
      attributes: {
        x: '-22.2%',
        y: '-11.1%',
        width: '144.4%',
        height: '144.4%',
        filterUnits: 'objectBoundingBox',
        id: 'b',
      },
      children: [
        {
          elementName: 'feOffset',
          attributes: {
            dy: '1',
            in: 'SourceAlpha',
            result: 'shadowOffsetOuter1',
          },
        },
        {
          elementName: 'feGaussianBlur',
          attributes: {
            stdDeviation: '.5',
            in: 'shadowOffsetOuter1',
            result: 'shadowBlurOuter1',
          },
        },
        {
          elementName: 'feColorMatrix',
          attributes: {
            values: '0 0 0 0 0.0572963765 0 0 0 0 0.0587644961 0 0 0 0 0.059204932 0 0 0 0.307631341 0',
            in: 'shadowBlurOuter1',
          },
        },
      ],
    },
    {
      elementName: 'filter',
      attributes: {
        x: '-28.3%',
        y: '-23.4%',
        width: '152.4%',
        height: '151.1%',
        filterUnits: 'objectBoundingBox',
        id: 'c',
      },
      children: [
        {
          elementName: 'feMorphology',
          attributes: {
            radius: '1',
            operator: 'dilate',
            in: 'SourceAlpha',
            result: 'shadowSpreadOuter1',
          },
        },
        {
          elementName: 'feOffset',
          attributes: {
            dx: -0.3,
            dy: 0.3,
            in: 'shadowSpreadOuter1',
            result: 'shadowOffsetOuter1',
          },
        },
        {
          elementName: 'feGaussianBlur',
          attributes: {
            stdDeviation: 0.5,
            in: 'shadowOffsetOuter1',
            result: 'shadowBlurOuter1',
          },
        },
        {
          elementName: 'feComposite',
          attributes: {
            in: 'shadowBlurOuter1',
            in2: 'SourceAlpha',
            operator: 'out',
            result: 'shadowBlurOuter1',
          },
        },
        {
          elementName: 'feColorMatrix',
          attributes: {
            values: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.134227808 0',
            in: 'shadowBlurOuter1',
          },
        },
      ],
    },
    {
      elementName: 'filter',
      attributes: {
        x: '-18.9%',
        y: '-42.2%',
        width: '134.9%',
        height: '191.9%',
        filterUnits: 'objectBoundingBox',
        id: 'd',
      },
      children: [{
        elementName: 'feMorphology',
        attributes: {
          radius: '1',
          operator: 'dilate',
          in: 'SourceAlpha',
          result: 'shadowSpreadOuter1',
        },
      }, {
        elementName: 'feOffset',
        attributes: {
          dx: -0.3,
          dy: 0.3,
          in: 'shadowSpreadOuter1',
          result: 'shadowOffsetOuter1',
        },
      }, {
        elementName: 'feGaussianBlur',
        attributes: {
          stdDeviation: 0.5,
          in: 'shadowOffsetOuter1',
          result: 'shadowBlurOuter1',
        },
      }, {
        elementName: 'feComposite',
        attributes: {
          in: 'shadowBlurOuter1',
          in2: 'SourceAlpha',
          operator: 'out',
          result: 'shadowBlurOuter1',
        },
      }, {
        elementName: 'feColorMatrix',
        attributes: {
          values: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.134227808 0',
          in: 'shadowBlurOuter1',
        },
      }],
    },
    {
      elementName: 'filter',
      attributes: {
        x: '-13.2%',
        y: '-7.9%',
        width: '126.3%',
        height: '126.3%',
        filterUnits: 'objectBoundingBox',
        id: 'e',
      },
      children: [
        {
          elementName: 'feMorphology',
          attributes: {
            radius: '.5',
            operator: 'dilate',
            in: 'SourceAlpha',
            result: 'shadowSpreadOuter1',
          },
        },
        {
          elementName: 'feOffset',
          attributes: {
            dy: '1',
            in: 'shadowSpreadOuter1',
            result: 'shadowOffsetOuter1',
          },
        },
        {
          elementName: 'feGaussianBlur',
          attributes: {
            stdDeviation: '.5',
            in: 'shadowOffsetOuter1',
            result: 'shadowBlurOuter1',
          },
        },
        {
          elementName: 'feComposite',
          attributes: {
            in: 'shadowBlurOuter1',
            in2: 'SourceAlpha',
            operator: 'out',
            result: 'shadowBlurOuter1',
          },
        },
        {
          elementName: 'feColorMatrix',
          attributes: {
            values: '0 0 0 0 0.0572963765 0 0 0 0 0.0587644961 0 0 0 0 0.059204932 0 0 0 0.307631341 0',
            in: 'shadowBlurOuter1',
          },
        },
      ],
    },
  ],
};

export const SHARE_OPTIONS = {
  Web: {
    'Vanilla JS': {
      disabled: false,
      template: 'VanillaJS',
    },
    React: {
      disabled: false,
      template: 'React',
    },
    Vue: {
      disabled: true,
      template: '',
    },
    Angular: {
      disabled: true,
      template: '',
    },
    'HTML + CDN': {
      disabled: false,
      template: 'Embed',
    },
  },
  Mobile: {
    iOS: {
      disabled: false,
      template: 'Lottie',
    },
    Android: {
      disabled: false,
      template: 'Lottie',
    },
    'React Native': {
      disabled: false,
      template: 'Lottie',
    },
  },
  Other: {
    GIF: {
      disabled: false,
      template: 'Gif',
    },
    Video: {
      disabled: true,
      template: '',
    },
  },
};

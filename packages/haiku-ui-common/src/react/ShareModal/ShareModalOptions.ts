export const enum ShareCategory {
  Web = 'Web',
  Mobile = 'Mobile',
  Other = 'Other',
}

export const SHARE_OPTIONS = {
  [ShareCategory.Web]: {
    'Vanilla JS': {
      disabled: false,
      template: 'VanillaJS',
    },
    React: {
      disabled: false,
      template: 'ReactHaiku',
    },
    Vue: {
      disabled: false,
      template: 'VueHaiku',
    },
    'HTML + CDN': {
      disabled: false,
      template: 'Embed',
    },
    Angular: {
      disabled: true,
      template: '',
    },
  },
  [ShareCategory.Mobile]: {
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
  [ShareCategory.Other]: {
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

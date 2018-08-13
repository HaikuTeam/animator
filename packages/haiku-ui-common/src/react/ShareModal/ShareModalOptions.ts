export const enum ShareCategory {
  Web = 'Web',
  Mobile = 'Mobile',
  Other = 'Other',
}

export const getShareOptions = (doSupportVideo: boolean) => ({
  [ShareCategory.Web]: {
    'Vanilla JS': {
      disabled: false,
      template: 'VanillaJS',
    },
    'HTML + CDN': {
      disabled: false,
      template: 'Embed',
    },
    React: {
      disabled: false,
      template: 'ReactHaiku',
    },
    Vue: {
      disabled: false,
      template: 'VueHaiku',
    },
    Angular: {
      disabled: false,
      template: 'AngularHaiku',
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
      disabled: !doSupportVideo,
      template: doSupportVideo ? 'Video' : '',
    },
  },
});

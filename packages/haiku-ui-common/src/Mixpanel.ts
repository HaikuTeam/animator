const tokens = {
  development: '53f3639f564804dcb710fd18511d1c0b',
  production: '6f31d4f99cf71024ce27c3e404a79a61',
};

const token = (process.env.NODE_ENV === 'production')
  ? tokens.production
  : tokens.development;

export default {
  token,
};

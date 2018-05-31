const setup = (view, win) => {
  // TODO: Inject driver capabilities into the DOM
}

module.exports = (view, win) => {
  if (
    process.env.NODE_ENV !== 'production'
  ) {
    setup(view, win)
  }
}

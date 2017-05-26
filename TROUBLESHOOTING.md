# Troubleshooting

**"Cannot find module 'xyz'", despite it seeming to be installed within a symlinked package**

Try running `npm run mono:npm-clean`. This clears out all the npm stuff, re-links all the packages, and re-installs all dependencies, hopefully giving you a clean setup. This takes about 10 minutes.

const {crashReportCreate} = require('./carbonite')

crashReportCreate(() => {
  process.exit()
})

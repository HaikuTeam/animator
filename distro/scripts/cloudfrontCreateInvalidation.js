var initializeAWSService = require('./initializeAWSService')

module.exports = function cloudfrontCreateInvalidation (distributionId, region, awsAccessKeyId, awsSecretAccessKey, cb) {
  var cloudfront = initializeAWSService('Cloudfront')

  var params = {
    DistributionId: distributionId,
    InvalidationBatch: {
      CallerReference: Date.now() + '',
      Paths: {
        Quantity: 1,
        Items: [
          '/*'
        ]
      }
    }
  }

  return cloudfront.createInvalidation(params, function (err, data) {
    if (err) return cb(err)
    console.log(data)
    return cb(null, data)
  })
}

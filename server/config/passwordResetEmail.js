//From http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property
var params = {
  Destination: { /* required */
    ToAddresses: [
      'wweisensel@gmail.com'
    ]
  },
  Message: { /* required */
    Body: { /* required */
      Html: {
        Data: 'Look!!! An email was sent using the Amazon SES service by my program!', /* required */
        Charset: 'UTF-8'
      },
      Text: {
        Data: 'Yo', /* required */
        Charset: 'UTF-8'
      }
    },
    Subject: { /* required */
      Data: 'Made You Look', /* required */
      Charset: 'UTF-8'
    }
  },
  Source: 'wweisensel@gmail.com', /* required */
};

module.exports = params;

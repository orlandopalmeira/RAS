const nodemailer = require('nodemailer')

module.exports.send = async function (sender,receiver,subject,body) {
    let newreceiver = receiver.slice(0, receiver.length-16);
    newreceiver += "uminho.pt"
    let receiver_host = "probum2024@outlook.pt"
    let password="Probumtest"
    const html = "<body><h2>"+subject+"</h2><p>"+body+"</p></body>"
    const mailOptions = {
    from: "probum2024@outlook.pt",
    to: "probum2024@outlook.pt",
    subject: subject,
    html: html,
  };

  try {
    var transport = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com', // server outlook
      port: 587,     // SMTP port
      secure: false, // false for TLS
      maxConnections: 10, // 10 conexoes
      pool: true,
      tls: {
        rejectUnauthorized: false
      },
      auth:  {
        user: receiver_host,
        pass: password
      }
    });
    let r = await transport.sendMail(mailOptions);
    return r;
  } catch (error) {
    console.log('Error occurred:', error);
    throw error
  }
}
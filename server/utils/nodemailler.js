import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport(
  {
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: "vitaliy.tester@mail.ru",
      pass: "T95an6nEDwHHnMsEfFaf",
    },
  },
  {
    from: "Mailer Test <vitaliy.tester@mail.ru>",
  }
);

const mailer = (message) => {
  transporter.sendMail(message, (err, info) => {
    if (err) return console.log(err);
    console.log("Email sent: ", info);
  });
};

export { mailer };

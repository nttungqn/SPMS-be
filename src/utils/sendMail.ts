import { EMAIL_MAIL, FE_ROUTE, PASSWORD_MAIL } from 'config/config';
import { MAIL_OPTIONS } from 'constant/constant';
import * as nodemailer from 'nodemailer';
import { UsersEntity } from 'users/entity/user.entity';
import { htmlTemplateEmail } from './htmlTemplateEmail';
import { resetPasswordEmailTemplate } from './resetPasswordEmailTemplate';

export interface IDataMail {
  title?: string;
  receiverName: string;
  message1?: string;
  link?: string;
  buttonText?: string;
  message2?: string;
  message3?: string;
  author?: string;
}
const defaultDataRender = {
  title: 'Title Default',
  receiverName: 'receiverName',
  message1: '',
  link: `${FE_ROUTE}`,
  buttonText: 'Click Me',
  message2: '',
  message3: '',
  author: 'SPMS Team'
};
export const sendMail = async (
  emailReceiver: string,
  subject: string,
  data?: IDataMail,
  template?: any,
  attachments?: any
) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    //host: 'myhost',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_MAIL,
      pass: PASSWORD_MAIL
    }
  });
  const dataRender = data || defaultDataRender;
  const mailOptions = {
    from: EMAIL_MAIL,
    to: emailReceiver,
    subject: subject || MAIL_OPTIONS.DEFAULT_SUBJECT,
    html: template || htmlTemplateEmail(dataRender),
    attachments: attachments || null
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Message error mail:', error);
    } else {
      console.log('sent mail');
    }
  });
  transporter.close();
};

export const sendMailResetPassword = async (user?: UsersEntity, urlResetPassword?: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    //host: 'myhost',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_MAIL,
      pass: PASSWORD_MAIL
    }
  });

  const mailOptions = {
    from: EMAIL_MAIL,
    to: user.email,
    subject: 'Reset password',
    text: 'You received message from SPMS',
    html: resetPasswordEmailTemplate(user, urlResetPassword)
  };

  let errorRes;
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      errorRes = error;
      console.log('Message error mail:', error);
    } else {
      console.log('sent mail');
    }
  });
  transporter.close();
  return errorRes;
};

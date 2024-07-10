/*
 * @Author: Libra
 * @Date: 2024-05-28 10:51:09
 * @LastEditors: Libra
 * @Description:
 */
"use server";
import nodemailer, { Transporter } from "nodemailer";

const createTransporter = (): Promise<Transporter> => {
  return new Promise((resolve, reject) => {
    fetch("https://accounts.google.com/o/oauth2/token", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const { access_token } = data || {};
        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            type: "OAuth2",
            user: process.env.EMAIL_USER,
            clientId: process.env.EMAIL_CLIENT_ID,
            clientSecret: process.env.EMAIL_CLIENT_SECRET,
            refreshToken: process.env.EMAIL_REFRESH_TOKEN,
            accessToken: access_token,
          },
        });
        resolve(transporter);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        reject(error);
      });
  });
};

const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    client_id: process.env.EMAIL_CLIENT_ID,
    client_secret: process.env.EMAIL_CLIENT_SECRET,
    refresh_token: process.env.EMAIL_REFRESH_TOKEN,
    grant_type: "refresh_token",
  }),
};
export const sendMail = async (to: string, token: string) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to, // list of receivers
      subject: "Confirm your email", // Subject line
      html: `<p>Click <a href='${process.env.HOSR_URL}/auth/new-verification?token=${token}'>here</a> to verify your email</p>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("send fail", error);
  }
};

export const sendResetMail = async (to: string, token: string) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to, // list of receivers
      subject: "Reset your password", // Subject line
      html: `<p>Click <a href='${process.env.HOSR_URL}/auth/new-password?token=${token}'>here</a> to reset your password</p>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("send fail", error);
  }
};

export const sendTwoFactorMail = async (to: string, token: string) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to, // list of receivers
      subject: "Two factor authentication", // Subject line
      html: `<p>Your two factor token is ${token}</p>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("send fail", error);
  }
};

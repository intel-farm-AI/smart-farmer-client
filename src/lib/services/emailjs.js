import emailjs from "@emailjs/browser";

const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY_EMAILJS;
const SERVICE_ID = import.meta.env.VITE_SERVICE_ID_EMAILJS;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID_EMAILJS;

export async function sendReportEmail({ name, email, subject, message }) {
  const templateParams = {
    name: name,
    email: email,
    subject: subject,
    message: message,
    time: new Date().toLocaleString(), // biar match dengan {{time}} di template
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
}

import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/v2/params";
import admin from "firebase-admin";
import sgMail from "@sendgrid/mail";

admin.initializeApp();
const db = admin.firestore();

const sendgridKey = defineSecret("SENDGRID_KEY");

export const sendNewPostEmail = onDocumentCreated(
  {
    document: "guides/{guideId}",
    region: "us-central1",
    timeoutSeconds: 300,
    memory: "256MiB",
    secrets: [sendgridKey],
  },
  async (event) => {
    sgMail.setApiKey(sendgridKey.value());
    
    const guide = event.data.data();
    const subsSnap = await db.collection("subscribers").get();
    const emails = subsSnap.docs.map(doc => doc.data().email);
    
    if (emails.length === 0) {
      console.log("No subscribers to notify");
      return;
    }
    
    const link = `https://topheroespro.vercel.app/guides/${event.params.guideId}`;
    
    const msg = {
      to: emails,
      from: {
        email: "lethien1932003@gmail.com", // ⚠️ Thay bằng email đã xác minh
        name: "Gaming Guides"
      },
      subject: `🆕 Bài viết mới: ${guide.title}`,
      html: `
        <h2>${guide.title}</h2>
        <p>${guide.summary || "Một bài viết mới đã được đăng."}</p>
        <a href="${link}">👉 Xem chi tiết</a>
      `,
    };
    
    try {
      await sgMail.sendMultiple(msg);
      console.log(`✅ Sent emails to ${emails.length} subscribers`);
    } catch (error) {
      console.error("❌ Error sending emails:", error);
      if (error.response) {
        console.error("Response body:", error.response.body);
      }
      throw error;
    }
  }
);
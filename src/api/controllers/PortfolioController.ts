import { Request, Response, NextFunction } from "express";
import nodeMailer from "nodemailer";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
}).array("attachment", 5); // Use .array() to handle multiple file uploads

export class PortfolioController {
  static async contactUs(request: Request, response: Response, next: NextFunction) {
    try {
      upload(request, response, async function (err: any) {
        if (err) {
          return response.status(400).json({ message: err.message });
        }

        const { firstname, lastname, email, phone, message } = request.body;
        const attachments = request.files; // Access the uploaded files
       if(!firstname||!lastname||!email||!phone||!message){
        return response.status(400).json({ message: "Missing details" });

       }
        try {
          // Create nodemailer transporter using SMTP
          const transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL || "shreyaspathak.ofc@gmail.com",
              pass: process.env.PASSWORD || "etay dgfi iqqa hhjr",
            },
          });

          // Email data
          const mailOptions: any = {
            from: email,
            to: process.env.EMAIL || "yashikayash2002@gmail.com",
            subject: "Contact Us form submission",
            text: `Name: ${firstname} ${lastname}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
            attachments: [],
          };

          // Add attachments if they exist
          if (attachments) {
            (attachments as Express.Multer.File[]).forEach((attachment: Express.Multer.File) => {
              mailOptions.attachments.push({
                filename: attachment.originalname,
                path: attachment.path,
              });
            });
          }
          await transporter.sendMail(mailOptions);
          return response.status(200).json({ message: "Email sent successfully" });
        } catch (error) {
          return response.status(500).json({ message: error.message });
        }
      });
    } catch (error) {
      return response.status(500).json({ message: "Error processing request" });
    }
  }
}

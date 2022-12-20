const db = require("../database/conn");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
require('dotenv').config();

exports.signIn = (req, res) => {
  const { email, pass } = req.body;
  // console.log(req.body);
  const query = `SELECT * FROM users WHERE user_email = "${email}"`;
  db.query(query, async (err, data) => {
    // console.log(data);
    data?.length ? data : data = [];
    if (data.length > 0) {
      // if not verify email
      if (data[0].isVerified === 0) {
        return res.status(401).json({
          status: "fail",
          message: "This email not verify yet!",
        });
      }
      // check password
      const isCorrect = await bcrypt.compare(pass, data[0].user_pass);
      if (isCorrect) {
        const user = { userId: data[0].user_id, email: data[0].user_email };
        const token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1D' });
        // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
        delete data[0]['user_pass'];
        // console.log(data);
        return res.cookie("access_token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: 'None',
          secure: process.env.NODE_ENV === "production",
        }).status(200).json({
          status: "success",
          message: "Login successfully",
          data: data,
          token: token,
          // refreshToken: refreshToken,
        });
      } else {
        return res.status(401).json({
          status: "fail",
          message: "Incorrect email or password",
        });
      }
    } else {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }
  });
};

exports.signUp = async (req, res) => {
  const { fname, lname, email, pass } = req.body;
  const hashPass = await bcrypt.hash(pass, 10);
  const query = `INSERT INTO users (user_fname,user_lname,user_email,user_pass) VALUES ("${fname}","${lname}","${email}","${hashPass}")`;

  db.query(query, async (err, data) => {
    if (err) {
      res.status(400).json({ status: "fail", message: err });
      return;
    }
    //send verify email
    const tokenMail = jwt.sign({ mail: email },
      process.env.TOKEN_SECRET, {
      expiresIn: '1h'
    });

    const tranSporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const option = {
      from: `Verify your email < ${process.env.EMAIL} >`,
      to: email,
      subject: "Research - verify your email",
      html: `<div class="center" style="color: #fff; background-color: #222; font-family:courier; width: 100%; text-align:center; ">
                <h1 style="padding: 35px 0px 0px;">${fname} ${lname}!</h1>
                <h2>Thanks for registering on our site.</h2>
                <h4>Please verify your mail to continue...</h4>
                <img width="250px" src="cid:imageMailer" alt="" />
                <br />
                <a style="cursor: pointer; 
                                border-radius: 12px; 
                                background-color: rgb(84, 84, 84); 
                                color: #fff; 
                                border-radius: 4px;
                                box-sizing: border-box;
                                font-size: 16px;
                                font-weight: 700;
                                line-height: 5;
                                outline: none;
                                overflow: hidden;
                                padding: 15px 15px 15px;
                                text-decoration: none;
                                " href="${process.env.HOSTWEB}/api/auth/verify-email?mail=${tokenMail}">
                    Verify Your Email
                </a>
            </div>
      `,
      attachments: [{
        path: __dirname + "/images/sendTYmailer.png",
        cid: "imageMailer",
      }],
    }
    tranSporter.sendMail(option, (err, info) => {
      if (err) {
        console.log('error => ', err);
        return res.status(400).json({
          status: "fail",
          message: "Fail to send mail.",
        });
        return;
      } else {
        console.log('Send => ' + info.response);
        return res.status(200).json({
          status: "success",
          message: `Send verify to (${email}).`,
          data: data
        });
      }
    });
    // res.status(200).json({ status: "success", message: "registered!!",  });
  });
};

exports.signOut = async (req, res) => {
  return res.status(200)
    .clearCookie("access_token")
    .json({ message: "Successfully sign out." });
}

// exports.refreshToken = (req, res) => {
//   if (req.cookies?.access_token) {
//     // Destructuring refreshToken from cookie
//     const refreshToken = req.cookies.access_token;
//     // Verifying refresh token
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
//       (err, decoded) => {
//         // Wrong Refresh Token
//         if (err) return res.status(400).json({ message: err });
//         // Correct token we send a new access token
//         console.log(decoded);
//         const token = jwt.sign({
//           userID: decoded.userId,
//           email: decoded.email,
//         }, process.env.TOKEN_SECRET, {
//           expiresIn: '1h'
//         });
//         return res.status(200).json({ token: token, });
//       })
//   } else {
//     return res.status(401).send("Token not found");
//   }
// }

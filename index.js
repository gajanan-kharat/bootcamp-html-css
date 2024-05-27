var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/Database')
var db=mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sushamajun95@gmail.com',
        pass: 'zosm esxn nqcd djrk'
    }
});

app.post("/sign_up",(req,res) => {
    var name= req.body.name
    var email=req.body.email
    var Number=req.body.Number
    var data={
        "name":name,
        "email":email,
        "Number":Number,
        "paymentId": "", 
        "paymentStatus": "fail" 
      
    }
    db.collection('users_register').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Register Record Inserted Succesfully")
    })
    return res.redirect(`/signup_successful.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&Number=${encodeURIComponent(Number)}`);
})

app.post("/payment_success",(req,res) => {
    var name= req.body.name
    var email=req.body.email
    var Number=req.body.Number
    var paymentId = req.body.paymentId;
    var amountPaid = "99/- "; 
    var transactionDate = new Date().toLocaleString(); 

    // Fetch event details from your database or hardcoded values
    var eventName = "3-day CSS Session";
    var eventDate = "1/6/2024 TO 3/6/2024"; 
    var eventLocation = "Online"; 
    var zoomLink = "https://example.com/zoom"; 


    db.collection('users_register').findOneAndUpdate({ 
            name: name, email: email, Number: Number 
        },
        { 
            $set: { 
                paymentId: paymentId, paymentStatus: 'success'
            } 
        },
        { 
            returnOriginal: false 
        },
        (err, result) => {
            if (err) {
                console.error("Error updating payment status:", err); 
                return res.status(500).send("Error updating payment status"); 
            }
            console.log("Payment Record Updated Successfully");
        
         // Create a new PDF document
        const doc = new PDFDocument();

         // Pipe the PDF document to a buffer
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);

        // Send email
        const mailOptions = {
            from: 'sushamajun95@gmail.com',  
            to: email,
            subject: 'Payment Successful',
            /*text: `Dear ${name},
               \nWe are happy to confirm that your payment for our 3-day CSS session has been successfully processed.
               \nHere are the details of your enrollment:
               \nFull Name: ${name}
               \nEmail: ${email}
               \nMobile Number: ${Number}
               \nPayment ID: ${paymentId} 
               \nAs promised, here is the Zoom link for the 3-day CSS session: 
               \nZoom Link: https://meet.google.com/fwj-zwwx-hpk
               \nAdditionally, we had like to inform you about our other exciting courses. Please visit our website https://www.codemindtechnology.com/ for more details.
               \nThank you for choosing to enhance your skills with us. Should you have any questions or require further assistance, feel free to reach out to our team.
               \nBest regards,
               \nCodemind Technology, Pune.
               \nContact Us: 9665044698 `,*/
            html:`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>CODEMIND</title>
                <link rel="icon" type="image/x-icon" href="codemind-img/cm-logo.ico">
                <!-- Fontawesome -->
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                <!-- Google Font -->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: "Nunito", sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        border: 1px solid #ddd;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #4CAF50;
                        color: #fff;
                        text-align: center;
                        padding: 20px;
                        position: relative;
                    }
                    .header img {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        width: 60px;
                        height: 50px;
                        border-radius: 10px;
                        background-color: #fff; 
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                        animation: fadeIn 2s;
                    }
                    .content {
                        padding: 20px;
                        animation: fadeIn 2s ease-in-out;
                    }
                    .content p, .content h2, .content ul {
                        margin: 0 0 15px;
                        line-height: 1.6;
                    }
                    .content .codemind_content{
                        line-height: 0.5;
                        text-align: right;
                    }
                    .content .codemind_website{
                        text-decoration: none;
                        color: #4476e2;
                    }
                    .content .google_meet{
                        text-decoration: none;
                        color: #4476e2;
                    }
                    .content ul li{
                        list-style: none;
                    }
                    .content h2 {
                        color: #4CAF50;
                        font-size: 20px;
                    }
                    #phone{
                        color: #4CAF50; 
                    }
                    .footer {
                        background-color: #f4f4f4;
                        color: #555;
                        text-align: center;
                        padding: 20px;
                        border-top: 1px solid #ddd;
                        animation: fadeIn 2s;
                    }
                    .footer p {
                        margin: 0;
                    }
                    .social-icons {
                        margin-top: 10px;
                    }
                    .social-icons a {
                        margin: 0 15px;
                        display: inline-block;
                        text-decoration: none;
                    }
                    .social-icons img {
                        width: 24px;
                        height: 24px;
                        transition: transform 0.3s;
                    }
                    .social-icons img:hover {
                        transform: scale(1.1);
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        margin: 20px 0;
                        background-color: #4CAF50;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        transition: background-color 0.3s ease;
                    }
                    .button:hover {
                        background-color: #45a049;
                    }
                    .whatsapp-button {
                        background-color: #25D366;
                        display: inline-block;
                        padding: 10px 20px;
                        margin: 20px 0;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        transition: background-color 0.3s ease;
                    }
                    .whatsapp-button:hover {
                        background-color: #1DA851;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img class="codemind_img" src="https://www.codemindtechnology.com/assets/img/logo-shape.png" alt="Email Icon">
                        <h1>Payment Successfully</h1>
                    </div>
                    <div class="content">
                        <h2>Dear ${name},</h2>
                        <p>Your payment for the 3-day CSS session has been successfully processed.</p>
                        <h3>Enrollment Details:</h3>
                        <ul>
                            <li><strong>Name:</strong> ${name}</li>
                            <li><strong>Email:</strong> ${email}</li>
                            <li><strong>Mobile:</strong> ${Number}</li>
                            <li><strong>Payment ID:</strong> ${paymentId} </li>
                        </ul>
                        <p><strong>Zoom Link:</strong> <a class="google_meet" href="https://meet.google.com/fwj-zwwx-hpk">https://meet.google.com/fwj-zwwx-hpk</a></p>
                        <p> For more courses, visit our website: <a class="codemind_website" href="https://www.codemindtechnology.com/">https://www.codemindtechnology.com</a></p>
                        <p> Thank you very much for choosing us. </p>
                        <p>  &quot; Success is not a milestone, it's a journey. And we have vowed to help you in yours.  &quot;</p>
                        <p> Take the first step in your journey with us.</p>
                        <p class="codemind_content">Best regards,</p>
                        <p class="codemind_content">Codemind Technology, Pune</p>
                        <p class="codemind_content"><i class="fa fa-phone" id="phone"></i>&nbsp; 9665044698</p>
                        <a href="https://chat.whatsapp.com/Gm7AnEXqNI1L47HGHDwW1O" class="whatsapp-button">Join our WhatsApp Group</a>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Codemind Technology. All rights reserved.</p>
                        <div class="social-icons">
                            <!--<a href="https://www.facebook.com/CodemindTechnologyLLP/" target="_blank">
                                <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Ficonduck.com%2Ficons%2F242033%2Ffacebook-color&psig=AOvVaw28GODGQNQLYOEdnQY1RBZt&ust=1716093949184000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJjJx4Lal4YDFQAAAAAdAAAAABAE" alt="Facebook">
                            </a>-->
                            <a href="www.youtube.com/@codemindtechnologyofficial" target="_blank">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" alt="YouTube">
                            </a>
                            <a href="https://www.instagram.com/codemind_technology_official/" target="_blank">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram">
                            </a>
                            <a href="https://in.linkedin.com/company/codemind-technology" target="_blank">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn">
                            </a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `,
            attachments: [{
            filename: 'payment_receipt.pdf',
            content: pdfData
            }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    });

    // Add content to the PDF document
    doc.image('codemind-img/codemind-img.jpeg', 25, 10, { width: 100, height: 100 });
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(15).text('Payment Receipt', {align: 'center'});
    
   // Calculate the position for each row
    const row1Y = 130; 
    const row2Y = row1Y + 20; 
    const row3Y = row2Y + 20; 
    const row4Y = row3Y + 20; 
    const row5Y = row4Y + 20; 
    const row6Y = row5Y + 20; 
    const row7Y = row6Y + 20; 
    const row8Y = row7Y + 20; 
    const row9Y = row8Y + 20; 
    const row10Y = row9Y + 20;

    // Define the column positions
    const col1X = 50; 
    const col2X = 200; 
 
    doc.font('Helvetica').fontSize(12);
    doc.text(' Full Name : ', col1X, row1Y);
    doc.text(name, col2X, row1Y);

    doc.text(' Email : ', col1X, row2Y);
    doc.text(email, col2X, row2Y);

    doc.text(' Mobile No : ', col1X, row3Y);
    doc.text(Number, col2X, row3Y);

    doc.text(' Payment ID : ', col1X, row4Y);
    doc.text(paymentId, col2X, row4Y);

    doc.text(' Amount Paid : ', col1X, row5Y);
    doc.text(amountPaid, col2X, row5Y);

    doc.text(' Transaction Date : ', col1X, row6Y);
    doc.text(transactionDate, col2X, row6Y);   

    doc.text(' Event Name  : ', col1X, row7Y);
    doc.text(eventName, col2X, row7Y);

    doc.text(' Date : ', col1X, row8Y);
    doc.text(eventDate, col2X, row8Y);

    doc.text(' Location : ', col1X, row9Y);
    doc.text(eventLocation, col2X, row9Y);   

    doc.text(' Zoom Link : ', col1X, row10Y);
    doc.text(zoomLink, col2X, row10Y); 
    
    doc.moveDown();
    doc.text('Thank you for your payment. If you have any questions or concerns, feel free to contact us.',50,row10Y+30);
    doc.moveDown();
    doc.moveDown();
    doc.text('Best regards,',{align: 'right'});
    doc.text('Codemind Technology, Pune',{align: 'right'});
    doc.end();

            return res.redirect('/showdata.html');
        }
    );
})


app.get("/",(req,res) => {
    res.set({
        "Allow-acces-Allow-Origin":'*'
    })
    return res.redirect('index.html')
}).listen(3000);

console.log("Listening on port 3000") 


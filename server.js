// import axios from 'axios';

// const username = 'sandbox';
// const apiKey = 'atsk_9a561fc568e89ec22a9d8daf822c26f7a44cc14283b37d74e238ca22733ff1cae0641984';
// const baseUrl = 'https://api.africastalking.com/version1/messaging';

// export const sendMessage = async (to, message) => {
//   try {
//     const response = await axios.post(baseUrl, {
//       username,
//       to,
//       message,
//     }, {
//       headers: {
//         'apiKey': apiKey,
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error sending message:', error);
//     throw error;
//   }
// };
// import africastalking from 'africastalking';

// const credentials = {
//   apiKey: 'atsk_9a561fc568e89ec22a9d8daf822c26f7a44cc14283b37d74e238ca22733ff1cae0641984',
//   username: 'sandbox',
// };

// const AT = africastalking(credentials);
// const sms = AT.SMS;

// export const sendMessage = async function (to, message) => {
//   try {
//     const response = await sms.send({
//       to,
//       message,
//     });
//     return response;
//   } catch (error) {
//     console.error('Error sending message:', error);
//     throw error;
//   }
// };

// import AfricasTalking from 'africastalking';

// const africasTalking = AfricasTalking({
//     apiKey: 'atsk_9a561fc568e89ec22a9d8daf822c26f7a44cc14283b37d74e238ca22733ff1cae0641984', // Replace with your API key
//     username: 'sandbox' // Replace with your username
// });

// const sms = africasTalking.SMS;

// export async function sendSMS(to, message) {
//     const options = {
//         to: [to],
//         message: message,
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     };

//     try {
//         const response = await sms.send(options);
//         return response;
//     } catch (error) {
//         console.error('Error sending SMS:', error);
//         throw error;
//     }
// }
const express = require('express');
const axios = require ('axios');
const cors= require('cors');
console.log('POST /send-sms not yet hit');
const app = express();

// import dotenv from "dontenv";

// dotenv.config();

//Authentication
// const credentials = {
//   apiKey: process.env.API_KEY,
//   username: process.env.USERNAME
// };

// Require the AT package

//const PORT2 = 8080||8081;
//const sms = AT.SMS;
//send SMS route
//Enable CORS with specific settings
app.use(cors({
  origin: `http://localhost:8080`,  // Allow only your Vue app's origin
  methods: 'GET,POST,OPTIONS',  // Allow these methods
  allowedHeaders: 'Accept,Accept-Language,Content-Type,Content-Language,apiKey'  // Allow the custom headers
}));

// Middleware to parse incoming JSON
app.use(express.json());

// Explicitly handle preflight OPTIONS requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', `http://localhost:8080`);  // Allow origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Allow methods
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Accept-Language, Content-Type, Content-Language, apiKey');  // Allow custom headers
  res.setHeader('Access-Control-Allow-Credentials', true);  // Allow credentials

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);  // Respond OK for OPTIONS requests
  }

  next();  // Continue to the next middleware
});

//Accept, Accept-Language, Content-Language, Content-Type)
// nor allowed by the Access-Control-Allow-Headers

app.post('/send-sms', async (req, res) => {
//cons {to,message} = req.body || res.status
console.log('POST /send-sms hit');
try {
  const { to, message } = req.body;
  console.log('Request body:', req.body);
  const response = await axios.post('https://api.sandbox.africastalking.com/version1/messaging', 
    new URLSearchParams({
      username: 'sandbox',
      to,
      message
    })
  , {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'apiKey': 'atsk_fd221a40d30b04649873b9094a955a5ffaf688e6f56ec3eecd05dc520b220617e5d4fd8c'
    }
  });
  res.json(response.data);
} catch (error) {
  console.error('Error in /send-sms:', error.response ? error.response.data : error.message);  // Log the error
  res.status(500).json({ error: error.message });
}
})

// app.post('/send-sms-after-client-payment', async (req, res) => {
// //cons {to,message} = req.body || res.status

// console.log('POST /send-sms-after-client-payment hit');

// try {
//   const { to, message } = req.body;
//   console.log('Request body:', req.body);
//   const response = await axios.post('https://api.sandbox.africastalking.com/version1/messaging', 
//     new URLSearchParams({
//       username: 'sandbox',
//       to,
//       message
//     })
//   , {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'apiKey': 'atsk_fd221a40d30b04649873b9094a955a5ffaf688e6f56ec3eecd05dc520b220617e5d4fd8c'
//     }
//   });
//   res.json(response.data);
// } catch (error) {
//   console.error('Error in /send-sms-after-client-payment:', error.response ? error.response.data : error.message);  // Log the error
//   res.status(500).json({ error: error.message });
// }
// }),

app.post('/verify-payment', async (req, res) => {
  const { reference } = req.body;

  try {
    const paystackResponse = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer sk_test_6808ef0eebdbc3e57f5c9838ca4273fadd8e29bd`, // Replace with your Paystack secret key
      },
    });

    const { status, data } = paystackResponse;
    if (status === 200 && data.data.status === 'success') {
      // Payment was successful
      res.json({ status: 'success', message: 'Payment verified successfully.' });
    } else {
      // Payment verification failed
      res.status(400).json({ status: 'error', message: 'Payment verification failed.' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ status: 'error', message: 'Server error. Please try again later.' });
  }})

const PORT = 3003||3000;

app.listen(PORT, () => console.log(`running on localhost:${PORT}`));

// //Delivery callback
// app.post("/delivery", async(req,res)=>{
//   console.log(req.body);
//})
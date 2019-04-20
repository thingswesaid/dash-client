const express = require('express');
const http = require('http');
const path = require('path');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

const payPalClient = require('./payPalClient.js');

const app = express();
const port = process.env.PORT || '8080';
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '../build')));

app.get('/foobar', (req, res) => { res.send({ hello: 'world' }); });

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.post('/paypal-transaction-complete', async (req, res) => {
  // 2a. Get the order ID from the request body
  const { orderID } = req.body;

  // 3. Call PayPal to get the transaction details
  const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

  let order;
  try {
    order = await payPalClient.client().execute(request);
  } catch (err) {
    // 4. Handle any errors from the call
    console.error(err);
    return res.send(500);
  }

  // 5. Validate the transaction details are as expected
  if (order.result.purchase_units[0].amount.value !== '4.99') {
    return res.send(400);
  }

  console.log('=======================');
  console.log('>>>>>>>>> order.result <<<<<<<<<<', order.result);
  console.log('=======================');

  // 6. Save the transaction in your database
  // await database.saveTransaction(orderID);

  // 7. Return a successful response to the client
  return res.send(200);
});

server.listen(port, () => console.log(`Running on localhost:${port}`));

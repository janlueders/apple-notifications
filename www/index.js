const express = require('express');
const axios = require('axios');
var bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());
const port = 80;
const { AppStoreServerAPI, Environment, decodeRenewalInfo, decodeTransaction, decodeTransactions } = require("app-store-server-api");
const { decodeNotificationPayload, isDecodedNotificationDataPayload, isDecodedNotificationSummaryPayload } = require("app-store-server-api");

const KEY =
  `-----BEGIN PRIVATE KEY-----

-----END PRIVATE KEY-----`


const KEY_ID = "****"
const ISSUER_ID = "****"
const APP_BUNDLE_ID = "****"

const apiProduction = new AppStoreServerAPI(
  KEY, KEY_ID, ISSUER_ID, APP_BUNDLE_ID, Environment.Production
);

const apiSandbox = new AppStoreServerAPI(
  KEY, KEY_ID, ISSUER_ID, APP_BUNDLE_ID, Environment.Sandbox
);

app.post('/app-store-notification', async (req, res) => {

  var body = req.body.signedPayload;

//  const payload = await decodeNotificationPayload(signedPayload)
//  if (payload.data.bundleId === APP_BUNDLE_ID) {

//  }

//  if (isDecodedNotificationDataPayload(payload)) {
  // payload is of type DecodedNotificationDataPayload
//  }

//  if (isDecodedNotificationSummaryPayload(payload)) {
  // payload is of type DecodedNotificationSummaryPayload
//  }
  res.status(200).json({ ok: true });
});

app.post('/app-store-notification-sandbox', async (req, res) => {

  var signedPayload = req.body.signedPayload;
  const payload = await decodeNotificationPayload(signedPayload)

  if (payload.data.bundleId === APP_BUNDLE__ID) {
    console.log(payload.data);
  }

  if (isDecodedNotificationDataPayload(payload)) {
    console.log(payload)
  }

  if (isDecodedNotificationSummaryPayload(payload)) {
    console.log(payload)
  }
  res.status(200).json({ ok: true });
});

app.post('/sub-status',async (req,res) => {

  const response = await apiProduction.getSubscriptionStatuses(originalTransactionId);
  // Find the transaction you're looking for
  const item = response.data[0].lastTransactions.find(item => item.originalTransactionId === originalTransactionId);
  const transactionInfo = await decodeTransaction(item.signedTransactionInfo);
  const renewalInfo = await decodeRenewalInfo(item.signedRenewalInfo);
  console.log(renewalInfo,transactionInfo);

  res.status(200).json({ ok: true });
});

app.post('/sub-status-sandbox',async (req,res) => {

  var originalTransactionId = req.body.originalTransactionId;
  const response = await apiSandbox.getSubscriptionStatuses(originalTransactionId);
  const item = response.data[0].lastTransactions.find(item => item.originalTransactionId === originalTransactionId);
  //
  const transactionInfo = await decodeTransaction(item.signedTransactionInfo);
  const renewalInfo = await decodeRenewalInfo(item.signedRenewalInfo);
  console.log(renewalInfo);
  res.status(200).json({ ok: true });
});

app.post('/send-sub-status', async (req,res) => {
  const response = await apiSandbox.requestTestNotification();
  res.status(200).json({ ok: true });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
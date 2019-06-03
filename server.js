const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const helmet = require('helmet');
const axios = require('axios');
const TransactionCount = require('./models/transactionCount.js');
const https = require('https');
const http = require('http');
const PORT = 8080;

//To prevent maxing out ports when looping through > 20k
https.globalAgent.maxSockets = 50;
http.globalAgent.maxSockets = 50;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());


// Initiate Sync
app.get('/sync', async (req, res) => {

  let transactionCount = 0;
  let lunieTransactionCount = 0;

  // Takes two integer arguements: startBlock (inclusive), and endBlock (inclusive)
  // Loops through blocks and if there are transactions the transactions as well.
  // Purpose: To identify and count transactions that have the Lunie signature in their memo's
  searchTxFunc = (startBlock, endBlock) => {
    for (let i = startBlock; i <= endBlock; i++) {
      axios.get(`https://stargate.cosmos.network/txs?tx.height=${i}`)
        .then((response) => {

          let data = response.data;

          // checks if there was a transaction included in the block
          if (data[0]) {

            // loop through all transactions in given block
            for (let x = 0; x < data.length; x++) {
  
              //increment transactionCount
              transactionCount++;
              
              let memo = data[x].tx.value.memo;

              // check the memo
              if (memo === 'Sent via Lunie' || memo === '(Sent via Lunie)') {
                // increment luniTransactionCount
                lunieTransactionCount++;
              };
  
            };
          };
        })
        .catch((error) => {
          console.log('Error getting network data: ', error);
        })
    };
  };

  // GET the latest block height
    // from https://stargate.cosmos.network/blocks/latest
    // retrieve the last block number updated to from db
    // call searchTxFunc to update from the last used block number (exlusively) to the most recent block (inclusively)
      // searchTxFunc(500000, 517790);  
    // update db with new transaction count and last block number used for update


  // res.status(200).send('Sync completed');
});




app.get('/lunieTransactionCount', async (req, res) => {

  //Query db to get the current transaction count
  const LunieObj = await TransactionCount.findOne({
    where: {
      company: 'Lunie'
    },
  });

  res.status(200).send(lunieObj.txCount);

});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
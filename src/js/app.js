  App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8485');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    /*
     * Replace me...
     */
    $.getJSON('Lottery.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var LotteryArtifact = data;
      App.contracts.Lottery = TruffleContract(LotteryArtifact);

      // Set the provider for our contract
      App.contracts.Lottery.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      // return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#purchase', App.handlePurchase);
    $(document).on('click', '#close', App.handleClose);
    $(document).on('click', '#winner', App.handleWinner);
    $(document).on('submit' , '#guessform' , App.handleGuess)
  },

  updateBidder: function() {

    console.log("Updating Bidder");

    var lotteryInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Lottery.deployed().then(function(instance) {
        lotteryInstance = instance;

        // Execute adopt as a transaction by sending account
        return lotteryInstance.getToken({from: account});
      }).then(function(result) {
        console.log(result);
        $('#tickets').text(result)
      }).catch(function(err) {
        console.log(err.message);
      });
    });
 
  },

  handlePurchase: function(event) {
    event.preventDefault();

    var lotteryInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      var amount = $('#amount').val();
      console.log(amount);

      App.contracts.Lottery.deployed().then(function(instance) {
        lotteryInstance = instance;

        // Execute adopt as a transaction by sending account
        return lotteryInstance.puchaseToken({from: account , value : web3.toWei(amount, 'ether')  , gas: 3000000});
      }).then(function(result) {
        return App.updateBidder();
      }).catch(function(err) {
        console.log(err.message);
      });
    });


  } ,
  handleClose: function(event) {
    event.preventDefault();

    var lotteryInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Lottery.deployed().then(function(instance) {
        lotteryInstance = instance;

        // Execute adopt as a transaction by sending account
        return lotteryInstance.closeGame({from: account});
      }).then(function(result) {
        console.log(result);
      }).catch(function(err) {
        console.log(err.message);
      });
    });


  } ,
  handleWinner: function(event) {
    event.preventDefault();

    var lotteryInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];


      App.contracts.Lottery.deployed().then(function(instance) {
        lotteryInstance = instance;

        // Execute adopt as a transaction by sending account
        return lotteryInstance.winnerAddress({from: account});
      }).then(function(result) {
          console.log(result);
      }).catch(function(err) {
        console.log(err.message);
      });
    });


  } ,

  handleGuess: function(event) {
    event.preventDefault();

    var lotteryInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      var guess = $('input[name=guess]').val();
      console.log(guess)

      App.contracts.Lottery.deployed().then(function(instance) {
        lotteryInstance = instance;

        // Execute adopt as a transaction by sending account
        return lotteryInstance.makeGuess(  guess , {from: account});
      }).then(function(result) {
        console.log(result);
        return App.updateBidder();
      }).catch(function(err) {
        console.log(err.message);
      });
    });


  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

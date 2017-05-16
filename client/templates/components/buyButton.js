const thisAdlist = function () {
  return Adlist.at(FlowRouter.getParam('adlistAddress'))
}

const thisAdregistry = function () {
  return Adregistry.at(FlowRouter.getParam('adregistryAddress'))
}

const thisAd = function() {
  return Ad.at(FlowRouter.getParam('adAddress'))
}

const handleError = function (err) {
  if (err) {
  EZModal(err.toString())
  }
}

var checkState = function (template) {
  template.contract.seller(function (error, seller) {
    if (!error) {
      TemplateVar.set(template, 'seller', seller)
    }
  })
  template.contract.buyer(function (error, buyer) {
    if (!error) {
      TemplateVar.set(template, 'buyer', buyer)
    }
  })
  template.contract.value(function (error, value) {
    if (!error) {
      TemplateVar.set(template, 'value', web3.fromWei(value, 'ether').toString(10))
    }
  })
  template.contract.state(function (error, state) {
    if (!error) {
      TemplateVar.set(template, 'state', +state)
    }
  })
  template.contract.trials(function (error, trials) {
    if (!error) {
      TemplateVar.set(template, 'trials', +trials)
    }
  })
}

var getUser = function () {
  var user = 'unknown'

  if (EthAccounts.findOne({address: TemplateVar.get('buyer'), default: true})) {
    user = 'buyer'
  }

  if (EthAccounts.findOne({address: TemplateVar.get('seller'), default: true})) {
    user = 'seller'
  }

  return user
}

var states = function () {
  var value = TemplateVar.get('value') || 0
  var trials = TemplateVar.get('trials') 
  var state = TemplateVar.get('state')
  if (state==0 && trials==0){
    return {
    seller: {
      0: {
        class: 'grey disabled',
        buttonText: 'Trials Exceeded',
        subText: 'You have exceeded valid trials'
      }
    },
    buyer: {
      0: {
        class: 'red',
        buttonText: 'Refund Amount',
        subText: 'Seller has exceeded valid trials. Refund payment of ' + value + ' ETH'
      }
    },
    unknown: {
      0: {
        class: 'grey disabled',
        buttonText: 'Unavailable',
        subText: 'Unauthorized Account'
      }
    }
  }
}
  else{
  return {
    seller: {
      0: {
        class: 'green',
        buttonText: 'Enter Secret Pin',
        subText: 'Redeem payment of ' + value + ' ETH'
      },
      1: {
        class: 'grey disabled',
        buttonText: 'Sale Concluded',
        subText: ''
      }
    },
    buyer: {
      0: {
        class: 'red',
        buttonText: 'Cancel purchase',
        subText: 'Returns your security deposit of ' + value + ' ETH'
      },
      1: {
        class: 'grey disabled',
        buttonText: 'Sale Concluded',
        subText: ''
      }
    },
    unknown: {
      0: {
        class: 'grey disabled',
        buttonText: 'Unavailable',
        subText: 'Unauthorized Account'
      },
      1: {
        class: 'grey disabled',
        buttonText: 'Sale Concluded',
        subText: ''
      }
    }
  }
}
}


var callContractMethod = function (tmpl, method, fromAddress, spin) {
  if (!tmpl.contract || !_.isFunction(tmpl.contract[method])) {
    return
  }

  TemplateVar.set(tmpl, 'processing', true)
  var args= {
    from: fromAddress,
    gas: 2100000
  }
  if (method=="redeemPayment"){
    args=spin
  }
 tmpl.contract[method](args
  , function (error, txHash) {
    if (!error) {
      const ad = thisAd()
      const adlist = thisAdlist()
      const adregistry = thisAdregistry()
      console.log('Transaction Sent: ' + txHash)
      if (args!=spin){FlowRouter.go('ad', {adregistryAddress:adregistry.address, adlistAddress: adlist.address, adAddress: ad.address})
    }
    } else {
      TemplateVar.set(tmpl, 'processing', false)
      console.error("Couldn't send transaciton", error)
      EZModal(error.toString())
    }
  })
}

Template.buyButton.onCreated(function () {
  const tmpl = this

  // stop here if no contract was given
  if (!tmpl.data || !tmpl.data.contract) {
    return
  }

  // attach contract to the template instance
  tmpl.contract = tmpl.data.contract

  // Load the current contract state
  checkState(tmpl)

  // crete an event handler watching relevant events
  tmpl.handler = tmpl.contract.allEvents({fromBlock: 'latest', toBlock: 'latest'}, function (error, log) {
    if (!error) {
      TemplateVar.set(tmpl, 'processing', false)

      // check the state on each new event
      checkState(tmpl)
    }
  })
})

Template.buyButton.onDestroyed(function () {
  // stop listening to events when the template gets destroyed
  if (this.handler) {
    this.handler.stopWatching()
  }
})

Template.buyButton.helpers({
  'getState': function (type) {
    return states()[getUser()][TemplateVar.get('state') || 0][type]
  }
})

Template.buyButton.events({
  'click .btn': function (e, tmpl) {
    const buyer = TemplateVar.get('buyer')
    const seller = TemplateVar.get('seller')
    const state = TemplateVar.get('state')
    const value = TemplateVar.get('value')
    const trials = TemplateVar.get('trials')
    
    // is buyer
    if (EthAccounts.findOne({address: buyer, default: true})) {
      if (web3.eth.getBlock(web3.eth.blockNumber).timestamp< tmpl.contract.releaseTime().toNumber())
      {
        alert('Escrow contract is under time lock. Will open in '+ (tmpl.contract.releaseTime().toNumber()-web3.eth.getBlock(web3.eth.blockNumber).timestamp) +' seconds')
      }
      else if (state === 0 && web3.eth.getBlock(web3.eth.blockNumber).timestamp > tmpl.contract.releaseTime().toNumber()) {
        callContractMethod(tmpl, 'cancelPurchase', buyer)
      }
    // is seller
    } else if (EthAccounts.findOne({address: seller, default: true})) {
      if (state === 0 && trials!=0) {
        alert("You have only "+trials+" trials left!")
        app.formModal({
        template: 'enterPinForm',
        title: "Enter your Secret Pin"
        }, function(err,data){
        handleError(err)
        callContractMethod(tmpl, 'redeemPayment', seller, data.pin)
      })
      }



    // is unknown
    } else {
      if (state === 0) 
        alert("Unknown Account in use!")
    }
  }
})


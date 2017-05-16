const thisAdlist = function () {
  return Adlist.at(FlowRouter.getParam('adlistAddress'))
}

const thisAdregistry = function () {
  return Adregistry.at(FlowRouter.getParam('adregistryAddress'))
}

const thisAd = function() {
  return Ad.at(FlowRouter.getParam('adAddress'))
}

const thisEscrow = function() {
	return Purchase.at(FlowRouter.getParam('escrowAddress'))
}

Template.purchase.helpers({
  contract: thisEscrow,
  address: function () {
    return FlowRouter.getParam('escrowAddress')
  },

  seller: function() {
  	const escrow=thisEscrow()
  	return escrow.seller()
  },

  buyer: function() {
  	const escrow=thisEscrow()
  	return escrow.buyer()
  },

  value: function() {
  	const escrow=thisEscrow()
  	return web3.fromWei(escrow.value(), 'ether').toString(10)
  },

  adAddress: function(){
    return FlowRouter.getParam('adAddress')
  },

  adlistAddress: function(){
    return FlowRouter.getParam('adlistAddress')
  },

  adregistryAddress: function(){
    return FlowRouter.getParam('adregistryAddress')
  },

  expireTime: function(){
    const escrow=thisEscrow()
    const currTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp
    const releaseTime = escrow.releaseTime().toNumber()
    if (releaseTime > currTime) return (releaseTime - currTime)
    return 0
  },

  createTime: function(){
    const escrow=thisEscrow()
    var a = new Date(escrow.createTime() * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = "0"+a.getHours();
    var min = "0"+a.getMinutes();
    var sec = "0"+a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2) ;
    return time;
  },

  trials: function(){
    const escrow=thisEscrow()
    return escrow.trials()
  }



})

Template.purchase.events({
  'click .back': function() {
    const ad = thisAd()
    const adlist = thisAdlist()
    const adregistry = thisAdregistry()
    FlowRouter.go('ad', {adregistryAddress:adregistry.address, adlistAddress: adlist.address, adAddress: ad.address})
}
})    
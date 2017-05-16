const thisAdregistry = function () {
  return Adregistry.at("0x8ac5861c878db96d62da25e7b0bde4971765137c")
}

Template.navbar.onRendered(function () {
  $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    });
})

Template.navbar.helpers({
  accArray: function () {
    let accArray=[]
    const ethAccounts = EthAccounts.find().fetch()
    for (let i=0; i<ethAccounts.length; i++)
    {
      accArray.push({address: ethAccounts[i].address})
    }
    return accArray
    console.log(accArray)
    }
  
})

Template.navbar.events({
  'click .select-account': function (e,tmpl) {
    e.preventDefault()
    app.setDefaultAccount(this.address)
    web3.eth.getBalance(app.getDefaultAddress(),function(err,result){
      TemplateVar.set(tmpl,'balance',web3.fromWei(result.toNumber(),'ether'))
    })
  },
  'click .detail-account': function (e,tmpl) {
    e.preventDefault()
    const adregistry = thisAdregistry()
    FlowRouter.go('account', {adregistryAddress:adregistry.address, accountAddress:app.getDefaultAddress()})
  }
})
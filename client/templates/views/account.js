const thisAdregistry = function () {
	return Adregistry.at(FlowRouter.getParam('adregistryAddress'))
}

Template.account.onRendered(function () {
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

Template.account.helpers({
	account: function(){
		return FlowRouter.getParam('accountAddress')
	},

	adArray: function() {
		const adregistry = thisAdregistry()
		const adlistCount = adregistry.count().toNumber()
		let adArray = []
		for (let i=0; i< adlistCount; i++) {	
			var ad = Ad.at(adregistry.adregister(i)[1])
			var adlist = Adlist.at(adregistry.adregister(i)[0])
			var title = adregistry.adregister(i)[2]
			if(ad.owner()==FlowRouter.getParam('accountAddress'))
			{
			var a = new Date(ad.createTime() * 1000);
    		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    		var year = a.getFullYear();
    		var month = months[a.getMonth()];
    		var date = a.getDate();
    		var hour = "0"+a.getHours();
    		var min = "0"+a.getMinutes();
   			var sec = "0"+a.getSeconds();
    		var time = date + ' ' + month + ' ' + year + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2) ;	
    		var orders = ad.count()
			adArray.push({adregistryAddress:adregistry.address,adlistAddress: adlist.address, address: ad.address, title:title,createTime:time,orders:orders,getDataMethod: ad.IPFSData})
			}
			}
		adArray.sort(function(a,b){return (a.createTime<b.createTime)})	
		return adArray
	},

	sellArray: function() {
		const adregistry = thisAdregistry()
		const adlistCount = adregistry.count().toNumber()
		let sellArray = []
		for (let i=0; i< adlistCount; i++) {	
			var ad = Ad.at(adregistry.adregister(i)[1])
			var adlist = Adlist.at(adregistry.adregister(i)[0])
			var title = adregistry.adregister(i)[2]
			var escrowCount = ad.count().toNumber()
			for (let j=0; j<escrowCount;j++){
				var escrow = Purchase.at(ad.orders(j))
				if(escrow.seller()==FlowRouter.getParam('accountAddress'))
				{
					var a = new Date(escrow.createTime() * 1000);
   					var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    				var year = a.getFullYear();
    				var month = months[a.getMonth()];
    				var date = a.getDate();
    				var hour = "0"+a.getHours();
    				var min = "0"+a.getMinutes();
    				var sec = "0"+a.getSeconds();
    				var time = date + ' ' + month + ' ' + year + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2) ;
					if(escrow.state().toNumber()==0){
					var state = "Locked"
					var color = "red"	
					sellArray.push({adregistryAddress:adregistry.address,adlistAddress: adlist.address, adAddress: ad.address, escrowAddress:escrow.address,title:title,state:state,color:color, createTime:time})
					}
					else{
					var state = "Inactive"
					var color = "grey"	
					sellArray.push({adregistryAddress:adregistry.address,adlistAddress: adlist.address, adAddress: ad.address, escrowAddress:escrow.address,title:title,state:state,color:color, createTime:time})
					}

				}
			}
		}
		sellArray.sort(function(a,b){return (a.createTime<b.createTime)})
		return sellArray
	},

	buyArray: function() {
		const adregistry = thisAdregistry()
		const adlistCount = adregistry.count().toNumber()
		let buyArray = []
		for (let i=0; i< adlistCount; i++) {	
			var ad = Ad.at(adregistry.adregister(i)[1])
			var adlist = Adlist.at(adregistry.adregister(i)[0])
			var title = adregistry.adregister(i)[2]
			var escrowCount = ad.count().toNumber()
			for (let j=0; j<escrowCount;j++){
				var escrow = Purchase.at(ad.orders(j))
				if(escrow.buyer()==FlowRouter.getParam('accountAddress'))
				{
					var a = new Date(escrow.createTime() * 1000);
   					var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    				var year = a.getFullYear();
    				var month = months[a.getMonth()];
    				var date = a.getDate();
    				var hour = "0"+a.getHours();
    				var min = "0"+a.getMinutes();
    				var sec = "0"+a.getSeconds();
    				var time = date + ' ' + month + ' ' + year + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2) ;
					if(escrow.state().toNumber()==0){
					var state = "Locked"
					var color = "red"	
					buyArray.push({adregistryAddress:adregistry.address,adlistAddress: adlist.address, adAddress: ad.address, escrowAddress:escrow.address,title:title,state:state,color:color, createTime:time})
					}
					else{
					var state = "Inactive"
					var color = "grey"	
					buyArray.push({adregistryAddress:adregistry.address,adlistAddress: adlist.address, adAddress: ad.address, escrowAddress:escrow.address,title:title,state:state,color:color, createTime:time})
					}
				}
			}
		}
		buyArray.sort(function(a,b){return (a.createTime<b.createTime)})
		return buyArray
	},

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


Template.account.events({
  'click .select-account': function (e,tmpl) {
    e.preventDefault()
    const adregistry = thisAdregistry()
    FlowRouter.go('account', {adregistryAddress:adregistry.address, accountAddress:this.address})
  }
})
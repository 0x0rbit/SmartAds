const thisAdlist = function () {
	return Adlist.at(FlowRouter.getParam('address'))
}

const thisAdregistry = function () {
	return Adregistry.at(FlowRouter.getParam('adregistryAddress'))
}


Template.adlist.helpers({
	adlistAddress: function() {
		return FlowRouter.getParam('address')
	},
	adlistInfo: function() {
		const adlist = thisAdlist()
		return {
			getDataMethod: adlist.IPFSData,
			setDataMethod: adlist.setIPFSData,
			formTemplate: 'adlistInfoForm',
			formTitle: 'Update Adlist Information',
			updatable:true,
			owner: adlist.owner()
		}
	},

	adArray: function() {
		const adlist = thisAdlist()
		const adregistry = thisAdregistry()
		const adlistCount = adlist.count().toNumber()
		let adArray = []
		for (let i=0; i< adlistCount; i++) {
			const ad = Ad.at(adlist.ads(i))
			adArray.push({adregistryAddress:adregistry.address,adlistAddress:adlist.address,address: ad.address, getDataMethod: ad.IPFSData})
		}
		return adArray
	},

	createTime: function(){
    const adlist = thisAdlist()
    var a = new Date(adlist.createTime() * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = "0"+a.getHours();
    var min = "0"+a.getMinutes();
    var sec = "0"+a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2) ;
    return time;
  }
})

Template.adlist.events({
	'click .new-ad': function(e,tmpl) {
		const adlist = thisAdlist()
		const adregistry = thisAdregistry()
		app.deployContract({
			tmpl:tmpl,
			template: 'adInfoForm',
			title: 'Create a new Ad',
			contract: Ad
		}, function(err,address) {
			if (err) { throw err}
			FlowRouter.go('ad', {adregistryAddress:adregistry.address, adlistAddress: adlist.address, adAddress: address})
			adlist.register(address)
			const ad=Ad.at(address)
			hash = ad.IPFSData()
			ipfs.catJson(hash, function(err,json){
			console.log(adlist.address,address,json.title)
			adregistry.register(adlist.address,address,json.title,0,{gas:3000000})	
			})	
		})
	}
})


const thisSearchterm = function() {
	return FlowRouter.getParam('searchterm')
}

const thisAdregistry = function () {
	return Adregistry.at(FlowRouter.getParam('adregistryAddress'))
}


Template.search.helpers({
	searchterm: function() {
		return FlowRouter.getParam('searchterm')
	},
	
	adArray: function() {
		const adregistry = thisAdregistry()
		const adlistCount = adregistry.count().toNumber()
		var search = thisSearchterm().split(' ')
		let adArray = []
		for (let i=0; i< adlistCount; i++) {
			var matchcount=0
			var title = adregistry.adregister(i)[2]	
			for (let j=0; j<search.length; j++) {
				if (title.toUpperCase().includes(search[j].toUpperCase()))
				{
					matchcount++
				}
			}
			if (matchcount>0){	
			var ad = Ad.at(adregistry.adregister(i)[1])
			var adlist = Adlist.at(adregistry.adregister(i)[0])
			var searchterm=FlowRouter.getParam('searchterm')
			adArray.push({adregistryAddress:adregistry.address,adlistAddress: adlist.address, address: ad.address, searchterm:searchterm, title:title, matchcount: matchcount,getDataMethod: ad.IPFSData})
			}
			}
		adArray.sort(function(a,b){return (b.matchcount-a.matchcount)})
		return adArray
	}
})

Template.search.events({
	'submit form': function (e, template) {
		e.preventDefault()
		const adregistry = thisAdregistry()
		var searchterm = $(e.target.searchterm).val()
		if (searchterm) {
			FlowRouter.go('search', {adregistryAddress:adregistry.address, searchterm:searchterm})
		}
	}
})


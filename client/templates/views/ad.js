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

Template.ad.helpers({
	address: function() {
		return FlowRouter.getParam('adAddress')
	},
	ipfsInfoConfig: function() {
		const ad = thisAd()
		return {
			getDataMethod: ad.IPFSData,
			setDataMethod: ad.setIPFSData,
			formTemplate: 'adInfoForm',
			formTitle: 'Update Ad Information',
			updatable: true,
			owner: ad.owner()
		}
	},
	owner: function(){
		const ad = thisAd()
		if (ad.owner()==app.getDefaultAddress()) 
		{	
			return false
		}
		else
		{
			return true
		}
	},
	postDate: function(){
		const ad = thisAd()
		var a = new Date(ad.createTime() * 1000);
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

Template.ad.events({
	'click .back': function() {
		const adlist = thisAdlist()
		const adregistry = thisAdregistry()
		var searchterm=FlowRouter.getParam('searchterm')
		if(typeof searchterm=='string')
		{ 
			FlowRouter.go('search', {adregistryAddress:adregistry.address, searchterm: searchterm})
		}
		else
		{
			FlowRouter.go('adlist', {adregistryAddress:adregistry.address, address: adlist.address})
		}
	},
	'click .buy': function(e, tmpl) {
		app.formModal({
			template: 'setPinForm',
			title: "Set your Secret Pin"
		}, function(err,data){
		handleError(err)	
		TemplateVar.set(tmpl,'deploying', true)
		const ad = thisAd()
		const adlist = thisAdlist()
		const adregistry = thisAdregistry()
		var hash = ad.IPFSData()
		ipfs.catJson(hash, function(err,json){
		Purchase.new(ad.owner(),data.pin,data.locktime*60,{data: "0x"+Purchase.bytecode, gas:2100000, value: web3.toWei(json.price, 'ether')
	},function (err, contract) {
  		if (err) {
   		 window.alert(err)
   		 TemplateVar.set(tmpl,'deploying', false)
   		}
   		 if (contract.address){
   		 	ad.registerOrder(contract.address,{gas:3000000})
   		 	FlowRouter.go('purchase', {adregistryAddress:adregistry.address, adlistAddress: adlist.address, adAddress: ad.address, escrowAddress: contract.address})
   		 }
		})
	})
	})
	},



})

Template.adInfoForm.helpers({
	deploying: function() {
		return FlowRouter.getRouteName() === 'adlist'
	}
})

Template.adInfoForm.events({
	'change input[type="file"]': function( e, tmpl ) {
     	const files=e.target.files
     	
     	let filename = []
     	for (var i=0;i<files.length && i<5;i++){
     		if (!files[i].type.match('image.*')) {
       			 continue;
      		}
     		filename.push(files[i].name)
     		let reader = new FileReader()
     		reader.onload = (function(theIndex){
     			var index = theIndex
     			return function(e){
     				const buffer = Buffer.from(reader.result)
     				ipfs.add(buffer, function(err,fhash){
     					if(err) throw err
     						if (index==0) TemplateVar.set(tmpl,'image0',fhash)
     							if (index==1) TemplateVar.set(tmpl,'image1',fhash)
     								if (index==2) TemplateVar.set(tmpl,'image2',fhash)
     									if (index==3) TemplateVar.set(tmpl,'image3',fhash)
     		})
     			}
     	})(i)
     	reader.readAsArrayBuffer(files[i])
     	}
     	TemplateVar.set(tmpl,'file-path',filename.toString())
     	
    },

    'change input[type="range"]':function(e,tmpl){
    	const sla=e.currentTarget.value
    	TemplateVar.set(tmpl,'sla',sla)
    }
})

Template.setPinForm.helpers({
	deployEscrow: function(){
		return true
	}
})

Template.setPinForm.events({
	'change input[type="range"]':function(e,tmpl){
		const ad = thisAd()
		var hash = ad.IPFSData()
		ipfs.catJson(hash, function(err,json){
			TemplateVar.set(tmpl,'sla',json.sla)
		})
    	const locktime=e.currentTarget.value
    	TemplateVar.set(tmpl,'locktime',locktime*60)
    }
})
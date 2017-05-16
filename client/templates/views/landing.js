const thisAdregistry = function () {
	return Adregistry.at("0x8ac5861c878db96d62da25e7b0bde4971765137c")
}

Template.landing.events({
	'click .new-adlist': function(e, tmpl) {
		const adregistry = thisAdregistry()
		app.deployContract({
			tmpl:tmpl,
			template:'adlistInfoForm',
			title: 'Create a new Adlist',
			contract: Adlist	
		}, function(err, address) {
			if(err) {throw err }
				FlowRouter.go('adlist', {adregistryAddress:adregistry.address,address:address})
		})
	},
	'submit form': function (e, template) {
		e.preventDefault()
		const adregistry = thisAdregistry()
		var address = $(e.target.adlist).val()
		var searchterm = $(e.target.searchterm).val()
		if (searchterm) {
			FlowRouter.go('search', {adregistryAddress:adregistry.address,searchterm:searchterm})
		}
		else if (address) {
			FlowRouter.go('adlist', {adregistryAddress:adregistry.address,address:address})
		}
	},
})


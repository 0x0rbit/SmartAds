const handleError = function (err) {
	if (err) {
	EZModal(err.toString())
	}
}

app.deployContract = function (args, callback) {
	app.formModal({
		template: args.template,
		title: args.title
	}, function(err,data) {
		handleError(err)
		const sendAmount = data.sendAmount || 0
		delete data.sendAmount
		TemplateVar.set(args.tmpl, 'deploying', true)
		ipfs.addJson(data, function(err,hash) {
			handleError(err)
			args.contract.new(hash, {data: "0x"+args.contract.bytecode, gas:2100000, value: web3.toWei(sendAmount, 'ether')
			}, function(err,contract) {
				if(err) {
					TemplateVar.set(args.tmpl,'deploying',false)
					handleError(err)
				}
			if (contract.address) {
				callback(null, contract.address)
			}
			}) 
		})
	})
}
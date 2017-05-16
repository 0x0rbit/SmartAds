Template.ipfsInfo.onCreated(function() {
	this.getIPFSData = () => {
		let ipfsHash = this.data.config.getDataMethod.call()
		if (ipfsHash) {
			TemplateVar.set(this, 'loading', true)
			ipfs.catJson(ipfsHash, (err, json) => {
				if (err) {throw err}
					TemplateVar.set(this, 'loading', false)
					TemplateVar.set(this, 'metadata', json)
			})
		} else {
			TemplateVar.set(this, 'loading', false)
		}
	}
this.getIPFSData()
})

Template.ipfsInfo.helpers({
	isUpdatable: function() {
		return this.config.updatable && app.getDefaultAddress() === this.config.owner
	}
})

const handleError = function (err, template) {
	if (err) {
		TemplateVar.set(template, 'error', err)
		throw err
	}
}

Template.ipfsInfo.events({
	'click .edit-metadata': function (e, template) {
		app.formModal({
			template: this.config.formTemplate,
			title: this.config.formTitle,
			data: TemplateVar.get('metadata')
		}, (err, data) => {
			handleError(err, template)
			TemplateVar.set(template, 'updating', true)
			ipfs.addJson(data, (err, hash) => {
				handleError(err, template)
				const txID = this.config.setDataMethod(hash)
				app.trackTransaction(txID, function(err, receipt) {
					handleError(err, template)
					TemplateVar.set(template, 'updating', false)
					TemplateVar.set(template, 'editing', false)
					template.getIPFSData()
				})
			})
		})
	}
})
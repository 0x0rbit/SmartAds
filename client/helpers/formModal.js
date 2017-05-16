app.formModal = function(args, callback) {
	if(!args.template) {
		throw Error('Template undefined')
	}
	let modalData = {
		bodyTemplate: args.template,
		dataContext: args.data,
		title: args.title,
		fixedFooter: true,
		leftButtons: [{
			html: 'Cancel'
		}],
		rightButtons: [{
			html: 'Submit',
			fn: function(e,template) {
				$(template.find('input[type="Submit"]')).click()
			}
		}]
	}
	const $thisModal = EZModal(modalData)
	$('textarea', $thisModal).trigger('autoresize')
	const $thisModalForm = $('.modal-content form', $thisModal)
	$thisModalForm.append('<input type="submit" class="hide"/>')
	$thisModalForm.on('submit', function(e) {
		e.preventDefault()
		callback(null, $thisModalForm.serializeJSON())
		$thisModal.modal('hide')
	})
	return $thisModal
}
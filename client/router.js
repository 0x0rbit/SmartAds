BlazeLayout.setRoot('body')

FlowRouter.route('/', {

	name: 'landing',
	action: function() {
		BlazeLayout.render('mainLayout', {main: 'landing'})
	}
})

FlowRouter.route('/adlist/:adregistryAddress/:address', {
	name: 'adlist' ,
	action: function() {
		BlazeLayout.render('mainLayout', {main: 'adlist'})
	}
})

FlowRouter.route('/adlist/:adregistryAddress/:adlistAddress/:adAddress', {
	name: 'ad' ,
	action: function() {
		BlazeLayout.render('mainLayout', {main: 'ad'})
	} 
})	

FlowRouter.route('/search/:adregistryAddress/:searchterm', {
	name: 'search' ,
	action: function() {
		BlazeLayout.render('mainLayout', {main: 'search'})
	} 
})	

FlowRouter.route('/adlist/:adregistryAddress/:adlistAddress/:adAddress/:escrowAddress', {
	name: 'purchase' ,
	action: function() {
		BlazeLayout.render('mainLayout', {main: 'purchase'})
	} 
})	

FlowRouter.route('/account/:adregistryAddress/:accountAddress', {
	name: 'account' ,
	action: function() {
		BlazeLayout.render('mainLayout', {main: 'account'})
	} 
})	

FlowRouter.route('/search/:adregistryAddress/:searchterm/:adlistAddress/:adAddress', {
	name: 'searchAd' ,
	action: function() {
		BlazeLayout.render('mainLayout', {main: 'ad'})
	} 
})	
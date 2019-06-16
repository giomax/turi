var app = {
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		this.checking();
		$this = this;
		setInterval(function(){
			$this.checking();
		},3000);
		$('#calendar').datepicker();


		
		$(document).on('click','.nav-item a',function(e){
			e.preventDefault();
			var id = $(this).data('id');
			$('.displayNone').hide();
			$("."+id).show();
			$('.navbar-collapse.collapse').slideUp(1000,function(){
				$(this).removeClass('show');
			});
		});
				
		 $(document).on('click','.loginBtn',function(e){
            e.preventDefault();
            $.ajax({
                url: base_url+lang+'/api_login',
                type: 'post',
                dataType: 'json',
                data: {
					'email':$('[name="email"]').val(),
					'password':$('[name="password"]').val()
				},
                success: function(data) {
					if(data.code == 0){
						swal(data.text);
					}else{
						$('.login_form').hide();
						$('.orders').show();
					}
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.responseText);
                }
            });
            return false;
        });
		
    },
	checking:function(){
		console.log('checking');
		 navigator.notification.alert(
                'mesiji',         // message
                null,                 // callback
                'titli',           // title
                'Ok'                  // buttonName
            );
		 $.ajax({
                url: base_url+lang+'/check_login',
                type: 'post',
                dataType: 'json',
                data: {
					'check':1
				},
                success: function(data) {
					if(data.code == 1){
						$('.orders').show();
					}else{
						$('.login_form').show();
					}
                }
            });
	},
    onDeviceReady: function() {
        app.setupPush();
    },
    setupPush: function() {
        var push = PushNotification.init({
            "android": {
                "senderID": "XXXXXXXX"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });

        push.on('registration', function(data) {
			console.log('daichira iventi');
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }

            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
       });
    }
};

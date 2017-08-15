$(document).ready(function(){

  // Validate
  // http://bassistance.de/jquery-plugins/jquery-plugin-validation/
  // http://docs.jquery.com/Plugins/Validation/
  // http://docs.jquery.com/Plugins/Validation/validate#toptions

  $('#sign-up-form').validate({
    rules: {
      nombre: {
        required: true
      },
      correo: {
        required: true,
        correo: true
      },
      password: {
        minlength: 6,
        required: true
      },
      confirmation: {
        minlength: 6,
        equalTo: "#password"
      }
    },
    success: function(element) {
      element
        .text('OK!').addClass('valid')
    }
  });

});


$(document).ready(function() {

    $('#submit-image-form').click(function() {
        $('#msg-image-form')
            .empty()
            .removeClass('alert-danger alert-success')
            .addClass('hide');

        $.ajax({
            url: urlImportImages,
            method: "POST",
            data: $('#image-form').serialize()
        }).done(function(response) {

            if (response.code !== 200) {
                $('#msg-image-form')
                    .html(response.message)
                    .removeClass('hide')
                    .addClass('alert-danger');
            }

            $('#msg-image-form')
                .html(response.message)
                .removeClass('hide')
                .addClass('alert-success');
        });
    });

});
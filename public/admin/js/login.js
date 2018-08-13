$(function () {
    $("#idLogin").on('click', function (e) {
        e.preventDefault();
        var dataLogin = {};
        dataLogin.email = $("#idEmail").val();
        dataLogin.password = $("#idPassword").val();
        $.ajax({
            type: "POST",
            url: "/user/login",
            data: JSON.stringify(dataLogin),
            contentType: "application/json",
            dataType: 'json',
            success: function (response) {
                setToken(response.value);
                window.location = '/admin/pages/dashboard.html';
            },
            error: function () {
                alert('Error');
            }
        });
        return false;
    });
});
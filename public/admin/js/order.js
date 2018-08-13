var listImageToUpload = [];

$(function () {
    var table = $('#example1').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: "http://localhost:8080/admin/order/find/all/forDataTable"
            // headers: getAuthHeader(),
        },
        "columns": [
            { "data": "id" },
            {
                "data": "code",
                "defaultContent": "",
                "orderable": true
            },
            {
                "data": "products[0].name",
                "defaultContent": "",
                "orderable": true
            },
            {
                "data": "customer.fullname",
                "defaultContent": "",
                "orderable": false
            },
            {
                "data": "status",
                "defaultContent": "",
                "orderable": true
            },
            {
                "data": "created_at",
                "defaultContent": "",
                "orderable": true,
            },
            {
                "data": null,
                "defaultContent": '' +
                    '<button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-pencil"></span></button>&nbsp' +
                    '<button class="btn btn-danger btn-xs" data-title="Delete"><span class="glyphicon glyphicon-trash"></span></button>',
                "orderable": false,
            }

        ],
    });

    $('#example1 tbody').on('click', 'button', function (event) {
        //         console.log('event: ', event.currentTarget.getAttribute('data-title'));
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var type = event.currentTarget.getAttribute('data-title');

        if (type == 'Edit') {
            $("#idOrderId").val(data.id);
            $("#idOrderCode").val(data.code);
            $("#idOrderCustomer").val(data.customer.fullname);
            if(data.products && data.products[0] && data.products[0].name){
                $("#idOrderProduct").val(data.products[0].name);
            }
            $("#idOrderStatus").val(data.status);
        }

        if (type == 'Delete') {
            bootbox.confirm({
                size: "small",
                message: "Are you sure you want to DELETE?",
                callback: function (result) {
                    if (result == true) {
                        $.ajax({
                            type: 'DELETE',
                            // headers: getAuthHeader(),
                            url: '/admin/order/delete?arrId=[' + data.id + ']',
                            success: function () {
                                alert("Success");
                                row.remove().draw(false);
                            },
                            error: function (jqXHR, status, err) {
                                alert("Delete fail");
                            },
                            contentType: "application/json",
                        });
                    } else {
                        console.log("No");
                    }
                }
            });
        }
    });


    $('#myModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal 
        var modal = $(this);
        var title = button.data('title');
        modal.find('.modal-title').text(title);
        $('#idSubmit').unbind();
        if (title == 'Edit') {
            $('#idSubmit').on('click', function (e) {
                e.preventDefault();
                var dataUpdate = {};
                dataUpdate.id = $("#idOrderId").val();
                dataUpdate.status = $("#idOrderStatus").val();
                $.ajax({
                    type: "PUT",
                    url: "/admin/order/update/",
                    data: JSON.stringify(dataUpdate),
                    contentType: "application/json",
                    dataType: 'json',
                    success: function (response) {
                        alert("Success");
                        $('#myModal').modal('hide');
                        table.ajax.reload(null, false); // user paging is not reset on reload
                    },
                    error: function () {
                        alert('Error');
                    }
                });
                return false;
            });
        }
    });
})
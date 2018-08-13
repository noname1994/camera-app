var listImageToUpload = [];

$(function () {
    var table = $('#example1').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: "http://localhost:8080/admin/video/find/all/forDataTable"
            // headers: getAuthHeader(),
        },
        "columns": [
            { "data": "id" },
            {
                "data": "title",
                "defaultContent": "",
                "orderable": true
            },
            {
                "data": "started_at",
                "defaultContent": "",
                "orderable": true
            },
            {
                "data": "ended_at",
                "defaultContent": "",
                "orderable": false
            },
            {
                "data": null,
                "defaultContent": "",
                "orderable": false,
                "data": null,
                "render": function (data, type, row) {
                    if (row.url) {
                        return '<a href="' + row.url + '">Link</a>';
                    }
                    return '';
                },
            },
            {
                "data": "created_type",
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
            $("#idVideoId").val(data.id);
            $("#idVideoTitle").val(data.title);
            $("#idVideoDescription").val(data.description);
            $("#idVideoUrl").val(data.url);
            $("#idVideoStartAt").val(data.started_at);
            $("#idVideoEndAt").val(data.ended_at);
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
                            url: '/admin/video/delete?arrId=[' + data.id + ']',
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
                var dataCreate = {};
                dataCreate.id = $("#idVideoId").val();
                dataCreate.title = $("#idVideoTitle").val();
                dataCreate.description = $("#idVideoDescription").val();
                dataCreate.url = $("#idVideoUrl").val();
                $.ajax({
                    type: "PUT",
                    url: "/admin/video/update",
                    data: JSON.stringify(dataCreate),
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
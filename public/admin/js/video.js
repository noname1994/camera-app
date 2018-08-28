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
                "orderable": true,
                "render": function (data, type, row) {
                    if (data) {
                        return moment(data).format('DD/MM/YYYY HH:mm');
                    }
                    return '';
                }
            },
            {
                "data": "ended_at",
                "defaultContent": "",
                "orderable": false,
                "render": function (data, type, row) {
                    if (data) {
                        return moment(data).format('DD/MM/YYYY HH:mm');
                    }
                    return '';
                }
            },
            {
                "data": null,
                "defaultContent": "",
                "orderable": false,
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
            if (data.camera_id) {
                $("#idVideoCamera").val(data.camera_id);
            } else {
                $("#idVideoCamera").val(0);
            }
            $("#idVideoTitle").val(data.title);
            $("#idVideoDescription").val(data.description);
            $("#idVideoUrl").val(data.url);
            $("#idVideoStartAt").val(moment(data.started_at).format('DD/MM/YYYY HH:mm'));
            $("#idVideoEndAt").val(moment(data.ended_at).format('DD/MM/YYYY HH:mm'));
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
                 dataCreate.camera_id = $('#idVideoCamera').val();
                if( dataCreate.camera_id <= 0){
                    alert("Please choose Camera");
                    return false;
                }
                dataCreate.created_type = "BY_ADMIN";
                dataCreate.id = $("#idVideoId").val();
                dataCreate.title = $("#idVideoTitle").val();
                dataCreate.description = $("#idVideoDescription").val();
                dataCreate.url = $("#idVideoUrl").val();
                var startDate = moment($("#idVideoStartAt").val(), 'DD/MM/YYYY HH:mm').toDate();
                var endDate = moment($("#idVideoEndAt").val(), 'DD/MM/YYYY HH:mm' ).toDate();
                if(!startDate.getTime() || !endDate.getTime()){
                    alert("Please fill all date fields");
                    return false;
                }
                if (endDate.getTime() >= new Date().getTime()) {
                    alert("End date must less than Now");
                    return false;
                }
                if (startDate.getTime() >= endDate.getTime()) {
                    alert("Start date must be before end date");
                    return false;
                }
                dataCreate.started_at = startDate.getTime(); 
                dataCreate.ended_at = endDate.getTime();
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
        }else if (title == 'Create') {
            console.log("open")
            $('#idSubmit').on('click', function (e) {
                e.preventDefault();
                var dataCreate = {};
                dataCreate.camera_id = $('#idVideoCamera').val();
                if( dataCreate.camera_id <= 0){
                    alert("Please choose Camera");
                    return false;
                }
                dataCreate.created_type = "BY_ADMIN";
                dataCreate.id = $("#idVideoId").val();
                dataCreate.title = $("#idVideoTitle").val();
                dataCreate.description = $("#idVideoDescription").val();
                dataCreate.url = $("#idVideoUrl").val();
                var startDate = moment($("#idVideoStartAt").val(), 'DD/MM/YYYY HH:mm').toDate();
                var endDate = moment($("#idVideoEndAt").val(), 'DD/MM/YYYY HH:mm' ).toDate();
                if(!startDate.getTime() || !endDate.getTime()){
                    alert("Please fill all date fields");
                    return false;
                }
                if (endDate.getTime() >= new Date().getTime()) {
                    alert("End date must less than Now");
                    return false;
                }
                if (startDate.getTime() >= endDate.getTime()) {
                    alert("Start date must be before end date");
                    return false;
                }
                dataCreate.started_at = startDate.getTime(); 
                dataCreate.ended_at = endDate.getTime();
                $.ajax({
                    type: "POST",
                    url: "/admin/video/create",
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
    // init datetimepicker
    $('.datepick').datetimepicker({
        format: 'DD/MM/YYYY HH:mm',
        ignoreReadonly: true
    });

    $.ajax({
        type: "GET",
        url: "/admin/camera/find/all",
        contentType: "application/json",
        success: function (response) {
            if (response.value && response.value.arr) {
                listCamera = response.value.arr;
                listCamera.forEach(cam => {
                    //preload list camera
                    $('#idVideoCamera').append($("<option></option>")
                        .attr("value", cam.id)
                        .text(cam.name));

                });
            }
        },
        error: function () {
            console.log("Can not load list camera")
        }
    });


})
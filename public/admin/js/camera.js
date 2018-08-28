$(function () {
    var table = $('#example1').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: "http://localhost:8080/admin/camera/find/all/forDataTable"
            // headers: getAuthHeader(),
        },
        "columns": [
            { "data": "id" },
            {
                "data": "name",
                "defaultContent": "",
                "orderable": true
            },
            {
                "data": "namespace",
                "defaultContent": "",
                "orderable": true
            },
            {
                "data": "uri",
                "defaultContent": "",
                "orderable": false
            },
            {
                "data": "location",
                "defaultContent": "",
                "orderable": false
            },
            {
                "data": "type",
                "defaultContent": "",
                "orderable": true
            },
            {
                "data": "status",
                "defaultContent": "",
                "orderable": true,
            },
            {
                "data": null,
                "defaultContent": '' +
                    '<button class="btn btn-info btn-xs" data-title="AddVideo" data-toggle="modal" data-target="#addVideoModal"><span class="glyphicon glyphicon-plus"></span></button>&nbsp' +
                    '<button class="btn btn-success btn-xs" data-title="Refresh"><span class="glyphicon glyphicon-refresh"></span></button>&nbsp' +
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

        if (type == 'AddVideo') {
            $("#idCameraToAddVideo").val(data.id);
            $("#idVideoTitle").val("");
            $("#idVideoDescription").val("");
        }

        if (type == 'Edit') {
            $("#idCameraId").val(data.id);
            $("#idCameraName").val(data.name);
            $("#idCameraDescription").val(data.description);
            $("#idCameraLocation").val(data.location);
            $("#idCameraUrl").val(data.uri);
            $("#idCameraType").val(data.type);
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
                            url: '/admin/camera/delete/' + data.id + '/',
                            success: function () {
                                makeSuccessfulToast("Delete success");
                                row.remove().draw(false);
                                sendMessageViaSocket(data.id, "DELETE");
                            },
                            error: function (jqXHR, status, err) {
                                makeErrorToast("Delete fail");
                            },
                            contentType: "application/json",
                        });
                    } else {
                        console.log("No");
                    }
                }
            });
        }

        if (type == 'Refresh') {
            bootbox.confirm({
                size: "small",
                message: "Are you sure you want to REFRESH camera processing?",
                callback: function (result) {
                    if (result == true) {
                        sendMessageViaSocket(data.id, "REFRESH");
                        // makeSuccessfulToast("Refresh success");
                        table.ajax.reload(null, false);
                        return;
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
        if (title == 'Create') {
            $("#idCameraName").val("");
            $("#idCameraDescription").val("");
            $("#idCameraLocation").val("");
            $("#idCameraUrl").val("");
            $('#idSubmit').on('click', function (e) {
                var dataCreate = {};
                dataCreate.name = $("#idCameraName").val();
                dataCreate.description = $("#idCameraDescription").val();
                dataCreate.location = $("#idCameraLocation").val();
                dataCreate.uri = $("#idCameraUrl").val();
                dataCreate.type = $("#idCameraType").val();

                $.ajax({
                    type: "POST",
                    url: "/admin/camera/create",
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
        } else if (title == 'Edit') {
            $('#idSubmit').on('click', function (e) {
                var dataCreate = {};
                dataCreate.id = $("#idCameraId").val();
                dataCreate.name = $("#idCameraName").val();
                dataCreate.description = $("#idCameraDescription").val();
                dataCreate.location = $("#idCameraLocation").val();
                dataCreate.uri = $("#idCameraUrl").val();
                dataCreate.type = $("#idCameraType").val();
                $.ajax({
                    type: "PUT",
                    url: "/admin/camera/update",
                    data: JSON.stringify(dataCreate),
                    contentType: "application/json",
                    dataType: 'json',
                    success: function (response) {
                        alert("Success");
                        $('#myModal').modal('hide');
                        table.ajax.reload(null, false); // user paging is not reset on reload
                        sendMessageViaSocket(data.id, "UPDATE");
                    },
                    error: function () {
                        alert('Error');
                    }
                });
                return false;
            });
        }
    });

    // set timepicker
    $('#idVideoStartAt').timepicker({
        minuteStep: 1,
        showSeconds: false,
        maxHours: 24,
        showMeridian: false,
        disableFocus: true
    });
    $('#idVideoEndAt').timepicker({
        minuteStep: 1,
        showSeconds: false,
        maxHours: 24,
        showMeridian: false,
        disableFocus: true
    });
    $('#idVideoSubmit').on('click', function (e) {
        var startDate = new Date();
        var endDate = new Date();
        try {
            var start = $("#idVideoStartAt").val().split(":");
            var end = $("#idVideoEndAt").val().split(":");
            startDate.setMilliseconds(0);
            startDate.setSeconds(0);
            startDate.setHours(start[0]);
            startDate.setMinutes(start[1]);
            endDate.setMilliseconds(0);
            endDate.setSeconds(0);
            endDate.setHours(end[0]);
            endDate.setMinutes(end[1]);
        } catch (err) {
            alert("Wrong date input");
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
        var dataCreate = {};
        dataCreate.camera_id = $("#idCameraToAddVideo").val();
        dataCreate.created_type = "BY_PRODUCT";
        dataCreate.title = $("#idVideoTitle").val();
        dataCreate.description = $("#idVideoDescription").val();
        dataCreate.started_at = startDate.getTime();
        dataCreate.ended_at = endDate.getTime();
        $.ajax({
            type: "POST",
            url: "/admin/video/buildVideo",
            data: JSON.stringify(dataCreate),
            contentType: "application/json",
            dataType: 'json',
            success: function (response) {
                alert("Success! Your video will be available soon");
                $('#addVideoModal').modal('hide');
            },
            error: function () {
                alert('Error');
            }
        });
        return false;
    });
})


// socket io
var socket = io(location.origin + "/admin/camera");

function sendMessageViaSocket(camId, type){
    // type = UPDATE, DELETE
    let msg = {id: camId, type: type};
    socket.emit("message", msg);
}

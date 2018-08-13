var listImageToUpload = [];

$(function () {
    var table = $('#example1').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: "http://localhost:8080/admin/user/find/all/forDataTable"
            // headers: getAuthHeader(),
        },
        "columns": [
            { "data": "id" },
            {
                "data": "email",
                "defaultContent": "",
                "orderable": true
            },
            {
                "data": "fullname",
                "defaultContent": "",
                "orderable": true
            },
            {
                "data": "phone_number",
                "defaultContent": "",
                "orderable": false
            },
            {
                "data": "address",
                "defaultContent": "",
                "orderable": false
            },
            {
                "data": null,
                "defaultContent": '' +
                    // '<button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-pencil"></span></button>&nbsp' +
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
            $("#idProductId").val(data.id);
            $("#idProductName").val(data.name);
            $("#idProductOriginalPrice").val(data.original_price);
            $("#idProductSalePrice").val(data.sale_price);
            $("#idProductDescription").val(data.description);
            var output = [];
            listImageToUpload = [];
            $("#idFileList").empty();
            if (data.images) {
                data.images.forEach(imgRes => {
                    listImageToUpload.push(imgRes);
                    var removeLink = "<a class=\"removeFile\" href=\"#\" data-fileid=\"" + imgRes.id + "\">Remove</a>";
                    output.push("<li><strong>", escape(imgRes.originalname), "</strong> - ", imgRes.size, " bytes.     ", removeLink, "</li> ");
                });
                $("#idFileList").append(output.join(""));
            }
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
                            url: '/admin/user/delete?arrId=[' + data.id + ']',
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
        if (title == 'Create') {
            console.log("open");
            $("#idProductId").val("");
            $("#idProductName").val("");
            $("#idProductOriginalPrice").val("");
            $("#idProductSalePrice").val("");
            $("#idProductDescription").val("");
            // $("#idProductStatus").val("");
            // $("#idProductType").val("");
            $("#idFileList").empty();
            listImageToUpload = [];
            $('#idSubmit').on('click', function (e) {
                e.preventDefault();
                var dataCreate = {};
                dataCreate.name = $("#idProductName").val();
                dataCreate.original_price = $("#idProductOriginalPrice").val();
                dataCreate.sale_price = $("#idProductSalePrice").val();
                dataCreate.description = $("#idProductDescription").val();
                dataCreate.status = $("#idProductStatus").val();
                dataCreate.type = $("#idProductType").val() == "" ? null : $("#idProductType").val();

                if (listImageToUpload && listImageToUpload.length > 0) {
                    dataCreate.images = listImageToUpload
                }
                $.ajax({
                    type: "POST",
                    url: "/admin/user/create",
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
                e.preventDefault();
                var dataCreate = {};
                dataCreate.id = $("#idProductId").val();
                dataCreate.name = $("#idProductName").val();
                dataCreate.original_price = $("#idProductOriginalPrice").val();
                dataCreate.sale_price = $("#idProductSalePrice").val();
                dataCreate.description = $("#idProductDescription").val();
                dataCreate.status = $("#idProductStatus").val();
                dataCreate.type = $("#idProductType").val() == "" ? null : $("#idProductType").val();
                if (listImageToUpload && listImageToUpload.length > 0) {
                    dataCreate.images = listImageToUpload
                }
                $.ajax({
                    type: "PUT",
                    url: "/admin/user/update",
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


    // var files1Uploader = $("#files1").fileUploader(listImageToUpload, "files1");

    $('#idUploadFile').change(function (event) {
        var images = event.target.files;
        var formImage = new FormData();
        for (var i = 0; i < images.length; i++) {
            var image = images[i];
            formImage.append('file', image);
            console.log(image.name);
        }


        $.ajax({
            type: 'POST',
            // headers: getAuthHeader(),
            url: '/file/upload',
            data: formImage,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.value && data.value.list) {
                    var output = [];
                    data.value.list.forEach(imgRes => {
                        listImageToUpload.push(imgRes);
                        var removeLink = "<a class=\"removeFile\" href=\"#\" data-fileid=\"" + imgRes.id + "\">Remove</a>";
                        output.push("<li><strong>", escape(imgRes.originalname), "</strong> - ", imgRes.size, " bytes.     ", removeLink, "</li> ");
                    });
                    console.log(listImageToUpload.length);
                    $("#idFileList").append(output.join(""));
                }

            },
            error: function (jqXHR, status, err) {
                alert("Error in upload file");
            },
        })
    });

    $("#files1").on("click", ".removeFile", function (e) {
        e.preventDefault();

        var fileId = $(this).parent().children("a").data("fileid");

        // loop through the files array and check if the name of that file matches FileName
        // and get the index of the match
        for (var i = 0; i < listImageToUpload.length; ++i) {
            if (listImageToUpload[i].id === fileId) {
                listImageToUpload.splice(i, 1);
            }
        }

        $(this).parent().remove();
        console.log(listImageToUpload.length);

    });

})
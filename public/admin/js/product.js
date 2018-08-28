var listImageToUpload = [];
var listCamera = [];
var listVideoToAdd = [];
$(function () {
    var table = $('#example1').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: "http://localhost:8080/admin/product/find/all/forDataTable"
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
                "data": "original_price",
                "defaultContent": "",
                "orderable": true
            },
            {
                "data": "status",
                "defaultContent": "",
                "orderable": false
            },
            {
                "data": "description",
                "defaultContent": "",
                "orderable": false
            },
            {
                "data": "type.name",
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
        console.log("data: ", data);
        if (type == 'Edit') {
            $("#idProductId").val(data.id);
            if (data.camera_id) {
                $("#idProductCamera").val(data.camera_id);
            } else {
                $("#idProductCamera").val(0);
            }
            $("#idProductName").val(data.name);
            $("#idProductOriginalPrice").val(data.original_price);
            $("#idProductSalePrice").val(data.sale_price);
            $("#idProductDescription").val(data.description);
            $('#idProductContent').summernote('code', data.content);

            if (data.type){
                var type = data.type;
                $("#idProductType").val(type.id);
            }else{
                $("#idProductType").val(0);
            }
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
            $('#idProductVideos').empty();
            listVideoToAdd = data.videos;
            if(listVideoToAdd){
                listVideoToAdd.forEach(video => {
                    $("#idSearchVideo").val("");
                    $('#idProductVideos').append(
                        '<li class="list-group-item" id="video' + video.id + '">' + video.title
                        + '<span class="glyphicon glyphicon-remove pull-right" style="cursor:pointer;" onclick=removeVideoInList(' + video.id + ')></span></li>');
                });
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
                            url: '/admin/product/delete?arrId=[' + data.id + ']',
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
            $("#idProductCamera").val();
            $("#idProductName").val("");
            $("#idProductOriginalPrice").val("");
            $("#idProductSalePrice").val("");
            $("#idProductDescription").val("");
            $("#idProductContent").summernote('code', '');

            // $("#idProductStatus").val("");
            $("#idProductType").val(0);
            $("#idFileList").empty();
            listImageToUpload = [];
            $('#idProductVideos').empty();
            $('#idSubmit').on('click', function (e) {
                e.preventDefault();
                var dataCreate = {};
                dataCreate.name = $("#idProductName").val();
                dataCreate.original_price = $("#idProductOriginalPrice").val();
                dataCreate.sale_price = $("#idProductSalePrice").val();
                dataCreate.description = $("#idProductDescription").val();
                dataCreate.content = $('#idProductContent').summernote('code');
                dataCreate.status = $("#idProductStatus").val();
                let objType = {};
                objType.id = $("#idProductType").val() == "" ? null : $("#idProductType").val();
                dataCreate.type = objType;
                if (listImageToUpload && listImageToUpload.length > 0) {
                    dataCreate.images = listImageToUpload
                }
                var cameraId = $("#idProductCamera").val();
                if (cameraId > 0) {
                    dataCreate.camera_id = cameraId;
                }
                dataCreate.videos = listVideoToAdd;
                $.ajax({
                    type: "POST",
                    url: "/admin/product/create",
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
                dataCreate.content = $('#idProductContent').summernote('code');
                dataCreate.status = $("#idProductStatus").val();
                let objType = {};
                objType.id = $("#idProductType").val() == "" ? null : $("#idProductType").val();
                dataCreate.type = objType;
                if (listImageToUpload && listImageToUpload.length > 0) {
                    dataCreate.images = listImageToUpload
                }
                dataCreate.related_videos = listVideoToAdd;
                var cameraId = $("#idProductCamera").val();
                if (cameraId > 0) {
                    dataCreate.camera_id = cameraId;
                }
                $.ajax({
                    type: "PUT",
                    url: "/admin/product/update",
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

    $.ajax({
        type: "GET",
        url: "/admin/type",
        contentType: "application/json",
        success: function (response) {
            if (response.value && response.value.arr) {
                listType = response.value.arr;
                listType.forEach(type => {
                    //preload list camera
                    $('#idProductType').append($("<option></option>")
                        .attr("value", type.id)
                        .text(type.name));

                });
            }
        },
        error: function () {
            console.log("Can not load list camera")
        }
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
                    $('#idProductCamera').append($("<option></option>")
                        .attr("value", cam.id)
                        .text(cam.name));

                });
            }
        },
        error: function () {
            console.log("Can not load list camera")
        }
    });

    $('#idProductCamera').change(function (event) {
        var cameraId = $('#idProductCamera').val();
        if (cameraId >= 0) {
            $('#idProductVideos').empty();
            findListVideo();
        }
    });
    $("#idSearchVideo").focus(function () {
        findListVideo();
    });
    /*execute a function presses a key on the keyboard:*/
    $("#idSearchVideo").on("keyup", function (e) {
        findListVideo();
        if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
        }
    });
})
function removeVideoInList(idVideo) {
    $("#video" + idVideo).remove();
    if(listVideoToAdd){
        listVideoToAdd.forEach((video, index) => {
            if(video.id){
                if(video.id == idVideo){
                    listVideoToAdd.splice(index, 1);
                }
            }
        });
    }
}
function findListVideo() {
    var cameraId = $('#idProductCamera').val();
    var searchText = $("#idSearchVideo").val();
    if (cameraId < 0) {
        return;
    }
    $.ajax({
        type: "GET",
        url: "/admin/video/find/all?created_type=BY_PRODUCT&camera_id="+cameraId+"&searchText=" + searchText,
        contentType: "application/json",
        success: function (response) {
            if (response.value && response.value.arr) {
                $("#idSearchVideo").empty();
                autocomplete(document.getElementById("idSearchVideo"), response.value.arr);
            }
        },
        error: function () {
            console.log("Can not load list video")
        }
    });
}
var currentFocus;
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    $('#idBtnAddVideo').unbind();
    $('#idBtnAddVideo').click(function (event) {
        $("#idSearchVideo").empty();
        if (currentFocus >= 0) {
            var video = arr[currentFocus];
            var check = $("#video" + video.id).length;
            if (!check) {
                $("#idSearchVideo").val("");
                listVideoToAdd.push(video);
                $('#idProductVideos').append(
                    '<li class="list-group-item" id="video' + video.id + '">' + video.title
                    + '<span class="glyphicon glyphicon-remove pull-right" style="cursor:pointer;" onclick=removeVideoInList(' + video.id + ')></span></li>');
            }
        }
    });
    /*execute a function when someone writes in the text field:*/


    inp.addEventListener("keyup", function (e) {
        draw();
    });
    function draw() {
        var inp = document.getElementById("idSearchVideo");
        console.log("draw");
        var a, b, i, val = inp.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        // if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", inp.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        inp.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            var text = arr[i].title;
            /*check if the item starts with the same letters as the text field value:*/
            // if (text.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            // b.innerHTML = "<strong>" + text.substr(0, val.length) + "</strong>";
            // b.innerHTML += text.substr(val.length);
            b.innerHTML += text;
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' name='" + i + "' value='" + text + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/

            b.addEventListener("click", function (e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                currentFocus = this.getElementsByTagName("input")[0].name;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
            // }
        }
    }
    draw();
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
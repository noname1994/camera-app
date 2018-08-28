// Shorthand for $( document ).ready()
$(function () {

    /**
     * Related product
     */
    $.ajax({
        type: "GET",
        url: "/product/find/all",
        contentType: "application/json",
        success: function (response) {
            if (response.value && response.value.arr) {
                var listProduct = response.value.arr;
                buildListProduct($('#relatedProduct'), listProduct, CONSTANTS.TYPE_OF_RUOU);
            }
        },
        error: function () {
            console.log("Can not load related product")
        }
    });

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    var productId = getUrlParameter("productId");

    $.ajax({
        type: "GET",
        url: "/product/detail?productId=" + productId,
        dataType: 'json',
        success: function (response) {
            // alert("Success");
            console.log("response: ", response);
            buildProduct(response.value);
            updateView();
        },
        error: function () {
            alert('Error');
        }
    });
    // buildProduct({})

    function buildProduct(product) {

        var images = product.images || [];
        var mainImage = images.find(function (img) {
            return img.priority == 1;
        })
        if (!mainImage && images.length > 0) {
            mainImage = images[0];
        }

        var str = '';

        var thumbnail = '';

        images.forEach((img, i) => {
            console.log("img: ", img);
            str += `<div class="item">
                        <div class="img-wrap"><span class="sold-icon-car-detail bg-gray">Đã nhận cọc</span>
                            <img src="${img.path}" alt="Toyota Vios E 1.5MT 2017" title="Toyota Vios E 1.5MT 2017" style="filter: gray; ">
                        </div>
                    </div>`

            thumbnail += `
                    <div class="item">
                        <a class="img-wrap" data-index="${i}" href="javascript:void(0);"><img src="${img.path}" alt="Toyota Vios E 1.5MT 2017"
                                title="Toyota Vios E 1.5MT 2017" style="filter: gray; "></a>
                    </div>
            `;
        });

        console.log("str : ", str);

        $("#div-1st").append(`
            <div class="sub-page">
                <div class="container"  style="width: 100%"> 
                    <div class="sub-page-content">
                        <div class="row">
                            <div class="col-lg-content" style="width: 100%">
                                <div class="car-slider">
                                    <div class="sync-slider">
                                        <div class="slider-show">
                                            ${str}
                                        </div>
                                        <div class="slider-control hidden-xs">
                                            ${thumbnail}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-content">
                <div class="car-intro show-icons">
                    <div class="full-content" id="tab-car-info" style="padding-left: 20px; padding-top: 20px;">
                        <div class="item">
                            ${product.content || ""}
                        </div>
                    </div>
                    <!-- Tab panes -->
                </div>
                <div class=""></div>
                <div class="visible-lg"></div>
            </div>
    `)
    }


    // get list video related with
    $.ajax({
        type: "GET",
        url: "/admin/video/find/all?productId=" + productId,
        contentType: "application/json",
        success: function (response) {
            if (response.value && response.value.arr) {
                var listVideo = response.value.arr;
                buildListRelatedVideo($('#listView'), listVideo)
            }
        },
        error: function () {
            console.log("Can not load related video")
            buildListRelatedVideo($('#listView', null));
        }
    });


});
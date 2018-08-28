// Shorthand for $( document ).ready()
$(function () {
    console.log("ready!");
    let newsId = getUrlParam("newsId");
    console.log(newsId);
    // get detail article
    $.ajax({
        type: "GET",
        url: "/news/detail?newsId=" + newsId,
        contentType: "application/json",
        success: function (response) {
            if (response.value) {
                var article = response.value;
                var content = article.content || "";
                var images = article.images || [];
                $('#article-content').append(content);
                buildCarouselList($('#article-image-container'), images);
            }
        },
        error: function () {
            console.log("Can not load related article")
        }
    });

    // get list newest article
    $.ajax({
        type: "GET",
        url: "/news/find/all",
        contentType: "application/json",
        success: function (response) {
            if (response.value && response.value.arr) {
                var listArticle = response.value.arr;
                buildListRecentArticle($('#recent-article-container'), listArticle)
            }
        },
        error: function () {
            console.log("Can not load related article")
        }
    });

    // get list related product
    $.ajax({
        type: "GET",
        url: "/product/find/all",
        contentType: "application/json",
        success: function (response) {
            if (response.value && response.value.arr) {
                var listProduct = response.value.arr;
                buildListProduct($('#product-container'), listProduct, CONSTANTS.TYPE_OF_RUOU);
            }
        },
        error: function () {
            console.log("Can not load related product")
        }
    });
});


function buildCarouselList(divToAppend, list) {
    if (list) {
        list.forEach(function (element, index) {
            var imageSrc = element.path || '/static/images/device_03.png';
            var isActive = index == 0 ? "active" : "";
            divToAppend.append(
            '<div class="item '+isActive+'">'+
            '    <img src="'+imageSrc+'" alt="" class="img-responsive">'+
            '</div>'
            );
        }, this);
    } else {
        // default image    
        divToAppend.append(
            ` <div class="item active">
                <img src="/static/images/bai-viet/blog_single_01.jpg" alt="" class="img-responsive">
            </div>`
        );
    }
}
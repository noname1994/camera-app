// Shorthand for $( document ).ready()
var PAGE_SIZE = 10;
$(function () {
    console.log("ready!");

    // get list newest article
    getListArticle(0);

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
                buildListRecentProduct($('#recent-product-container'), listProduct);
            }
        },
        error: function () {
            console.log("Can not load related product")
        }
    });

});

function getListArticle(pageNum) {
    $('#article-container').empty();
    $.ajax({
        type: "GET",
        url: "/news/find/all?pageNum=" + pageNum + "&pageSize="+ PAGE_SIZE,
        contentType: "application/json",
        success: function (response) {
            if (response.value && response.value.arr && response.value.total) {
                var listArticle = response.value.arr;
                buildListArticle($('#article-container'), listArticle);
                buildPagination(response.value.total, pageNum + 1);
            }
        },
        error: function () {
            console.log("Can not load article")
        }
    });
}
function buildPagination(maxItems, currentPage) {
    $('#pagination').pagination({
        items: maxItems,
        itemsOnPage: PAGE_SIZE,
        currentPage: currentPage,
        cssStyle: 'light-theme',
        onPageClick(pageNumber, event) {
            console.log("go to Page: " + pageNumber);
            getListArticle(pageNumber - 1);
        }
    });
}

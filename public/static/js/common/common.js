var CONSTANTS = {
    TYPE_OF_RUOU : "BINH_RUOU",
    TYPE_OF_GA : "CHUONG_GA"
 }

function buildListCamera(divToAppend, list, type){
    if(list){
        list.forEach(function(element) {
            var imageSrc = element.images && element.images.length > 0 && element.images[0].path ? element.images[0].path : '/static/images/device_03.png';
            var link_video = "#"; 
            var link_dat_hang = "#";
            var camId = element.id;
            if(type == CONSTANTS.TYPE_OF_RUOU){
                link_video = "/video-truc-tuyen-ruou?camId=" + camId;
                link_dat_hang = "/dat-hang-ruou?camId=" + camId;
            }else if(type == CONSTANTS.TYPE_OF_GA){
                link_video = "/video-truc-tuyen-ga?camId=" + camId;
                link_dat_hang = "/dat-hang-ga?camId=" + camId;
            }
            divToAppend.append(
            '<div class="col-md-3 col-sm-3 shop-item">                                                           '+
            '	<div class="entry">                                                                              '+
            '		<img class="img-responsive img-style" src=" '+imageSrc+' " alt="">                                     '+
            '		<div class="magnifier">                                                                      '+
            '			<div class="buttons">                                                                    '+
            '				<a class="st" rel="bookmark" href="' + link_dat_hang+ '"><span class="fa fa-shopping-cart"></span></a>  '+
            // '				<a class="st" rel="bookmark" href="#"><span class="fa fa-link"></span></a>           '+
            '			</div>                                                                                   '+
            '		</div>                                                                                       '+
            '		<!-- end magnifier -->                                                                       '+
            '	</div>                                                                                           '+
            '	<!-- end entry -->                                                                               '+
            '	<h4><a href="' + link_video+ '">'+element.name+'</a></h4>                                   '+
            '	<a href="' + link_video+ '"><small>Thông tin chi tiết</small></a>                                                              '+
            // '	<div class="rating">                                                                             '+
            // '		<i class="fa fa-star"></i>                                                                   '+
            // '		<i class="fa fa-star"></i>                                                                   '+
            // '		<i class="fa fa-star"></i>                                                                   '+
            // '		<i class="fa fa-star"></i>                                                                   '+
            // '		<i class="fa fa-star-o"></i>                                                                 '+
            // '		<span>(12)</span>                                                                            '+
            // '	</div>                                                                                           '+
            '</div>                                                                                              '+
            '<!-- end shop_item -->');
        }, this);
    }
}

function buildListProduct(divToAppend, list, type){
    if(list){
        list.forEach(function(element) {
            var imageSrc = element.images && element.images.length > 0 && element.images[0].path ? element.images[0].path : '/static/images/device_03.png';
            var link_dat_hang = "#";
            var productId = element.id;
            if(type == CONSTANTS.TYPE_OF_RUOU){
                link_dat_hang = "/dat-hang-ruou?productId=" + productId;
            }else if(type == CONSTANTS.TYPE_OF_GA){
                link_dat_hang = "/dat-hang-ga?productId=" + productId;
            }
            var price = element.sale_price || 0;
            price = price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
            divToAppend.append(
            '<div class="col-md-3 col-sm-3 shop-item">                                                           '+
            '	<div class="entry">                                                                              '+
            '		<img class="img-responsive img-style" src="'+ imageSrc +'" alt="">                       '+
            '		<div class="magnifier">                                                                      '+
            '			<div class="buttons">                                                                    '+
            '				<a class="st" rel="bookmark" href="'+ link_dat_hang+ '"><span class="fa fa-shopping-cart"></span></a>  '+
            // '				<a class="st" rel="bookmark" href="#"><span class="fa fa-link"></span></a>           '+
            '			</div>                                                                                   '+
            '		</div>                                                                                       '+
            '		<!-- end magnifier -->                                                                       '+
            '	</div>                                                                                           '+
            '	<!-- end entry -->                                                                               '+
            '	<h4 ><a href="/san-pham?productId='+element.id+'">'+element.name+'</a></h4>                                   '+
            // '	<a href="/san-pham?productId='+element.id+'"><small>Thông tin chi tiết</small></a>                                                                '+
            '	<div class="rating">                                                                             '+
            '		<i class="fa fa-star-o"></i>                                                                   '+
            '		<i class="fa fa-star-o"></i>                                                                   '+
            '		<i class="fa fa-star-o"></i>                                                                   '+
            '		<i class="fa fa-star-o"></i>                                                                   '+
            '		<i class="fa fa-star-o"></i>                                                                 '+
            '		<span></span>                                                                            '+
            '	</div>                                                                                           '+
            '	<h4><a href="/san-pham?productId='+element.id+'" style="color:#e74c3c;">'+price+'</a></h4>                                   '+
            '</div>                                                                                              '+
            '<!-- end shop_item -->');
        }, this);
    }
}

function buildListRelatedVideo(divToAppend, list){
    if(list && list.length > 0){
        list.forEach(function(element) {
            var imageSrc = element.thumnail  ? element.thumnail : '/static/images/san-pham/1.jpg';
            var camId = element.camera_id;
            var linkReplay = "/camera?camId="+ camId + "&videoId=" +element.id;
            divToAppend.append(
            ' <li class="k-item k-state-default" onmouseover="$(this).addClass("k-state-hover")" onmouseout="$(this).removeClass("k-state-hover")"   '+
            '                         role="option" aria-selected="false">                                                 '+
            ' 	<a href="'+linkReplay+'"> ' +
            '       <span>                                                                                                                               '+
            ' 		    <img src="'+ imageSrc +'">                                                                                        '+
            ' 		    <h5>'+ element.title+'</h5>                                                                     '+
            ' 	     </span>                                                                                                                              '+
            '    </a>  ' +
            ' </li>                                                                                                                                  ');
        }, this);
    }else{
        // show No content div
        $('.playlist').addClass('center-content');
        $("#idNoContent").css("display","");      
    }
}
function getUrlParam( name ) {
    var url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

function buildListArticle(divToAppend, list){
    if(list){
        list.forEach(function(element) {
            var imageSrc = element.images && element.images.length > 0 && element.images[0].path ? element.images[0].path : '/static/images/device_03.png';
            var link =  "/bai-viet?newsId=" + element.id;
            var createdDate =  new Date(element.created_at);

            
            divToAppend.append(
            '<div class="blog-wrapper row">                                                                                                                   '+
            '	<div class="col-md-5">                                                                                                                        '+
            '		<div class="blog-image">                                                                                                                  '+
            '			<a href="'+link+'" title=""><img src="'+imageSrc+'" alt="" class="img-responsive img-style"></a>                  '+
            '		</div>                                                                                                                                    '+
            '		<!-- end image -->                                                                                                                        '+
            '	</div>                                                                                                                                        '+
            '                                                                                                                                                 '+
            '	<div class="col-md-7">                                                                                                                        '+
            '		<div class="blog-title">                                                                                                                  '+
            '			<h2><a href="'+link+'" title="">'+element.title+'</a></h2>                                                    '+
            '			<div class="post-meta">                                                                                                               '+
            '				<span>                                                                                                                            '+
            '				<i class="fa fa-clock-o"></i>                                                                                                     '+
            '				<a href="#">' + buildFormatedDateAsString(createdDate) +'</a>                                                                                                      '+
            '				</span>                                                                                                                           '+
            // '				<span>                                                                                                                            '+
            // '				<i class="fa fa-comments"></i>                                                                                                    '+
            // '				<a href="#">31 Comments</a>                                                                                                       '+
            // '				</span>                                                                                                                           '+
            // '				<span>                                                                                                                            '+
            // '				<i class="fa fa-eye"></i>                                                                                                         '+
            // '				<a href="#">441 Views</a>                                                                                                         '+
            // '				</span>                                                                                                                           '+
            // '				<span>                                                                                                                            '+
            // '				<i class="fa fa-share-alt"></i>                                                                                                   '+
            // '				<a href="#">Share</a>                                                                                                             '+
            // '				</span>                                                                                                                           '+
            '			</div>                                                                                                                                '+
            '			<div class="block-with-text">'+element.description+'</div>                                                                                                   '+
            '			<a href="'+link+'" class="readmore">Read more</a>                                                                                    '+
            '		</div>                                                                                                                                    '+
            '		<!-- end desc -->                                                                                                                         '+
            '	</div>                                                                                                                                        '+
            '</div>                                                                                                                                           '+
            '<!-- end blog-wrapper -->                                                                                                                        '
            );
        }, this);
    }
}

function buildListRecentArticle(divToAppend, list){
    if(list){
        list.forEach(function(element) {
            var imageSrc = element.images && element.images.length > 0 && element.images[0].path ? element.images[0].path : '/static/images/device_03.png';
            var link =  "/bai-viet?id=" + element.id;
            var createdAt =  new Date();
            divToAppend.append(
            '<li style="width: 100%;">                                                                         '+
            '	<p>                                                                       '+
            '		<a href="'+link+'" title="">                                          '+
            '			<img src="'+imageSrc+'" alt="" class="alignleft img-style">' + element.title +
            '		</a>                                                                  '+
            '	</p>                                                                      '+
            '	<span>' + moment(createdAt).format('DD/MM/YYYY') + '</span>                                         '+
            '</li>                                                                        '
            );
        }, this);
    }
}

function buildListRecentProduct(divToAppend, list){
    if(list){
        list.forEach(function(element) {
            var imageSrc = element.images && element.images.length > 0 && element.images[0].path ? element.images[0].path : '/static/images/device_03.png';
            var link = "/san-pham?productId=" + element.id;
            var createdAt =  element.created_at || new Date();
            divToAppend.append(
            '<li style="width: 100%;">                                                                         '+
            '	<p>                                                                       '+
            '		<a href="'+link+'" title="">                                          '+
            '			<img src="'+imageSrc+'" alt="" class="alignleft img-style">' + element.name +
            '		</a>                                                                  '+
            '	</p>                                                                      '+
            '	<span>' + moment(createdAt).format('DD/MM/YYYY') + '</span>                                         '+
            '</li>                                                                        '
            );
        }, this);
    }
}

function buildFormatedDateAsString(date){
    let stringDate = "";
    if(date){
        stringDate = "Ngày " + date.getDate() + " tháng " + date.getMonth() + " năm " + date.getFullYear(); 
    }
    return stringDate;
}
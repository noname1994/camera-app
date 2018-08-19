function buildListCamera(divToAppend, list){
    if(list){
        list.forEach(function(element) {
            divToAppend.append(
            '<div class="col-md-3 col-sm-3 shop-item">                                                           '+
            '	<div class="entry">                                                                              '+
            '		<img class="img-responsive" src="/static/images/device_03.png" alt="">                       '+
            '		<div class="magnifier">                                                                      '+
            '			<div class="buttons">                                                                    '+
            '				<a class="st" rel="bookmark" href="/dat-hang-ruou"><span class="fa fa-shopping-cart"></span></a>  '+
            // '				<a class="st" rel="bookmark" href="#"><span class="fa fa-link"></span></a>           '+
            '			</div>                                                                                   '+
            '		</div>                                                                                       '+
            '		<!-- end magnifier -->                                                                       '+
            '	</div>                                                                                           '+
            '	<!-- end entry -->                                                                               '+
            '	<h4><a href="/video-truc-tuyen-ruou">Tên bình rượu</a></h4>                                      '+
            '	<small>Thông tin chi tiết</small>                                                                '+
            '	<div class="rating">                                                                             '+
            '		<i class="fa fa-star"></i>                                                                   '+
            '		<i class="fa fa-star"></i>                                                                   '+
            '		<i class="fa fa-star"></i>                                                                   '+
            '		<i class="fa fa-star"></i>                                                                   '+
            '		<i class="fa fa-star-o"></i>                                                                 '+
            '		<span>(12)</span>                                                                            '+
            '	</div>                                                                                           '+
            '</div>                                                                                              '+
            '<!-- end shop_item -->');
        }, this);
    }
}
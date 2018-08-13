const fs = require('fs');
const fbUpload = require('facebook-api-video-upload');
const request = require('request');
const VideoService = require("../api/service/camera/video.service");
const videoService = new VideoService();

/*
* FB account: 01205284605/abc13579

* Go to: https://developers.facebook.com/tools/explorer/
(DEBUG: https://developers.facebook.com/tools/debug/accesstoken)
(extend to 2 month: https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=2196506320579383&client_secret=9c107474996d0af1bd5807766f126a9e&fb_exchange_token={short-lived-token} )
* Choose : Lấy mã truy cập người dùng, chọn quyền publish_action, user_post, user_photo, user_videos
* Choose : Bấm Lấy mã truy cập
* (!IMPORTANT) Cho FB quyền đăng bài với Mọi người 
* Copy mã truy cập vào bên dưới. eg: EAACEdEose0cBAI8Xxezhq8ZBalHcWEBoH5x2hAXoJiLeLRQWqfbHdoKZBACsZBxaoGRIlxfI0eF6QgX65dmAZBUTgvp8OMoWVnIhyoIUZBW1Bq0907UvKQTqUFWTeQNmOwgk6za0ZCMPUxFPZBWAn2bNvxFVGQiO9MJuUhDd9XVgvfQA8u5pBVq5DZCwbt37b7ZBtX9jMBdhMuevXxKp2iw00ioXVB0NpZCZBYZD
* Dòng GET, nhập : /v2.6/me   
    ->response: 
    {
    "name": "Nguyen Duy",
    "id": "106820440195293"
    }
* Copy id này vào bên dưới. Chú ý: ứng với mỗi app Id của người dùng sẽ thay đổi
*
* Limit : https://developers.facebook.com/docs/graph-api/advanced/rate-limiting
* 200 API calls/ 1 user/ 1 hour
* 
* res:  { success: true, video_id: '106824343528236' }

Call: 
https://graph.facebook.com/v2.6/106824343528236?fields=embed_html,picture,embeddable
{
  "embed_html": "<iframe src=\"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F100026020122480%2Fvideos%2F106824343528236%2F&width=854\" width=\"854\" height=\"480\" style=\"border:none;overflow:hidden\" scrolling=\"no\" frameborder=\"0\" allowTransparency=\"true\" allowFullScreen=\"true\"></iframe>",
  "picture": "https://scontent.xx.fbcdn.net/v/t15.0-10/p168x128/30833005_106826086861395_1119390188120834048_n.jpg?_nc_cat=0&oh=a0d17f4170ef3780454615e0d9a7781b&oe=5B9CD2E1",
  "embeddable": true,
  "id": "106824343528236"
}

* Dòng embed_html có thể nhúng vào bất kỳ trang nào
*/
class FacebookVideoUploadService {
    upload(absoluteVideoPath, videoDto) {
        console.log("Start upload to fb");
        let args = {
            token: "EAACEdEose0cBAIFsQ5unAPlm3ozeTNZBnitbC2ZCRxzNPfiw6DTIYhRQTAQC50nz4HGhyJNeFaJVnEnfSoxaCtQtgzXkIRK5ZC6aCapULiTfTa13Nnuo7hxXFwhy4mshbwNo3XJnwctOvnqkv0QYCOzKfnRNy6ZBAuL8n1A7MIp813OXd4PZC2kZBEZA9wDcECn2Nbd64aqATaigLvMB5g3", // with the permission to upload
            id: 106820440195293, //The id represent {page_id || user_id || event_id || group_id}
            stream: fs.createReadStream(absoluteVideoPath), //path to the video
            title: videoDto.title,
            description: "This is playback video from camera"
        };

        fbUpload(args).then((res) => {
            console.log('res: ', res);
            //res:  { success: true, video_id: '1838312909759132' }

            //update video object
            if (videoDto) {
                videoDto.video_id = res.video_id;
                videoDto.url = "https://www.facebook.com/100026020122480/videos/" + res.video_id + "/";
                videoDto.embedded_link = '<iframe src="https://www.facebook.com/plugins/video.php?'+
                'href=https%3A%2F%2Fwww.facebook.com%2F100026020122480%2Fvideos%2F' + res.video_id +
                '%2F&width=854" width="854" height="480" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>';
                videoService.update(videoDto, videoDto.id);
            }

        }).catch((e) => {
            console.error(e.message);
            console.error("Can not upload Video file:", absoluteVideoPath);
        });

    }
    getDetailVideoById(idVideoFB){
        request('https://graph.facebook.com/v2.6/' + idVideoFB +
        '?access_token=EAACEdEose0cBAIFsQ5unAPlm3ozeTNZBnitbC2ZCRxzNPfiw6DTIYhRQTAQC50nz4HGhyJNeFaJVnEnfSoxaCtQtgzXkIRK5ZC6aCapULiTfTa13Nnuo7hxXFwhy4mshbwNo3XJnwctOvnqkv0QYCOzKfnRNy6ZBAuL8n1A7MIp813OXd4PZC2kZBEZA9wDcECn2Nbd64aqATaigLvMB5g3' +
        '&fields=embed_html,picture,embeddable', { json: true }, (err, res, body) => {
            if (err) {
                console.log(err);
                return null;
            }
            // videoDto.picture = body.picture;
            return body;
        });
    }
}
module.exports = FacebookVideoUploadService;


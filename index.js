import axios from "axios";

export async function nicoDownloadInit(nicoSM) {
    return axios({
        url : "https://www.nicovideo.jp/watch/" + nicoSM,
        method : "GET",
        headers : {
            "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
            "Content-Type" : "text/html; charset=UTF-8"
        }
    }).then(async res => {
        let initData = /data-api-data="([^"]+)"/.exec(res.data)[1];
        let data = initData.replace(/(&quot\;)/g,"\"").replace(/&gt;/g, '>').replace(/&lt;/g, '<');

        let api_data = JSON.parse(data);

        let set_cookie = res.headers["set-cookie"];
        let cookies = [];
        for (let c of set_cookie) {
            cookies.push(c.substring(0, c.indexOf(";")));
        }
        
        let valid_url = api_data.video.smileInfo.url;
        let header_info = await axios.head(valid_url, {headers : {
            cookie : cookies
        }});
        let size = header_info.headers["content-length"];

        return {url : valid_url, thumbnail : api_data.video.largeThumbnailURL, size : size,
                title : api_data.video.title, cookies : cookies.join("; ")};
    });
}
const url = "https://movie.douban.com/explore#!type=movie&tag=%E8%B1%86%E7%93%A3%E9%AB%98%E5%88%86&sort=recommend&page_limit=20&page_start=0"
const puppeteer = require("puppeteer")

async function fetchMoive(item){
    let url =`https://movie.douban.com/subject/${item.doubanId}/?tag=%E8%B1%86%E7%93%A3%E9%AB%98%E5%88%86&from=gaia_video`


        const browser = await puppeteer.launch({
            args:["--no-sandbox"],
            dumpio:false
        })
    
        const page = await browser.newPage()

        await page.goto(url,{
            waitUntil:"networkidle2"
        }) 

        await sleep(3000)

        // var reg = new RegExp("(^|上映日期:)"+ "片长([^&]*)");
        // $("#info").text().match(reg); 

        const result = await page.evaluate(() =>{
            var $ = window.$
            var reg = new RegExp("(^|subject)"+ "/([^&]*)(/|$)");
            var doubanid = window.location.href.match(reg)[2]; 
            var movie_type =[]
            var comments =[]
            var summary = $("#link-report span").text().replace(/\s+/g,"")
            var title = $("#mainpic").find("img").attr("alt")
            var year = $(".year").text().match(/\(([\s\S]*?)\)/)[1]
            let poster = $("#mainpic").find("img").attr("src").replace("s_ratio","l_ratio")
            let rate = Number($(".ll.rating_num").text())
             $(".comment-item").each(function () {
                console.log(this)
                let comment = $(this).find(".short").text()
               let like = $(this).find(".votes").text()
               let data_cid = $(this).attr("data-cid")

                let commentItem ={
                    data_cid:data_cid || "",
                    comment:comment || "",
                    like:like || ""
                }
                comments.push(commentItem)
             })

            $(".tags-body a").each(function() {
                movie_type.push($(this).html())
            });
            let items ={
                doubanId:doubanid,
                summary:summary || "",
                movie_type:movie_type || [],
                rate:rate,
                poster:poster,
                title:title,
                comments:comments,
                year:year,
            }
    
            return items;
        })
        
        await browser.close();

        return result
}

const sleep = time => new Promise(
    resolve =>{
        setTimeout(resolve,time)
    }
)


 

;(async () =>{
    console.log("Start visit the target page")

    const browser = await puppeteer.launch({
        args:["--no-sandbox"],
        dumpio:false
    })

    const page = await browser.newPage()
    await page.goto(url,{
        waitUntil:"networkidle2"
    })

    await sleep(3000)

    await page.waitForSelector(".more")

    for(let i= 0; i<3; i++){
        await sleep(3000)
        await page.click(".more")
    }

    const movieData = await page.evaluate(() =>{
        var $ = window.$
        var items = $(".list a")
        var links = []

        if(items.length >= 1){
            items.each((index,item) =>{
                let it  = $(item)
                let doubanId =it.find("div").data("id")
                // let title = it.find("img").attr("alt")
                // let rate = Number(it.find("strong").text())
                // let poster = it.find("img").attr("src").replace("s_ratio","l_ratio")

                links.push({
                    doubanId,
                    // title,
                    // rate,
                    // poster
                })

            })
        }
        return links
    })
    await browser.close()

    await movieData.map(async movie =>{
        let movieDataDetail = await fetchMoive(movie)
        await sleep(2000)
        await  process.send({movieDataDetail})
    })

})()
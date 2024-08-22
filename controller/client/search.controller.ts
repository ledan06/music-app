import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";


//[GET] /search/:type   
export const result = async (req: Request, res: Response)=>{
    const keyword: string = `${req.query.keyword}`
    const type = req.params.type
    let newSongs = []
    if(keyword){
        const keywordRegex = new RegExp(keyword, "i")

        //Tạo ra slug không dấu, có thêm dấu - ngăn cách
        const stringSlug = convertToSlug(keyword)
        const stringSlugRegex = new RegExp(stringSlug, "i")

        const songs = await Song.find({
            $or: [
                {title: keywordRegex},
                {slug: stringSlugRegex}
            ]
        })
        for (const item of songs) {
            const infoSinger = await Singer.findOne({
                deleted: false,
                _id: item.singerId
            })

            // song["infoSinger"] = infoSinger
            newSongs.push({
                id: item.id,
                title: item.title,
                avatar: item.avatar,
                like: item.like,
                slug: item.slug,
                infoSinger: {
                    fullName: infoSinger.fullName
                }
            })
        }
        // newSongs = songs
    }
    
    switch (type) {
        case "result":
            res.render("client/pages/search/result", {
                pageTitle: `Kết quả: ${keyword}`,
                keyword: keyword,
                songs: newSongs
            })
            break;
        case "suggest":
            res.json({
                code: 200,
                message: "thành công",
                songs: newSongs
            })
            break;
        default:
            break;
    }
}
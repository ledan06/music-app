import { Request, Response } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";


//[GET] /songs/slug
export const list = async (req: Request, res: Response)=>{
    const topic = await Topic.findOne({
        deleted: false,
        status: "active",
        slug: req.params.slugTopic
    })
    const songs = await Song.find({
        deleted: false,
        status: "active",
        topicId: topic.id
    })
    for (const song of songs) {
        const infoSinger = await Singer.findOne({
            deleted: false,
            status: "active",
            _id: song.singerId
        })
        song["infoSinger"] = infoSinger
    }
    res.render("client/pages/songs/list", {
        pageTitle: "Danh sách bài hát",
        songs: songs
    })
}
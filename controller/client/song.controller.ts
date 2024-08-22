import { Request, Response } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";


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

//[GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
    const slugSong = req.params.slugSong

    const song = await Song.findOne({
        deleted: false,
        status: "active",
        slug: slugSong
    })
    const topic = await Topic.findOne({
        deleted: false,
        status: "active",
        _id: song.topicId
    }).select("title")
    const singer = await Singer.findOne({
        deleted: false,
        status: "active",
        _id: song.singerId
    }).select("fullName")

    const favoriteSong = await FavoriteSong.findOne({
        songId: song.id
    })

    song["isFavoriteSong"] = favoriteSong ? true : false

    res.render("client/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song: song,
        topic: topic,
        singer: singer
    })
}

//[Patch] /songs/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {
    const typeLike = req.params.typeLike
    const idSong = req.params.idSong

    const song = await Song.findOne({
        _id: idSong,
        deleted: false,
        status: "active"
    })
    let likeUpdate:number = typeLike == "like" ? song.like + 1 : song.like - 1
    await Song.updateOne(
        {
            _id: idSong
        },
        {
            like: likeUpdate
        }
    )
    res.json({
        code: 200,
        message: "Thành công!",
        like: likeUpdate
    })
}

//[Patch] /songs/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
    const typeFavorite: string = req.params.typeFavorite
    const idSong: string = req.params.idSong

    switch (typeFavorite) {
        case "favorite":
            const existFavoriteSong = await FavoriteSong.findOne({
                songId: idSong
            })
            if(!existFavoriteSong){
                const record = new FavoriteSong({
                    // userId: ""
                    songId: idSong
                })
                await record.save()
            }
            break;
        case "unfavorite":
            await FavoriteSong.deleteOne({
                songId: idSong
            })
            break

        default:
            break;
    }
    
    res.json({
        code: 200,
        message: "Thành công!"
    })
}


//[Patch] /songs/listen/:idSong
export const listen = async (req: Request, res: Response) => {
    const idSong: string = req.params.idSong

    const song = await Song.findOne({
        _id: idSong
    })
    const listen: number = song.listen + 1
    await Song.updateOne({
        _id: idSong
    },{
        listen: listen
    })
    const songNew = await Song.findOne({
        _id: idSong
    })
    res.json({
        code:200,
        message: "Thành công",
        listen: songNew.listen
    })
}
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.favorite = exports.like = exports.detail = exports.list = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield topic_model_1.default.findOne({
        deleted: false,
        status: "active",
        slug: req.params.slugTopic
    });
    const songs = yield song_model_1.default.find({
        deleted: false,
        status: "active",
        topicId: topic.id
    });
    for (const song of songs) {
        const infoSinger = yield singer_model_1.default.findOne({
            deleted: false,
            status: "active",
            _id: song.singerId
        });
        song["infoSinger"] = infoSinger;
    }
    res.render("client/pages/songs/list", {
        pageTitle: "Danh sách bài hát",
        songs: songs
    });
});
exports.list = list;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugSong = req.params.slugSong;
    const song = yield song_model_1.default.findOne({
        deleted: false,
        status: "active",
        slug: slugSong
    });
    const topic = yield topic_model_1.default.findOne({
        deleted: false,
        status: "active",
        _id: song.topicId
    }).select("title");
    const singer = yield singer_model_1.default.findOne({
        deleted: false,
        status: "active",
        _id: song.singerId
    }).select("fullName");
    const favoriteSong = yield favorite_song_model_1.default.findOne({
        songId: song.id
    });
    song["isFavoriteSong"] = favoriteSong ? true : false;
    res.render("client/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song: song,
        topic: topic,
        singer: singer
    });
});
exports.detail = detail;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const typeLike = req.params.typeLike;
    const idSong = req.params.idSong;
    const song = yield song_model_1.default.findOne({
        _id: idSong,
        deleted: false,
        status: "active"
    });
    let likeUpdate = typeLike == "like" ? song.like + 1 : song.like - 1;
    yield song_model_1.default.updateOne({
        _id: idSong
    }, {
        like: likeUpdate
    });
    res.json({
        code: 200,
        message: "Thành công!",
        like: likeUpdate
    });
});
exports.like = like;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const typeFavorite = req.params.typeFavorite;
    const idSong = req.params.idSong;
    switch (typeFavorite) {
        case "favorite":
            const existFavoriteSong = yield favorite_song_model_1.default.findOne({
                songId: idSong
            });
            if (!existFavoriteSong) {
                const record = new favorite_song_model_1.default({
                    songId: idSong
                });
                yield record.save();
            }
            break;
        case "unfavorite":
            yield favorite_song_model_1.default.deleteOne({
                songId: idSong
            });
            break;
        default:
            break;
    }
    res.json({
        code: 200,
        message: "Thành công!"
    });
});
exports.favorite = favorite;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSong = req.params.idSong;
    const song = yield song_model_1.default.findOne({
        _id: idSong
    });
    const listen = song.listen + 1;
    yield song_model_1.default.updateOne({
        _id: idSong
    }, {
        listen: listen
    });
    const songNew = yield song_model_1.default.findOne({
        _id: idSong
    });
    res.json({
        code: 200,
        message: "Thành công",
        listen: songNew.listen
    });
});
exports.listen = listen;

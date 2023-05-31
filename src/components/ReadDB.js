import { uuidv4 } from "@firebase/util";
import {
    collection,
    getDoc,
    getDocs,
    orderBy,
    query,
    onSnapshot,
    addDoc,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    arrayRemove,
    arrayUnion,
    DocumentSnapshot,
    where,
} from "firebase/firestore";
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from "react";
import { db, auth } from "../firebase/firebase";
import Modal from "./Modal";

function ReadDB(props) {
    const [posts, setPosts] = useState([]);
    const [isLogin, setIsLogin] = useState(props.user);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState({})
    const collectionRef = useRef()
    const [choiceTable, setChoiceTable] = useState("");
    const [choiceTable2, setChoiceTable2] = useState("");
    const [watch, setWatch] = useState(false);
    const [message, setMessage] = useState("みんなの番組表を見る")
    const [icon, setIcon] = useState(false)

    let time = new Date()   //現在時刻取得

    useEffect(() => {
        const postData = collection(db, "users");

        /* リアルタイムで取得 */
        onSnapshot(postData, (querySnapshot) => {
            const Data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            // console.log(querySnapshot);
            setPosts(Data);
        });

        collectionRef.current = postData
    }, []);

    const ShowModal = () => {
        setShowModal(true);
    }
    const closeOthers = () => {
        setWatch(false);
        setMessage("みんなの番組表を見る")
    }

    const watchTables = () => {
        if (watch) {
            setWatch(false)
            setMessage("みんなの番組表を見る")
        } else {
            setWatch(true)
            setMessage("閉じる")
        }
        if (isLogin == 0) {
            setChoiceTable(1)
            setChoiceTable2(2)
        } else if (isLogin == 1) {
            setChoiceTable(0)
            setChoiceTable2(2)
        } else if (isLogin == 5) {
            setChoiceTable(0)
            setChoiceTable2(1)
        }
    }

    const DeleteMovie = (post) => {
        const userCollection = doc(db, 'users', posts[isLogin].id);
        const docRef = updateDoc(userCollection, {
            Tmovies: arrayRemove({
                title: post.title,
                URL: post.URL,
                img: post.img,
                viewingTime: post.viewingTime,
                streamingTime: post.streamingTime,
                comment: post.comment,
                good: post.good
            })
        })
        console.log(userCollection)
    }
    const AddGood = (post) => {
        setIcon(true)
        console.log(posts[choiceTable].id)
        const userCollection = doc(db, 'users', posts[choiceTable].id);
        const docRef = updateDoc(userCollection, {
            Tmovies: arrayUnion({
                title: post.title,
                URL: post.URL,
                img: post.img,
                viewingTime: post.viewingTime,
                streamingTime: post.streamingTime,
                comment: post.comment,
                good: post.good + 1
            })
        })
        const docRef2 = updateDoc(userCollection, {
            Tmovies: arrayRemove({
                title: post.title,
                URL: post.URL,
                img: post.img,
                viewingTime: post.viewingTime,
                streamingTime: post.streamingTime,
                comment: post.comment,
                good: post.good
            })
        })
    }
    const AddGood2 = (post) => {
        setIcon(true)
        console.log(posts[choiceTable2].id)
        const userCollection = doc(db, 'users', posts[choiceTable2].id);
        const docRef = updateDoc(userCollection, {
            Tmovies: arrayUnion({
                title: post.title,
                URL: post.URL,
                img: post.img,
                viewingTime: post.viewingTime,
                streamingTime: post.streamingTime,
                comment: post.comment,
                good: post.good + 1
            })
        })
        const docRef2 = updateDoc(userCollection, {
            Tmovies: arrayRemove({
                title: post.title,
                URL: post.URL,
                img: post.img,
                viewingTime: post.viewingTime,
                streamingTime: post.streamingTime,
                comment: post.comment,
                good: post.good
            })
        })
    }
    const OpenMovie = () => {
        const now = dayjs(time).format('HH:mm') //現在時刻
        const urls = []
        posts[choiceTable]?.Tmovies?.sort(function (a, b) {
            return (a.streamingTime < b.streamingTime) ? -1 : 1;
        }).map((post, i) => {
            if (post.streamingTime <= now) {
                urls.push(post.URL)
                console.log(post.title, post.streamingTime)
            } else {
                console.log("まだ放送時間ではありません")
            }
        })
        window.open(urls[urls.length - 1], '_blank')
    }
    const OpenMovie2 = () => {
        const now = dayjs(time).format('HH:mm') //現在時刻
        const urls = []
        posts[choiceTable2]?.Tmovies?.sort(function (a, b) {
            return (a.streamingTime < b.streamingTime) ? -1 : 1;
        }).map((post, i) => {
            if (post.streamingTime <= now) {
                urls.push(post.URL)
                console.log(post.title, post.streamingTime)
            } else {
                console.log("まだ放送時間ではありません")
            }
        })
        window.open(urls[urls.length - 1], '_blank')
    }

    return (
        <div className="App">
            <h1 className="timestamp">{dayjs(time).format('HH:mm')}</h1>
            <div className="">
                <button className="watchTables" onClick={watchTables}>
                    <span className="hover-underline-animation"> {message} </span>
                    <svg viewBox="0 0 46 16" height="10" width="30" xmlns="http://www.w3.org/2000/svg" id="arrow-horizontal">
                        <path transform="translate(30)" d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" data-name="Path 10" id="Path_10" fill="white"></path>
                    </svg>
                </button>
            </div>
            <div className="">
                {watch ? ( //ボタンで表示、非表示制御
                    <div className="" >
                        <hr className="keyline" />
                        <h2>user{choiceTable + 1}の番組表</h2>
                        <div className="wrap-center">
                            <button className="TVmode" onClick={OpenMovie}>
                                <svg class="play-icon" viewBox="0 0 40 40">
                                    <path d="M 10,10 L 30,20 L 10,30 z"></path>
                                </svg>
                                現在の配信動画を見る</button>
                        </div>
                        <div className="others">
                            {posts[choiceTable]?.Tmovies?.sort(function (a, b) {
                                return (a.streamingTime < b.streamingTime) ? -1 : 1;
                            }).map((post, i) => (
                                <div key={i}>
                                    <ul className="table">
                                        <li className="time">{post.streamingTime}</li>
                                        <li className="title">{post.title}</li>
                                        <img src={post.img} alt={post.title} />
                                        <li className="comment">{post.comment}</li>
                                        <div className="block">
                                            <span className="video_play"
                                                onClick={(e) => {
                                                    window.open(post.URL, '_blank');
                                                }}>
                                            </span>
                                            <button className="watched"
                                                onClick={(e) => {
                                                    AddGood(post)
                                                }}>
                                                <span className="icon">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                                                            fill="currentColor"
                                                        />
                                                        <path
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            d="M12 3C17.5915 3 22.2898 6.82432 23.6219 12C22.2898 17.1757 17.5915 21 12 21C6.40848 21 1.71018 17.1757 0.378052 12C1.71018 6.82432 6.40848 3 12 3ZM12 19C7.52443 19 3.73132 16.0581 2.45723 12C3.73132 7.94186 7.52443 5 12 5C16.4756 5 20.2687 7.94186 21.5428 12C20.2687 16.0581 16.4756 19 12 19Z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="text">見たよ!!</span>
                                            </button>
                                        </div>
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <hr className="keyline" />
                        <h2>user{choiceTable2 + 1}の番組表</h2>
                        <div className="wrap-center">
                            <button className="TVmode" onClick={OpenMovie2}>
                                <svg class="play-icon" viewBox="0 0 40 40">
                                    <path d="M 10,10 L 30,20 L 10,30 z"></path>
                                </svg>
                                現在の配信動画を見る</button>
                        </div>
                        <div className="others">
                            {posts[choiceTable2]?.Tmovies?.sort(function (a, b) {
                                return (a.streamingTime < b.streamingTime) ? -1 : 1;
                            }).map((post, i) => (
                                <div key={i}>
                                    <ul className="table">
                                        <li className="time">{post.streamingTime}</li>
                                        <li className="title">{post.title}</li>
                                        <img src={post.img} alt={post.title} />
                                        <li className="comment">{post.comment}</li>
                                        <div className="block">
                                            <span className="video_play"
                                                onClick={(e) => {
                                                    window.open(post.URL, '_blank');
                                                }}>
                                            </span>
                                            <button className="watched"
                                                onClick={(e) => {
                                                    AddGood2(post)
                                                }}>
                                                <span className="icon">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                                                            fill="currentColor"
                                                        />
                                                        <path
                                                            fill-rule="evenodd"
                                                            clip-rule="evenodd"
                                                            d="M12 3C17.5915 3 22.2898 6.82432 23.6219 12C22.2898 17.1757 17.5915 21 12 21C6.40848 21 1.71018 17.1757 0.378052 12C1.71018 6.82432 6.40848 3 12 3ZM12 19C7.52443 19 3.73132 16.0581 2.45723 12C3.73132 7.94186 7.52443 5 12 5C16.4756 5 20.2687 7.94186 21.5428 12C20.2687 16.0581 16.4756 19 12 19Z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="text">見たよ!!</span>
                                            </button>
                                        </div>
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <hr className="keyline" />
                        <button onClick={closeOthers}><a>閉じる</a></button>
                    </div>
                ) : (
                    <></>// watchがfalseの場合はModalは表示しない
                )
                }
            </div >
            <div className="whole">
                <div className="myLists-area">
                    <h3>あなたのマイリスト</h3>
                    {isLogin !== "" && posts[isLogin]?.mylists?.movies?.map((post, i) => (
                        <div key={i}>
                            <ul className="myLists">
                                <li className="title">{post.title}</li>
                                <img className="select" src={post.img} alt={post.title}
                                    onClick={(e) => {
                                        ShowModal()
                                        setSelected(post)
                                    }}
                                />
                            </ul>
                        </div>
                    ))}
                    <Modal showFlag={showModal} setShowModal={setShowModal}
                        content={selected} user={(isLogin !== "" && posts.length != 0) && posts[isLogin].id}
                    />
                </div>

                <div className="table-area">
                    <h3>あなたの番組表</h3>
                    {isLogin !== "" && posts[isLogin]?.Tmovies?.sort(function (a, b) {
                        return (a.streamingTime < b.streamingTime) ? -1 : 1;
                    }).map((post, i) => (
                        <div key={i}>
                            <ul className="table">
                                <li className="time">{post.streamingTime}</li>
                                <li className="title">{post.title}</li>
                                <img src={post.img} alt={post.title} />
                                <li className="comment">{post.comment}</li>
                                <span id="count">👀 × {post.good}</span>
                                <div className="block">
                                    <button className="cancell"
                                        onClick={(e) => {
                                            DeleteMovie(post)
                                            console.log('削除が完了しました')
                                        }}>
                                        <span className="text">削除</span><span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span>
                                    </button>
                                </div>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}


export default ReadDB;
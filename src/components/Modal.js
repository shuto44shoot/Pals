import React, { useState } from "react";
import { db } from "../firebase/firebase";
import {
    collection,
    addDoc,
    doc,
    setDoc,
    arrayUnion,
    updateDoc
} from "firebase/firestore";

const Modal = (props) => {
    const [time, setTime] = useState("")
    const [addTime, setAddTime] = useState("")
    const [text, setText] = useState("")
    const [addText, setAddText] = useState("");

    const closeModal = () => {
        props.setShowModal(false);
    };
    const decideInfo = () => {
        setAddTime(time)
        setTime("")
        setAddText(text)
        setText("")
        const usersCollectionRef = doc(db, 'users', props.user);
        console.log(usersCollectionRef)
        const documentRef = updateDoc(usersCollectionRef, {
            Tmovies: arrayUnion({
                title: props.content.title,
                URL: props.content.URL,
                img: props.content.img,
                viewingTime: props.content.viewingTime,
                streamingTime: time,
                comment: text,
                good:0,
            })
        }).then(function () {
            console.log("created");
        });
    }
    return (
        <>
            {props.showFlag ? ( // showFlagがtrueだったらModalを表示する
                <div id="overlay" onClick={closeModal}>
                    <div className="content" onClick={(e) => e.stopPropagation()}>
                        <h3 id="Title">{props.content.title}</h3>
                        <div className="modal">
                            <img className="modal-item" src={props.content.img} alt={props.content.title} />
                            <form>
                                <div id="form">
                                    <label htmlFor="scheduled-time">配信予定時刻を入力</label>
                                    <input value={time} type="time" name="scheduled_time" id="scheduled-time"
                                        step="300"
                                        onChange={(e) => setTime(e.target.value)} required />
                                    <input value={text} id="text" placeholder="オススメする理由"
                                        onChange={(e) => setText(e.target.value)} />
                                    <button className="decide" onClick={() => {
                                        decideInfo()
                                        closeModal()
                                    }}><p>決定</p></button>
                                </div>
                                <button onClick={closeModal}><a>閉じる</a></button>
                            </form>
                            
                        </div>
                    </div>
                </div>
            ) : (
                <></>// showFlagがfalseの場合はModalは表示しない
            )}
        </>
    );
};

export default Modal;

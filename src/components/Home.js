import { useEffect, useRef, useState } from "react";
import { auth, provider } from '../firebase/firebase'
import { signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import ReadDB from './ReadDB';

function Home() {
  const [user, setUser] = useState("");

  const signIn0 = () => {
    setUser("0")
  }
  const signIn1 = () => {
    setUser("1")
  }
  const signIn2 = () => {
    setUser("2")
  }
  const signIn3 = () => {
    setUser("3")
  }
  const signIn4 = () => {
    setUser("4")
  }
  
  return (
    <div className='App'>
      <div className='block'>
        {user ? (
          <div className='user'>
            <div className="user-area">
              <p>user{parseInt(user) + 1}</p>
              <button onClick={() => setUser()}>
                <a>ログアウト</a>
              </button>
            </div>
            <div>
              <h1 className='App-header'>PalStreaming 番組表管理</h1>
              <ReadDB user={user} />
            </div>
          </div>
        ) : (
          <div className='Login'>
            <h1 className='App-header'>PalStreaming</h1>
            <h1> ログインしてください</h1>
            <button className="loginUser" onClick={signIn0}>
              <p>user1</p>
            </button>
            <button className="loginUser" onClick={signIn1}>
              <p>user2</p>
            </button>
            <button className="loginUser" onClick={signIn2}>
              <p>user3</p>
            </button>
            <button className="loginUser" onClick={signIn3}>
              <p>user4</p>
            </button>
            <button className="loginUser" onClick={signIn4}>
              <p>user5</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

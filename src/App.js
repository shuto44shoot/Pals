import { useEffect,useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import './App.css';
import { v4 as uuidv4 } from "uuid"
import { db } from './firebase/firebase';
import ReadDB from './components/ReadDB';
import Home from './components/Home';

function App() {
  
  return (
    <div className='App'>
      <Home />
    </div>
  );
}

export default App;

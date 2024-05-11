import './App.css';
import {Button, Container, Form} from 'react-bootstrap';
import background from './images/background.jpg'

import { initializeApp } from "firebase/app";
import { getDatabase, get, set, ref } from 'firebase/database'
import React from "react";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let wish;
const wishesRef = ref(db, 'wishes');

const WishInput = () => {

    const handleClick = async (event) => {
        event.preventDefault();

        let newWish =
            {
                wish: wish,
                wishDate: Date.now()
            };

        const snapshot = await get(wishesRef)
        const existingWishes = snapshot.val();

        let updatedWishes;
        if (existingWishes) {
            const nonUndefinedWishes = existingWishes.filter(wish => wish !== undefined);

            updatedWishes = [...nonUndefinedWishes, newWish]
        }
        else
            updatedWishes = [newWish]

        await set(wishesRef, updatedWishes).then((err) => {
            if (err)
                console.log(err)
        })
        document.getElementById('wish_area').value = '';

    }

    const handleInputChange = (event) => {
        wish = event.target.value;
    }

    return (
        <>
            <Container>
                <Form.Control
                    id='wish_area'
                    as="textarea"
                    placeholder="Wish and whisper good things..."
                    style={{ height: '600px', opacity: 0.7}}
                    onChange={handleInputChange}
                />
                <Button onClick={handleClick}>Whisper Me</Button>
            </Container>
        </>
    )
}

function App() {
  return (
    <div className="App"
         style={{
             backgroundImage: `url(${background})`,
             backgroundRepeat: 'no-repeat',
             backgroundSize: 'cover',
             height: '100vh'}}>
        <WishInput />
    </div>
  );
}

export default App;

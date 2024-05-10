import './App.css';
import Like from "./components/Like";
import {useState} from "react";

function App() {

    const [likes, setLikes] = useState(0)

    const onCLick = () => {
        console.log('Like button clicked')
        setLikes(likes + 1)
    }

    return (
        <div>
            <Like onClick={onCLick} />
            {likes}
        </div>
    )
}

export default App;
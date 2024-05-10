import DismissableAlert from "./components/DismissableAlert";
import Button from "./components/Button";
import {useState} from "react";

function App() {

    const [show, setShow] = useState(false);

    return (
        <div>
            {show && <DismissableAlert onClick={() => setShow(false)}>This is a dismissable alert</DismissableAlert>}
            <Button onClick={() => setShow(true)}>Show Alert</Button>
        </div>
    )
}

export default App;
import React, { useContext, useEffect, useState } from 'react';
import StoreContext from "../contexts/storeContext";
import { BugsState } from "../store/entities/bugs";
import { UnknownAction } from "redux";
import { loadBugs } from "../store/entities/bugs";

const Bugs: React.FC = () => {
    const store = useContext(StoreContext);

    const [bugs, setBugs] = useState<BugsState>({
        lastFetch: null,
        loading: false,
        ids: [],
        entities: {}
    });

    useEffect(() => {
        if (!store) return;

        const unsubscribe = store.subscribe(() => {
            const bugsInStore = store.getState().entities.bugs;
            if (bugs !== bugsInStore) {
                setBugs(bugsInStore);
            }
        });

        store.dispatch(loadBugs() as unknown as UnknownAction);

        return () => {
            unsubscribe();
        };
    }, [store, bugs]);

    if (!store) {
        return <div>No store available</div>;
    }

    return (
        <div>
            <h2>Bugs</h2>
            <ul>
                {Object.values(bugs.entities).map(bug => (
                    <li key={bug.id}>{bug.description}</li>
                ))}
            </ul>
        </div>
    );
};

export default Bugs;

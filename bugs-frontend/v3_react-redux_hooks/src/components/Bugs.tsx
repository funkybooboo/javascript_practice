import React, { useEffect } from 'react';
import { selectUnresolvedBugs, Bug, selectBugs} from "../store/entities/bugs";
import { UnknownAction } from "redux";
import { loadBugs } from "../store/entities/bugs";
import { useDispatch, useSelector } from 'react-redux';

const Bugs: React.FC = () => {

    const dispatch = useDispatch();
    const bugs: Bug[] = useSelector(selectBugs);
    const unresolvedBugs: Bug[] = useSelector(selectUnresolvedBugs);

    useEffect(() => {
        dispatch(loadBugs() as unknown as UnknownAction);
    }, []);

    return (
        <div>
            <h1>Bugs</h1>
            <h3>All</h3>
            <ul>
                {bugs.map(bug => (
                    <li key={bug.id}>{bug.description}</li>
                ))}
            </ul>
            <h3>Unresolved</h3>
            <ul>
                {unresolvedBugs.map(bug => (
                    <li key={bug.id}>{bug.description}</li>
                ))}
            </ul>
        </div>
    );
};

export default Bugs;

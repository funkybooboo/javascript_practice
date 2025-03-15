import "./styles.css";

import React, { useEffect } from 'react';
import {Bug, selectBugs, loadBugs, resolveBug, selectLoading, selectErrorMessage} from "../../store/entities/bugs";
import { useDispatch, useSelector } from 'react-redux';
import {UnknownAction} from "redux";

const BugsList: React.FC = () => {
    const dispatch = useDispatch();
    const bugs: Bug[] = useSelector(selectBugs);
    const loading: boolean = useSelector(selectLoading);
    const errorMessage: string = useSelector(selectErrorMessage);

    useEffect(() => {
        dispatch(loadBugs() as unknown as UnknownAction);
    }, [dispatch]);

    const handleResolve = (bugId: number) => {
        dispatch(resolveBug(bugId));
    };

    if (loading) {
        return <div>Loading bugs...</div>;
    }

    if (errorMessage) {
        return <div className="error">{errorMessage}</div>;
    }

    return (
        <div className="bug-list-container">
            <h1>Bugs Tracker</h1>
            <ul>
                {bugs.length === 0 ? (
                    <p>No bugs found!</p>
                ) : (
                    bugs.map((bug) => (
                        <BugItem key={bug.id} bug={bug} onResolve={handleResolve} />
                    ))
                )}
            </ul>
        </div>
    );
};

interface BugItemProps {
    bug: Bug;
    onResolve: (bugId: number) => void;
}

const BugItem: React.FC<BugItemProps> = ({ bug, onResolve }) => {
    return (
        <li className={`bug-item ${bug.is_resolved ? 'resolved' : 'unresolved'}`}>
            <p><strong>Description:</strong> {bug.description}</p>
            <p><strong>Resolved:</strong> {bug.is_resolved ? 'Yes' : 'No'}</p>
            <p><strong>Project ID:</strong> {bug.project_id}</p>
            {!bug.is_resolved && (
                <button onClick={() => onResolve(bug.id)} className="resolve-btn">
                    Resolve
                </button>
            )}
        </li>
    );
};

export default BugsList;

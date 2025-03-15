import React, { useEffect } from 'react';
import { BugsState } from "../store/entities/bugs";
import { UnknownAction } from "redux";
import { loadBugs } from "../store/entities/bugs";
import { connect } from "react-redux";
import { RootState } from "../store";
import { Dispatch } from "@reduxjs/toolkit";

interface Props {
    bugs: BugsState,
    loadBugs: () => void;
}

const Bugs: React.FC<Props> = ({ bugs, loadBugs }: Props) => {

    useEffect(() => {
        loadBugs();
    }, []);

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

const mapStateToProps = (state: RootState) => ({
    bugs: state.entities.bugs
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadBugs: () => dispatch(loadBugs() as unknown as UnknownAction)
});

export default connect(mapStateToProps, mapDispatchToProps)(Bugs);

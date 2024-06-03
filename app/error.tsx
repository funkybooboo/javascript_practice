'use client'

interface Props {
    error: Error;
    reset: () => void;
}

const ErrorPage = ({error, reset}: Props) => {

    console.error(error);

    return (
        <>
            <h1>An unexpected error has occurred.</h1>
            <button className={"btn"} onClick={() => reset()}>Retry</button>
        </>
    );
}

export default ErrorPage;
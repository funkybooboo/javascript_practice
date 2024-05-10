import {ReactNode} from "react";

type Props = {
    children: ReactNode;
    onClick: () => void;
};

function DismissableAlert({ children, onClick }: Props) {
    return (
      <div className="alert alert-warning alert-dismissible fade show" role="alert">
          {children}
          <button onClick={onClick} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    );
}

export default DismissableAlert;
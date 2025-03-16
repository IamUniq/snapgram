import { createContext, useContext, useState } from "react";

const INITIAL_STATE = {
    isCommentModalOpen: false,
    setCommentModalOpen: () => { },
};

type IContextType = {
    isCommentModalOpen: boolean;
    setCommentModalOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const CommentsContext = createContext<IContextType>(INITIAL_STATE);

export function CommentsProvider({ children }: { children: React.ReactNode }) {
    const [isCommentModalOpen, setCommentModalOpen] = useState(false);

    return (
        <CommentsContext.Provider value={{ isCommentModalOpen, setCommentModalOpen }}>
            {children}
        </CommentsContext.Provider>
    );
}

export const useCommentContext = () => useContext(CommentsContext);

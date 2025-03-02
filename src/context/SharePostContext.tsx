import { createContext, useContext, useState } from "react";

const INITIAL_STATE = {
    isShareModalOpen: false,
    setShareModalOpen: () => { },
};

type IContextType = {
    isShareModalOpen: boolean;
    setShareModalOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const SharePostContext = createContext<IContextType>(INITIAL_STATE);

export function SharePostProvider({ children }: { children: React.ReactNode }) {
    const [isShareModalOpen, setShareModalOpen] = useState(false);

    return (
        <SharePostContext.Provider value={{ isShareModalOpen, setShareModalOpen }}>
            {children}
        </SharePostContext.Provider>
    );
}

export const useShareContext = () => useContext(SharePostContext);

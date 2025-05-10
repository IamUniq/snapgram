import { createContext, useContext, useState } from "react";

type ModalProps = 'COMMENT' | 'DELETE' | 'SHARE' | 'PASSWORD'

type IContextType = {
    modalToOpen: {
        type: ModalProps;
        postId?: string;
    } | null;
    setModalToOpen: React.Dispatch<React.SetStateAction<{
        type: ModalProps;
        postId?: string;
    } | null>>
};

const INITIAL_STATE: IContextType = {
    modalToOpen: { type: 'COMMENT' },
    setModalToOpen: () => { },
};


const ModalContext = createContext<IContextType>(INITIAL_STATE);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [modalToOpen, setModalToOpen] = useState<{ type: ModalProps; postId?: string } | null>(null);

    return (
        <ModalContext.Provider value={ { modalToOpen, setModalToOpen } }>
            { children }
        </ModalContext.Provider>
    );
}

export const useModalContext = () => useContext(ModalContext);
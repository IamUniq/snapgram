import { createContext, useContext, useState } from "react";

type ModalProps = 'COMMENT' | 'DELETE' | 'SHARE' | null

type IContextType = {
    modalToOpen: ModalProps;
    setModalToOpen: React.Dispatch<React.SetStateAction<ModalProps>>
};

const INITIAL_STATE: IContextType = {
    modalToOpen: null,
    setModalToOpen: () => { },
};


const ModalContext = createContext<IContextType>(INITIAL_STATE);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [modalToOpen, setModalToOpen] = useState<ModalProps>(null);

    return (
        <ModalContext.Provider value={{ modalToOpen, setModalToOpen }}>
            {children}
        </ModalContext.Provider>
    );
}

export const useModalContext = () => useContext(ModalContext);

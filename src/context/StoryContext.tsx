import { createContext, useContext, useState, type ReactNode } from "react"

export type StoryText = {
    content: string
    style: {
        color: string;
        fontSize: number;
        lineHeight: number;
        fontWeight: string;
        fontStyle: string;
        textAlign: string;
        backgroundColor: string
    }
}

interface StoryContextType {
    text: StoryText;
    setText: React.Dispatch<React.SetStateAction<StoryText>>;
}

const INIT_STATE: StoryText = {
    content: "",
    style: {
        color: "#000000",
        fontSize: 16,
        lineHeight: 1,
        fontWeight: "normal",
        fontStyle: "normal",
        textAlign: "center",
        backgroundColor: "#FFFFFF"
    }
}

const StoryContext = createContext<StoryContextType | undefined>(undefined)

export function StoryProvider({ children }: { children: ReactNode }) {
    const [text, setText] = useState(INIT_STATE)

    return (
        <StoryContext.Provider
            value={ {
                text,
                setText,
            } }
        >
            { children }
        </StoryContext.Provider>
    )
}

export function useStory() {
    const context = useContext(StoryContext)
    if (context === undefined) {
        throw new Error("useStory must be used within a StoryProvider")
    }
    return context
}

import { createContext, useContext, useState, type ReactNode } from "react"

type StoryElement = {
    id: string
    type: "text" | "drawing"
    content: string
    position: { x: number; y: number }
    style?: Record<string, any>
}

interface StoryContextType {
    elements: StoryElement[]
    activeToolId: string | null
    backgroundColor: string
    addElement: (element: Omit<StoryElement, "id">) => void
    removeElement: (id: string) => void
    updateElement: (id: string, updates: Partial<StoryElement>) => void
    setActiveTool: (toolId: string | null) => void
    setBackgroundColor: (color: string) => void
}

const StoryContext = createContext<StoryContextType | undefined>(undefined)

export function StoryProvider({ children }: { children: ReactNode }) {
    const [elements, setElements] = useState<StoryElement[]>([])
    const [activeToolId, setActiveToolId] = useState<string | null>(null)
    const [backgroundColor, setBackgroundColor] = useState<string>("#000000")

    const addElement = (element: Omit<StoryElement, "id">) => {
        const newElement = {
            ...element,
            id: `element-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        }
        setElements([...elements, newElement])
    }

    const removeElement = (id: string) => {
        setElements(elements.filter((element) => element.id !== id))
    }

    const updateElement = (id: string, updates: Partial<StoryElement>) => {
        setElements(elements.map((element) => (element.id === id ? { ...element, ...updates } : element)))
    }

    const setActiveTool = (toolId: string | null) => {
        setActiveToolId(toolId)
    }

    return (
        <StoryContext.Provider
            value={ {
                elements,
                activeToolId,
                backgroundColor,
                addElement,
                removeElement,
                updateElement,
                setActiveTool,
                setBackgroundColor,
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

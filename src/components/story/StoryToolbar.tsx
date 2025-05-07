import { Button } from "@/components/ui/button"
import { useStory } from "@/context/StoryContext"
import { Palette, PenTool, Type } from "lucide-react"

interface StoryToolbarProps {
    onToolSelect: (toolId: string) => void
}

export default function StoryToolbar({ onToolSelect }: StoryToolbarProps) {
    const { activeToolId, setActiveTool, setBackgroundColor } = useStory()

    const tools = [
        { id: "text", icon: Type, label: "Text" },
        { id: "draw", icon: PenTool, label: "Draw" },
        { id: "color", icon: Palette, label: "Background" },
    ]

    const handleToolClick = (toolId: string) => {
        if (toolId === activeToolId) {
            setActiveTool(null)
        } else {
            setActiveTool(toolId)
            onToolSelect(toolId)
        }

        if (toolId === "color") {
            const colors = ["#000000", "#FFFFFF", "#FF5757", "#3B82F6", "#10B981", "#8B5CF6"]
            const randomColor = colors[Math.floor(Math.random() * colors.length)]
            setBackgroundColor(randomColor)
        }
    }

    return (
        <div className="bg-black/80 backdrop-blur-sm p-4">
            <div className="flex justify-center gap-4">
                { tools.map((tool) => (
                    <Button
                        key={ tool.id }
                        variant="ghost"
                        size="icon"
                        className={ `rounded-full ${activeToolId === tool.id ? "bg-white/20" : ""}` }
                        onClick={ () => handleToolClick(tool.id) }
                    >
                        <tool.icon className="h-6 w-6 md:h-16 md:w-16 text-white" />
                        <span className="sr-only">{ tool.label }</span>
                    </Button>
                )) }
            </div>
        </div>
    )
}

import { Button } from "@/components/ui/button"
import { useStory } from "@/context/StoryContext"
import { Edit2, Palette } from "lucide-react"

type TextEditorToolbarProps = {
    setShowEditorToolbar: React.Dispatch<React.SetStateAction<boolean>>
}

type Tool = 'edit' | 'background'

const Toolbar = ({ setShowEditorToolbar }: TextEditorToolbarProps) => {
    const { setText } = useStory()

    const tools = [
        { icon: Edit2, label: "Edit" },
        { icon: Palette, label: "Background" },
    ]

    const colors = ["#000000", "#FFFFFF", "#FF5757", "#3B82F6", "#10B981", "#8B5CF6"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const toolAction = (tool: Tool) => {
        switch (tool) {
            case 'background':
                setText(prev => ({
                    ...prev,
                    style: {
                        ...prev.style,
                        backgroundColor: randomColor
                    }
                }))
                break;
            case 'edit':
                setShowEditorToolbar(true)
                break;
            default:
                break;
        }
    }

    return (
        <div className="flex-center mx-auto w-28 h-12 rounded-3xl gap-4 bg-dark-3 border-2 border-light-1/80 backdrop-blur-sm mt-4">
            { tools.map(tool => (
                <Button
                    key={ tool.label }
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    title={ tool.label }
                    onClick={ () => toolAction(tool.label.toLowerCase() as Tool) }
                >
                    <tool.icon className="h-6 w-6 md:h-16 md:w-16 text-white" />
                    <span className="sr-only">Background</span>
                </Button>
            )) }
        </div>
    )
}

export default Toolbar
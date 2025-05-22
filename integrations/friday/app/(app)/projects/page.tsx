import { Search, MoreHorizontal, Wand2 } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen pt-12">
      <div className="max-w-7xl mx-auto p-4">
        <div className="relative mb-4 border rounded-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 " />
          </div>
          <input
            type="search"
            className="block w-full pl-10 py-2 bg-transparent text-sm text-primary"
            placeholder="Search for a project..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProjectCard
            title="Futuristic Dashboard"
            chatCount={1}
            username="manfromexistence"
            updatedAt="Updated 3 days ago"
          />

          <ProjectCard
            title="SaaS landing page"
            chatCount={1}
            username="manfromexistence"
            updatedAt="Updated May 4, 2025"
          />

          <ProjectCard
            title="Cuisine Selector Chips"
            chatCount={1}
            username="manfromexistence"
            updatedAt="Updated March 16, 2025"
          />

          <ProjectCard
            title="Documentation Starter"
            chatCount={1}
            username="manfromexistence"
            updatedAt="Updated January 18, 2025"
          />

          <ProjectCard
            title="Next.js + Charts"
            chatCount={2}
            username="manfromexistence"
            updatedAt="Updated January 18, 2025"
          />
        </div>
      </div>
    </div>
  )
}

interface ProjectCardProps {
  title: string
  chatCount: number
  username: string
  updatedAt: string
}

function ProjectCard({ title, chatCount, username, updatedAt }: ProjectCardProps) {
  return (
    <div className="brounded-lg border overflow-hidden rounded-md hover:bg-primary-foreground text-muted-foreground hover:text-primary">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="p-1.5 rounded">
            <Wand2 className="h-4 w-4 " />
          </div>
          <div className="ml-3">
            <h3 className=" font-medium">{title}</h3>
            <p className="text-sm ">
              {chatCount} {chatCount === 1 ? "Chat" : "Chats"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xs ">👤</span>
              <span className="text-xs ">{username}</span>
              <span className="text-xs ">{updatedAt}</span>
            </div>
          </div>
          <button className=" hover:">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

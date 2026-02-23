import { MainLayout } from "../layout/main";
import AgriculturalLand from "./section/chat/agriculturalLand";
import Task from "./section/chat/task";
import { Weather } from "./section/chat/weather";

export function ChatWithAI() {
  return (
    <MainLayout withNavigation={false} withSidebar={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 pt-25 p-6">
        {/* Weather Section */}
        <div>
          <Weather />
        </div>

        {/* Responsive Grid for Land & Task - Agricultural Land wider than Task */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-5">
          {/* Agricultural Land - Takes 8 columns (wider) */}
          <div className="lg:col-span-8 h-full">
            <AgriculturalLand />
          </div>

          {/* Task - Takes 4 columns (narrower) */}
          <div className="lg:col-span-4 h-full">
            <Task />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
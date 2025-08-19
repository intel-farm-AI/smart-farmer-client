import { MainLayout } from "../layout/main";
import AgriculturalLand from "./section/chat/agriculturalLand";
import Task from "./section/chat/Task";
import { Weather } from "./section/chat/weather";

export function ChatWithAI() {
  return (
    <MainLayout withNavigation={false} withSidebar={true}>
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-8 bg-slate-900">
        {/* Weather Section */}
        <div>
          <Weather />
        </div>
        
        {/* Responsive Grid for Land & Task - Agricultural Land wider than Task */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 ">
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
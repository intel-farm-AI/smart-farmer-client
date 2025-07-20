import { MainLayout } from "../layout/main";
import AgriculturalLand from "./section/chat/agriculturalLand";
import Task from "./section/chat/Task";
import { PlantDiseaseDetection } from "./section/chat/detection";
import { Weather } from "./section/chat/weather";

export function ChatWithAI() {
  return (
    <MainLayout withNavigation={false} withSidebar={true}>
      <Weather />
      <section className="container mx-auto flex flex-col md:flex-row gap-8 my-8">
        <div className="w-full md:w-3/4">
          <AgriculturalLand />
        </div>
        <div className="w-full md:w-1/4">
          <Task />
        </div>
      </section>
    </MainLayout>
  );
}
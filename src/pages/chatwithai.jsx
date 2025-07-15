import { MainLayout } from "../layout/main";
import { PlantDiseaseDetection } from "./section/chat/detection";
import Task from "./section/chat/Task";
import { Weather } from "./section/chat/weather";

export function ChatWithAI() {
  return (
    <MainLayout withNavigation={false}>
      <Weather />
      <Task />
      <PlantDiseaseDetection />
    </MainLayout>
  );
}
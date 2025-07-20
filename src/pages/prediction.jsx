import { MainLayout } from "../layout/main";
import { PlantDiseaseDetection } from "./section/chat/detection";

export default function PredictionPage() {
    return (
        <MainLayout withNavigation={false} withSidebar={true}>
            <PlantDiseaseDetection />
        </MainLayout>
    );
    }
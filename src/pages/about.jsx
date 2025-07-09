import { MainLayout } from "../layout/main";

export function About() {
  return (
    <MainLayout>
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">About the Intel AI Competition</h1>
      <p className="mb-4">
        The Intel AI Competition is an annual event that challenges participants to develop innovative AI solutions using Intel technologies.
      </p>
      <p className="mb-4">
        Participants will have the opportunity to showcase their skills, collaborate with others, and win exciting prizes.
      </p>
      <p>
        Join us in pushing the boundaries of AI technology!
      </p>
    </div>
    </MainLayout>
  );
}
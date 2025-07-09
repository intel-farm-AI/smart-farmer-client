import { MainLayout } from "../layout/main";

export function Contact() {
  return (
    <MainLayout>
      <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        <p className="mb-4">
          If you have any questions or need assistance, please reach out to us at:
        </p>
        <p className="mb-4">
          <strong>Email:</strong>
            <a href="mailto:habibiahmadaziz@gmail.com" className="text-blue-500 hover:underline">
                habibiahmadaziz@gmail.com
            </a>
        </p>
        <p className="mb-4">
            <strong>Phone:</strong> +1 (123) 456-7890
        </p>
        <p>
          We look forward to hearing from you!
        </p>
      </div>
    </MainLayout>
  );
}
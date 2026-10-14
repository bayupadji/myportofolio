import React from "react";
import { container } from "@/infrastructure/container";
import { ServicesManager } from "@/presentation/components/admin/ServicesManager";

export const metadata = {
  title: "Freelance Services · Admin",
};

export default async function AdminServicesPage() {
  const services = await container.getServices.execute();

  return (
    <div className="w-full">
      <ServicesManager initialServices={services} />
    </div>
  );
}

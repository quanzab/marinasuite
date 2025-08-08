import CrewAllocationClient from "./crew-allocation-client";

export default function CrewAiPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Crew Allocation AI</h1>
      </div>
      <p className="text-muted-foreground">
        Use our intelligent assistant to get optimal crew allocation suggestions for your routes and vessels.
      </p>
      <CrewAllocationClient />
    </div>
  );
}

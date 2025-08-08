
import ScheduleClient from "./schedule-client";

export default function SchedulingPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Crew Scheduling</h1>
      </div>
      <p className="text-muted-foreground">
        Drag and drop unassigned crew members onto vessels within the weekly calendar to manage assignments.
      </p>
      <ScheduleClient />
    </div>
  );
}

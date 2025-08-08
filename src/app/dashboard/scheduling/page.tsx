
import ScheduleClient from "./schedule-client";

export default function SchedulingPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Crew Scheduling</h1>
      </div>
      <p className="text-muted-foreground">
        View assigned and unassigned crew members and manage weekly schedules.
      </p>
      <ScheduleClient />
    </div>
  );
}

import type { Timer } from "@prisma/client";

type TimerTimelineProps = {
  timers: Pick<Timer, "id" | "status" | "type">[];
  active: string;
};

export const TimerTimeline: React.FC<TimerTimelineProps> = ({
  timers,
  active,
}) => {
  return (
    <div className="flex items-center justify-center" data-testid="timeline">
      {timers.map((timer, index) => {
        const lineAfter = index !== timers.length - 1;
        const icon = timer.type === "EXERCISE" ? "🏋🏽" : "💻";
        const isActiveTimer = timer.id === active;
        return (
          <div
            key={timer.id}
            className={[
              "flex max-w-[80px] items-center",
              lineAfter ? "flex-grow" : "flex-grow-0",
            ].join(" ")}
          >
            <div className="flex-grow-0">
              <div
                className={[
                  "inline-flex items-center justify-center rounded-full ",
                  timer.status === "FINISHED" ? "bg-gold-900" : "",
                  isActiveTimer
                    ? "h-11 w-11 bg-gold-900 bg-opacity-80"
                    : "h-8 w-8 bg-gray-200",
                ].join(" ")}
              >
                <span
                  className={[
                    isActiveTimer ? "text-lg opacity-100" : "opacity-50",
                  ].join(" ")}
                >
                  {icon}
                </span>
              </div>
            </div>
            {lineAfter && (
              <div
                className={[
                  "h-1 w-full flex-grow ",
                  timer.status === "FINISHED"
                    ? "bg-gold-900 bg-opacity-80"
                    : "bg-gray-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};



import React, { useEffect, useState } from "react";
import axios from "axios";
import { ActivityCalendar } from "react-activity-calendar";

const HeatMapProfile = () => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const load = async () => {
     
      const repoId = localStorage.getItem("repoId") ||
  localStorage.getItem("currentRepoId") ||
  new URLSearchParams(window.location.search).get("repoId");

      if (!repoId) {
        console.error("No repoId found in localStorage");
        return;
      }

      const res = await axios.get(
        `https://codehub-backend-jj4b.onrender.com/repo/contributions/repo/${repoId}`
      );
console.log("Repo ID used:", repoId);
console.log("Response:", res.data);

      const grouped = {};

      res.data.forEach((item) => {
        const d = item.pushedAt.split("T")[0]; 
        grouped[d] = (grouped[d] || 0) + 1;
      });

      const data = Object.keys(grouped).map((date) => ({
        date,
        count: grouped[date],
        level: Math.min(4, grouped[date]),
      }));

      setActivity(data);
    };

    load();
  }, []);

  if (activity.length === 0) {
    return <div>Loading heatmap...</div>;
  }

  return (
    <div>
      <h3>Recent Contributions</h3>

      <ActivityCalendar
        data={activity}
        blockSize={13}
        blockMargin={4}
        maxLevel={4}
        showWeekdayLabels={true}
        weekStartsOn={1}
        hideColorLegend={false}
        labels={{
          months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        }}
        theme={{
          light: [
            "transparent",
            "#9be9a8",
            "#40c463",
            "#30a14e",
            "#216e39",
          ],
        }}
      />
    </div>
  );
};

export default HeatMapProfile;

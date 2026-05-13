import { ChartBarMultiple } from "@/components/charts-and-graphs/ChartBarMultiple";
import KeyMetrics from "./_components/metric-card";
import { ChartAreaStacked } from "@/components/charts-and-graphs/ChartAreaStacked";
import Analytics from "./_components/analytics";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-[24px] font-bold text-primary mb-4">Welcome Dashboard</h1>

      <KeyMetrics />


      <div className="grid grid-cols-2 my-4 gap-4">
        <ChartAreaStacked />
        <ChartBarMultiple />
      </div>
    </div>
  );
};

export default Dashboard;

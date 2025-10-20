import {
  FaChartBar,
  FaBus,
  FaUser,
  FaMoneyBill,
  FaCalendar,
  FaCreditCard,
} from "react-icons/fa";
import EarningsChart from "./components/EarningsChart";
import TopBar from "../dashboardComponents/TopBar";

const AdminDashboard = () => {
  return (
    <section className="p-5 md:p-10 min-h-screen w-full">
      {/*Top bar with profile icon and the heading*/}
      <TopBar heading="Dashboard" />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
          <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
            <FaChartBar className="text-xl text-white" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Van Drivers</p>
            <p className="font-semibold text-lg text-gray-800">100</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
          <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
            <FaBus className="text-xl text-white" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Van Owners</p>
            <p className="font-semibold text-lg text-gray-800">122</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
          <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
            <FaUser className="text-xl text-white" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Parents</p>
            <p className="font-semibold text-lg text-gray-800">16</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
          <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
            <FaMoneyBill className="text-xl text-white" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Earnings</p>
            <p className="font-semibold text-lg text-gray-800">2500</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
          <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
            <FaCalendar className="text-xl text-white" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Monthly Revenue</p>
            <p className="font-semibold text-lg text-gray-800">750</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
          <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
            <FaCreditCard className="text-xl text-white" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Pending Payments</p>
            <p className="font-semibold text-lg text-gray-800">14</p>
          </div>
        </div>
      </div>

      {/* Earnings Chart Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4" style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-lg mr-3">
              <FaChartBar className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Earnings Overview</h2>
              <p className="text-white/80 text-sm">Monthly revenue and earnings analysis</p>
            </div>
          </div>
        </div>
        
        {/* Chart Content */}
        <div className="p-6">
          <EarningsChart />
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;

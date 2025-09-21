import Navbar from "@/components/dashboard/Navbar"
import AISuggestions from "./AISuggestions";
import MarketPrices from "./MarketPrices";
import MainCards from "./MainCards";
import QuickActions from "./QuickActions";
import Footer from "./Footer";

interface DashboardProps {
  user: { name: string; email: string }  // Just pass the user object
  onLogout: () => void
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  if (!user) {
    return <div>Loading...</div>; // or redirect to login
  }

  const firstName = user.name.split(' ')[0]  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="flex flex-col w-full mx-auto space-y-4 sm:space-y-6">
      <Navbar 
        userName={user.name}
        userEmail={user.email}
        onLogout={onLogout}
      />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Greeting Section */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">{getGreeting()}, {firstName}!</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Here&apos;s what&apos;s happening on your farm today</p>
        </div>
        
        {/* Quick Actions Row */}
        <QuickActions />

        {/* AI Suggestions Button */}
        <AISuggestions />

        {/* Farm and Weather Cards */}
        <MainCards />

        {/* Market Prices */}
        <MarketPrices />
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

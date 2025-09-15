import React from 'react';
import { 
  BarChart3, 
  FileBarChart, 
  Settings, 
  Users,
  TrendingUp,
  Calendar,
  Bell,
  Shield,
  Zap,
  ArrowRight,
  ExternalLink,
  Mail,
  MessageSquare,
  BookOpen
} from 'lucide-react';

const PlaceholderPage = ({ 
  title = "Coming Soon", 
  description = "This feature is currently under development",
  icon = "Settings",
  showFeatures = true,
  showCTA = true,
  className = ""
}) => {
  
  // Icon mapping
  const getIcon = (iconName) => {
    const icons = {
      BarChart3,
      FileBarChart,
      Settings,
      Users,
      TrendingUp,
      Calendar,
      Bell,
      Shield,
      Zap
    };
    return icons[iconName] || Settings;
  };

  const IconComponent = getIcon(icon);

  // Feature configurations based on page type
  const getFeatures = () => {
    switch (icon) {
      case 'BarChart3':
        return [
          {
            icon: TrendingUp,
            title: "Advanced Analytics",
            description: "Deep dive into contract performance metrics and trends"
          },
          {
            icon: BarChart3,
            title: "Custom Dashboards",
            description: "Create personalized views with the metrics that matter most"
          },
          {
            icon: Calendar,
            title: "Predictive Insights",
            description: "AI-powered forecasting for contract renewals and risks"
          },
          {
            icon: Shield,
            title: "Risk Assessment",
            description: "Comprehensive risk analysis across your contract portfolio"
          }
        ];
      
      case 'FileBarChart':
        return [
          {
            icon: FileBarChart,
            title: "Executive Reports",
            description: "Generate comprehensive reports for stakeholders"
          },
          {
            icon: TrendingUp,
            title: "Performance Metrics",
            description: "Track key performance indicators across all contracts"
          },
          {
            icon: Calendar,
            title: "Scheduled Reports",
            description: "Automate report generation and delivery"
          },
          {
            icon: ExternalLink,
            title: "Export Options",
            description: "Export reports in multiple formats (PDF, Excel, CSV)"
          }
        ];
      
      case 'Settings':
        return [
          {
            icon: Users,
            title: "User Management",
            description: "Manage team access and permissions"
          },
          {
            icon: Bell,
            title: "Notifications",
            description: "Configure alerts and notification preferences"
          },
          {
            icon: Shield,
            title: "Security Settings",
            description: "Advanced security and compliance configuration"
          },
          {
            icon: Zap,
            title: "Integrations",
            description: "Connect with your existing business tools"
          }
        ];
      
      default:
        return [
          {
            icon: Zap,
            title: "Enhanced Functionality",
            description: "Powerful new features to streamline your workflow"
          },
          {
            icon: Users,
            title: "Team Collaboration",
            description: "Work together more effectively on contract management"
          },
          {
            icon: Shield,
            title: "Advanced Security",
            description: "Enterprise-grade security for your sensitive data"
          },
          {
            icon: TrendingUp,
            title: "Improved Performance",
            description: "Faster, more efficient contract processing"
          }
        ];
    }
  };

  const features = getFeatures();

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      {/* Main Content */}
      <div className="text-center mb-12">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <IconComponent className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          In Development
        </div>
      </div>

      {/* Features Preview */}
      {showFeatures && (
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              What's Coming
            </h2>
            <p className="text-gray-600">
              Exciting features we're building for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Development Timeline
          </h2>
          <p className="text-gray-600">
            Stay updated on our progress
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200"></div>

            {/* Timeline Items */}
            <div className="space-y-8">
              {/* Phase 1 */}
              <div className="relative flex items-center">
                <div className="flex-1 text-right pr-8">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-900">Phase 1: Core Features</h4>
                    <p className="text-sm text-gray-600 mt-1">Basic functionality and UI</p>
                    <span className="text-xs text-green-600 font-medium">Completed</span>
                  </div>
                </div>
                <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow relative z-10"></div>
                <div className="flex-1 pl-8">
                  <div className="text-sm text-gray-500">Q4 2024</div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative flex items-center">
                <div className="flex-1 text-right pr-8">
                  <div className="text-sm text-gray-500">Q1 2025</div>
                </div>
                <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow relative z-10 animate-pulse"></div>
                <div className="flex-1 pl-8">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-900">Phase 2: Advanced Analytics</h4>
                    <p className="text-sm text-gray-600 mt-1">Enhanced reporting and insights</p>
                    <span className="text-xs text-blue-600 font-medium">In Progress</span>
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative flex items-center">
                <div className="flex-1 text-right pr-8">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm opacity-60">
                    <h4 className="font-semibold text-gray-900">Phase 3: AI Integration</h4>
                    <p className="text-sm text-gray-600 mt-1">Machine learning capabilities</p>
                    <span className="text-xs text-gray-500 font-medium">Planned</span>
                  </div>
                </div>
                <div className="w-4 h-4 bg-gray-300 rounded-full border-4 border-white shadow relative z-10"></div>
                <div className="flex-1 pl-8">
                  <div className="text-sm text-gray-500">Q2 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {showCTA && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Stay in the Loop
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Want to be notified when this feature launches? We'll keep you updated on our progress
            and let you know as soon as it's available.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Bell className="w-4 h-4" />
              Notify Me When Ready
            </button>
            
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageSquare className="w-4 h-4" />
              Send Feedback
            </button>
          </div>

          {/* Contact Options */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Have questions or suggestions?
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <a 
                href="mailto:support@contractpro.com" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Documentation
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Feature Requests
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm mb-4">
          In the meantime, explore what's already available
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <FileBarChart className="w-4 h-4" />
            View Contracts
            <ArrowRight className="w-3 h-3" />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <TrendingUp className="w-4 h-4" />
            Dashboard
            <ArrowRight className="w-3 h-3" />
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Users className="w-4 h-4" />
            Upload Files
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
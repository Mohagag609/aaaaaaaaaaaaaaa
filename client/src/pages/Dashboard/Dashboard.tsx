import React from 'react';
import { useQuery } from 'react-query';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  BuildingOfficeIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  TrendingUpIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

interface DashboardStats {
  total_clients: number;
  active_clients: number;
  total_contracts: number;
  active_contracts: number;
  total_units: number;
  available_units: number;
  total_value: number;
  monthly_revenue: number;
}

interface ContractStatus {
  name: string;
  value: number;
  color: string;
}

const Dashboard: React.FC = () => {
  // جلب إحصائيات لوحة التحكم
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>(
    'dashboard-stats',
    async () => {
      const response = await axios.get('/api/dashboard/stats');
      return response.data.data;
    },
    {
      refetchInterval: 300000, // تحديث كل 5 دقائق
    }
  );

  // جلب حالة العقود
  const { data: contractStatus, isLoading: contractStatusLoading } = useQuery<ContractStatus[]>(
    'contract-status',
    async () => {
      const response = await axios.get('/api/contracts/stats/overview');
      const data = response.data.data;
      
      return [
        { name: 'نشطة', value: data.active_contracts || 0, color: '#22c55e' },
        { name: 'مكتملة', value: data.completed_contracts || 0, color: '#3b82f6' },
        { name: 'ملغية', value: data.cancelled_contracts || 0, color: '#ef4444' },
      ];
    }
  );

  // بيانات تجريبية للرسوم البيانية
  const monthlyData = [
    { name: 'يناير', عقود: 12, عملاء: 8, إيرادات: 450000 },
    { name: 'فبراير', عقود: 15, عملاء: 12, إيرادات: 520000 },
    { name: 'مارس', عقود: 18, عملاء: 15, إيرادات: 680000 },
    { name: 'أبريل', عقود: 22, عملاء: 18, إيرادات: 750000 },
    { name: 'مايو', عقود: 25, عملاء: 20, إيرادات: 820000 },
    { name: 'يونيو', عقود: 28, عملاء: 22, إيرادات: 950000 },
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#ef4444'];

  if (statsLoading || contractStatusLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* عنوان الصفحة */}
      <div className="page-header">
        <h1 className="page-title">لوحة التحكم</h1>
        <p className="page-subtitle">نظرة عامة على أداء النظام والإحصائيات</p>
      </div>

      {/* البطاقات الإحصائية */}
      <div className="responsive-grid">
        {/* إجمالي العملاء */}
        <div className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="mr-4">
              <p className="stat-label">إجمالي العملاء</p>
              <p className="stat-value">{stats?.total_clients || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="stat-change-positive">
              <TrendingUpIcon className="inline h-4 w-4 ml-1" />
              +12% من الشهر الماضي
            </span>
          </div>
        </div>

        {/* إجمالي العقود */}
        <div className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-success-600" />
            </div>
            <div className="mr-4">
              <p className="stat-label">إجمالي العقود</p>
              <p className="stat-value">{stats?.total_contracts || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="stat-change-positive">
              <TrendingUpIcon className="inline h-4 w-4 ml-1" />
              +8% من الشهر الماضي
            </span>
          </div>
        </div>

        {/* إجمالي الوحدات */}
        <div className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BuildingOfficeIcon className="h-8 w-8 text-warning-600" />
            </div>
            <div className="mr-4">
              <p className="stat-label">إجمالي الوحدات</p>
              <p className="stat-value">{stats?.total_units || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="stat-label">
              {stats?.available_units || 0} وحدة متاحة
            </span>
          </div>
        </div>

        {/* إجمالي القيمة */}
        <div className="stat-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-danger-600" />
            </div>
            <div className="mr-4">
              <p className="stat-label">إجمالي القيمة</p>
              <p className="stat-value">
                {(stats?.total_value || 0).toLocaleString('ar-SA')} ريال
              </p>
            </div>
          </div>
          <div className="mt-4">
            <span className="stat-change-positive">
              <TrendingUpIcon className="inline h-4 w-4 ml-1" />
              +15% من الشهر الماضي
            </span>
          </div>
        </div>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* الرسم البياني الشهري */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">الأداء الشهري</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  value.toLocaleString('ar-SA'), 
                  name === 'عقود' ? 'العقود' : 
                  name === 'عملاء' ? 'العملاء' : 'الإيرادات'
                ]}
              />
              <Bar dataKey="عقود" fill="#3b82f6" />
              <Bar dataKey="عملاء" fill="#22c55e" />
              <Bar dataKey="إيرادات" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* رسم بياني دائري لحالة العقود */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">حالة العقود</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={contractStatus || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {contractStatus?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* التنبيهات والإشعارات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* التنبيهات العاجلة */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">التنبيهات العاجلة</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <ExclamationTriangleIcon className="h-5 w-5 text-warning-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">أقساط متأخرة</p>
                  <p className="text-sm text-secondary-600">3 أقساط متأخرة تتطلب متابعة فورية</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 space-x-reverse">
                <ClockIcon className="h-5 w-5 text-info-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">عقود تنتهي قريباً</p>
                  <p className="text-sm text-secondary-600">5 عقود تنتهي خلال الشهر القادم</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 space-x-reverse">
                <CheckCircleIcon className="h-5 w-5 text-success-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">مشاريع مكتملة</p>
                  <p className="text-sm text-secondary-600">2 مشاريع تم إكمالها بنجاح</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* النشاط الأخير */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">النشاط الأخير</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary-900">تم إنشاء عقد جديد</p>
                  <p className="text-xs text-secondary-500">منذ ساعتين</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary-900">تم تسجيل عميل جديد</p>
                  <p className="text-xs text-secondary-500">منذ 4 ساعات</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary-900">تم تحديث مشروع</p>
                  <p className="text-xs text-secondary-500">منذ 6 ساعات</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-2 h-2 bg-info-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary-900">تم إنشاء تقرير</p>
                  <p className="text-xs text-secondary-500">منذ يوم واحد</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* روابط سريعة */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-secondary-900">روابط سريعة</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <UsersIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-secondary-900">إضافة عميل</p>
            </button>
            
            <button className="p-4 text-center rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <DocumentTextIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-secondary-900">إنشاء عقد</p>
            </button>
            
            <button className="p-4 text-center rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <BuildingOfficeIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-secondary-900">إضافة وحدة</p>
            </button>
            
            <button className="p-4 text-center rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <ChartBarIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-secondary-900">عرض التقارير</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

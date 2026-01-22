import React, { useState, useEffect } from 'react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  MessageSquare,
  Zap,
  TrendingUp,
  AlertTriangle,
  Loader2,
  RefreshCw,
  CreditCard,
} from 'lucide-react';
import RAGClient, { PlanLimitsResponse, UsageResponse, CostReportResponse } from '@/api/ragClient';
import { useToast } from '@/components/ToastContainer';

const BillingUsagePage: React.FC = () => {
  const [limits, setLimits] = useState<PlanLimitsResponse | null>(null);
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [costReport, setCostReport] = useState<CostReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [limitsData, usageData, costData] = await Promise.all([
        RAGClient.getLimits(),
        RAGClient.getUsage('month'),
        RAGClient.getCostReport('month'),
      ]);
      setLimits(limitsData);
      setUsage(usageData);
      setCostReport(costData);

      // Check if quota exceeded
      if (limitsData.remaining_chats !== null && limitsData.remaining_chats === 0) {
        setShowUpgradeModal(true);
      }
    } catch (err: any) {
      console.error('Failed to load billing data:', err);
      if (err.response?.status === 402) {
        setShowUpgradeModal(true);
        error('AI quota exceeded. Please upgrade your plan.');
      } else {
        error(err.response?.data?.detail || 'Failed to load billing information');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getUsagePercentage = () => {
    if (!limits || limits.monthly_chat_limit === -1) return 0;
    return Math.min((limits.current_month_usage / limits.monthly_chat_limit) * 100, 100);
  };

  const getProgressColor = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return 'bg-red-600';
    if (percentage >= 75) return 'bg-yellow-600';
    return 'bg-primary-600';
  };

  if (loading) {
    return (
      <TenantLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="space-y-8 pb-8">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Billing & Usage
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Monitor your AI usage, costs, and subscription limits.
                </p>
              </div>
              <div className="mt-6 lg:mt-0">
                <Button onClick={loadData} variant="outline" className="btn-secondary">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <div className="px-6">
            {/* Quota Exceeded Banner */}
            {limits && limits.remaining_chats !== null && limits.remaining_chats === 0 && (
              <Card className="mb-6 border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-1">
                        AI Quota Exceeded
                      </h3>
                      <p className="text-yellow-800 mb-4">
                        You've reached your monthly limit of {formatNumber(limits.monthly_chat_limit)}{' '}
                        chats. Upgrade your plan to continue using AI features.
                      </p>
                      <Button
                        onClick={() => window.location.href = '/pricing'}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Plan Limits */}
            {limits && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Plan</span>
                        <span className="text-lg font-bold text-gray-900 capitalize">
                          {limits.plan_name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Monthly Limit</span>
                        <span className="text-lg font-bold text-gray-900">
                          {limits.monthly_chat_limit === -1
                            ? 'Unlimited'
                            : formatNumber(limits.monthly_chat_limit)}
                        </span>
                      </div>
                    </div>

                    {limits.monthly_chat_limit !== -1 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Usage This Month</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatNumber(limits.current_month_usage)} /{' '}
                            {formatNumber(limits.monthly_chat_limit)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div
                            className={`h-3 rounded-full transition-all ${getProgressColor()}`}
                            style={{ width: `${getUsagePercentage()}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Remaining</span>
                          <span className="text-xs font-semibold text-gray-700">
                            {formatNumber(limits.remaining_chats || 0)} chats
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Usage Stats */}
            {usage && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {formatNumber(usage.total_requests)}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">Total Requests</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                        <Zap className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {formatNumber(usage.total_tokens)}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">Total Tokens</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {formatCurrency(usage.total_cost_usd)}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">Estimated Cost</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Cost Breakdown */}
            {costReport && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Provider Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(costReport.breakdown_by_provider).map(([provider, data]) => (
                        <div key={provider} className="border-b border-gray-100 pb-4 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 capitalize">{provider}</span>
                            <span className="text-sm font-semibold text-gray-700">
                              {formatCurrency(data.cost_usd)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatNumber(data.requests)} requests • {formatNumber(data.tokens)} tokens
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Model Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(costReport.breakdown_by_model).map(([model, data]) => (
                        <div key={model} className="border-b border-gray-100 pb-4 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{model}</span>
                            <span className="text-sm font-semibold text-gray-700">
                              {formatCurrency(data.cost_usd)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatNumber(data.requests)} requests • {formatNumber(data.tokens)} tokens
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </TenantLayout>
  );
};

export default BillingUsagePage;


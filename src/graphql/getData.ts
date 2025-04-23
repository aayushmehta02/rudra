import { gql } from '@apollo/client';

export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs {
    audit_logs(order_by: { time: desc }) {
      id
      time
      description
      event
      category
      performed_by
    }
  }
`;


export const GET_TENANTS = gql`
  query GetTenants {
    tenants(order_by: { id: desc }) {
      id
      name
      data_usage_gb
    }
  }
`;

export const GET_TENANT_USAGE = gql`
  query GetTenantUsage {
    tenant_data_usage_daily(order_by: { usage_date: desc }) {
     usage_time:usage_date
     data_usage_gb
    }
  }
`;
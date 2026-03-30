// Serviço para buscar dados do dashboard
export interface DashboardSummary {
  total: number;
  text: string;
}

export interface DashboardResponse {
  summary: DashboardSummary;
}

export async function fetchDashboard(): Promise<DashboardResponse> {
  const res = await fetch('/dashboard');
  if (!res.ok) throw new Error('Erro ao buscar dashboard');
  return res.json();
}

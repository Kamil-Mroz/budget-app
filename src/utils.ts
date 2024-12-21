export function groupByMonth(
  expenses: { amount: number; date: Date; category?: string }[]
) {
  const monthlyTotals: Record<string, number> = {};
  expenses.forEach((expense) => {
    const yearMonth = `${expense.date.getFullYear()}-${
      expense.date.getMonth() + 1
    }`;
    monthlyTotals[yearMonth] = (monthlyTotals[yearMonth] || 0) + expense.amount;
  });

  return monthlyTotals;
}

export function formatReport(object: Record<string, number>): string {
  return Object.entries(object)
    .map(([key, value]) => `[${key}]:${formatCurrency(value)}`)
    .join("\n");
}

export function sortByMonth(data: Record<string, number>): string[] {
  return Object.keys(data).sort((a, b) => {
    const [yearA, monthA] = a.split("-").map(Number);
    const [yearB, monthB] = b.split("-").map(Number);

    return yearA === yearB ? monthA - monthB : yearA - yearB;
  });
}

export function formatCurrency(amount: number): string {
  return Intl.NumberFormat("pl-PL", {
    currency: "PLN",
    style: "currency",
  }).format(amount);
}

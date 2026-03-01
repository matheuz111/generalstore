// src/components/checkout/PaymentMethods.tsx

interface Method {
  id:    string;
  label: string;
  icon:  string;
  color: string;
}

const ALL_METHODS: Method[] = [
  { id: "yape",    label: "Yape",         icon: "💜", color: "border-purple-500/50 bg-purple-500/10 text-purple-300" },
  { id: "plin",    label: "Plin",          icon: "🟢", color: "border-green-500/50 bg-green-500/10 text-green-300" },
  { id: "bcp",     label: "Transferencia", icon: "🏦", color: "border-blue-700/50 bg-blue-700/10 text-blue-300" },
  { id: "binance", label: "Binance Pay",   icon: "⚡", color: "border-yellow-500/50 bg-yellow-500/10 text-yellow-300" },
  { id: "bizum",   label: "Bizum",         icon: "💙", color: "border-blue-400/50 bg-blue-400/10 text-blue-200" },
];

interface Props {
  selected:  string;
  onSelect:  (id: string) => void;
  currency?: string;
}

// Qué métodos mostrar según la divisa activa
const METHODS_BY_CURRENCY: Record<string, string[]> = {
  PEN: ["yape", "plin", "bcp"],
  USD: ["binance"],
  EUR: ["bizum"],
};

const PaymentMethods = ({ selected, onSelect, currency = "PEN" }: Props) => {
  const allowed = METHODS_BY_CURRENCY[currency] ?? METHODS_BY_CURRENCY["PEN"];
  const methods = ALL_METHODS.filter(m => allowed.includes(m.id));

  return (
  <div className="grid grid-cols-2 gap-3">
    {methods.map((m) => (
      <button
        key={m.id}
        type="button"
        onClick={() => onSelect(m.id)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition font-bold text-sm cursor-pointer active:scale-95 ${
          selected === m.id
            ? m.color + " ring-2 ring-offset-1 ring-offset-transparent ring-white/20"
            : "border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:bg-white/10"
        }`}
      >
        <span className="text-xl">{m.icon}</span>
        {m.label}
      </button>
    ))}
  </div>
  );
};

export default PaymentMethods;
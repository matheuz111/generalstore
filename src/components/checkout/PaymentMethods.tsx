// src/components/checkout/PaymentMethods.tsx
import { useLang } from "../../context/LangContext";

interface Props {
  selected: string;
  onSelect: (method: string) => void;
}

const PaymentMethods = ({ selected, onSelect }: Props) => {
  const { t } = useLang();

  const methods = [
    { id: "yape",          name: t("payment", "methodYape"),     description: t("payment", "descYape")     },
    { id: "plin",          name: t("payment", "methodPlin"),     description: t("payment", "descPlin")     },
    { id: "transferencia", name: t("payment", "methodTransfer"), description: t("payment", "descTransfer") },
    { id: "binance",       name: t("payment", "methodBinance"),  description: t("payment", "descBinance")  },
  ];

  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`w-full text-left p-4 rounded-xl border transition cursor-pointer ${
            selected === method.id
              ? "border-blue-500 bg-blue-500/10"
              : "border-white/10 bg-white/5 hover:bg-white/10"
          }`}
        >
          <p className="font-semibold text-lg">{method.name}</p>
          <p className="text-sm text-gray-400">{method.description}</p>
        </button>
      ))}
    </div>
  );
};

export default PaymentMethods;
// src/components/checkout/PaymentInstructions.tsx
import { useLang } from "../../context/LangContext";

interface Props { method: string }

const PaymentInstructions = ({ method }: Props) => {
  const { t } = useLang();
  if (!method) return null;

  return (
    <div className="mt-5 bg-black/40 border border-white/10 rounded-xl p-4 space-y-4">

      {method === "yape" && (
        <>
          <h4 className="text-lg font-bold text-purple-400">{t("payment", "yape")}</h4>
          <img src="/images/yape.jpg" alt="QR Yape" className="w-48 mx-auto rounded-lg" />
          <div className="text-sm text-gray-300 space-y-1 text-center">
            <p><strong>{t("payment", "number")}</strong> 963 469 586</p>
            <p><strong>{t("payment", "name")}</strong> Freddy Aystin Rodriguez Uricay</p>
          </div>
          <p className="text-xs text-gray-400 text-center">{t("payment", "sendReceipt")}</p>
        </>
      )}

      {method === "plin" && (
        <>
          <h4 className="text-lg font-bold text-green-400">{t("payment", "plin")}</h4>
          <img src="/images/plin.jpg" alt="QR Plin" className="w-48 mx-auto rounded-lg" />
          <div className="text-sm text-gray-300 space-y-1 text-center">
            <p><strong>{t("payment", "number")}</strong> 963 469 586</p>
            <p><strong>{t("payment", "name")}</strong> Freddy Aystin Rodriguez Uricay</p>
          </div>
          <p className="text-xs text-gray-400 text-center">{t("payment", "sendReceipt")}</p>
        </>
      )}

      {method === "transferencia" && (
        <>
          <h4 className="text-lg font-bold text-blue-400">{t("payment", "transfer")}</h4>
          <ul className="text-sm text-gray-300 space-y-2">
            <li><strong>BCP:</strong> 19206197697098</li>
            <li><strong>Interbank:</strong> 8983302393569</li>
            <li><strong>BBVA:</strong> 001108140213226768</li>
          </ul>
          <p className="text-sm text-gray-300">
            <strong>{t("payment", "holder")}</strong> Freddy Aystin Rodriguez Uricay
          </p>
          <p className="text-xs text-gray-400">{t("payment", "doTransfer")}</p>
        </>
      )}

      {method === "binance" && (
        <>
          <h4 className="text-lg font-bold text-yellow-400">{t("payment", "binance")}</h4>
          <img src="/images/binance.jpg" alt="QR Binance Pay" className="w-48 mx-auto rounded-lg" />
          <div className="text-sm text-gray-300 space-y-1 text-center">
            <p><strong>{t("payment", "payId")}</strong> 1066569170</p>
            <p><strong>{t("payment", "name")}</strong> Kidstore</p>
          </div>
          <p className="text-xs text-gray-400 text-center">{t("payment", "scanQr")}</p>
        </>
      )}

    </div>
  );
};

export default PaymentInstructions;
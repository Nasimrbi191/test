import { useTranslation } from "react-i18next";


function LocateButton({ onLocate }: { onLocate: () => void }) {
  const {t} = useTranslation();
  return (
    <button
      onClick={onLocate}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        padding: "8px 12px",
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
      }}
    >
      📍 {t('current location')}
    </button>
  );
}

export default LocateButton
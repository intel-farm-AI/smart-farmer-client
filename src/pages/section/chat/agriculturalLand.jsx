import { useEffect, useState } from "react";
import AddLandModal from "../../../components/modal/AddLandModal";
import { FiGrid } from "react-icons/fi";
import { db, auth } from "../../../lib/services/firebase";
import { ref, onValue } from "firebase/database";

const placeholderLands = [
  {
    id: 0,
    name: "Belum ada lahan",
    location: "Silakan tambah lahan baru",
    size: "-",
    crop: "-",
  },
];

export default function AgriculturalLand() {
  const [userLands, setUserLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const landsRef = ref(db, `lands/${uid}`); // <-- ini yang diubah

    const unsubscribe = onValue(landsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const landsArr = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setUserLands(landsArr);
      } else {
        setUserLands([]);
      }
      setLoading(false); // pastikan ini tetap dipanggil
    });

    return () => unsubscribe();
  }, []);

  const landsToShow =
    !loading && userLands.length > 0 ? userLands : !loading ? placeholderLands : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-full max-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-700">Lahan Milik Anda</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition"
          onClick={() => setShowModal(true)}
        >
          + Tambah Lahan
        </button>
      </div>

      <div className="overflow-y-auto divide-y divide-green-100 pr-2" style={{ maxHeight: "350px" }}>
        <ul>
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <li key={i} className="flex items-center py-4 animate-pulse">
                <span className="w-16 h-16 rounded-lg mr-4 bg-green-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="ml-4 w-20 h-8 bg-green-200 rounded" />
              </li>
            ))
          ) : (
            landsToShow.map((land) => (
              <li key={land.id} className="flex items-center py-4">
                <span className="w-16 h-16 flex items-center justify-center rounded-lg mr-4 border border-green-200 bg-green-50 text-green-700 text-3xl">
                  <FiGrid />
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-green-800">{land.name}</div>
                  <div className="text-sm text-gray-600">{land.location}</div>
                  <div className="text-xs text-gray-500">{land.size}</div>
                  <div className="text-xs text-green-600">{land.crop}</div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <AddLandModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
import { useEffect, useState } from "react";
import AddLandModal from "../../../components/modal/AddLandModal";
import { FiGrid, FiPlus, FiMapPin, FiCrop } from "react-icons/fi";
import { db, auth } from "../../../lib/services/firebase";
import { ref, onValue } from "firebase/database";

export default function AgriculturalLand() {
  const [userLands, setUserLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const landsRef = ref(db, `lands/${uid}`);

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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-700/50 p-8 h-full max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 rounded-full p-3">
              <FiGrid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                Lahan Milik Anda
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Kelola dan pantau lahan pertanian Anda
              </p>
            </div>
          </div>

          <button
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
            onClick={() => setShowModal(true)}
          >
            <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Tambah Lahan
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 pr-2 space-y-1" style={{ maxHeight: "400px" }}>
          {loading ? (
            // Loading state
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-slate-700/30 rounded-2xl p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-600/50" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-slate-600/50 rounded-lg w-2/3" />
                      <div className="h-4 bg-slate-600/30 rounded-lg w-1/2" />
                      <div className="flex gap-4">
                        <div className="h-3 bg-slate-600/30 rounded w-20" />
                        <div className="h-3 bg-slate-600/30 rounded w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : userLands.length > 0 ? (
            // List lahan
            <div className="space-y-3">
              {userLands.map((land) => (
                <div
                  key={land.id}
                  className="group relative bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/50 hover:border-emerald-500/50 
                    rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-600/30 transition-all duration-300">
                      <FiGrid className="w-7 h-7" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-2 truncate text-slate-200 group-hover:text-emerald-300">
                        {land.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <FiMapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-400 text-sm truncate">{land.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-slate-300 text-sm">
                            <span className="text-slate-500">Luas:</span> {land.size}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <FiCrop className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300 text-sm font-medium">{land.crop}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-16">
              <div className="bg-slate-700/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiGrid className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-slate-300 text-xl font-semibold mb-2">Belum ada lahan</h3>
              <p className="text-slate-500 mb-6">Mulai dengan menambahkan lahan pertama Anda</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                Tambah Lahan Pertama
              </button>
            </div>
          )}
        </div>
      </div>

      <AddLandModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

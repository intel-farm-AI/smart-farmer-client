import { Link } from "react-router-dom";

export default function Join() {
    return (
        <section className="py-16 bg-gradient-to-br from-green-700 to-green-500 text-white text-center">
            <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Bergabunglah dengan Komunitas Smartfarm AI!</h2>
            <p className="text-lg mb-8">Jadilah bagian dari revolusi pertanian digital bersama ribuan petani lainnya.</p>
                <Link to="/login" className="bg-white text-green-800 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-green-200 transition-all">
                Mulai Sekarang
                </Link>
            </div>
        </section>
    )
}
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Users, CreditCard, PieChart, Trash2, Edit3, Search,
    Download, Check, X, Loader2, Plus,
    Save, MapPin, Mail, LogOut, Settings, QrCode, Ticket, Shield, Sun, Moon
} from 'lucide-react';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({ totalUsers: 0, paidUsers: 0, totalRevenue: 0, roleStats: [] });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [activeTab, setActiveTab] = useState('inscriptions');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        nom: '', prenom: '', email: '', telephone: '',
        ville: '', pays: 'Tunisie', role: 'praticien',
        totalPrice: 0, currency: 'TND', paymentStatus: 'pending',
        modePaiement: 'especes'
    });

    const [isDarkMode, setIsDarkMode] = useState(true);
    const [appSettings, setAppSettings] = useState({
        maxPractitioners: 200,
        maxAssistants: 100,
        maxStudents: 50,
        maxExhibitors: 20,
        practitionerPrice: 850,
        assistantPrice: 450,
        studentPrice: 300,
        exhibitorPrice: 2500,
        practitionerPriceEUR: 250,
        assistantPriceEUR: 150,
        studentPriceEUR: 100,
        exhibitorPriceEUR: 750,
        isRegistrationOpen: true
    });
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, settingsRes] = await Promise.all([
                axios.get('/api/admin/stats'),
                axios.get('/api/admin/users'),
                axios.get('/api/admin/settings')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setAppSettings(prev => ({ ...prev, ...settingsRes.data }));
        } catch (err) {
            console.error("Error fetching admin data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({ ...user });
        } else {
            setEditingUser(null);
            setFormData({
                nom: '', prenom: '', email: '', telephone: '',
                ville: '', pays: 'Tunisie', role: 'praticien',
                totalPrice: 0, currency: 'TND', paymentStatus: 'pending',
                modePaiement: 'especes'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await axios.put(`/api/admin/users/${editingUser._id}`, formData);
                alert("Modifications enregistrées avec succès !");
            } else {
                const res = await axios.post('/api/admin/users', formData);
                if (res.data.defaultPassword) {
                    alert(`NOUVEL INSCRIT CRÉÉ !\n\n🔑 Mot de passe temporaire : ${res.data.defaultPassword}\n\nL'email avec le QR Code a été expédié.`);
                }
            }
            fetchData();
            handleCloseModal();
            if (!editingUser) setActiveTab('inscriptions');
        } catch (err) {
            alert("Erreur: " + (err.response?.data?.message || err.message));
        }
    };

    const handleResendEmail = async (email) => {
        if (!window.confirm(`Voulez-vous renvoyer le QR Code et la confirmation à ${email} ?`)) return;
        try {
            await axios.post('/api/auth/resend-confirmation', { email });
            alert(`Email expédié avec succès à ${email} !`);
        } catch (err) {
            alert("Erreur lors de l'envoi de l'email.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Action critique: Voulez-vous vraiment supprimer cet inscrit ?")) return;
        try {
            await axios.delete(`/api/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    const togglePaymentStatus = async (user) => {
        const newStatus = user.paymentStatus === 'paid' ? 'pending' : 'paid';
        try {
            const res = await axios.put(`/api/admin/users/${user._id}`, { paymentStatus: newStatus });
            setUsers(users.map(u => u._id === user._id ? res.data : u));
            const statsRes = await axios.get('/api/admin/stats');
            setStats(statsRes.data);
        } catch (err) {
            alert("Erreur lors de la mise à jour");
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = (u.nom + ' ' + u.prenom + ' ' + u.email + ' ' + (u.registrationNumber || '')).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const exportToExcel = () => {
        const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Ville', 'Pays', 'Rôle', 'Prix Facturé', 'Statut Paiement', 'Mode Paiement', 'Numéro de Billet'];
        const rows = filteredUsers.map(u => [
            u.nom, u.prenom, u.email, u.telephone, u.ville, u.pays, u.role, u.totalPrice, u.paymentStatus, u.modePaiement, u.registrationNumber
        ]);


        const BOM = "\uFEFF";
        const csvContent = BOM + headers.join(";") + "\n"
            + rows.map(e => e.join(";")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Inscriptions_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyToSheets = async () => {
        try {
            const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Ville', 'Pays', 'Rôle', 'Prix', 'Statut', 'Mode', 'Numéro'];
            const rows = filteredUsers.map(u => [
                u.nom, u.prenom, u.email, u.telephone, u.ville, u.pays, u.role, u.totalPrice, u.paymentStatus, u.modePaiement, u.registrationNumber
            ]);

            // TSV format (Tab Separated) is the magic format for pasting into Google Sheets/Excel
            const tsvContent = headers.join("\t") + "\n" + rows.map(r => r.join("\t")).join("\n");

            await navigator.clipboard.writeText(tsvContent);
            alert("🪄 Données copiées ! Allez sur Google Sheets et faites CTRL + V.");
        } catch (err) {
            alert("Erreur lors de la copie.");
        }
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        setIsSavingSettings(true);
        try {
            await axios.post('/api/admin/settings', appSettings);
            alert("Paramètres mis à jour avec succès !");
        } catch (err) {
            alert("Erreur lors de la sauvegarde des paramètres.");
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) return (
        <div data-theme={isDarkMode ? 'dark' : 'light'} className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
    );

    return (
        <div data-theme={isDarkMode ? 'dark' : 'light'} className="flex h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden font-outfit transition-colors duration-300">

            {/* SIDEBAR */}
            <aside className="w-72 bg-[var(--bg-card)] border-r border-[var(--border-subtle)] flex flex-col justify-between hidden lg:flex shadow-2xl relative z-10 transition-colors duration-300">
                <div>
                    <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between">
                        <div>
                            <div className="flex items-center justify-center mb-4">
                                <img src="/Logo_SUMMIT.png" alt="Summit Logo" className="h-[85px] w-80 object-contain" />
                            </div>
                            <p className="text-center text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-black opacity-60">Centre de Contrôle</p>
                        </div>

                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-3 rounded-xl transition-all duration-300 border ${isDarkMode ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'}`}
                            title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    <nav className="p-4 space-y-2 mt-4">
                        <button
                            onClick={() => setActiveTab('inscriptions')}
                            className={`w-full flex items-center space-x-3 px-5 py-4 rounded-xl font-bold transition-all ${activeTab === 'inscriptions'
                                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-colors'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 border border-transparent transition-colors'
                                }`}
                        >
                            <Ticket size={20} />
                            <span>Inscriptions & Stats</span>
                        </button>

                        <button
                            onClick={() => {
                                handleOpenModal(null);
                                setActiveTab('nouvelle');
                            }}
                            className={`w-full flex items-center space-x-3 px-5 py-4 rounded-xl font-bold transition-all ${activeTab === 'nouvelle'
                                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-colors'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 border border-transparent transition-colors'
                                }`}
                        >
                            <Plus size={20} />
                            <span>Nouvelle Inscription</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center space-x-3 px-5 py-4 rounded-xl font-bold transition-all ${activeTab === 'settings'
                                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-colors'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 border border-transparent transition-colors'
                                }`}
                        >
                            <Settings size={20} />
                            <span>Configuration</span>
                        </button>
                    </nav>
                </div>

                <div className="p-6 border-t border-[var(--border-subtle)]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-4 text-red-600 dark:text-red-400 hover:text-white hover:bg-red-500 rounded-xl font-bold transition-all border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    >
                        <LogOut size={18} />
                        <span>Fermer la session</span>
                    </button>
                </div>
            </aside>


            <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative">

                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="p-6 lg:p-12 w-full max-w-7xl mx-auto relative z-10">


                    {activeTab === 'settings' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="mb-10">
                                <h1 className="text-3xl lg:text-4xl font-black text-[var(--text-main)] tracking-tight transition-colors">Configuration Global</h1>
                                <p className="text-[var(--text-muted)] mt-2">Gérez les quotas de places, les tarifs et l'état des inscriptions.</p>
                            </div>

                            <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 xl:grid-cols-2 gap-8">


                                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[32px] p-8 lg:p-10 shadow-xl transition-colors duration-300">
                                    <div className="flex items-center space-x-4 mb-8">
                                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                                            <Users size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[var(--text-main)]">Quotas & Capacités</h3>
                                            <p className="text-sm text-[var(--text-muted)]">Limites par rôle.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { label: 'Praticiens Max', key: 'maxPractitioners' },
                                            { label: 'Assistantes Max', key: 'maxAssistants' },
                                            { label: 'Étudiants Max', key: 'maxStudents' },
                                            { label: 'Exposants Max', key: 'maxExhibitors' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-[var(--bg-input)] rounded-2xl border border-[var(--border-subtle)]">
                                                <label className="text-[var(--text-muted)] font-medium">{item.label}</label>
                                                <input
                                                    type="number"
                                                    value={appSettings[item.key]}
                                                    onChange={(e) => setAppSettings({ ...appSettings, [item.key]: Number(e.target.value) })}
                                                    className="w-24 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-[var(--text-main)] text-right font-black focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[32px] p-8 lg:p-10 shadow-xl transition-colors duration-300">
                                    <div className="flex items-center space-x-4 mb-8">
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[var(--text-main)]">Grille Tarifaire</h3>
                                            <p className="text-sm text-[var(--text-muted)]">TND / EUR par catégorie.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                        {[
                                            { label: 'PRATICIEN', tnd: 'practitionerPrice', eur: 'practitionerPriceEUR' },
                                            { label: 'ASSISTANTE', tnd: 'assistantPrice', eur: 'assistantPriceEUR' },
                                            { label: 'ÉTUDIANT', tnd: 'studentPrice', eur: 'studentPriceEUR' },
                                            { label: 'EXPOSANT', tnd: 'exhibitorPrice', eur: 'exhibitorPriceEUR' }
                                        ].map((row, idx) => (
                                            <div key={idx} className="p-4 bg-[var(--bg-input)] rounded-2xl border border-[var(--border-subtle)]">
                                                <label className="text-blue-400 font-black text-[10px] uppercase tracking-widest block mb-3">{row.label}</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-muted)] font-bold">TND</span>
                                                        <input
                                                            type="number"
                                                            value={appSettings[row.tnd]}
                                                            onChange={(e) => setAppSettings({ ...appSettings, [row.tnd]: Number(e.target.value) })}
                                                            className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl pl-11 pr-3 py-2 text-[var(--text-main)] font-black focus:border-blue-500 outline-none text-sm"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-600 font-bold">EUR</span>
                                                        <input
                                                            type="number"
                                                            value={appSettings[row.eur]}
                                                            onChange={(e) => setAppSettings({ ...appSettings, [row.eur]: Number(e.target.value) })}
                                                            className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl pl-11 pr-3 py-2 text-emerald-400 font-black focus:border-emerald-500 outline-none text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[32px] p-8 lg:p-10 shadow-xl xl:col-span-2 transition-colors duration-300">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
                                                <Shield size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[var(--text-main)]">Statut des Inscriptions</h3>
                                                <p className="text-sm text-[var(--text-muted)]">Contrôlez l'accès au formulaire public.</p>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => setAppSettings({ ...appSettings, isRegistrationOpen: !appSettings.isRegistrationOpen })}
                                            className={`w-16 h-8 rounded-full cursor-pointer transition-all relative ${appSettings.isRegistrationOpen ? 'bg-green-600' : 'bg-slate-700'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${appSettings.isRegistrationOpen ? 'left-9' : 'left-1'}`}></div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-between items-center bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl p-6 gap-6">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-3 h-3 rounded-full ${appSettings.isRegistrationOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                            <span className="font-bold text-[var(--text-main)]">{appSettings.isRegistrationOpen ? "Les inscriptions sont actuellement OUVERTES" : "Les inscriptions sont fermées"}</span>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSavingSettings}
                                            className="w-full md:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-10 py-4 rounded-xl font-black shadow-lg transition-all border border-white/10"
                                        >
                                            {isSavingSettings ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                            <span>Enregistrer la Configuration</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="xl:col-span-2 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex items-start space-x-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                        <PieChart size={20} />
                                    </div>
                                    <p className="text-sm text-blue-400/90 dark:text-blue-400 leading-relaxed transition-colors">
                                        <span className="font-bold text-blue-600 dark:text-blue-400 transition-colors">Note:</span> Ces paramètres impactent directement le site public. La clôture des inscriptions empêchera tout nouveau visiteur de s'inscrire, mais vous pourrez toujours ajouter des inscrits manuellement depuis l'onglet "Nouvelle Inscription".
                                    </p>
                                </div>

                            </form>
                        </div>
                    )}

                    {activeTab === 'nouvelle' && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-black text-[var(--text-main)] transition-colors tracking-tight">Nouvelle Inscription</h1>
                                    <p className="text-slate-400 mt-2">Enregistrement manuel d'un nouveau participant au Summit.</p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('inscriptions')}
                                    className="bg-[#1E293B] hover:bg-[#2A3B52] text-white px-6 py-3.5 rounded-xl border border-white/5 transition-all font-bold flex items-center space-x-2"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[32px] overflow-hidden shadow-2xl">
                                <form onSubmit={handleSubmit} className="p-8 lg:p-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Prénom du participant</label>
                                            <input name="prenom" value={formData.prenom} onChange={handleInputChange} className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl px-6 py-4 text-[var(--text-main)] focus:border-blue-500 focus:bg-[var(--bg-card)] outline-none transition-all text-lg" required />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Nom du participant</label>
                                            <input name="nom" value={formData.nom} onChange={handleInputChange} className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl px-6 py-4 text-[var(--text-main)] focus:border-blue-500 focus:bg-[var(--bg-card)] outline-none transition-all text-lg" required />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Adresse Email</label>
                                            <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="exemple@mail.com" className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl px-6 py-4 text-[var(--text-main)] focus:border-blue-500 focus:bg-[var(--bg-card)] outline-none transition-all" required />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Numéro de Téléphone</label>
                                            <input name="telephone" value={formData.telephone} onChange={handleInputChange} placeholder="+216 -- --- ---" className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl px-6 py-4 text-[var(--text-main)] focus:border-blue-500 focus:bg-[var(--bg-card)] outline-none transition-all" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Ville</label>
                                            <input name="ville" value={formData.ville} onChange={handleInputChange} placeholder="Ex: Monastir, Tunis..." className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl px-6 py-4 text-[var(--text-main)] focus:border-blue-500 focus:bg-[var(--bg-card)] outline-none transition-all" required />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Pays</label>
                                            <input name="pays" value={formData.pays} onChange={handleInputChange} className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl px-6 py-4 text-[var(--text-main)] focus:border-blue-500 focus:bg-[var(--bg-card)] outline-none transition-all" required />
                                        </div>

                                        <div className="md:col-span-2 my-4">
                                            <div className="h-[1px] bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent"></div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Catégorie / Rôle</label>
                                            <select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl px-6 py-5 text-[var(--text-main)] outline-none font-bold appearance-none cursor-pointer hover:border-white/20 transition-colors">
                                                <option value="praticien">Praticien</option>
                                                <option value="assistante">Assistante</option>
                                                <option value="exposant">Exposant</option>
                                                <option value="etudiant">Étudiant</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Méthode de Paiement</label>
                                            <select name="modePaiement" value={formData.modePaiement} onChange={handleInputChange} className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl px-6 py-5 text-[var(--text-main)] outline-none font-bold appearance-none cursor-pointer hover:border-white/20 transition-colors">
                                                <option value="especes">En Espèces</option>
                                                <option value="virement">Virement Bancaire</option>
                                                <option value="carte">Carte en ligne</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Tarif Appliqué</label>
                                            <div className="relative">
                                                <input name="totalPrice" type="number" value={formData.totalPrice} onChange={handleInputChange} className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl px-6 py-5 text-blue-400 outline-none font-black text-2xl focus:border-blue-500/50" />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                                                    <select name="currency" value={formData.currency} onChange={handleInputChange} className="bg-transparent text-[var(--text-muted)] font-bold outline-none cursor-pointer">
                                                        <option value="TND" className="bg-[var(--bg-card)]">TND</option>
                                                        <option value="€" className="bg-[var(--bg-card)]">EUR</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Statut Initial du Paiement</label>
                                            <select name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} className={`w-full border rounded-2xl px-6 py-5 outline-none font-black appearance-none cursor-pointer transition-all ${formData.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'}`}>
                                                <option value="pending" className="bg-[var(--bg-card)]">En attente (Non payé)</option>
                                                <option value="paid" className="bg-[var(--bg-card)]">Déjà Payé / Confirmé</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-12 flex flex-col md:flex-row gap-4">
                                        <button type="submit" className="flex-1 lg:flex-none lg:px-12 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-[0_15px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center space-x-2 border border-blue-400/20">
                                            <Check size={20} />
                                            <span>Valider l'Inscription</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('inscriptions')}
                                            className="px-10 py-5 bg-[var(--bg-sidebar)] hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-main)] font-bold rounded-2xl border border-[var(--border-subtle)] transition-all"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}


                    {activeTab === 'inscriptions' && (
                        <div className="animate-in fade-in duration-500">

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-black text-[var(--text-main)] transition-colors tracking-tight">Gestion des Billets</h1>
                                    <p className="text-slate-400 mt-2">Vue détaillée des transactions et inscrits au Summit Efficience.</p>
                                </div>
                                <div className="flex space-x-3 w-full md:w-auto">

                                    <button
                                        onClick={copyToSheets}
                                        className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all font-bold border border-white/5"
                                        title="Copier pour coller directement dans Google Sheets"
                                    >
                                        <Save size={20} /><span>Copier pour Sheets</span>
                                    </button>
                                    <button
                                        onClick={exportToExcel}
                                        className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-[var(--bg-card)] hover:bg-[var(--bg-input)] text-[var(--text-main)] px-6 py-3.5 rounded-xl border border-[var(--border-subtle)] transition-all font-bold"
                                        title="Télécharger l'export pour Excel"
                                    >
                                        <Download size={20} /><span>Export Excel</span>
                                    </button>
                                </div>
                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                <StatCard icon={Users} label="Total Inscrits" value={stats.totalUsers} color="blue" />
                                <StatCard icon={Check} label="Paiements Validés" value={stats.paidUsers} color="green" />
                                <StatCard icon={CreditCard} label="Revenu Brut" value={`${stats.totalRevenue.toLocaleString()}`} color="cyan" />
                                <StatCard icon={PieChart} label="Taux de Conv." value={`${stats.totalUsers > 0 ? ((stats.paidUsers / stats.totalUsers) * 100).toFixed(1) : 0}%`} color="purple" />
                            </div>


                            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 shadow-xl transition-colors duration-300">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Chercher un nom, email, billet (SE26...)"
                                        className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl py-3.5 pl-12 pr-4 text-[var(--text-main)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl py-3.5 px-6 text-[var(--text-main)] outline-none focus:border-blue-500 font-bold"
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                >
                                    <option value="all">Tous Rôles</option>
                                    <option value="praticien">Praticiens</option>
                                    <option value="assistante">Assistantes</option>
                                    <option value="exposant">Exposants</option>
                                    <option value="etudiant">Étudiants</option>
                                </select>
                            </div>


                            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden shadow-2xl relative">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-[var(--bg-input)] text-[var(--text-muted)] text-xs uppercase tracking-[0.15em] font-black border-b border-[var(--border-subtle)]">
                                            <tr>
                                                <th className="px-6 py-5">Participant & Badge</th>
                                                <th className="px-6 py-5">Contact & Lieu</th>
                                                <th className="px-6 py-5">Role & Mode</th>
                                                <th className="px-6 py-5">Repas</th>
                                                <th className="px-6 py-5">Statut Paiement</th>
                                                <th className="px-6 py-5 text-right">Actions Manuelles</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-main)]">
                                            {filteredUsers.map((u) => (
                                                <tr key={u._id} className="hover:bg-blue-500/[0.03] transition-colors group">


                                                    <td className="px-6 py-6 border-none">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-blue-400 font-black text-lg border border-blue-500/10 shadow-inner">
                                                                {u.prenom[0]}{u.nom[0]}
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-[17px] leading-tight text-[var(--text-main)] transition-colors">{u.prenom} {u.nom}</div>
                                                                <div className="mt-1 flex items-center flex-wrap gap-2">
                                                                    <div className="text-[11px] text-blue-400 font-mono tracking-widest uppercase bg-blue-500/10 px-2.5 py-1 rounded-md">
                                                                        {u.registrationNumber}
                                                                    </div>
                                                                    {u.nbParticipants > 1 && (
                                                                        <div className="text-[11px] text-purple-400 font-bold bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20 flex items-center">
                                                                            <Users size={12} className="mr-1.5" />
                                                                            +{u.nbParticipants - 1} Accomp.
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-6 border-none text-[var(--text-main)] transition-colors">
                                                        <div className="flex flex-col space-y-1.5">
                                                            <div className="flex items-center text-sm">
                                                                <Mail size={14} className="mr-2 text-[var(--text-muted)]" />
                                                                {u.email}
                                                            </div>
                                                            <div className="flex items-center text-xs text-[var(--text-muted)] font-medium">
                                                                <MapPin size={14} className="mr-2 opacity-70" />
                                                                {u.ville}, {u.pays}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-6 border-none">
                                                        <div className="flex flex-col items-start space-y-2">
                                                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${u.role === 'praticien' ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                                                                u.role === 'assistante' ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                                                    u.role === 'etudiant' ? 'bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' :
                                                                        u.role === 'exposant' ? 'bg-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                                                                            'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                                                                }`}>
                                                                {u.role}
                                                            </span>
                                                            <div className="text-[11px] text-[var(--text-muted)] flex items-center font-bold">
                                                                {u.modePaiement === 'carte' ? <CreditCard size={12} className="mr-1.5" /> : <Save size={12} className="mr-1.5" />}
                                                                {u.modePaiement?.toUpperCase() || 'ESPECES'}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-6 border-none">
                                                        <div className="text-sm font-bold text-[var(--text-main)]">
                                                            {(parseInt(u.ticketsRepas) || 0) + (u.additionalParticipants?.reduce((sum, p) => sum + (parseInt(p.ticketsRepas) || 0), 0) || 0)} <span className="text-[11px] text-[var(--text-muted)]">tickets</span>
                                                        </div>
                                                    </td>


                                                    <td className="px-6 py-6 border-none">
                                                        <div className="flex flex-col items-start space-y-2">
                                                            <button
                                                                onClick={() => togglePaymentStatus(u)}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-black border transition-all text-center ${u.paymentStatus === 'paid'
                                                                    ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                                                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20'
                                                                    }`}
                                                            >
                                                                {u.paymentStatus === 'paid' ? 'VALIDÉ ✅' : 'ATTENTE ⏳'}
                                                            </button>
                                                            <div className="text-base font-black text-[var(--text-main)] transition-colors">{u.totalPrice} <span className="text-xs text-[var(--text-muted)] ml-1">{u.currency}</span></div>
                                                        </div>
                                                    </td>


                                                    <td className="px-6 py-6 text-right border-none">
                                                        <div className="flex justify-end space-x-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleResendEmail(u.email)}
                                                                title="Renvoyer l'Email & le QR Code"
                                                                className="p-3 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30"
                                                            >
                                                                <Mail size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenModal(u)}
                                                                title="Modifier le dossier"
                                                                className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
                                                            >
                                                                <Edit3 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(u._id)}
                                                                title="Supprimer"
                                                                className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg hover:shadow-red-500/30"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {isModalOpen && editingUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={handleCloseModal}></div>
                        <div className="relative bg-[var(--bg-card)] border border-[var(--border-subtle)] w-full max-w-2xl rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
                            <div className="p-8 border-b border-[var(--border-subtle)] flex justify-between items-center bg-gradient-to-r from-blue-900/20 to-transparent">
                                <div>
                                    <h2 className="text-2xl font-black text-[var(--text-main)]">
                                        Modifier le Dossier
                                    </h2>
                                    <p className="text-sm text-[var(--text-muted)] mt-1">Mise à jour des détails du participant</p>
                                </div>
                                <button onClick={handleCloseModal} className="text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-sidebar)] w-10 h-10 rounded-full flex items-center justify-center"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                                        <input name="prenom" value={formData.prenom} onChange={handleInputChange} className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:bg-[#0A111F] outline-none transition-colors" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                                        <input name="nom" value={formData.nom} onChange={handleInputChange} className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:bg-[#0A111F] outline-none transition-colors" required />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                        <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:bg-[#0A111F] outline-none transition-colors" required />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                                        <input name="telephone" value={formData.telephone} onChange={handleInputChange} className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:bg-[#0A111F] outline-none transition-colors" />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Ville</label>
                                        <input name="ville" value={formData.ville} onChange={handleInputChange} className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:bg-[#0A111F] outline-none transition-colors" required />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Pays</label>
                                        <input name="pays" value={formData.pays} onChange={handleInputChange} className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:bg-[#0A111F] outline-none transition-colors" required />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <div className="w-full h-[1px] bg-white/5 my-2"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Rôle</label>
                                        <select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none font-bold">
                                            <option value="praticien">Praticien (Normal)</option>
                                            <option value="assistante">Assistante</option>
                                            <option value="exposant">Exposant / VIP</option>
                                            <option value="etudiant">Étudiant spécial</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Mode de Paiement</label>
                                        <select name="modePaiement" value={formData.modePaiement} onChange={handleInputChange} className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none font-bold">
                                            <option value="especes">En Espèces / Sur Place</option>
                                            <option value="virement">Virement Bancaire</option>
                                            <option value="carte">Carte en ligne (Stripe)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Prix Facturé</label>
                                        <input name="totalPrice" type="number" value={formData.totalPrice} onChange={handleInputChange} className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none font-black text-lg text-blue-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Devise Période</label>
                                        <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none font-bold">
                                            <option value="TND">TND (Dinar)</option>
                                            <option value="€">EUR (€)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Validation Paiement</label>
                                        <select name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} className={`w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3.5 outline-none font-black ${formData.paymentStatus === 'paid' ? 'text-green-500 bg-green-900/10 border-green-500/30' : 'text-amber-500'}`}>
                                            <option value="pending">⏳ En attente (Non payé)</option>
                                            <option value="paid">Payé / Validé</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-10 flex space-x-4">
                                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center space-x-2 border border-blue-400/20">
                                        <Save size={20} />
                                        <span>{editingUser ? 'Sauvegarder les modifications' : 'Générer Inscription'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-7 relative overflow-hidden group shadow-lg transition-colors duration-300">
        <div className={`absolute -right-6 -bottom-6 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700`}></div>
        <div className="flex items-center space-x-5 relative z-10">
            <div className={`w-14 h-14 bg-${color}-500/10 rounded-[18px] flex items-center justify-center text-${color}-400 border border-${color}-500/20 shadow-inner`}>
                <Icon size={26} strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black text-[var(--text-main)] transition-colors">{value}</h3>
            </div>
        </div>
    </div>
);

export default AdminDashboard;

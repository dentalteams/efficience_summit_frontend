import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { User, Calendar, Download, Mail, Check, Clock, Loader2, ArrowRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [downloading, setDownloading] = useState(false);
    const [emailing, setEmailing] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    if (!user) return null;

    // Fonction de génération sécurisée du contenu du QR Code
    const generateSecureQRData = (participant, isPrincipal = true) => {
        const isPaid = user.paymentStatus === 'paid';
        const status = isPaid ? 'Payé' : 'Non payé';
        // Création d'un token basique pour authentifier le billet avec une clé visuelle
        const rawToken = `${participant?.registrationNumber || user.registrationNumber}-${isPaid ? 'VAL' : 'PEND'}-2026`;
        const secureToken = btoa(rawToken).substring(0, 10).toUpperCase();

        if (isPrincipal) {
            return `--- SUMMIT EFFICIENCE 2026 ---
ID: ${user.registrationNumber}
Participant: ${user.prenom?.toUpperCase()} ${user.nom?.toUpperCase()}
Role: ${user.role?.toUpperCase()}
Paiement: ${status}
Tickets Repas: ${user.ticketsRepas || 0}
Assistantes avec vous: ${(user.nbParticipants || 1) - 1}
------------------------------
SecToken: ${secureToken}`;
        } else {
            return `--- SUMMIT EFFICIENCE 2026 ---
ID: ${participant.registrationNumber || 'Billet-Lie'}
Participant: ${participant.prenom?.toUpperCase()} ${participant.nom?.toUpperCase()}
Role: ${participant.role?.toUpperCase() || 'ASSISTANTE'}
Lie au compte de: ${user.nom?.toUpperCase()}
Paiement: ${status}
Tickets Repas: ${participant.ticketsRepas || 0}
------------------------------
SecToken: ${secureToken}`;
        }
    };

    const downloadBadge = async () => {
        setDownloading(true);
        try {
            // Create a clean canvas for the PDF
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 1100;
            const ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#1e40af';
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('SUMMIT EFFICIENCE 2026', 400, 100);

            ctx.fillStyle = '#64748b';
            ctx.font = '24px Arial';
            ctx.fillText('15 & 16 Mai - Monastir', 400, 150);

            // Get the QR Code Canvas
            const qrCanvas = document.getElementById('qr-canvas');
            if (qrCanvas) {
                ctx.drawImage(qrCanvas, 200, 250, 400, 400);
            }


            ctx.fillStyle = '#000000';
            ctx.font = 'bold 50px Arial';
            ctx.fillText(`${user.prenom.toUpperCase()} ${user.nom.toUpperCase()}`, 400, 750);

            ctx.fillStyle = '#2563eb';
            ctx.font = 'bold 30px Courier';
            ctx.fillText(user.registrationNumber, 400, 820);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            pdf.addImage(imgData, 'PNG', 10, 10, 190, 260);
            pdf.save(`Badge_${user.registrationNumber}.pdf`);

            setMessage({ text: 'Badge téléchargé avec succès !', type: 'success' });
        } catch (err) {
            console.error(err);
            setMessage({ text: 'Erreur lors de la génération du badge.', type: 'error' });
        } finally {
            setDownloading(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
    };

    const resendEmail = async () => {
        setEmailing(true);
        try {
            await axios.post('/api/auth/resend-confirmation', { email: user.email });
            setMessage({ text: 'Email de confirmation envoyé !', type: 'success' });
        } catch (err) {
            console.error(err);
            setMessage({ text: "Erreur lors de l'envoi de l'email.", type: 'error' });
        } finally {
            setEmailing(false);
            setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-5xl font-black text-white mb-3">Mon Espace</h2>
                    <p className="text-xl text-blue-200">Bienvenue Dr. {user.nom} {user.prenom}</p>
                    {message.text && (
                        <div className={`mt-4 inline-block px-6 py-2 rounded-full text-sm font-bold animate-bounce ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                            {message.text}
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/20 p-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/50">
                                <User className="text-white w-12 h-12" />
                            </div>

                            <h3 className="text-2xl font-bold text-white text-center mb-2">
                                {user.nom} {user.prenom}
                            </h3>
                            <p className="text-blue-200 text-center mb-6">{user.email}</p>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                                    <span className="text-blue-200 text-sm">Statut</span>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm font-semibold border border-green-500/30">
                                        Confirmé
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                                    <span className="text-blue-200 text-sm">Rôle</span>
                                    <span className="text-white font-semibold text-sm capitalize">
                                        {user.role === 'praticien' ? 'Praticien' :
                                            user.role === 'assistante' ? 'Assistante' :
                                                user.role === 'exposant' ? 'Exposant' : 'Étudiant'}
                                    </span>
                                </div>
                                {user.nbParticipants > 1 && (
                                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                                        <span className="text-blue-200 text-sm">Participants</span>
                                        <span className="text-white font-semibold text-sm">
                                            {user.nbParticipants} personnes
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                                    <span className="text-blue-200 text-sm">Paiement</span>
                                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${user.paymentStatus === 'paid'
                                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                        }`}>
                                        {user.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/20 p-8 mb-6">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                    <Calendar className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Votre QR Code</h3>
                                    <p className="text-blue-200">À présenter le jour du congrès</p>
                                </div>
                            </div>
                            {/* Visualization Badge (SVG) */}
                            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5">
                                <div className="flex justify-center border-4 border-white/10 p-4 rounded-xl bg-white">
                                    <QRCodeSVG
                                        value={generateSecureQRData(user, true)}
                                        size={256}
                                        level="M"
                                        includeMargin={true}
                                    />
                                </div>
                                <div className="text-center mt-6">
                                    <p className="text-2xl font-black text-white">{user.prenom} {user.nom}</p>
                                    <p className="text-blue-400 font-mono text-sm tracking-widest uppercase">{user.registrationNumber}</p>
                                </div>
                            </div>

                            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                                <div id="badge-capture-area" style={{ width: '400px', padding: '40px', backgroundColor: '#ffffff', textAlign: 'center', fontFamily: 'Arial' }}>
                                    <h1 style={{ color: '#1e40af', fontSize: '24px', marginBottom: '10px' }}>SUMMIT EFFICIENCE 2026</h1>
                                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>15 & 16 Mai - Monastir</p>
                                    <div style={{ display: 'inline-block', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                                        <QRCodeCanvas
                                            id="qr-canvas"
                                            value={generateSecureQRData(user, true)}
                                            size={250}
                                            level="M"
                                        />
                                    </div>
                                    <div style={{ marginTop: '30px' }}>
                                        <h2 style={{ color: '#000000', fontSize: '28px', margin: '0' }}>{user.prenom.toUpperCase()} {user.nom.toUpperCase()}</h2>
                                        <p style={{ color: '#2563eb', fontWeight: 'bold', letterSpacing: '2px', marginTop: '10px' }}>{user.registrationNumber}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 grid sm:grid-cols-2 gap-4">
                                <button
                                    onClick={downloadBadge}
                                    disabled={downloading}
                                    className="py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                                >
                                    {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                                    <span>{downloading ? 'Génération...' : 'Télécharger QR Code'}</span>
                                </button>
                                <button
                                    onClick={resendEmail}
                                    disabled={emailing}
                                    className="py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold border border-white/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                                >
                                    {emailing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                                    <span>{emailing ? 'Envoi...' : 'Envoyer par Email'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/20 p-8">
                            <h3 className="text-2xl font-bold text-white mb-6">Informations du Congrès</h3>

                            <div className="space-y-4">
                                <div className="flex items-start space-x-4 p-4 bg-slate-900/50 rounded-xl">
                                    <Calendar className="text-cyan-400 w-6 h-6 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-white font-semibold">Dates</p>
                                        <p className="text-blue-200">15 & 16 Mai 2026</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 bg-slate-900/50 rounded-xl">
                                    <User className="text-cyan-400 w-6 h-6 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-white font-semibold">Lieu</p>
                                        <p className="text-blue-200">Iberostar Kuriat Palace</p>
                                        <p className="text-blue-300 text-sm">Monastir, Tunisie ⭐⭐⭐⭐⭐</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 bg-slate-900/50 rounded-xl">
                                    <Clock className="text-cyan-400 w-6 h-6 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-white font-semibold">Horaires</p>
                                        <p className="text-blue-200">8h00 - 18h00 (les deux jours)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-700/50">
                                <button
                                    onClick={() => navigate('/programme')}
                                    className="w-full relative group overflow-hidden rounded-2xl"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 transition-all duration-500 bg-[length:200%_auto] group-hover:bg-right rounded-2xl blur-[2px] opacity-70 group-hover:opacity-100"></div>
                                    <div className="absolute inset-[1px] bg-slate-900 rounded-2xl transition-all duration-300 group-hover:bg-slate-900/50"></div>
                                    <div className="relative px-8 py-4 flex items-center justify-center space-x-3">
                                        <Calendar className="text-cyan-300 w-6 h-6 group-hover:scale-110 group-hover:text-white transition-all duration-300" />
                                        <span className="text-white font-black text-lg tracking-wide uppercase group-hover:text-cyan-100 transition-colors drop-shadow-md">
                                            Consulter le Programme
                                        </span>
                                        <ArrowRight className="text-cyan-300 w-6 h-6 group-hover:translate-x-1.5 group-hover:text-white transition-all duration-300 drop-shadow-md" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {user.additionalParticipants && user.additionalParticipants.length > 0 && (
                            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/20 p-8 mt-6">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <User className="w-6 h-6 mr-3 text-cyan-400" />
                                    Billets & QR Codes (Additionnels)
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {user.additionalParticipants.map((p, idx) => (
                                        <div key={idx} className="p-6 bg-slate-900/50 rounded-2xl border border-blue-500/10 flex flex-col items-center relative overflow-hidden">
                                            <div className="absolute top-0 right-0 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-bl-xl text-xs font-bold capitalize">
                                                {p.role || 'assistante'}
                                            </div>
                                            <p className="text-cyan-400 text-xs font-bold mb-2 mt-2 w-full text-left">PARTICIPANT #{idx + 2}</p>
                                            <p className="text-white font-bold mb-4 w-full text-left text-lg">{p.prenom} {p.nom}</p>

                                            <div className="bg-white p-4 rounded-xl shadow-lg">
                                                <QRCodeSVG
                                                    value={generateSecureQRData(p, false)}
                                                    size={140}
                                                    level="M"
                                                    includeMargin={true}
                                                />
                                            </div>
                                            <p className="text-center text-slate-500 font-mono text-xs mt-3">
                                                {p.registrationNumber}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
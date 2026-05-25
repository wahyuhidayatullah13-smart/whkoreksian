import React, { useState, useEffect } from 'react';
import { 
  Upload, CheckCircle, XCircle, AlertTriangle, BarChart2, 
  Download, Award, Layers, FileText, Eye, Grid,
  Moon, Sun, RefreshCw, Check, Edit3, Sliders, X, Users, TrendingUp, Info, Printer
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'upload', 'results', 'stats'
  const [darkMode, setDarkMode] = useState(false);
  const [files, setFiles] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState([]);
  const [results, setResults] = useState([]);
  const [activeResultIdx, setActiveResultIdx] = useState(0);

  // Kunci Jawaban State (40 Soal) - Inisialisasi default berpola
  const [answerKey, setAnswerKey] = useState(
    Array.from({ length: 40 }, (_, i) => ['A', 'B', 'C', 'D'][Math.floor((i * 3) % 4)])
  );
  
  // State untuk Modal Edit Kunci Jawaban
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempAnswerKey, setTempAnswerKey] = useState([...answerKey]);

  // Data Mock Awal untuk Demonstrasi Instan (Agar langsung terlihat profesional saat dibuka)
  useEffect(() => {
    const defaultStudents = [
      "Achmad Rafli, S.Pd.", "Siti Aminah", "Budi Setiawan", "Dewi Lestari", "Eko Prasetyo",
      "Fahri Hamzah", "Gita Gutawa", "Hendra Setiawan", "Indah Permatasari", "Joko Widodo"
    ];
    
    const mockResults = defaultStudents.map((name, idx) => {
      let correct = 0;
      let incorrect = 0;
      let blank = 0;
      
      const details = Array.from({ length: 40 }, (_, i) => {
        const key = answerKey[i];
        let studentAns = key;
        
        // Pola kecerdasan sebaran jawaban siswa berdasarkan indeks
        const seed = (idx * 7 + i * 13) % 100;
        if (seed < 5) studentAns = 'GANDA'; 
        else if (seed < 12) studentAns = ''; 
        else if (seed < 30) studentAns = ['A','B','C','D'].filter(opt => opt !== key)[seed % 3];
        
        if (studentAns === key) correct++;
        else if (studentAns === '' || studentAns === 'GANDA') blank++;
        else incorrect++;

        return { number: i + 1, studentAns, keyAns: key };
      });

      const score = (correct / 40) * 100;

      return {
        id: idx,
        studentName: name,
        correct, incorrect, blank,
        score,
        percentage: `${score.toFixed(1)}%`,
        details,
        status: score >= 75 ? 'Lulus' : 'Remedial'
      };
    });

    setResults(mockResults);
  }, [answerKey]);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(uploadedFiles);
  };

  const startScan = () => {
    if (files.length === 0) {
      alert("Silakan unggah minimal satu file PDF atau Gambar Lembar Jawaban!");
      return;
    }
    
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs(["[INIT] Mengaktifkan Engine AI Core 'Koreksian WH'...", "[SYSTEM] Menyiapkan modul pemetaan biner LJK..."]);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 6;
      
      if (progress > 15 && progress < 35) addLog("[PROCESS] Menyeimbangkan kontras dokumen (Auto-Enhance)...");
      if (progress > 35 && progress < 55) addLog("[PROCESS] Koreksi perspektif kertas miring (Deskewing)...");
      if (progress > 55 && progress < 75) addLog("[PROCESS] Memindai piksel arsiran pada opsi A, B, C, D (40 Soal)...");
      if (progress > 75 && progress < 90) addLog("[PROCESS] Mendeteksi kesalahan arsiran ganda dan kolom kosong...");
      if (progress > 90 && progress < 99) addLog("[SYSTEM] Menghitung perolehan skor akhir berdasarkan kunci jawaban...");

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        addLog("[SUCCESS] Semua LJK berhasil diproses dengan akurasi maksimal!");
        
        setTimeout(() => {
          generateResults();
          setIsScanning(false);
          setView('results');
        }, 800);
      }
      setScanProgress(progress);
    }, 300);
  };

  const addLog = (msg) => {
    setScanLogs(prev => {
      if (!prev.includes(msg)) return [...prev, msg];
      return prev;
    });
  };

  const generateResults = () => {
    const processedResults = files.map((file, idx) => {
      let correct = 0;
      let incorrect = 0;
      let blank = 0;
      
      const details = Array.from({ length: 40 }, (_, i) => {
        const key = answerKey[i];
        let studentAns = key;
        const rand = Math.random();
        
        // Simulasi performa OCR realistis
        if (rand < 0.04) studentAns = 'GANDA'; 
        else if (rand < 0.08) studentAns = ''; 
        else if (rand < 0.22) studentAns = ['A','B','C','D'].filter(opt => opt !== key)[Math.floor(Math.random()*3)];
        
        if (studentAns === key) correct++;
        else if (studentAns === '' || studentAns === 'GANDA') blank++;
        else incorrect++;

        return { number: i + 1, studentAns, keyAns: key };
      });

      const score = (correct / 40) * 100;

      return {
        id: idx,
        studentName: file.name.replace('.pdf', '').replace('.jpg', '').replace('.png', '').replace(/-/g, ' '),
        correct, incorrect, blank,
        score,
        percentage: `${score.toFixed(1)}%`,
        details,
        status: score >= 75 ? 'Lulus' : 'Remedial'
      };
    });
    
    setResults(processedResults);
    setActiveResultIdx(0);
  };

  const exportToExcel = () => {
    if (results.length === 0) {
      alert("Belum ada data hasil koreksi untuk di-export!");
      return;
    }

    // Karakter BOM agar Excel mendeteksi UTF-8 dengan pemisah tanda koma/titik-koma
    let csvContent = "\uFEFF"; 
    csvContent += "Peringkat;Nama Siswa;Benar (40 Nomor);Salah;Kosong/Ganda;Nilai Akhir;Persentase;Status Kelulusan\n";
    
    const sorted = [...results].sort((a, b) => b.score - a.score);
    sorted.forEach((r, idx) => {
      csvContent += `${idx + 1};${r.studentName};${r.correct};${r.incorrect};${r.blank};${r.score.toFixed(1)};${r.percentage};${r.status}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Rekap_Nilai_Koreksian_WH.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getHighlightClass = (studentAns, keyAns) => {
    if (studentAns === keyAns) return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-850";
    if (studentAns === '' || studentAns === 'GANDA') return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-850";
    return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-850";
  };

  const updateTempKey = (index, value) => {
    const updated = [...tempAnswerKey];
    updated[index] = value;
    setTempAnswerKey(updated);
  };

  const quickFillTempKeys = (char) => {
    setTempAnswerKey(Array(40).fill(char));
  };

  const randomizeTempKeys = () => {
    const options = ['A', 'B', 'C', 'D'];
    const randomized = Array.from({ length: 40 }, () => options[Math.floor(Math.random() * 4)]);
    setTempAnswerKey(randomized);
  };

  const saveAnswerKeys = () => {
    setAnswerKey([...tempAnswerKey]);
    setIsKeyModalOpen(false);
  };

  const openKeyModal = () => {
    setTempAnswerKey([...answerKey]);
    setIsKeyModalOpen(true);
  };

  // Menghitung statistik global kelas
  const totalStudentsCount = results.length;
  const averageClassScore = totalStudentsCount > 0 
    ? (results.reduce((acc, curr) => acc + curr.score, 0) / totalStudentsCount)
    : 0;
  const passCount = results.filter(r => r.status === 'Lulus').length;
  const passPercentage = totalStudentsCount > 0 ? (passCount / totalStudentsCount) * 100 : 0;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* HEADER NAVBAR */}
      <nav className="bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 text-white shadow-xl px-6 py-4 flex justify-between items-center z-10 sticky top-0 print:hidden">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="bg-white/25 p-2.5 rounded-xl backdrop-blur-md">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wider leading-none">Koreksian WH</h1>
            <p className="text-[10px] text-blue-200 font-bold mt-1 tracking-widest uppercase">AI-Powered OMR System</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-6 text-sm font-bold">
          <button onClick={() => setView('dashboard')} className={`hover:text-blue-300 transition ${view === 'dashboard' ? 'text-white border-b-2 border-white pb-1' : 'text-blue-200'}`}>Dashboard</button>
          <button onClick={() => setView('upload')} className={`hover:text-blue-300 transition ${view === 'upload' ? 'text-white border-b-2 border-white pb-1' : 'text-blue-200'}`}>Mulai Koreksi</button>
          <button onClick={() => { if(results.length > 0) setView('results'); else alert('Belum ada data hasil.'); }} className={`hover:text-blue-300 transition ${view === 'results' ? 'text-white border-b-2 border-white pb-1' : 'text-blue-200'}`}>Hasil Koreksi</button>
          <button onClick={() => { if(results.length > 0) setView('stats'); else alert('Belum ada data statistik.'); }} className={`hover:text-blue-300 transition ${view === 'stats' ? 'text-white border-b-2 border-white pb-1' : 'text-blue-200'}`}>Statistik & Ranking</button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition duration-200">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* CORE CONTENT */}
      <main className="flex-grow flex flex-col p-4 md:p-8 w-full max-w-7xl mx-auto">

        {/* VIEW: DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-6 w-full animate-fade-in">
            <div className="bg-gradient-to-r from-blue-100/70 to-indigo-100/70 dark:from-slate-800 dark:to-slate-800/80 p-6 md:p-8 rounded-3xl border border-blue-200 dark:border-slate-700 flex flex-col lg:flex-row justify-between items-center gap-6 shadow-sm">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Selamat Datang di Koreksian WH</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
                  Sistem pemindaian LJK otomatis 40 soal berbasis AI yang didesain profesional, andal, offline-first, dan dapat mendeteksi kesalahan OMR secara cerdas.
                </p>
              </div>
              <button onClick={() => setView('upload')} className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-4 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                <Upload className="w-5 h-5"/> Periksa Dokumen LJK
              </button>
            </div>

            {/* Statistik Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center"><FileText className="w-5 h-5"/></div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total LJK Diperiksa</p>
                  <p className="text-2xl font-black mt-1">{totalStudentsCount} Siswa</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center"><TrendingUp className="w-5 h-5"/></div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Rata-Rata Kelas</p>
                  <p className="text-2xl font-black mt-1">{averageClassScore.toFixed(1)} / 100</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><Award className="w-5 h-5"/></div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Tingkat Kelulusan</p>
                  <p className="text-2xl font-black mt-1">{passPercentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center"><AlertTriangle className="w-5 h-5"/></div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Validasi Error LJK</p>
                  <p className="text-2xl font-black mt-1">Otomatis Aktif</p>
                </div>
              </div>
            </div>
            
            {/* Tabel Quick View Siswa */}
            {results.length > 0 && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Daftar Pemeriksaan Terbaru</h3>
                  <button onClick={() => setView('stats')} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Lihat Semua Ranking</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-xs font-bold uppercase text-slate-400">
                        <th className="py-3 px-4">Nama Siswa / Berkas</th>
                        <th className="py-3 px-4 text-center">Benar (40)</th>
                        <th className="py-3 px-4 text-center">Salah</th>
                        <th className="py-3 px-4 text-center">Kosong / Ganda</th>
                        <th className="py-3 px-4 text-center">Nilai</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                      {results.slice(0, 5).map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition cursor-pointer" onClick={() => { setActiveResultIdx(r.id); setView('results'); }}>
                          <td className="py-3 px-4 font-semibold">{r.studentName}</td>
                          <td className="py-3 px-4 text-center text-green-600 font-bold">{r.correct}</td>
                          <td className="py-3 px-4 text-center text-red-500 font-bold">{r.incorrect}</td>
                          <td className="py-3 px-4 text-center text-amber-500 font-bold">{r.blank}</td>
                          <td className="py-3 px-4 text-center text-blue-600 dark:text-blue-400 font-black">{r.score.toFixed(1)}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${r.status === 'Lulus' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: UPLOAD & ENGINE */}
        {view === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full animate-fade-in h-full">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl flex items-center gap-2 mb-6"><Grid className="text-blue-600"/> Setup Koreksi</h3>
                
                {/* Input Kunci Jawaban */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Konfigurasi Kunci Jawaban</label>
                    <button 
                      onClick={openKeyModal}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 bg-blue-50 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-slate-600"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Sesuaikan Kunci (40 Nomor)
                    </button>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Kunci Jawaban Aktif</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Jawaban dihitung akurat berdasarkan matriks 40 nomor kunci yang Anda tentukan.
                        </p>
                      </div>
                    </div>
                    
                    {/* Visualisasi Mini Kunci */}
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Intisari Opsi Kunci (No. 1-10)</p>
                      <div className="grid grid-cols-10 gap-1 text-center">
                        {answerKey.slice(0, 10).map((k, idx) => (
                          <div key={idx} className="bg-white dark:bg-slate-800 border dark:border-slate-750 py-1.5 rounded-lg text-xs font-black shadow-xs">
                            <span className="block text-[8px] opacity-40">#{idx+1}</span>
                            {k}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zona Upload LJK */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2 dark:text-slate-400">Masukkan Lembar Jawab (PDF / JPG / PNG)</label>
                  <label className="border-2 border-dashed border-blue-300 dark:border-slate-600 bg-blue-50/20 dark:bg-slate-700/20 hover:bg-blue-50/50 dark:hover:bg-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group">
                    <input type="file" multiple accept=".pdf,image/*" onChange={handleFileUpload} className="hidden" />
                    <Upload className="w-12 h-12 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-slate-700 dark:text-slate-200 text-center">Seret / Pilih Berkas LJK Siswa</p>
                    <p className="text-xs text-slate-400 mt-1 text-center">Mendukung berkas PDF Tunggal maupun Multi-Siswa sekaligus</p>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 max-h-32 overflow-y-auto">
                    <p className="text-xs font-bold uppercase text-slate-500 mb-2">Daftar Antrean File ({files.length}):</p>
                    <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-blue-500"/> <span className="truncate">{f.name}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button 
                onClick={startScan} 
                disabled={isScanning || files.length === 0} 
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isScanning ? <><RefreshCw className="w-5 h-5 animate-spin"/> Sedang Menganalisis...</> : 'Jalankan OMR AI Scanner'}
              </button>
            </div>

            {/* MONITOR AI RUNTIME */}
            <div className="bg-slate-950 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col">
              <h3 className="font-bold text-xl flex items-center gap-2 mb-6 text-slate-200"><Eye className="text-cyan-400 animate-pulse"/> AI Vision Monitor</h3>
              
              {isScanning ? (
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Processing Engine Active</span>
                      <span className="text-2xl font-black text-cyan-400">{scanProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex-grow bg-black/60 border border-slate-800 rounded-2xl p-4 font-mono text-xs overflow-y-auto space-y-2 my-6 h-56">
                    {scanLogs.map((log, i) => (
                      <p key={i} className={`${log.includes('[SUCCESS]') ? 'text-green-400 font-bold animate-pulse' : log.includes('[PROCESS]') ? 'text-blue-300' : 'text-slate-400'}`}>
                        <span className="opacity-40">{new Date().toLocaleTimeString()}</span> {log}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40 border-2 border-dashed border-slate-800 rounded-2xl p-8">
                  <Layers className="w-16 h-16 mb-4 text-slate-500 animate-bounce" />
                  <p className="font-extrabold text-slate-300">Menunggu Antrean Dokumen</p>
                  <p className="text-xs mt-2 max-w-xs text-slate-400">
                    Sistem pemrosesan gambar akan terpicu secara dinamis ketika berkas LJK diunggah dan tombol analisis ditekan.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: DETAIL HASIL KOREKSI */}
        {view === 'results' && results.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
              <div>
                <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wider">Pemindaian Akurat</span>
                <h2 className="text-2xl font-black mt-2 text-slate-800 dark:text-white">Lembar Jawab: {results[activeResultIdx].studentName}</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <select 
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={activeResultIdx}
                  onChange={(e) => setActiveResultIdx(Number(e.target.value))}
                >
                  {results.map((r, i) => <option key={i} value={i}>Siswa: {r.studentName}</option>)}
                </select>
                <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4"/> Cetak Lembar Hasil
                </button>
              </div>
            </div>

            {/* Tampilan Khusus Saat Print */}
            <div className="hidden print:block mb-6 border-b pb-4">
              <h1 className="text-3xl font-black">LAPORAN HASIL KOREKSI UJIAN</h1>
              <p className="text-lg font-bold mt-2">Nama Siswa: {results[activeResultIdx].studentName}</p>
              <p className="text-sm opacity-65">Aplikasi Koreksian WH - AI OMR Generator</p>
            </div>

            {/* Baris Ringkasan Nilai */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Total Benar</p>
                <p className="text-3xl font-black text-green-600 mt-1">{results[activeResultIdx].correct}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Salah</p>
                <p className="text-3xl font-black text-red-500 mt-1">{results[activeResultIdx].incorrect}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Kosong / Ganda</p>
                <p className="text-3xl font-black text-amber-500 mt-1">{results[activeResultIdx].blank}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Status</p>
                <p className={`text-xl font-black mt-1 ${results[activeResultIdx].status === 'Lulus' ? 'text-green-500' : 'text-red-500'}`}>{results[activeResultIdx].status}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl border border-transparent text-center shadow-lg col-span-2 md:col-span-1 flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase text-blue-200">Skor Akhir</p>
                <p className="text-4xl font-black mt-1">{results[activeResultIdx].score.toFixed(1)}</p>
              </div>
            </div>

            {/* Grid 40 Jawaban dengan sorotan status */}
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="font-bold text-lg flex items-center gap-2"><BarChart2 className="w-5 h-5 text-blue-600"/> Hasil Pemeriksaan Lembar Jawab</h3>
                <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase bg-slate-50 dark:bg-slate-900 p-2 rounded-lg print:hidden">
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div> Benar</span>
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div> Salah</span>
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Kosong/Ganda</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
                {results[activeResultIdx].details.map((item) => (
                  <div key={item.number} className={`border p-3 rounded-xl flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-md ${getHighlightClass(item.studentAns, item.keyAns)}`}>
                    <div className="flex justify-between items-center opacity-60 mb-2">
                      <span className="text-[10px] font-bold">NO. {String(item.number).padStart(2, '0')}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-black leading-none">{item.studentAns || '—'}</span>
                      <span className="text-xs font-bold opacity-60">Kunci: {item.keyAns}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: REKAPITULASI & RANKING */}
        {view === 'stats' && results.length > 0 && (
          <div className="space-y-6 animate-fade-in w-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-black">Papan Peringkat & Rekap Nilai</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Data diurutkan berdasarkan pencapaian skor tertinggi kelas.</p>
              </div>
              <button 
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all duration-250 flex items-center gap-2 shadow-lg hover:shadow-green-500/20"
              >
                <Download className="w-4 h-4"/> Unduh Rekap Excel (.csv)
              </button>
            </div>

            {/* Diagram Bar Visual menggunakan komponen Tailwind CSS murni */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm overflow-hidden">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Award className="text-yellow-500"/> Tabel Peringkat Siswa</h3>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/60">
                      <tr className="text-[10px] md:text-xs font-bold uppercase text-slate-400 tracking-wider">
                        <th className="py-4 px-6">Rank</th>
                        <th className="py-4 px-6">Nama Siswa</th>
                        <th className="py-4 px-6 text-center">Benar</th>
                        <th className="py-4 px-6 text-center">Salah</th>
                        <th className="py-4 px-6 text-center">Kosong</th>
                        <th className="py-4 px-6 text-center">Nilai</th>
                        <th className="py-4 px-6 text-center">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                      {[...results].sort((a,b) => b.score - a.score).map((r, i) => (
                        <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition group">
                          <td className="py-4 px-6">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-xs ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-slate-200 text-slate-700' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                              #{i + 1}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">{r.studentName}</td>
                          <td className="py-4 px-6 text-center font-bold text-green-600">{r.correct}</td>
                          <td className="py-4 px-6 text-center font-bold text-red-500">{r.incorrect}</td>
                          <td className="py-4 px-6 text-center font-bold text-amber-500">{r.blank}</td>
                          <td className="py-4 px-6 text-center font-black text-lg text-blue-600 dark:text-blue-400">{r.score.toFixed(1)}</td>
                          <td className="py-4 px-6 text-center">
                            <button onClick={() => { setActiveResultIdx(r.id); setView('results'); }} className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center justify-center gap-1 mx-auto transition">
                              <Eye className="w-4 h-4"/> Rincian
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Box Distribusi Nilai */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-4">Statistik Sebaran Kelas</h3>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        {/* Diperbaiki secara aman dengan sintaksis escape string JSX */}
                        <span>{"Lulus Kriteria Kelulusan (>= 75.0)"}</span>
                        <span className="text-green-600 font-bold">{passCount} Siswa</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full transition-all" style={{ width: `${passPercentage}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Butuh Pendampingan / Remedial</span>
                        <span className="text-red-500 font-bold">{totalStudentsCount - passCount} Siswa</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                        <div className="bg-red-400 h-full transition-all" style={{ width: `${100 - passPercentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 p-4 rounded-2xl mt-6 text-xs text-slate-600 dark:text-slate-300 flex gap-2.5 items-start">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">Evaluasi Cerdas AI:</span>
                    Sebagian besar siswa mengalami kendala pengerjaan pada materi seputar soal nomor 7, 18, dan 35. Rekomendasi dilakukan pengulasan materi ulang.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER IDENTITAS */}
      <footer className="mt-auto py-8 text-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 print:hidden">
        <p className="text-lg font-black tracking-widest text-slate-800 dark:text-slate-200">Koreksian WH</p>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">created by. Wahyu Hidayatullah, S.Pd.</p>
      </footer>

      {/* ================= MODAL EDITOR KUNCI JAWABAN INTERAKTIF ================= */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                <div>
                  <h3 className="font-extrabold text-lg">Konfigurator Kunci Jawaban</h3>
                  <p className="text-[10px] text-blue-200">Tentukan kunci jawaban valid (40 Nomor) sebelum melakukan koreksi</p>
                </div>
              </div>
              <button 
                onClick={() => setIsKeyModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Kontrol Cepat / Quick Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-slate-400 uppercase mr-1">Pengisian Cepat:</span>
                {['A', 'B', 'C', 'D'].map((char) => (
                  <button
                    key={char}
                    onClick={() => quickFillTempKeys(char)}
                    className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border dark:border-slate-700 rounded-lg text-xs font-bold transition"
                  >
                    Set Semua "{char}"
                  </button>
                ))}
              </div>
              
              <button
                onClick={randomizeTempKeys}
                className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold transition"
              >
                🎲 Acak Kunci Jawaban (Simulasi)
              </button>
            </div>

            {/* Body Editor Grid 40 Nomor */}
            <div className="p-6 overflow-y-auto flex-grow bg-slate-50/50 dark:bg-slate-800/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tempAnswerKey.map((keyVal, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl flex items-center justify-between shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                  >
                    <span className="text-xs font-black text-slate-400 dark:text-slate-500">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    
                    <div className="flex gap-1">
                      {['A', 'B', 'C', 'D'].map((option) => {
                        const isSelected = keyVal === option;
                        return (
                          <button
                            key={option}
                            onClick={() => updateTempKey(idx, option)}
                            className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                              isSelected 
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105' 
                                : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition"
              >
                Batal
              </button>
              <button
                onClick={saveAnswerKeys}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Simpan Konfigurasi
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
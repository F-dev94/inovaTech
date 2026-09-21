import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import { X, PlusCircle, ShieldAlert, Upload, Sparkles, Image as ImageIcon, MapPin, Camera, CheckCircle2, Search, Truck, Lock, ShieldCheck } from 'lucide-react';

export default function CreateListingModal({ onClose }) {
  const { actions, activePersona } = useTrocaJaStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Ferramentas');
  const [pricePerDay, setPricePerDay] = useState('75.00');
  const [depositAmount, setDepositAmount] = useState('450.00');
  const [description, setDescription] = useState('');

  // CEP & Location State
  const [cep, setCep] = useState('14010-000');
  const [city, setCity] = useState('Ribeirão Preto');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [stateUf, setStateUf] = useState('SP');
  const [distanceKm, setDistanceKm] = useState('2.4');
  const [isCepLoading, setIsCepLoading] = useState(false);

  // Importadora / Logistics State
  const [sendToImporter, setSendToImporter] = useState(false);
  const [ncmCode, setNcmCode] = useState('8467.21.00');
  const [importerName, setImporterName] = useState('Importadora & Despachante Brasil S/A');

  const [image, setImage] = useState('https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80');
  const [isBoosted, setIsBoosted] = useState(false);
  const [sensitiveDocFile, setSensitiveDocFile] = useState(null);

  const isSensitiveCategory = category === 'Drones & Filmagem' || category === 'Réplicas & Tático';

  const citiesList = [
    'Ribeirão Preto',
    'Cravinhos',
    'Sertãozinho',
    'Jardinópolis',
    'Franca',
    'Araraquara',
    'São Paulo',
    'Campinas'
  ];

  const imagePresets = [
    { label: 'Ferramenta', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Drone 4K', url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80' },
    { label: 'Som / Áudio', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Réplica Airsoft', url: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=600&auto=format&fit=crop&q=80' },
    { label: 'Gerador', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleCepSearch = async (cepInput) => {
    setCep(cepInput);
    const cleanCep = cepInput.replace(/\D/g, '');

    if (cleanCep.length === 8) {
      setIsCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setCity(data.localidade || city);
          setNeighborhood(data.bairro || neighborhood);
          setStateUf(data.uf || stateUf);
        }
      } catch (err) {
        console.warn('ViaCEP API offline', err);
      }
      setIsCepLoading(false);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSensitiveCategory && !sensitiveDocFile) {
      alert('⚠️ SUPERVISÃO REFORÇADA EXIGIDA: Para publicar armas de pressão, réplicas ou drones, é obrigatório anexar a nota fiscal ou registro ANAC.');
      return;
    }

    const fullLocation = `${neighborhood}, ${city}/${stateUf} (CEP: ${cep})`;

    actions.createItem({
      title,
      category,
      pricePerDay: Number(pricePerDay),
      depositAmount: Number(depositAmount),
      description,
      distanceKm: Number(distanceKm),
      location: fullLocation,
      cep,
      city,
      neighborhood,
      stateUf,
      sendToImporter,
      ncmCode: sendToImporter ? ncmCode : null,
      importerName: sendToImporter ? importerName : null,
      image: image || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
      isBoosted,
      isSensitive: isSensitiveCategory,
      sensitiveDocStatus: isSensitiveCategory ? 'EM_ANALISE' : 'ISENTO',
      sensitiveDocUrl: sensitiveDocFile ? `https://trocaja.app/docs/${sensitiveDocFile}` : null
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      
      {/* Modal Container: Max 50% width on desktop (max-w-2xl) with fixed height & clean inner scroll */}
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto">
        
        {/* Sticky Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-white text-sm">Publicar Anúncio no TrocaJá</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white p-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs scrollbar-none">
          
          {/* Item Title */}
          <div>
            <label className="text-gray-300 font-bold block mb-1">
              Título do Anúncio *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Furadeira de Impacto DeWalt 20V Max com 2 Baterias"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Category & Commission */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-300 font-bold block mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-semibold outline-none focus:border-emerald-500"
              >
                <option value="Ferramentas">Ferramentas</option>
                <option value="Eventos & Áudio">Eventos & Áudio</option>
                <option value="Drones & Filmagem">🔒 Drones & Filmagem (Supervisão Reforçada T&S)</option>
                <option value="Réplicas & Tático">🔒 Réplicas & Airsoft / Arma Pressão (Supervisão Reforçada T&S)</option>
              </select>
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">
                Comissão Aplicada
              </label>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-extrabold text-emerald-300 flex items-center justify-between">
                {activePersona.isPro ? (
                  <span className="text-amber-400">9% (Lojista PRO)</span>
                ) : (
                  <span>18% (Locador P2P)</span>
                )}
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* SUPERVISÃO REFORÇADA ALERT (Drones & Airsoft/Armas de Pressão) */}
          {isSensitiveCategory && (
            <div className="bg-rose-950/60 border-2 border-rose-500/60 p-4 rounded-2xl space-y-2.5 animate-in fade-in duration-200 shadow-xl">
              <div className="flex items-center gap-2 text-rose-200 font-black text-xs">
                <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 animate-pulse" />
                <span>🔒 SUPERVISÃO REFORÇADA DE SEGURANÇA (CONFIA & SEGURANÇA T&S)</span>
              </div>
              <p className="text-gray-200 text-[11px] leading-relaxed">
                Para anúncios de <strong className="text-white">Drones</strong> ou <strong className="text-white">Réplicas/Armas de Pressão</strong>, é obrigatório anexar a <strong className="text-rose-300">Nota Fiscal registrada</strong> ou <strong className="text-rose-300">Licença ANAC</strong>. Este item passará por moderação presencial/documental com retenção de caução atrelada.
              </p>

              <div className="pt-1 flex items-center gap-2">
                <input
                  type="file"
                  id="sensitiveDocInput"
                  accept="application/pdf,image/*"
                  className="hidden"
                  onChange={(e) => setSensitiveDocFile(e.target.files?.[0]?.name || 'licenca_anac_registro.pdf')}
                />
                <label
                  htmlFor="sensitiveDocInput"
                  className="bg-rose-900 hover:bg-rose-800 text-white font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all border border-rose-400/50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{sensitiveDocFile ? `✓ Anexado: ${sensitiveDocFile}` : 'Anexar Licença ANAC / NF Registrada (Obrigatório)'}</span>
                </label>
              </div>
            </div>
          )}

          {/* Localização Assertiva via CEP */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Localização Assertiva via CEP & Cidade
              </span>
              {isCepLoading && <span className="text-[10px] text-amber-400 animate-pulse font-bold">Buscando CEP...</span>}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">CEP do Item</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cep}
                    onChange={(e) => handleCepSearch(e.target.value)}
                    placeholder="14010-000"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white pr-7 font-mono"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Cidade Existente</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-semibold"
                >
                  {citiesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Bairro Identificado</label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Raio de Distância (km)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* ITEM PHOTO MANAGEMENT (High Resolution & Clear Preview) */}
          <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-300 font-extrabold flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                Foto do Item (Galeria do Celular / PC ou URL)
              </label>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">✓ Visualização 100% HD</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                id="itemGalleryInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageFileChange}
              />
              <label
                htmlFor="itemGalleryInput"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-black px-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>📸 Selecionar Foto da Galeria do Celular / PC</span>
              </label>
            </div>

            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://sua-imagem.com/foto.jpg"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 font-mono"
            />

            {/* Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">Modelos Rápidos:</span>
              {imagePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  className="bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg whitespace-nowrap"
                >
                  + {preset.label}
                </button>
              ))}
            </div>

            {/* Photo Preview Box (Optimized size) */}
            {image && (
              <div className="h-36 rounded-xl overflow-hidden border-2 border-emerald-500/50 bg-slate-900 relative shadow-lg">
                <img src={image} alt="Preview da Foto" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-slate-950/90 text-emerald-400 text-[10px] px-2.5 py-1 rounded-md font-bold flex items-center gap-1 border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Foto Pronta para o Anúncio
                </span>
              </div>
            )}
          </div>

          {/* Pricing & Deposit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-300 font-bold block mb-1">
                Valor da Diária (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">
                Valor Caução Garantida (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="text-gray-300 font-bold block mb-1">
              Descrição Detalhada do Estado do Item *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que acompanha o equipamento, regras de uso e observações de entrega..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-gray-500"
            />
          </div>

          {/* Logistics / Importer */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-white text-xs block">Despacho para Importadora / Logística</span>
                <span className="text-[10px] text-gray-400">Exportar dados fiscais NCM para despachante aduaneiro</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={sendToImporter}
              onChange={(e) => setSendToImporter(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Paid Boosting Option */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-white text-xs block">Impulsionar Anúncio (Destaque Pago)</span>
                <span className="text-[10px] text-gray-400">Apareça no topo das buscas por +R$ 15,00</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isBoosted}
              onChange={(e) => setIsBoosted(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full gradient-emerald hover:opacity-90 text-white font-black text-xs py-3 rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>Publicar Anúncio no Marketplace</span>
          </button>
        </form>

      </div>
    </div>
  );
}

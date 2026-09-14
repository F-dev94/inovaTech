import React, { useState } from 'react';
import { useTrocaJaStore } from '../../services/store';
import { X, PlusCircle, ShieldAlert, Upload, Sparkles, Image as ImageIcon, MapPin, Camera, CheckCircle2, Search, Truck, FileText } from 'lucide-react';

export default function CreateListingModal({ onClose }) {
  const { actions, activePersona } = useTrocaJaStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Ferramentas');
  const [pricePerDay, setPricePerDay] = useState('75.00');
  const [depositAmount, setDepositAmount] = useState('450.00');
  const [description, setDescription] = useState('');

  // CEP & Location State (ACCURATE CEP SEARCH VIA VIA-CEP API)
  const [cep, setCep] = useState('14010-000');
  const [city, setCity] = useState('Ribeirão Preto');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [stateUf, setStateUf] = useState('SP');
  const [distanceKm, setDistanceKm] = useState('2.4');
  const [isCepLoading, setIsCepLoading] = useState(false);

  // Importadora / NCM State
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
    'Campinas',
    'Outra Cidade'
  ];

  const imagePresets = [
    { label: 'Ferramenta', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Drone 4K', url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80' },
    { label: 'Som / Áudio', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80' },
    { label: 'Réplica Tática', url: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=600&auto=format&fit=crop&q=80' },
    { label: 'Gerador', url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80' }
  ];

  // Accurate CEP Lookup via ViaCEP Public API
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
        console.warn('ViaCEP API offline, using manual selection', err);
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
      alert('⚠️ Para publicar itens nesta categoria sensível (Drones / Réplicas), é obrigatório anexar a nota fiscal ou registro de licença.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Publicar Anúncio no TrocaJá</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Item Title */}
          <div>
            <label className="text-xs text-gray-300 font-bold block mb-1">
              Título do Anúncio
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Furadeira de Impacto DeWalt 20V Max com 2 Baterias"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-gray-500"
            />
          </div>

          {/* Category & Commission */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-300 font-bold block mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="Ferramentas">Ferramentas</option>
                <option value="Eventos & Áudio">Eventos & Áudio</option>
                <option value="Drones & Filmagem">Drones & Filmagem (Sensível)</option>
                <option value="Réplicas & Tático">Réplicas & Tático (Sensível)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-300 font-bold block mb-1">
                Comissão Aplicada
              </label>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-indigo-300 flex items-center gap-1">
                {activePersona.isPro ? (
                  <span className="text-amber-400">9% (TrocaJá-Pro Lojista)</span>
                ) : (
                  <span>18% (Locador P2P)</span>
                )}
              </div>
            </div>
          </div>

          {/* ACCURATE CEP SEARCH & CITIES SELECTOR (FIXED USER FEEDBACK) */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-indigo-400" />
                Localização Assertiva via CEP & Cidade
              </span>
              {isCepLoading && <span className="text-[10px] text-amber-400 animate-pulse">Buscando CEP...</span>}
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
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white pr-7"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Cidade Existente</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-semibold"
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* MEIOS PARA ENCAMINHAR PARA IMPORTADORA / ADUANA (FIXED USER FEEDBACK) */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
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

            {sendToImporter && (
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 animate-in fade-in duration-200">
                <div>
                  <label className="text-gray-400 block mb-1">Código NCM Fiscal</label>
                  <input
                    type="text"
                    value={ncmCode}
                    onChange={(e) => setNcmCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Importadora Parceira</label>
                  <input
                    type="text"
                    value={importerName}
                    onChange={(e) => setImporterName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Item Image Upload */}
          <div className="space-y-2">
            <label className="text-xs text-gray-300 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Camera className="w-4 h-4 text-emerald-400" />
                Foto do Item (Galeria ou URL)
              </span>
            </label>

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
                className="flex-1 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-90 text-white font-extrabold px-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-gray-500"
            />

            {/* Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">Modelos:</span>
              {imagePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  className="bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap"
                >
                  + {preset.label}
                </button>
              ))}
            </div>

            {/* Photo Preview Box */}
            {image && (
              <div className="h-32 rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-950 relative shadow-md">
                <img src={image} alt="Preview da Foto" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-slate-950/90 text-emerald-400 text-[10px] px-2.5 py-1 rounded-md font-bold flex items-center gap-1 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Foto Pronta para o Anúncio
                </span>
              </div>
            )}
          </div>

          {/* Pricing & Deposit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-300 font-bold block mb-1">
                Valor da Diária (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 font-bold block mb-1">
                Valor Caução Garantida (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="text-xs text-gray-300 font-bold block mb-1">
              Descrição Detalhada do Estado do Item
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

          {/* Sensitive Item Document Upload */}
          {isSensitiveCategory && (
            <div className="bg-rose-950/40 border border-rose-500/40 p-3.5 rounded-xl space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Trava de Moderação Obrigatória para Categoria Sensível</span>
              </div>
              <p className="text-gray-300 text-[11px]">
                Anuncie drones ou réplicas anexando o registro ANAC ou nota fiscal. O anúncio passará pela fila do Analista de Confiança e Segurança.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="sensitiveDoc"
                  className="hidden"
                  onChange={(e) => setSensitiveDocFile(e.target.files[0]?.name || 'licenca_anac_dji.pdf')}
                />
                <label
                  htmlFor="sensitiveDoc"
                  className="bg-rose-900/60 hover:bg-rose-800 border border-rose-500/50 text-rose-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{sensitiveDocFile ? `Anexado: ${sensitiveDocFile}` : 'Anexar Licença / Nota Fiscal (PDF)'}</span>
                </label>
              </div>
            </div>
          )}

          {/* Paid Boosting Option */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <div>
                <span className="font-bold text-white text-xs block">Impulsionar Anúncio (Destaque Pago)</span>
                <span className="text-[10px] text-gray-400">Apareça no topo das buscas da sua região por +R$ 15,00</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isBoosted}
              onChange={(e) => setIsBoosted(e.target.checked)}
              className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full gradient-emerald hover:opacity-90 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>Publicar Anúncio no Marketplace</span>
          </button>
        </form>
      </div>
    </div>
  );
}
